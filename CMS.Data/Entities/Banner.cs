using System.ComponentModel.DataAnnotations;

namespace CMS.Data.Entities
{
    public class Banner
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(160)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(300)]
        public string? Subtitle { get; set; }

        [Required]
        public string ImageUrl { get; set; } = string.Empty;

        [MaxLength(300)]
        public string? LinkUrl { get; set; }

        [MaxLength(50)]
        public string Position { get; set; } = "Home";

        public int DisplayOrder { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedDate { get; set; } = DateTime.Now;
    }
}
