using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;

namespace CMS.Backend.Controllers
{
    /// <summary>
    /// API Quản lý danh mục bài viết tin tức
    /// </summary>
    [Route("api/Categories")]
    [ApiController]
    public class CategoriesApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CategoriesApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Lấy danh sách tất cả danh mục bài viết tin tức
        /// </summary>
        /// <returns>Danh sách danh mục bài viết</returns>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var categories = await _context.Categories
                .Select(c => new {
                    c.Id,
                    c.Name
                })
                .ToListAsync();

            return Ok(categories);
        }
    }
}