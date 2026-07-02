using CMS.Backend.Helpers;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Admin")]
    public class CustomerController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CustomerController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            var data = _context.Customers.ToList();
            return View(data);
        }

        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(Customer model)
        {
            if (string.IsNullOrWhiteSpace(model.FullName) ||
                string.IsNullOrWhiteSpace(model.Email) ||
                string.IsNullOrWhiteSpace(model.Password))
            {
                ModelState.AddModelError("", "Họ tên, Email và Mật khẩu là bắt buộc.");
                return View(model);
            }

            model.Password = PasswordHelper.HashPassword(model.Password);
            model.ResetPasswordToken = null;
            model.ResetPasswordTokenExpiresAt = null;

            _context.Customers.Add(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        [HttpGet]
        public IActionResult Edit(int id)
        {
            var customer = _context.Customers.Find(id);
            if (customer == null) return NotFound();

            customer.Password = string.Empty;
            return View(customer);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(Customer model)
        {
            var existingCustomer = _context.Customers.Find(model.Id);
            if (existingCustomer == null) return NotFound();

            if (string.IsNullOrWhiteSpace(model.FullName) || string.IsNullOrWhiteSpace(model.Email))
            {
                ModelState.AddModelError("", "Họ tên và Email là bắt buộc.");
                return View(model);
            }

            existingCustomer.FullName = model.FullName;
            existingCustomer.Email = model.Email;
            existingCustomer.Phone = model.Phone;
            existingCustomer.Address = model.Address;

            if (!string.IsNullOrWhiteSpace(model.Password))
            {
                existingCustomer.Password = PasswordHelper.HashPassword(model.Password);
                existingCustomer.ResetPasswordToken = null;
                existingCustomer.ResetPasswordTokenExpiresAt = null;
            }

            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Delete(int id)
        {
            var customer = _context.Customers.Find(id);
            if (customer != null)
            {
                _context.Customers.Remove(customer);
                _context.SaveChanges();
            }

            return RedirectToAction("Index");
        }
    }
}
