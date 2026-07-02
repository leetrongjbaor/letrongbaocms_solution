namespace CMS.Backend.Services
{
    public interface IEmailService
    {
        Task SendPasswordResetCodeAsync(string toEmail, string customerName, string code);
        Task SendOrderConfirmationAsync(OrderEmailMessage order);
        Task SendOrderAdminNotificationAsync(OrderEmailMessage order);
    }

    public class OrderEmailMessage
    {
        public int OrderId { get; set; }
        public string CustomerName { get; set; } = "";
        public string CustomerEmail { get; set; } = "";
        public string? CustomerPhone { get; set; }
        public string? ShippingAddress { get; set; }
        public string? Notes { get; set; }
        public DateTime OrderDate { get; set; }
        public List<OrderEmailItem> Items { get; set; } = new();
        public decimal TotalAmount => Items.Sum(item => item.Quantity * item.UnitPrice);
    }

    public class OrderEmailItem
    {
        public string ProductName { get; set; } = "";
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }
}
