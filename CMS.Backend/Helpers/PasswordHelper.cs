namespace CMS.Backend.Helpers
{
    public static class PasswordHelper
    {
        private const int WorkFactor = 12;

        public static string HashPassword(string password)
        {
            if (string.IsNullOrWhiteSpace(password))
            {
                throw new ArgumentException("Mật khẩu không được để trống.", nameof(password));
            }

            return BCrypt.Net.BCrypt.HashPassword(password, WorkFactor);
        }

        public static bool VerifyPassword(string password, string storedPassword)
        {
            if (string.IsNullOrWhiteSpace(password) || string.IsNullOrWhiteSpace(storedPassword))
            {
                return false;
            }

            if (!IsBCryptHash(storedPassword))
            {
                return password == storedPassword;
            }

            try
            {
                return BCrypt.Net.BCrypt.Verify(password, storedPassword);
            }
            catch
            {
                return false;
            }
        }

        public static bool IsBCryptHash(string? value)
        {
            return !string.IsNullOrWhiteSpace(value) &&
                   (value.StartsWith("$2a$") || value.StartsWith("$2b$") || value.StartsWith("$2y$"));
        }
    }
}
