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
    /// API Đăng ký và Đăng nhập dành cho Khách hàng
    /// </summary>
    [Route("api/Customers")]
    [ApiController]
    public class CustomersApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CustomersApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Đăng ký tài khoản khách hàng mới
        /// </summary>
        /// <param name="model">Thông tin khách hàng đăng ký</param>
        /// <returns>Kết quả đăng ký thành công và thông tin khách hàng</returns>
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] Customer model)
        {
            if (model == null)
            {
                return BadRequest(new { message = "Dữ liệu đăng ký không hợp lệ" });
            }

            if (string.IsNullOrWhiteSpace(model.Email) || string.IsNullOrWhiteSpace(model.Password) || string.IsNullOrWhiteSpace(model.FullName))
            {
                return BadRequest(new { message = "Họ tên, Email và Mật khẩu là bắt buộc" });
            }

            // Kiểm tra xem email đã tồn tại chưa
            var exists = await _context.Customers.AnyAsync(c => c.Email.ToLower() == model.Email.ToLower());
            if (exists)
            {
                return BadRequest(new { message = "Email này đã được đăng ký trong hệ thống" });
            }

            // Thêm khách hàng mới
            _context.Customers.Add(model);
            await _context.SaveChangesAsync();

            return Ok(new { 
                message = "Đăng ký tài khoản thành công!",
                customer = new {
                    model.Id,
                    model.FullName,
                    model.Email,
                    model.Phone,
                    model.Address
                }
            });
        }

        /// <summary>
        /// Đăng nhập hệ thống dành cho khách hàng
        /// </summary>
        /// <param name="request">Thông tin tài khoản Email và Mật khẩu</param>
        /// <returns>Kết quả đăng nhập thành công và thông tin hồ sơ khách hàng</returns>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(new { message = "Email và Mật khẩu không được để trống" });
            }

            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Email.ToLower() == request.Email.ToLower() && c.Password == request.Password);

            if (customer == null)
            {
                return BadRequest(new { message = "Email hoặc Mật khẩu không chính xác" });
            }

            return Ok(new {
                message = "Đăng nhập thành công!",
                customer = new {
                    customer.Id,
                    customer.FullName,
                    customer.Email,
                    customer.Phone,
                    customer.Address
                }
            });
        }
    }

    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
