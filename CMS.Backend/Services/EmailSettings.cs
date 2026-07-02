namespace CMS.Backend.Services
{
    public class EmailSettings
    {
        public string Host { get; set; } = "";
        public int Port { get; set; } = 587;
        public bool EnableSsl { get; set; } = true;
        public string Username { get; set; } = "";
        public string Password { get; set; } = "";
        public string FromEmail { get; set; } = "";
        public string FromName { get; set; } = "GadgetHub.Store";
        public string? AdminEmail { get; set; }
        public string FrontendBaseUrl { get; set; } = "http://localhost:3000";
    }
}
