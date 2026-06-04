/*
Họ Tên: Lê Trọng Bảo
MSSV: 2123110056
VS: 1.0
*/
using CMS.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    // Chỉ Admin mới vào được — không phải Admin → chuyển sang trang 403
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
    }
}
