using System;

namespace CMS.Backend.Helpers
{
    /// <summary>
    /// Bộ hỗ trợ băm và kiểm tra mật khẩu sử dụng BCrypt
    /// </summary>
    public static class PasswordHelper
    {
        /// <summary>
        /// Băm mật khẩu thô bằng BCrypt
        /// </summary>
        /// <param name="password">Mật khẩu dạng thô</param>
        /// <returns>Mật khẩu đã được băm</returns>
        public static string HashPassword(string password)
        {
            if (string.IsNullOrWhiteSpace(password))
            {
                return string.Empty;
            }
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        /// <summary>
        /// Đối chiếu mật khẩu nhập vào với mật khẩu đã băm (hỗ trợ fallback nếu mật khẩu lưu trữ là chuỗi thô cũ)
        /// </summary>
        /// <param name="password">Mật khẩu người dùng nhập vào để kiểm tra</param>
        /// <param name="hashedPassword">Mật khẩu được lấy từ cơ sở dữ liệu (có thể là hash hoặc plaintext cũ)</param>
        /// <returns>True nếu trùng khớp, ngược lại False</returns>
        public static bool VerifyPassword(string password, string hashedPassword)
        {
            if (string.IsNullOrEmpty(hashedPassword))
            {
                return false;
            }

            // BCrypt hash bắt đầu bằng $2a$, $2b$, hoặc $2y$
            if (hashedPassword.StartsWith("$2a$") || hashedPassword.StartsWith("$2b$") || hashedPassword.StartsWith("$2y$"))
            {
                try
                {
                    return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
                }
                catch
                {
                    // Fallback trong trường hợp lỗi định dạng băm đột xuất
                    return password == hashedPassword;
                }
            }

            // Fallback so khớp chuỗi thô cho tài khoản cũ chưa mã hóa
            return password == hashedPassword;
        }
    }
}
