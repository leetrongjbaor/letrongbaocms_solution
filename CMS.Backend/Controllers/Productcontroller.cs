/*
Họ Tên: Lê Trọng Bảo
MSSV: 2123110056
VS: 1.0
*/
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;

        public ProductController(ApplicationDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // ===== INDEX =====
        public IActionResult Index()
        {
            var data = _context.Products
                               .Include(p => p.CategoryProduct)
                               .ToList();
            return View(data);
        }

        // ===== CREATE =====
        [HttpGet]
        public IActionResult Create()
        {
            ViewBag.Categories = _context.CategoriesProducts.ToList();
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Create(Product model, IFormFile? ImageFile)
        {
            // Xử lý upload ảnh
            if (ImageFile != null && ImageFile.Length > 0)
            {
                model.ImageUrl = await SaveImageAsync(ImageFile);
            }

            _context.Products.Add(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        // ===== EDIT =====
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var product = _context.Products.Find(id);
            if (product == null) return NotFound();

            ViewBag.Categories = _context.CategoriesProducts.ToList();
            return View(product);
        }

        [HttpPost]
        public async Task<IActionResult> Edit(Product model, IFormFile? ImageFile)
        {
            // Xử lý upload ảnh mới
            if (ImageFile != null && ImageFile.Length > 0)
            {
                // Xóa ảnh cũ nếu có (chỉ xóa ảnh trong thư mục uploads)
                if (!string.IsNullOrEmpty(model.ImageUrl) && model.ImageUrl.StartsWith("/uploads/"))
                {
                    var oldPath = Path.Combine(_env.WebRootPath, model.ImageUrl.TrimStart('/'));
                    if (System.IO.File.Exists(oldPath))
                    {
                        System.IO.File.Delete(oldPath);
                    }
                }

                model.ImageUrl = await SaveImageAsync(ImageFile);
            }
            else
            {
                // Nếu không chọn ảnh mới → giữ ảnh cũ từ database
                var existingProduct = await _context.Products.AsNoTracking()
                    .FirstOrDefaultAsync(p => p.Id == model.Id);
                if (existingProduct != null)
                {
                    model.ImageUrl = existingProduct.ImageUrl;
                }
            }

            _context.Products.Update(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        // ===== DELETE =====
        public IActionResult Delete(int id)
        {
            var product = _context.Products.Find(id);
            if (product != null)
            {
                // Xóa file ảnh khi xóa sản phẩm
                if (!string.IsNullOrEmpty(product.ImageUrl) && product.ImageUrl.StartsWith("/uploads/"))
                {
                    var imgPath = Path.Combine(_env.WebRootPath, product.ImageUrl.TrimStart('/'));
                    if (System.IO.File.Exists(imgPath))
                    {
                        System.IO.File.Delete(imgPath);
                    }
                }

                _context.Products.Remove(product);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }

        // ===== HELPER: Lưu ảnh vào wwwroot/uploads =====
        private async Task<string> SaveImageAsync(IFormFile file)
        {
            var uploadsDir = Path.Combine(_env.WebRootPath, "uploads");
            if (!Directory.Exists(uploadsDir))
            {
                Directory.CreateDirectory(uploadsDir);
            }

            // Tạo tên file duy nhất để tránh trùng
            var ext = Path.GetExtension(file.FileName);
            var fileName = $"{Guid.NewGuid()}{ext}";
            var filePath = Path.Combine(uploadsDir, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return $"/uploads/{fileName}";
        }
    }
}