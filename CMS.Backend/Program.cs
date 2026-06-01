using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using CMS.Data;

var builder = WebApplication.CreateBuilder(args);

// ===== 1. ĐĂNG KÝ SERVICES =====
builder.Services.AddControllersWithViews();

// Đăng ký DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

// Cookie Authentication
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath        = "/Account/Login";
        options.LogoutPath       = "/Account/Logout";
        options.AccessDeniedPath = "/Account/AccessDenied";
        options.ExpireTimeSpan   = TimeSpan.FromHours(8);
    });

// ===== THÊM MỚI: Swagger + CORS =====
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
// =====================================

var app = builder.Build();

// ===== 2. CẤU HÌNH MIDDLEWARE =====
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

// ===== THÊM MỚI: Swagger UI =====
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "ThaiCMS Web API v1");
    c.RoutePrefix = "swagger";
});
// =================================

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

// ===== THÊM MỚI: CORS (phải nằm giữa UseRouting và UseAuthentication) =====
app.UseCors("AllowAll");
// ===========================================================================

app.UseAuthentication();
app.UseAuthorization();

// ===== 3. ROUTING =====
// Phân luồng A: API
app.MapControllers();

// Phân luồng B: MVC cũ
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();