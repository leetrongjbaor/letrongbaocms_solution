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
    public class OrderDetailController : Controller
    {
        private readonly ApplicationDbContext _context;

        public OrderDetailController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            var data = _context.OrderDetails
                               .Include(od => od.Order)
                                   .ThenInclude(o => o.Customer)
                               .Include(od => od.Product)
                               .OrderByDescending(od => od.OrderId)
                               .ThenByDescending(od => od.Id)
                               .ToList();
            return View(data);
        }

        [HttpGet]
        public IActionResult Create(int? orderId)
        {
            LoadFormData();
            var model = new OrderDetail
            {
                OrderId = orderId ?? 0,
                Quantity = 1
            };
            return View(model);
        }

        [HttpPost]
        public IActionResult Create(OrderDetail model)
        {
            if (!ModelState.IsValid)
            {
                LoadFormData();
                return View(model);
            }

            _context.OrderDetails.Add(model);
            _context.SaveChanges();
            return RedirectToAction("Details", "Order", new { id = model.OrderId });
        }

        [HttpGet]
        public IActionResult Edit(int id)
        {
            var detail = _context.OrderDetails.Find(id);
            if (detail == null) return NotFound();

            LoadFormData();
            return View(detail);
        }

        [HttpPost]
        public IActionResult Edit(OrderDetail model)
        {
            if (!ModelState.IsValid)
            {
                LoadFormData();
                return View(model);
            }

            _context.OrderDetails.Update(model);
            _context.SaveChanges();
            return RedirectToAction("Details", "Order", new { id = model.OrderId });
        }

        public IActionResult Delete(int id)
        {
            var detail = _context.OrderDetails.Find(id);
            if (detail == null) return RedirectToAction("Index");

            var orderId = detail.OrderId;
            _context.OrderDetails.Remove(detail);
            _context.SaveChanges();

            return RedirectToAction("Details", "Order", new { id = orderId });
        }

        private void LoadFormData()
        {
            ViewBag.Orders = _context.Orders
                .Include(o => o.Customer)
                .OrderByDescending(o => o.Id)
                .ToList();

            ViewBag.Products = _context.Products
                .OrderBy(p => p.Name)
                .ToList();
        }
    }
}
