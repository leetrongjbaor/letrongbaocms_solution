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
                    p.CategoryProductId,
                    CategoryName = p.CategoryProduct.Name   
                })
                .ToListAsync();

            return Ok(products);
        }

        [HttpGet("best-selling")]
        public async Task<IActionResult> GetBestSelling()
        {
            var soldStats = await _context.OrderDetails
                .GroupBy(od => od.ProductId)
                .Select(g => new
                {
                    ProductId = g.Key,
                    SoldQuantity = g.Sum(od => od.Quantity)
                })
                .ToListAsync();

            var soldLookup = soldStats.ToDictionary(x => x.ProductId, x => x.SoldQuantity);

            var products = await _context.Products
                .Include(p => p.CategoryProduct)
                .ToListAsync();

            var bestSelling = products
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.ImageUrl,
                    p.StockQuantity,
                    p.Description,
                    p.CategoryProductId,
                    CategoryName = p.CategoryProduct != null ? p.CategoryProduct.Name : null,
                    SoldQuantity = soldLookup.ContainsKey(p.Id) ? soldLookup[p.Id] : 0
                })
                .OrderByDescending(p => p.SoldQuantity)
                .ThenByDescending(p => p.Id)
                .Take(3)
                .ToList();

            return Ok(bestSelling);
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
                    p.CategoryProductId,
                    CategoryName = p.CategoryProduct.Name   
                })
                .ToListAsync();

            return Ok(products);
        }

        [HttpGet("filter")]
        public async Task<IActionResult> FilterProducts(
            [FromQuery] int? categoryProductId,
            [FromQuery] decimal? minPrice,
            [FromQuery] decimal? maxPrice)
        {
            var query = _context.Products
                .Include(p => p.CategoryProduct)
                .AsQueryable();

            if (categoryProductId.HasValue)
            {
                query = query.Where(p => p.CategoryProductId == categoryProductId.Value);
            }

            if (minPrice.HasValue)
            {
                query = query.Where(p => p.Price >= minPrice.Value);
            }

            if (maxPrice.HasValue)
            {
                query = query.Where(p => p.Price <= maxPrice.Value);
            }

            var products = await query
                .OrderByDescending(p => p.Id)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.ImageUrl,
                    p.StockQuantity,
                    p.Description,
                    p.CategoryProductId,
                    CategoryName = p.CategoryProduct != null ? p.CategoryProduct.Name : null
                })
                .ToListAsync();

            return Ok(products);
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchProducts([FromQuery] string? keyword)
        {
            keyword = keyword?.Trim();

            if (string.IsNullOrWhiteSpace(keyword))
            {
                return Ok(new List<object>());
            }

            var products = await _context.Products
                .Include(p => p.CategoryProduct)
                .Where(p =>
                    p.Name.Contains(keyword) ||
                    (p.Description != null && p.Description.Contains(keyword)) ||
                    (p.CategoryProduct != null && p.CategoryProduct.Name.Contains(keyword)))
                .OrderByDescending(p => p.Id)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.ImageUrl,
                    p.StockQuantity,
                    p.Description,
                    p.CategoryProductId,
                    CategoryName = p.CategoryProduct != null ? p.CategoryProduct.Name : null
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
