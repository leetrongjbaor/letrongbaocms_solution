using CMS.Backend.Helpers;
using CMS.Backend.Services;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

namespace CMS.Backend.Controllers
{
    [Route("api/Customers")]
    [ApiController]
    public class CustomersApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;

        public CustomersApiController(ApplicationDbContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] CustomerRegisterRequest request)
        {
            if (request == null ||
                string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.Password) ||
                string.IsNullOrWhiteSpace(request.FullName))
            {
                return BadRequest(new { message = "Họ tên, Email và Mật khẩu là bắt buộc" });
            }

            if (request.Password.Length < 6)
            {
                return BadRequest(new { message = "Mật khẩu phải có ít nhất 6 ký tự" });
            }

            var normalizedEmail = request.Email.Trim().ToLower();
            var exists = await _context.Customers.AnyAsync(c => c.Email.ToLower() == normalizedEmail);
            if (exists)
            {
                return BadRequest(new { message = "Email này đã được đăng ký trong hệ thống" });
            }

            var customer = new Customer
            {
                FullName = request.FullName.Trim(),
                Email = request.Email.Trim(),
                Phone = request.Phone?.Trim(),
                Address = request.Address?.Trim(),
                Password = PasswordHelper.HashPassword(request.Password)
            };

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Đăng ký tài khoản thành công!",
                customer = ToCustomerResponse(customer)
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(new { message = "Email và Mật khẩu không được để trống" });
            }

            var normalizedEmail = request.Email.Trim().ToLower();
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Email.ToLower() == normalizedEmail);

            if (customer == null || !PasswordHelper.VerifyPassword(request.Password, customer.Password))
            {
                return BadRequest(new { message = "Email hoặc Mật khẩu không chính xác" });
            }

            if (!PasswordHelper.IsBCryptHash(customer.Password))
            {
                customer.Password = PasswordHelper.HashPassword(request.Password);
                await _context.SaveChangesAsync();
            }

            return Ok(new
            {
                message = "Đăng nhập thành công!",
                customer = ToCustomerResponse(customer)
            });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Email))
            {
                return BadRequest(new { message = "Email không được để trống" });
            }

            var normalizedEmail = request.Email.Trim().ToLower();
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Email.ToLower() == normalizedEmail);

            if (customer != null)
            {
                customer.ResetPasswordToken = RandomNumberGenerator.GetInt32(100000, 1000000).ToString();
                customer.ResetPasswordTokenExpiresAt = DateTime.UtcNow.AddMinutes(10);
                await _context.SaveChangesAsync();

                await _emailService.SendPasswordResetCodeAsync(
                    customer.Email,
                    customer.FullName,
                    customer.ResetPasswordToken);
            }

            return Ok(new { message = "Nếu email tồn tại, hệ thống đã gửi mã xác nhận đặt lại mật khẩu." });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            if (request == null ||
                string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.Token) ||
                string.IsNullOrWhiteSpace(request.NewPassword))
            {
                return BadRequest(new { message = "Email, mã xác nhận và mật khẩu mới không được để trống" });
            }

            if (request.NewPassword.Length < 6)
            {
                return BadRequest(new { message = "Mật khẩu mới phải có ít nhất 6 ký tự" });
            }

            var normalizedEmail = request.Email.Trim().ToLower();
            var normalizedToken = request.Token.Trim();
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c =>
                    c.Email.ToLower() == normalizedEmail &&
                    c.ResetPasswordToken == normalizedToken &&
                    c.ResetPasswordTokenExpiresAt.HasValue &&
                    c.ResetPasswordTokenExpiresAt.Value > DateTime.UtcNow);

            if (customer == null)
            {
                return BadRequest(new { message = "Mã xác nhận không hợp lệ hoặc đã hết hạn" });
            }

            customer.Password = PasswordHelper.HashPassword(request.NewPassword);
            customer.ResetPasswordToken = null;
            customer.ResetPasswordTokenExpiresAt = null;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đặt lại mật khẩu thành công" });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProfile(int id, [FromBody] CustomerUpdateDTO model)
        {
            if (model == null)
            {
                return BadRequest(new { message = "Dữ liệu cập nhật không hợp lệ" });
            }

            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
            {
                return NotFound(new { message = "Không tìm thấy khách hàng" });
            }

            if (!string.IsNullOrWhiteSpace(model.FullName))
                customer.FullName = model.FullName.Trim();
            if (model.Phone != null)
                customer.Phone = model.Phone.Trim();
            if (model.Address != null)
                customer.Address = model.Address.Trim();

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Cập nhật hồ sơ thành công!",
                customer = ToCustomerResponse(customer)
            });
        }

        private static object ToCustomerResponse(Customer customer)
        {
            return new
            {
                customer.Id,
                customer.FullName,
                customer.Email,
                customer.Phone,
                customer.Address
            };
        }
    }

    public class CustomerRegisterRequest
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public string Password { get; set; }
    }

    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class ForgotPasswordRequest
    {
        public string Email { get; set; }
    }

    public class ResetPasswordRequest
    {
        public string Email { get; set; }
        public string Token { get; set; }
        public string NewPassword { get; set; }
    }

    public class CustomerUpdateDTO
    {
        public string? FullName { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
    }
}
