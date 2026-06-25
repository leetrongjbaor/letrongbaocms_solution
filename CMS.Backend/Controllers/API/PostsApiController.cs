using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;

namespace CMS.Backend.Controllers
{
    [Route("api/Posts")]
    [ApiController]
    public class PostsApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PostsApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Lấy danh sách toàn bộ bài viết (hỗ trợ phân trang tùy chọn)
        /// </summary>
        /// <param name="page">Số thứ tự trang (bắt đầu từ 1). Để trống hoặc bằng 0 để lấy toàn bộ không phân trang.</param>
        /// <param name="pageSize">Số lượng bài viết trên mỗi trang. Để trống hoặc bằng 0 để lấy toàn bộ không phân trang.</param>
        /// <returns>Danh sách bài viết hoặc đối tượng phân trang chứa dữ liệu bài viết.</returns>
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int? page = null, [FromQuery] int? pageSize = null)
        {
            var query = _context.Posts
                .Include(p => p.Category)
                .OrderByDescending(p => p.CreatedDate);

            // Kiểm tra xem client có yêu cầu phân trang hay không
            if (page.HasValue && page.Value > 0 && pageSize.HasValue && pageSize.Value > 0)
            {
                var totalCount = await query.CountAsync();
                var totalPages = (int)Math.Ceiling((double)totalCount / pageSize.Value);
                
                var posts = await query
                    .Skip((page.Value - 1) * pageSize.Value)
                    .Take(pageSize.Value)
                    .Select(p => new {
                        p.Id,
                        p.Title,
                        p.Content,       
                        p.ImageUrl,
                        p.CreatedDate,
                        CategoryId = p.CategoryId,
                        CategoryName = p.Category.Name
                    })
                    .ToListAsync();

                return Ok(new {
                    data = posts,
                    page = page.Value,
                    pageSize = pageSize.Value,
                    totalCount,
                    totalPages
                });
            }
            else
            {
                // Trả về toàn bộ danh sách để tương thích ngược với Frontend React cũ
                var posts = await query
                    .Select(p => new {
                        p.Id,
                        p.Title,
                        p.Content,       
                        p.ImageUrl,
                        p.CreatedDate,
                        CategoryId = p.CategoryId,
                        CategoryName = p.Category.Name
                    })
                    .ToListAsync();

                return Ok(posts);
            }
        }

        /// <summary>
        /// Lấy thông tin chi tiết một bài viết theo ID
        /// </summary>
        /// <param name="id">Mã định danh của bài viết</param>
        /// <returns>Thông tin chi tiết bài viết</returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var post = await _context.Posts
                .Where(p => p.Id == id)
                .Select(p => new {
                    p.Id,
                    p.Title,
                    p.Content,       
                    p.ImageUrl,
                    p.CreatedDate,
                    CategoryId = p.CategoryId,
                    CategoryName = p.Category.Name
                })
                .FirstOrDefaultAsync();

            if (post == null)
                return NotFound(new { message = "Không tìm thấy bài viết" });

            return Ok(post);
        }
    }
}