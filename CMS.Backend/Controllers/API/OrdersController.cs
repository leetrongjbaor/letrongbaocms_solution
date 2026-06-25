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
                var newOrder = new Order
                {
                    OrderDate  = DateTime.Now,
                    CustomerId = input.CustomerId,
                    Status     = 0,            // 0 = Chờ xử lý
                    Notes      = input.Notes
                };

                _context.Orders.Add(newOrder);
                await _context.SaveChangesAsync();

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
    }

    // DTO hứng dữ liệu từ Frontend
    public class OrderInputDTO
    {
        public int CustomerId { get; set; }
        public string Notes { get; set; }
    }
}