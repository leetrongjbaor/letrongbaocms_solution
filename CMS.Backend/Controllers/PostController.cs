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
    public class PostController : Controller
    {
        private readonly ApplicationDbContext _context;

        public PostController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ===== INDEX =====
        public IActionResult Index(int? id, int page = 1, int pageSize = 6)
        {
            var postsQuery = _context.Posts
                        .Include(p => p.Category)
                        .OrderByDescending(p => p.CreatedDate)
                        .AsQueryable();

            if (id != null)
                postsQuery = postsQuery.Where(p => p.CategoryId == id);

            int totalItems = postsQuery.Count();
            int totalPages = (int)Math.Ceiling((double)totalItems / pageSize);

            if (page < 1) page = 1;
            if (totalPages > 0 && page > totalPages) page = totalPages;

            var posts = postsQuery
                        .Skip((page - 1) * pageSize)
                        .Take(pageSize)
                        .ToList();

            ViewBag.CurrentPage = page;
            ViewBag.PageSize = pageSize;
            ViewBag.TotalPages = totalPages;
            ViewBag.TotalItems = totalItems;
            ViewBag.CategoryId = id;

            return View(posts);
        }

        // ===== DETAILS =====
        public IActionResult Details(int id)
        {
            var post = _context.Posts
                       .Include(p => p.Category)
                       .FirstOrDefault(p => p.Id == id);

            if (post == null) return NotFound();
            return View(post);
        }

        // ===== CREATE =====
        [HttpGet]
        public IActionResult Create()
        {
            // Đưa danh sách Category ra View để chọn
            ViewBag.Categories = _context.Categories.ToList();
            return View();
        }

        [HttpPost]
        public IActionResult Create(Post model)
        {
            model.CreatedDate = DateTime.Now;

            // Nếu không nhập ảnh thì gán chuỗi rỗng để tránh lỗi NULL trong database
            if (string.IsNullOrEmpty(model.ImageUrl))
            {
                model.ImageUrl = "";
            }

            _context.Posts.Add(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        // ===== EDIT =====
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var post = _context.Posts.Find(id);
            if (post == null) return NotFound();

            ViewBag.Categories = _context.Categories.ToList();
            return View(post);
        }

        [HttpPost]
        public IActionResult Edit(Post model)
        {
            // Nếu không nhập ảnh thì gán chuỗi rỗng để tránh lỗi NULL trong database
            if (string.IsNullOrEmpty(model.ImageUrl))
            {
                model.ImageUrl = "";
            }

            _context.Posts.Update(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        // ===== DELETE =====
        public IActionResult Delete(int id)
        {
            var post = _context.Posts.Find(id);
            if (post != null)
            {
                _context.Posts.Remove(post);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }
    }
}