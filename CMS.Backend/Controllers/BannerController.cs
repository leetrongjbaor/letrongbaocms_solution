using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class BannerController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;

        public BannerController(ApplicationDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        public async Task<IActionResult> Index()
        {
            var banners = await _context.Banners
                .OrderBy(b => b.DisplayOrder)
                .ThenByDescending(b => b.Id)
                .ToListAsync();

            return View(banners);
        }

        [HttpGet]
        public IActionResult Create()
        {
            return View(new Banner { IsActive = true, Position = "Home" });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Banner model, IFormFile? ImageFile)
        {
            if (ImageFile != null && ImageFile.Length > 0)
            {
                model.ImageUrl = await SaveBannerImageAsync(ImageFile);
                ModelState.Remove(nameof(Banner.ImageUrl));
            }

            if (!ModelState.IsValid) return View(model);

            model.CreatedDate = DateTime.Now;
            _context.Banners.Add(model);
            await _context.SaveChangesAsync();

            return RedirectToAction(nameof(Index));
        }

        [HttpGet]
        public async Task<IActionResult> Edit(int id)
        {
            var banner = await _context.Banners.FindAsync(id);
            if (banner == null) return NotFound();

            return View(banner);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(Banner model, IFormFile? ImageFile)
        {
            var banner = await _context.Banners.FindAsync(model.Id);
            if (banner == null) return NotFound();

            if (ImageFile != null && ImageFile.Length > 0)
            {
                banner.ImageUrl = await SaveBannerImageAsync(ImageFile);
                model.ImageUrl = banner.ImageUrl;
                ModelState.Remove(nameof(Banner.ImageUrl));
            }
            else
            {
                model.ImageUrl = banner.ImageUrl;
            }

            if (!ModelState.IsValid) return View(model);

            banner.Title = model.Title;
            banner.Subtitle = model.Subtitle;
            if (!string.IsNullOrWhiteSpace(model.ImageUrl))
            {
                banner.ImageUrl = model.ImageUrl;
            }
            banner.LinkUrl = model.LinkUrl;
            banner.Position = model.Position;
            banner.DisplayOrder = model.DisplayOrder;
            banner.IsActive = model.IsActive;

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        public async Task<IActionResult> Delete(int id)
        {
            var banner = await _context.Banners.FindAsync(id);
            if (banner != null)
            {
                _context.Banners.Remove(banner);
                await _context.SaveChangesAsync();
            }

            return RedirectToAction(nameof(Index));
        }

        private async Task<string> SaveBannerImageAsync(IFormFile file)
        {
            var uploadDir = Path.Combine(_env.WebRootPath, "uploads", "banners");
            Directory.CreateDirectory(uploadDir);

            var ext = Path.GetExtension(file.FileName);
            var fileName = $"{Guid.NewGuid()}{ext}";
            var filePath = Path.Combine(uploadDir, fileName);

            using var stream = new FileStream(filePath, FileMode.Create);
            await file.CopyToAsync(stream);

            return $"/uploads/banners/{fileName}";
        }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class BannersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;

        public BannersController(ApplicationDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Banner>>> GetAll([FromQuery] bool activeOnly = false)
        {
            var query = _context.Banners.AsQueryable();

            if (activeOnly)
            {
                query = query.Where(b => b.IsActive);
            }

            return await query
                .OrderBy(b => b.DisplayOrder)
                .ThenByDescending(b => b.Id)
                .ToListAsync();
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Banner>> GetById(int id)
        {
            var banner = await _context.Banners.FindAsync(id);
            return banner == null ? NotFound() : banner;
        }

        [HttpPost]
        public async Task<ActionResult<Banner>> Create([FromForm] BannerFormDto model)
        {
            var banner = new Banner
            {
                Title = model.Title,
                Subtitle = model.Subtitle,
                ImageUrl = model.ImageUrl ?? string.Empty,
                LinkUrl = model.LinkUrl,
                Position = string.IsNullOrWhiteSpace(model.Position) ? "Home" : model.Position,
                DisplayOrder = model.DisplayOrder,
                IsActive = model.IsActive,
                CreatedDate = DateTime.Now
            };

            if (model.ImageFile != null && model.ImageFile.Length > 0)
            {
                banner.ImageUrl = await SaveBannerImageAsync(model.ImageFile);
            }

            _context.Banners.Add(banner);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = banner.Id }, banner);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromForm] BannerFormDto model)
        {
            var banner = await _context.Banners.FindAsync(id);
            if (banner == null) return NotFound();

            banner.Title = model.Title;
            banner.Subtitle = model.Subtitle;
            if (model.ImageFile != null && model.ImageFile.Length > 0)
            {
                banner.ImageUrl = await SaveBannerImageAsync(model.ImageFile);
            }
            else if (!string.IsNullOrWhiteSpace(model.ImageUrl))
            {
                banner.ImageUrl = model.ImageUrl;
            }
            banner.LinkUrl = model.LinkUrl;
            banner.Position = string.IsNullOrWhiteSpace(model.Position) ? "Home" : model.Position;
            banner.DisplayOrder = model.DisplayOrder;
            banner.IsActive = model.IsActive;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteApi(int id)
        {
            var banner = await _context.Banners.FindAsync(id);
            if (banner == null) return NotFound();

            _context.Banners.Remove(banner);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private async Task<string> SaveBannerImageAsync(IFormFile file)
        {
            var uploadDir = Path.Combine(_env.WebRootPath, "uploads", "banners");
            Directory.CreateDirectory(uploadDir);

            var ext = Path.GetExtension(file.FileName);
            var fileName = $"{Guid.NewGuid()}{ext}";
            var filePath = Path.Combine(uploadDir, fileName);

            using var stream = new FileStream(filePath, FileMode.Create);
            await file.CopyToAsync(stream);

            return $"/uploads/banners/{fileName}";
        }
    }

    public class BannerFormDto
    {
        public string Title { get; set; } = string.Empty;
        public string? Subtitle { get; set; }
        public string? ImageUrl { get; set; }
        public IFormFile? ImageFile { get; set; }
        public string? LinkUrl { get; set; }
        public string? Position { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
