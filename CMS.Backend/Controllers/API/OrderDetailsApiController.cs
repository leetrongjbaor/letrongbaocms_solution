using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;

namespace CMS.Backend.Controllers.API
{
    /// <summary>
    /// API Quản lý chi tiết đơn hàng (OrderDetail)
    /// </summary>
    [Route("api/OrderDetails")]
    [ApiController]
    public class OrderDetailsApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrderDetailsApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Lấy toàn bộ danh sách chi tiết dòng đơn đặt hàng
        /// </summary>
        /// <returns>Danh sách chi tiết dòng đơn hàng</returns>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var details = await _context.OrderDetails
                .Include(d => d.Product)
                .Select(d => new {
                    d.Id,
                    d.OrderId,
                    d.ProductId,
                    ProductName = d.Product != null ? d.Product.Name : "",
                    d.Quantity,
                    d.UnitPrice,
                    SubTotal = d.Quantity * d.UnitPrice
                })
                .ToListAsync();

            return Ok(details);
        }

        /// <summary>
        /// Lấy danh sách chi tiết sản phẩm đã mua theo ID đơn hàng
        /// </summary>
        /// <param name="orderId">Mã định danh đơn hàng</param>
        /// <returns>Danh sách chi tiết sản phẩm trong đơn hàng</returns>
        [HttpGet("order/{orderId}")]
        public async Task<IActionResult> GetByOrderId(int orderId)
        {
            var details = await _context.OrderDetails
                .Where(d => d.OrderId == orderId)
                .Include(d => d.Product)
                .Select(d => new {
                    d.Id,
                    d.OrderId,
                    d.ProductId,
                    ProductName = d.Product != null ? d.Product.Name : "",
                    d.Quantity,
                    d.UnitPrice,
                    SubTotal = d.Quantity * d.UnitPrice
                })
                .ToListAsync();

            return Ok(details);
        }

        /// <summary>
        /// Lấy thông tin chi tiết một dòng đơn hàng theo ID
        /// </summary>
        /// <param name="id">Mã định danh của dòng chi tiết đơn hàng</param>
        /// <returns>Chi tiết dòng đơn hàng</returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var detail = await _context.OrderDetails
                .Where(d => d.Id == id)
                .Include(d => d.Product)
                .Select(d => new {
                    d.Id,
                    d.OrderId,
                    d.ProductId,
                    ProductName = d.Product != null ? d.Product.Name : "",
                    d.Quantity,
                    d.UnitPrice,
                    SubTotal = d.Quantity * d.UnitPrice
                })
                .FirstOrDefaultAsync();

            if (detail == null)
                return NotFound(new { message = "Không tìm thấy chi tiết dòng đơn hàng" });

            return Ok(detail);
        }
    }
}
