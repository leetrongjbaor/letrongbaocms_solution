using CMS.Backend.Helpers;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Admin")]
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            var users = _context.Users.ToList();
            return View(users);
        }

        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(User model)
        {
            if (string.IsNullOrWhiteSpace(model.Username) ||
                string.IsNullOrWhiteSpace(model.PasswordHash) ||
                string.IsNullOrWhiteSpace(model.FullName) ||
                string.IsNullOrWhiteSpace(model.Role))
            {
                ModelState.AddModelError("", "Vui lòng nhập đầy đủ thông tin thành viên.");
                return View(model);
            }

            model.PasswordHash = PasswordHelper.HashPassword(model.PasswordHash);
            _context.Users.Add(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        [HttpGet]
        public IActionResult Edit(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null) return NotFound();

            user.PasswordHash = string.Empty;
            return View(user);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(User model)
        {
            var existingUser = _context.Users.Find(model.Id);
            if (existingUser == null) return NotFound();

            if (string.IsNullOrWhiteSpace(model.Username) ||
                string.IsNullOrWhiteSpace(model.FullName) ||
                string.IsNullOrWhiteSpace(model.Role))
            {
                ModelState.AddModelError("", "Vui lòng nhập đầy đủ thông tin thành viên.");
                return View(model);
            }

            existingUser.Username = model.Username;
            existingUser.FullName = model.FullName;
            existingUser.Role = model.Role;

            if (!string.IsNullOrWhiteSpace(model.PasswordHash))
            {
                existingUser.PasswordHash = PasswordHelper.HashPassword(model.PasswordHash);
            }

            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Delete(int id)
        {
            var user = _context.Users.Find(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                _context.SaveChanges();
            }

            return RedirectToAction("Index");
        }
    }
}
