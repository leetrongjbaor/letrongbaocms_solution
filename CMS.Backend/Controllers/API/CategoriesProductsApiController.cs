/*
Họ Tên: Lê Trọng Bảo
MSSV: 2123110056
VS: 1.0
*/
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;

namespace CMS.Backend.Controllers
{
    /// <summary>
    /// API Quản lý danh mục sản phẩm thời trang
    /// </summary>
    [Route("api/CategoriesProducts")]  // giữ route không đổi
    [ApiController]
    public class CategoriesProductsApiController : ControllerBase  
    {
        private readonly ApplicationDbContext _context;

        public CategoriesProductsApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Lấy danh sách tất cả danh mục sản phẩm thời trang
        /// </summary>
        /// <returns>Danh sách danh mục sản phẩm</returns>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var categories = await _context.CategoriesProducts
                    .Select(c => new {
                        c.Id,
                        c.Name,
                        c.Description
                    })
                    .ToListAsync();

                return Ok(categories);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Lỗi kết nối cơ sở dữ liệu",
                    detail = ex.Message
                });
            }
        }
    }
}