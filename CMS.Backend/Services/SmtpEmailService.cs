using Microsoft.Extensions.Options;
using System.Net;
using System.Net.Mail;
using System.Text;

namespace CMS.Backend.Services
{
    public class SmtpEmailService : IEmailService
    {
        private readonly EmailSettings _settings;
        private readonly ILogger<SmtpEmailService> _logger;

        public SmtpEmailService(IOptions<EmailSettings> settings, ILogger<SmtpEmailService> logger)
        {
            _settings = settings.Value;
            _logger = logger;
        }

        public Task SendPasswordResetCodeAsync(string toEmail, string customerName, string code)
        {
            var resetUrl = $"{_settings.FrontendBaseUrl.TrimEnd('/')}/forgot-password?email={Uri.EscapeDataString(toEmail)}";
            var body = $@"
                <h2>Ma xac nhan dat lai mat khau</h2>
                <p>Xin chao {Html(customerName)},</p>
                <p>Ma xac nhan cua ban la:</p>
                <div style=""font-size:28px;font-weight:700;letter-spacing:6px;background:#f3f4f6;padding:16px 20px;border-radius:8px;display:inline-block"">{Html(code)}</div>
                <p>Ma nay co hieu luc trong 10 phut.</p>
                <p>Nhap ma tai: <a href=""{Html(resetUrl)}"">{Html(resetUrl)}</a></p>
                <p>Neu ban khong yeu cau dat lai mat khau, vui long bo qua email nay.</p>";

            return SendAsync(toEmail, "Ma xac nhan dat lai mat khau", body);
        }

        public Task SendOrderConfirmationAsync(OrderEmailMessage order)
        {
            var body = BuildOrderHtml(order, "Dat hang thanh cong", "Cam on ban da dat hang tai GadgetHub.Store. Don hang cua ban dang cho xu ly.");
            return SendAsync(order.CustomerEmail, $"Xac nhan don hang #{order.OrderId}", body);
        }

        public Task SendOrderAdminNotificationAsync(OrderEmailMessage order)
        {
            if (string.IsNullOrWhiteSpace(_settings.AdminEmail))
            {
                return Task.CompletedTask;
            }

            var body = BuildOrderHtml(order, "Co don hang moi", "Vui long kiem tra va xu ly don hang trong trang quan tri.");
            return SendAsync(_settings.AdminEmail, $"Don hang moi #{order.OrderId}", body);
        }

        private async Task SendAsync(string toEmail, string subject, string htmlBody)
        {
            if (!IsConfigured())
            {
                _logger.LogWarning("Email settings are incomplete. Skipped sending email to {Email}.", toEmail);
                return;
            }

            try
            {
                using var message = new MailMessage
                {
                    From = new MailAddress(_settings.FromEmail, _settings.FromName),
                    Subject = subject,
                    Body = htmlBody,
                    IsBodyHtml = true,
                    BodyEncoding = Encoding.UTF8,
                    SubjectEncoding = Encoding.UTF8
                };
                message.To.Add(toEmail);

                using var client = new SmtpClient(_settings.Host, _settings.Port)
                {
                    EnableSsl = _settings.EnableSsl,
                    Credentials = new NetworkCredential(_settings.Username, _settings.Password)
                };

                await client.SendMailAsync(message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Could not send email to {Email}.", toEmail);
            }
        }

        private bool IsConfigured()
        {
            return !string.IsNullOrWhiteSpace(_settings.Host)
                && !string.IsNullOrWhiteSpace(_settings.Username)
                && !string.IsNullOrWhiteSpace(_settings.Password)
                && !string.IsNullOrWhiteSpace(_settings.FromEmail);
        }

        private static string BuildOrderHtml(OrderEmailMessage order, string title, string intro)
        {
            var rows = string.Join("", order.Items.Select(item => $@"
                <tr>
                    <td style=""padding:8px;border-bottom:1px solid #eee"">{Html(item.ProductName)}</td>
                    <td style=""padding:8px;border-bottom:1px solid #eee;text-align:center"">{item.Quantity}</td>
                    <td style=""padding:8px;border-bottom:1px solid #eee;text-align:right"">{FormatVnd(item.UnitPrice)}</td>
                    <td style=""padding:8px;border-bottom:1px solid #eee;text-align:right"">{FormatVnd(item.UnitPrice * item.Quantity)}</td>
                </tr>"));

            return $@"
                <h2>{Html(title)}</h2>
                <p>{Html(intro)}</p>
                <p><strong>Ma don hang:</strong> #{order.OrderId}</p>
                <p><strong>Khach hang:</strong> {Html(order.CustomerName)} ({Html(order.CustomerEmail)})</p>
                <p><strong>So dien thoai:</strong> {Html(order.CustomerPhone ?? "")}</p>
                <p><strong>Dia chi giao hang:</strong> {Html(order.ShippingAddress ?? "")}</p>
                <table style=""border-collapse:collapse;width:100%;max-width:760px"">
                    <thead>
                        <tr>
                            <th style=""padding:8px;text-align:left;background:#111;color:#fff"">San pham</th>
                            <th style=""padding:8px;text-align:center;background:#111;color:#fff"">SL</th>
                            <th style=""padding:8px;text-align:right;background:#111;color:#fff"">Don gia</th>
                            <th style=""padding:8px;text-align:right;background:#111;color:#fff"">Thanh tien</th>
                        </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                    <tfoot>
                        <tr>
                            <td colspan=""3"" style=""padding:12px;text-align:right;font-weight:700"">Tong cong</td>
                            <td style=""padding:12px;text-align:right;font-weight:700;color:#e50914"">{FormatVnd(order.TotalAmount)}</td>
                        </tr>
                    </tfoot>
                </table>
                <p><strong>Ghi chu:</strong> {Html(order.Notes ?? "")}</p>";
        }

        private static string Html(string value)
        {
            return WebUtility.HtmlEncode(value);
        }

        private static string FormatVnd(decimal amount)
        {
            return string.Format(new System.Globalization.CultureInfo("vi-VN"), "{0:C0}", amount);
        }
    }
}
