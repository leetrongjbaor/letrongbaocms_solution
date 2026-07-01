/*
Họ Tên: Lê Trọng Bảo
MSSV: 2123110056
VS: 1.0
*/
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CMS.Backend.Helpers;

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

        // ===== INDEX =====
        public IActionResult Index()
        {
            var data = _context.Customers.ToList();
            return View(data);
        }

        // ===== CREATE =====
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Create(Customer model)
        {
            if (!string.IsNullOrWhiteSpace(model.Password))
            {
                model.Password = PasswordHelper.HashPassword(model.Password);
            }
            _context.Customers.Add(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        // ===== EDIT =====
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var customer = _context.Customers.Find(id);
            if (customer == null) return NotFound();
            return View(customer);
        }

        [HttpPost]
        public IActionResult Edit(Customer model)
        {
            var existingCustomer = _context.Customers.Find(model.Id);
            if (existingCustomer == null)
            {
                return NotFound();
            }

            existingCustomer.FullName = model.FullName;
            existingCustomer.Email = model.Email;
            existingCustomer.Phone = model.Phone;
            existingCustomer.Address = model.Address;

            // Nếu người dùng nhập mật khẩu mới thì băm và cập nhật, ngược lại giữ nguyên mật khẩu cũ
            if (!string.IsNullOrWhiteSpace(model.Password))
            {
                existingCustomer.Password = PasswordHelper.HashPassword(model.Password);
            }

            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        // ===== DELETE =====
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