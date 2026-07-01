/*
Họ Tên: Lê Trọng Bảo
MSSV: 2123110056
VS: 1.0
*/
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class CategoriesProductsController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _environment;

        public CategoriesProductsController(ApplicationDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        // ===== INDEX =====
        public IActionResult Index()
        {
            var data = _context.CategoriesProducts.ToList();
            return View(data);
        }

        // ===== CREATE =====
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Create(CategoryProduct model, IFormFile? ImageFile)
        {
            if (ImageFile != null && ImageFile.Length > 0)
            {
                model.ImageUrl = await SaveCategoryImage(ImageFile);
            }

            _context.CategoriesProducts.Add(model);
            await _context.SaveChangesAsync();
            return RedirectToAction("Index");
        }

        // ===== EDIT =====
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var category = _context.CategoriesProducts.Find(id);
            if (category == null) return NotFound();
            return View(category);
        }

        [HttpPost]
        public async Task<IActionResult> Edit(CategoryProduct model, IFormFile? ImageFile)
        {
            var existing = await _context.CategoriesProducts.FindAsync(model.Id);
            if (existing == null) return NotFound();

            existing.Name = model.Name;
            existing.Description = model.Description;

            if (!string.IsNullOrWhiteSpace(model.ImageUrl))
            {
                existing.ImageUrl = model.ImageUrl;
            }

            if (ImageFile != null && ImageFile.Length > 0)
            {
                existing.ImageUrl = await SaveCategoryImage(ImageFile);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction("Index");
        }

        // ===== DELETE =====
        public IActionResult Delete(int id)
        {
            var category = _context.CategoriesProducts.Find(id);
            if (category != null)
            {
                _context.CategoriesProducts.Remove(category);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }

        private async Task<string> SaveCategoryImage(IFormFile imageFile)
        {
            var uploadFolder = Path.Combine(_environment.WebRootPath, "uploads", "categories");
            Directory.CreateDirectory(uploadFolder);

            var extension = Path.GetExtension(imageFile.FileName);
            var fileName = $"{Guid.NewGuid():N}{extension}";
            var filePath = Path.Combine(uploadFolder, fileName);

            await using var stream = new FileStream(filePath, FileMode.Create);
            await imageFile.CopyToAsync(stream);

            return $"/uploads/categories/{fileName}";
        }
    }
}
