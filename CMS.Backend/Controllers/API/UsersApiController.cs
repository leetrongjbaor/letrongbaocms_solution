using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;

namespace CMS.Backend.Controllers.API
{
    /// <summary>
    /// API Quản lý Tài khoản Quản trị viên/Biên tập viên (User)
    /// </summary>
    [Route("api/Users")]
    [ApiController]
    public class UsersApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Lấy danh sách tài khoản quản trị hệ thống (Ẩn thông tin mật khẩu bảo mật)
        /// </summary>
        /// <returns>Danh sách tài khoản</returns>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _context.Users
                .Select(u => new {
                    u.Id,
                    u.Username,
                    u.FullName,
                    u.Role
                })
                .ToListAsync();

            return Ok(users);
        }

        /// <summary>
        /// Lấy thông tin chi tiết một tài khoản quản trị theo ID (Ẩn thông tin mật khẩu bảo mật)
        /// </summary>
        /// <param name="id">Mã định danh tài khoản quản trị viên</param>
        /// <returns>Thông tin chi tiết tài khoản</returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var user = await _context.Users
                .Where(u => u.Id == id)
                .Select(u => new {
                    u.Id,
                    u.Username,
                    u.FullName,
                    u.Role
                })
                .FirstOrDefaultAsync();

            if (user == null)
                return NotFound(new { message = "Không tìm thấy tài khoản quản trị" });

            return Ok(user);
        }
    }
}
