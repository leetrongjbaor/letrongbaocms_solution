/*
Họ Tên: Lê Trọng Bảo
MSSV: 2123110056
VS: 1.0
*/
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;

namespace CMS.Backend.Controllers
{
    /// <summary>
    /// API Quản lý Đơn hàng và Đặt hàng
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrdersController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Lấy toàn bộ danh sách đơn hàng trong hệ thống
        /// </summary>
        /// <returns>Danh sách đơn hàng tóm tắt</returns>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var orders = await _context.Orders
                .Include(o => o.Customer)
                .OrderByDescending(o => o.Id)
                .Select(o => new {
                    o.Id,
                    o.OrderDate,
                    o.Status,
                    o.Notes,
                    CustomerName = o.Customer.FullName
                })
                .ToListAsync();

            return Ok(orders);
        }

        /// <summary>
        /// Lấy thông tin chi tiết một đơn hàng theo ID
        /// </summary>
        /// <param name="id">Mã định danh đơn hàng</param>
        /// <returns>Chi tiết đơn hàng</returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            var order = await _context.Orders
                .Include(o => o.Customer)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
                return NotFound(new { message = "Không tìm thấy đơn hàng này" });

            return Ok(order);
        }

        /// <summary>
        /// Tiếp nhận và tạo mới đơn đặt hàng từ giỏ hàng Frontend
        /// </summary>
        /// <param name="input">Thông tin giỏ hàng và khách hàng đặt hàng</param>
        /// <returns>Mã đơn hàng mới được tạo</returns>
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] OrderInputDTO input)
        {
            if (input == null)
                return BadRequest(new { message = "Dữ liệu đơn hàng không hợp lệ" });

            try
            {
                // Kiểm tra sự tồn tại của Khách hàng
                var customerExists = await _context.Customers.AnyAsync(c => c.Id == input.CustomerId);
                if (!customerExists)
                {
                    return BadRequest(new { message = "Khách hàng không tồn tại trong hệ thống" });
                }

                // Kiểm tra sự tồn tại của từng Sản phẩm
                if (input.Items != null && input.Items.Any())
                {
                    foreach (var item in input.Items)
                    {
                        var productExists = await _context.Products.AnyAsync(p => p.Id == item.ProductId);
                        if (!productExists)
                        {
                            return BadRequest(new { message = $"Sản phẩm với ID {item.ProductId} không tồn tại trên hệ thống" });
                        }
                    }
                }

                var newOrder = new Order
                {
                    OrderDate  = DateTime.Now,
                    CustomerId = input.CustomerId,
                    Status     = 0,            // 0 = Chờ xử lý
                    Notes      = input.Notes
                };

                _context.Orders.Add(newOrder);
                await _context.SaveChangesAsync();

                // Lưu danh sách sản phẩm mua vào bảng OrderDetails và cập nhật tồn kho
                if (input.Items != null && input.Items.Any())
                {
                    foreach (var item in input.Items)
                    {
                        var product = await _context.Products.FindAsync(item.ProductId);
                        if (product != null)
                        {
                            if (product.StockQuantity < item.Quantity)
                            {
                                return BadRequest(new { message = $"Sản phẩm '{product.Name}' không đủ số lượng tồn kho (Còn lại: {product.StockQuantity})" });
                            }
                            product.StockQuantity -= item.Quantity;
                        }

                        var detail = new OrderDetail
                        {
                            OrderId   = newOrder.Id,
                            ProductId = item.ProductId,
                            Quantity  = item.Quantity,
                            UnitPrice = item.UnitPrice
                        };
                        _context.OrderDetails.Add(detail);
                    }
                    await _context.SaveChangesAsync();
                }

                return StatusCode(201, new
                {
                    message = "Đặt hàng thành công!",
                    orderId = newOrder.Id
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Lỗi xử lý tạo đơn hàng",
                    detail = ex.Message
                });
            }
        }
        /// <summary>
        /// Lấy danh sách đơn hàng theo mã khách hàng (dành cho trang Lịch sử đơn hàng)
        /// </summary>
        /// <param name="customerId">Mã khách hàng</param>
        /// <returns>Danh sách đơn hàng kèm chi tiết sản phẩm</returns>
        [HttpGet("customer/{customerId}")]
        public async Task<IActionResult> GetByCustomerId(int customerId)
        {
            var orders = await _context.Orders
                .Where(o => o.CustomerId == customerId)
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                .OrderByDescending(o => o.Id)
                .Select(o => new {
                    o.Id,
                    o.OrderDate,
                    o.Status,
                    o.Notes,
                    TotalAmount = o.OrderDetails.Sum(od => od.Quantity * od.UnitPrice),
                    TotalItems = o.OrderDetails.Sum(od => od.Quantity),
                    Items = o.OrderDetails.Select(od => new {
                        od.Id,
                        od.ProductId,
                        ProductName = od.Product != null ? od.Product.Name : "",
                        ProductImage = od.Product != null ? od.Product.ImageUrl : "",
                        od.Quantity,
                        od.UnitPrice,
                        SubTotal = od.Quantity * od.UnitPrice
                    }).ToList()
                })
                .ToListAsync();

            return Ok(orders);
        }
    }

    // DTO hứng dữ liệu từ Frontend
    public class OrderInputDTO
    {
        public int CustomerId { get; set; }
        public string Notes { get; set; }
        public List<CartItemDTO>? Items { get; set; }
    }

    public class CartItemDTO
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }
}