/*
Họ Tên: Lê Trọng Bảo
MSSV: 2123110056
VS: 1.0
*/
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;
using CMS.Data;

public class AccountController : Controller
{
    private readonly ApplicationDbContext _context;

    public AccountController(ApplicationDbContext context)
    {
        _context = context;
    }

    // ================================
    // GET: /Account/Login
    // Hiển thị form đăng nhập
    // ================================
    [HttpGet]
    public IActionResult Login()
    {
        return View();
    }

    // ================================
    // POST: /Account/Login
    // Xử lý logic đăng nhập
    // ================================
    [HttpPost]
    public async Task<IActionResult> Login(string username, string password)
    {
        // BƯỚC 1: Tìm user trong database khớp username VÀ password
        var user = _context.Users
            .FirstOrDefault(u => u.Username == username && u.PasswordHash == password);

        if (user != null)
        {
            // BƯỚC 2: Tạo danh sách Claims (thông tin đính kèm vào Cookie)
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name,  user.Username),  // Tên đăng nhập
                new Claim(ClaimTypes.Role,  user.Role),      // "Admin" hoặc "Editor"
                new Claim("FullName",       user.FullName)   // Tên hiển thị
            };

            // BƯỚC 3: Đóng gói Claims thành Identity
            var claimsIdentity = new ClaimsIdentity(
                claims, CookieAuthenticationDefaults.AuthenticationScheme);

            // BƯỚC 4: Ghi Cookie vào trình duyệt → đăng nhập thành công
            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(claimsIdentity));

            return RedirectToAction("Index", "Home");
        }

        // Đăng nhập thất bại → hiển thị thông báo lỗi
        ViewBag.Error = "Tên đăng nhập hoặc mật khẩu không đúng!";
        return View();
    }

    // ================================
    // GET: /Account/Logout
    // Xóa Cookie → đăng xuất
    // ================================
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return RedirectToAction("Login");
    }

    // ================================
    // GET: /Account/AccessDenied
    // Hiển thị khi không đủ quyền
    // ================================
    [HttpGet]
    public IActionResult AccessDenied()
    {
        return View();
    }
}
