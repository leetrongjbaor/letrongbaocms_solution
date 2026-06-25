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
    /// API Quản lý Sản phẩm thời trang
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Lấy toàn bộ danh sách sản phẩm
        /// </summary>
        /// <returns>Danh sách sản phẩm tóm tắt</returns>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = await _context.Products
                .OrderByDescending(p => p.Id)
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.ImageUrl,
                    p.StockQuantity,
                    p.Description,                         
                    CategoryName = p.CategoryProduct.Name   
                })
                .ToListAsync();

            return Ok(products);
        }

        /// <summary>
        /// Lấy danh sách sản phẩm lọc theo Danh mục sản phẩm thời trang
        /// </summary>
        /// <param name="categoryProductId">Mã định danh danh mục sản phẩm</param>
        /// <returns>Danh sách sản phẩm thuộc danh mục</returns>
        [HttpGet("categoryproduct/{categoryProductId}")]
        public async Task<IActionResult> GetByCategoryProduct(int categoryProductId)
        {
            var products = await _context.Products
                .Where(p => p.CategoryProductId == categoryProductId)
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.ImageUrl,
                    p.StockQuantity,
                    p.Description,                          
                    CategoryName = p.CategoryProduct.Name   
                })
                .ToListAsync();

            return Ok(products);
        }

        /// <summary>
        /// Lấy chi tiết thông tin sản phẩm theo ID
        /// </summary>
        /// <param name="id">Mã định danh sản phẩm</param>
        /// <returns>Thông tin chi tiết sản phẩm</returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            var product = await _context.Products
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
                return NotFound(new { message = "Không tìm thấy sản phẩm này trong hệ thống" });

            return Ok(product);
        }
    }
}