# LeTrongBaoCMS - Hệ Thống Quản Trị Nội Dung Bài Viết & Sản Phẩm

Chào mừng bạn đến với dự án **LeTrongBaoCMS**. Tài liệu này cung cấp hướng dẫn khởi chạy dự án, cách cấu hình, sử dụng API Swagger và chi tiết về tính năng phân trang bài viết vừa được thiết lập ở cả MVC Admin và RESTful API.

---

## 🛠️ Công Nghệ Sử Dụng

- **Backend**: ASP.NET Core MVC & Web API (.NET 8.0)
- **Database Access**: Entity Framework Core với Microsoft SQL Server
- **API Documentation**: Swagger (Swashbuckle.AspNetCore 10.2.0) tích hợp XML Comments tiếng Việt
- **Frontend**: React (Vite / CRA) với Axios client

---

## 🗄️ Cấu Trúc Cơ Sở Dữ Liệu (8 Bảng) & Swagger API

Hệ thống sử dụng cơ sở dữ liệu gồm **8 bảng chính** được định nghĩa bằng Entity Framework Core trong dự án `CMS.Data`. Dưới đây là thông tin chi tiết từng bảng, các trường dữ liệu và các Swagger API endpoints tương ứng:

### 1. Bảng `Categories` (Danh mục bài viết tin tức)
- **Cấu trúc trường**:
  - `Id` (int, Primary Key): Mã định danh danh mục.
  - `Name` (string): Tên danh mục tin tức (Ví dụ: *Mẹo phối đồ*, *Bộ sưu tập*, *Xu hướng*).
- **Mã nguồn Class**: [Category.cs](file:///d:/BaocaoKetThucMon/letrongbaocms-Solution/CMS.Data/Entities/Category.cs)
- **Swagger API Endpoint**: `GET /api/Categories` - Lấy danh sách tất cả các danh mục bài viết.

### 2. Bảng `CategoriesProducts` (Danh mục sản phẩm thời trang)
- **Cấu trúc trường**:
  - `Id` (int, Primary Key): Mã định danh danh mục sản phẩm.
  - `Name` (string): Tên danh mục sản phẩm (Ví dụ: *Áo thun*, *Váy đầm*, *Phụ kiện*).
  - `Description` (string, nullable): Mô tả ngắn về danh mục sản phẩm.
- **Mã nguồn Class**: [CategoryProduct.cs](file:///d:/BaocaoKetThucMon/letrongbaocms-Solution/CMS.Data/Entities/CategoryProduct.cs)
- **Swagger API Endpoint**: `GET /api/CategoriesProducts` - Lấy danh sách toàn bộ danh mục sản phẩm thời trang.

### 3. Bảng `Products` (Sản phẩm thời trang)
- **Cấu trúc trường**:
  - `Id` (int, Primary Key): Mã sản phẩm.
  - `Name` (string): Tên sản phẩm.
  - `Price` (decimal): Giá bán sản phẩm.
  - `ImageUrl` (string, nullable): Đường dẫn ảnh sản phẩm.
  - `StockQuantity` (int): Số lượng tồn kho.
  - `Description` (string, nullable): Mô tả chi tiết sản phẩm.
  - `CategoryProductId` (int, Foreign Key): Liên kết tới danh mục sản phẩm.
- **Mã nguồn Class**: [Product.cs](file:///d:/BaocaoKetThucMon/letrongbaocms-Solution/CMS.Data/Entities/Product.cs)
- **Swagger API Endpoints**:
  - `GET /api/Products` - Lấy toàn bộ danh sách sản phẩm.
  - `GET /api/Products/{id}` - Lấy chi tiết thông tin sản phẩm theo ID.
  - `GET /api/Products/categoryproduct/{categoryProductId}` - Lọc danh sách sản phẩm theo mã danh mục sản phẩm.

### 4. Bảng `Posts` (Bài viết tin tức)
- **Cấu trúc trường**:
  - `Id` (int, Primary Key): Mã bài viết.
  - `Title` (string): Tiêu đề bài viết.
  - `Content` (string): Nội dung chi tiết bài viết (Lưu trữ mã HTML từ CKEditor).
  - `ImageUrl` (string, nullable): Đường dẫn ảnh minh họa bài viết.
  - `CreatedDate` (DateTime): Ngày đăng bài viết.
  - `CategoryId` (int, Foreign Key): Liên kết tới danh mục bài viết.
- **Mã nguồn Class**: [Post.cs](file:///d:/BaocaoKetThucMon/letrongbaocms-Solution/CMS.Data/Entities/Post.cs)
- **Swagger API Endpoints**:
  - `GET /api/Posts` - Lấy danh sách bài viết (Hỗ trợ phân trang tùy chọn bằng tham số `page` và `pageSize`).
  - `GET /api/Posts/{id}` - Lấy chi tiết một bài viết theo ID.

### 5. Bảng `Customers` (Khách hàng mua sắm)
- **Cấu trúc trường**:
  - `Id` (int, Primary Key): Mã khách hàng.
  - `FullName` (string): Họ tên khách hàng.
  - `Email` (string): Địa chỉ email (dùng để đăng nhập).
  - `Password` (string): Mật khẩu đăng nhập.
  - `Phone` (string, nullable): Số điện thoại liên hệ.
  - `Address` (string, nullable): Địa chỉ giao hàng.
- **Mã nguồn Class**: [Customer.cs](file:///d:/BaocaoKetThucMon/letrongbaocms-Solution/CMS.Data/Entities/Customer.cs)
- **Swagger API Endpoints**:
  - `POST /api/Customers/register` - Đăng ký tài khoản khách hàng mới.
  - `POST /api/Customers/login` - Đăng nhập tài khoản khách hàng.

### 6. Bảng `Orders` (Đơn đặt hàng)
- **Cấu trúc trường**:
  - `Id` (int, Primary Key): Mã đơn hàng.
  - `OrderDate` (DateTime): Ngày đặt hàng.
  - `CustomerId` (int, Foreign Key): Mã khách hàng đặt hàng.
  - `Status` (int): Trạng thái đơn hàng (0: Chờ duyệt, 1: Đang giao, 2: Hoàn thành).
  - `Notes` (string, nullable): Ghi chú giao hàng.
- **Mã nguồn Class**: [Order.cs](file:///d:/BaocaoKetThucMon/letrongbaocms-Solution/CMS.Data/Entities/Order.cs)
- **Swagger API Endpoints**:
  - `GET /api/Orders` - Lấy danh sách toàn bộ đơn đặt hàng.
  - `GET /api/Orders/{id}` - Lấy chi tiết một đơn hàng kèm danh sách chi tiết sản phẩm đã mua.
  - `POST /api/Orders` - Tạo đơn đặt hàng mới từ giỏ hàng Frontend React.

### 7. Bảng `OrderDetails` (Chi tiết đơn đặt hàng)
- **Cấu trúc trường**:
  - `Id` (int, Primary Key): Mã chi tiết dòng đơn hàng.
  - `OrderId` (int, Foreign Key): Liên kết đơn đặt hàng.
  - `ProductId` (int, Foreign Key): Liên kết sản phẩm thời trang.
  - `Price` (decimal): Giá bán tại thời điểm mua sản phẩm.
  - `Quantity` (int): Số lượng sản phẩm mua.
- **Mã nguồn Class**: [OrderDetail.cs](file:///d:/BaocaoKetThucMon/letrongbaocms-Solution/CMS.Data/Entities/OrderDetail.cs)
- **Swagger API**: Thông tin bảng này được tích hợp trả về trực tiếp trong endpoint chi tiết đơn hàng `GET /api/Orders/{id}`.

### 8. Bảng `Users` (Tài khoản quản trị viên hệ thống)
- **Cấu trúc trường**:
  - `Id` (int, Primary Key): Mã tài khoản quản trị.
  - `Username` (string): Tên đăng nhập vào CMS Admin.
  - `PasswordHash` (string): Mật khẩu đã được mã hóa.
  - `FullName` (string): Họ tên đầy đủ của quản trị viên.
  - `Role` (string): Vai trò của tài khoản (Ví dụ: *Quản trị viên* hoặc *Biên tập viên*).
- **Mã nguồn Class**: [User.cs](file:///d:/BaocaoKetThucMon/letrongbaocms-Solution/CMS.Data/Entities/User.cs)
- **Swagger API**: Không công khai API quản trị viên để bảo mật. Tài khoản được xác thực nội bộ thông qua cơ chế Cookie Authentication tại MVC controller [AccountController.cs](file:///d:/BaocaoKetThucMon/letrongbaocms-Solution/CMS.Backend/Controllers/AccountController.cs).

---

## 📁 Cấu Trúc Thư Mục Dự Án (Folder Directory Tree)

Dưới đây là sơ đồ chi tiết về cấu trúc các dự án con, thư mục và các file mã nguồn chính trong Solution `letrongbaocms_solution.sln`:

```text
letrongbaocms-Solution/
│
├── CMS.Backend/                       # Dự án Backend (ASP.NET Core MVC & Web API)
│   ├── Controllers/                   # Điều hướng yêu cầu từ Client
│   │   ├── API/                       # Các API phục vụ cho Frontend React (RESTful endpoints)
│   │   │   ├── CategoriesApiController.cs        # API quản lý danh mục sản phẩm
│   │   │   ├── CategoriesProductsApiController.cs# API liên kết danh mục và sản phẩm
│   │   │   ├── CustomersApiController.cs         # API quản lý khách hàng
│   │   │   ├── OrdersController.cs               # API quản lý đơn hàng
│   │   │   ├── PostsApiController.cs             # API bài viết (Hỗ trợ phân trang)
│   │   │   └── ProductsController.cs             # API quản lý sản phẩm
│   │   ├── AccountController.cs       # Đăng nhập/Đăng xuất hệ thống Admin MVC
│   │   ├── Categoriesproductscontroller.cs       
│   │   ├── CategoryController.cs      # Quản lý danh mục qua giao diện Admin MVC
│   │   ├── Customercontroller.cs      # Quản lý khách hàng qua giao diện Admin MVC
│   │   ├── HomeController.cs          # Trang chủ hệ thống Admin
│   │   ├── Ordercontroller.cs         # Quản lý đơn hàng qua giao diện Admin MVC
│   │   ├── Orderdetailcontroller.cs   # Quản lý chi tiết đơn hàng MVC
│   │   ├── PostController.cs          # Quản lý bài viết MVC (Hỗ trợ phân trang)
│   │   ├── Productcontroller.cs       # Quản lý sản phẩm qua giao diện Admin MVC
│   │   └── UserController.cs          # Quản lý tài khoản quản trị viên MVC
│   ├── Models/                        # Chứa các Model hiển thị hoặc dữ liệu trung gian
│   │   └── ErrorViewModel.cs
│   ├── Views/                         # Giao diện Razor Pages (.cshtml) cho trang quản trị Admin
│   │   ├── Account/                   # View cho Đăng nhập
│   │   ├── CategoriesProducts/
│   │   ├── Category/                  # Giao diện CRUD Danh mục
│   │   ├── Customer/                  # Giao diện CRUD Khách hàng
│   │   ├── Home/                      # Giao diện Dashboard trang chủ
│   │   ├── Order/                     # Giao diện quản lý Đơn hàng
│   │   ├── OrderDetail/               # Giao diện Chi tiết đơn hàng
│   │   ├── Post/                      # Giao diện quản lý Bài viết (Hỗ trợ Bootstrap Pagination UI)
│   │   ├── Product/                   # Giao diện CRUD Sản phẩm
│   │   ├── Shared/                    # Layout dùng chung cho toàn bộ trang Admin (_Layout.cshtml)
│   │   ├── User/                      # Giao diện quản lý Tài khoản
│   │   ├── _ViewImports.cshtml        # Nạp các thư viện dùng chung cho toàn bộ View
│   │   └── _ViewStart.cshtml          # Định nghĩa Layout mặc định cho hệ thống
│   ├── Properties/
│   │   └── launchSettings.json        # Định nghĩa cổng chạy HTTP/HTTPS và cấu hình môi trường
│   ├── wwwroot/                       # Tài nguyên tĩnh (CSS, JS, Hình ảnh, Thư viện client-side)
│   ├── appsettings.json               # Lưu chuỗi kết nối Database và cấu hình chung
│   ├── Program.cs                     # Điểm khởi chạy dự án, đăng ký Middleware, Authentication & Swagger
│   └── CMS.Backend.csproj             # File cấu hình thư viện và biên dịch dự án Backend
│
├── CMS.Data/                          # Dự án lớp Dữ liệu (Database Layer)
│   ├── Entities/                      # Các đối tượng đại diện cho bảng CSDL (ORM Mapping)
│   │   ├── Category.cs                # Thực thể Danh mục
│   │   ├── CategoryProduct.cs         # Thực thể liên kết Nhiều-Nhiều Danh mục & Sản phẩm
│   │   ├── Customer.cs                # Thực thể Khách hàng
│   │   ├── Order.cs                   # Thực thể Đơn hàng
│   │   ├── OrderDetail.cs             # Thực thể Chi tiết đơn hàng
│   │   ├── Post.cs                    # Thực thể Bài viết tin tức
│   │   ├── Product.cs                 # Thực thể Sản phẩm
│   │   └── User.cs                    # Thực thể Tài khoản quản trị viên
│   ├── Migrations/                    # Các file lịch sử cập nhật cấu trúc database của EF Core
│   ├── ApplicationDbContext.cs        # Kết nối CSDL thông qua Entity Framework DbContext
│   └── CMS.Data.csproj                # File cấu hình thư viện dự án Data
│
├── cms.frontend/                      # Ứng dụng Client (React JS)
│   ├── public/                        # Chứa các tài nguyên tĩnh công khai (logo, favicon)
│   ├── src/                           # Mã nguồn chính của ứng dụng
│   │   ├── api/                       # Cấu hình gọi API dùng chung
│   │   │   ├── axiosClient.js         # Khởi tạo Axios với BaseURL và Response Interceptor
│   │   │   └── blogService.js
│   │   ├── components/                # Các Component giao diện độc lập, tái sử dụng
│   │   │   ├── BlogCategoryList.jsx   # Danh sách danh mục bài viết tin tức
│   │   │   ├── Cart.jsx               # Giỏ hàng và các chức năng giỏ hàng
│   │   │   ├── CategoryProductList.jsx# Bộ lọc danh mục sản phẩm
│   │   │   ├── Footer.jsx             # Chân trang giao diện thời trang
│   │   │   ├── Header.jsx             # Thanh điều hướng đầu trang (Menu, Tìm kiếm, Giỏ hàng)
│   │   │   ├── PostCard.jsx           # Card hiển thị tóm tắt một bài viết
│   │   │   ├── PostDetail.css         # CSS cho trang chi tiết bài viết
│   │   │   ├── PostDetail.jsx         # Trang hiển thị chi tiết nội dung bài viết
│   │   │   ├── PostList.jsx           # Danh sách các bài viết xu hướng
│   │   │   ├── ProductCard.jsx        # Card hiển thị tóm tắt một sản phẩm (Tên, Ảnh, Giá)
│   │   │   ├── ProductDetail.jsx      # Trang xem chi tiết sản phẩm và chọn mua
│   │   │   └── ProductList.jsx        # Danh sách sản phẩm chính
│   │   ├── pages/                     # Các Component tương ứng với từng đường dẫn (Route)
│   │   │   ├── about/                 # Trang giới thiệu
│   │   │   ├── blog/                  # Trang Tin tức thời trang
│   │   │   ├── blog-detail/           # Trang Chi tiết tin tức
│   │   │   ├── cart/                  # Trang Giỏ hàng
│   │   │   ├── checkout/              # Trang Thanh toán đặt hàng
│   │   │   ├── home/                  # Các thành phần chính của Trang chủ
│   │   │   │   ├── CategoryMenu.jsx   # Danh mục sản phẩm trang chủ
│   │   │   │   ├── HeroBanner.css     # CSS cho Banner chuyển động
│   │   │   │   ├── HeroBanner.jsx     # Banner slider trang chủ
│   │   │   │   ├── LatestBlog.jsx     # Tin tức mới nhất (hiển thị 3 bài mới nhất)
│   │   │   │   ├── ProductGrid.jsx    # Lưới sản phẩm nổi bật
│   │   │   │   └── index.jsx          # File lắp ráp tổng trang chủ
│   │   │   ├── login/                 # Trang Đăng nhập khách hàng
│   │   │   ├── product-detail/        # Trang Chi tiết sản phẩm
│   │   │   ├── register/              # Trang Đăng ký khách hàng
│   │   │   └── shop/                  # Trang Cửa hàng mua sắm chính
│   │   ├── services/                  # Các lớp trung gian gọi API RESTful từ Backend
│   │   │   ├── blogService.js         # Dịch vụ gọi API danh mục và chi tiết bài viết
│   │   │   ├── categoryProductService.js
│   │   │   ├── customerService.js     # Dịch vụ gọi API tài khoản khách hàng
│   │   │   ├── postService.js         # Dịch vụ gọi API danh sách bài viết
│   │   │   └── productService.js      # Dịch vụ gọi API sản phẩm
│   │   ├── utils/                     # Các hàm hỗ trợ dùng chung
│   │   │   └── imageHelper.js         # Hỗ trợ xử lý đường dẫn hình ảnh từ backend
│   │   ├── App.css                    # CSS toàn cục cho App React
│   │   ├── App.js                     # File điều phối chính, cấu hình định tuyến (Routing)
│   │   ├── index.css                  # CSS cốt lõi
│   │   └── index.js                   # Điểm khởi chạy của ứng dụng React
│   ├── package.json                   # Liệt kê các thư viện và script npm (start, build, test)
│   └── README.md                      # Hướng dẫn chi tiết chạy riêng dự án React
│
├── letrongbaocms_solution.sln         # File Solution quản lý tổng thể Backend và Data trong Visual Studio
└── README.md                          # Hướng dẫn tổng quan dự án (File này)
```

---

## 🚀 Hướng Dẫn Chạy Dự Án

### 1. Yêu Cầu Hệ Thống
- Cài đặt [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0).
- Cài đặt Microsoft SQL Server LocalDB hoặc SQL Express.
- Node.js (phiên bản 18+ khuyến nghị).

### 2. Cấu Hình Cơ Sở Dữ Liệu
Mở file [appsettings.json](file:///d:/BaocaoKetThucMon/letrongbaocms-Solution/CMS.Backend/appsettings.json) trong thư mục `CMS.Backend`, kiểm tra hoặc thay đổi chuỗi kết nối SQL Server:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=letrongbaocms_db;Trusted_Connection=True;MultipleActiveResultSets=true"
}
```

### 3. Chạy Backend
Mở Terminal hoặc Command Prompt tại thư mục `CMS.Backend` và chạy lệnh:
```bash
dotnet build
dotnet run
```
Ứng dụng Backend sẽ chạy tại cổng HTTPS mặc định:
- **HTTPS**: `https://localhost:7046`
- **HTTP**: `http://localhost:5029`

---

## 📄 Cổng Trực Quan API (Swagger UI) & Đặc Tả Chi Tiết API (API Reference)

Khi Backend đã khởi chạy, bạn có thể truy cập tài liệu API trực quan Swagger tại:
👉 **[https://localhost:7046/swagger](https://localhost:7046/swagger)**

Dưới đây là đặc tả chi tiết tất cả các Swagger API Endpoints được tích hợp trong hệ thống:

### 1. API Danh Mục Bài Viết (Categories API)
Quản lý các danh mục của bài viết tin tức.
* **Endpoint**: `/api/Categories`
* **Các phương thức**:
  * **`GET /api/Categories`**: Lấy danh sách toàn bộ danh mục bài viết.
    * **Phản hồi mẫu (200 OK)**:
      ```json
      [
        { "id": 1, "name": "Xu hướng" },
        { "id": 2, "name": "Mẹo phối đồ" }
      ]
      ```

### 2. API Danh Mục Sản Phẩm (Categories Products API)
Quản lý các danh mục của sản phẩm thời trang.
* **Endpoint**: `/api/CategoriesProducts`
* **Các phương thức**:
  * **`GET /api/CategoriesProducts`**: Lấy danh sách toàn bộ danh mục sản phẩm.
    * **Phản hồi mẫu (200 OK)**:
      ```json
      [
        { "id": 1, "name": "Áo Nam", "description": "Các sản phẩm áo dành cho nam giới" },
        { "id": 2, "name": "Đầm Nữ", "description": "Váy đầm cao cấp cho phái đẹp" }
      ]
      ```

### 3. API Sản Phẩm Thời Trang (Products API)
Quản lý và tra cứu thông tin sản phẩm thời trang.
* **Endpoint**: `/api/Products`
* **Các phương thức**:
  * **`GET /api/Products`**: Lấy toàn bộ sản phẩm (dạng tóm tắt cho trang cửa hàng).
    * **Phản hồi mẫu (200 OK)**:
      ```json
      [
        {
          "id": 1,
          "name": "Áo Khoác Blazer Hàn Quốc",
          "price": 450000.0,
          "imageUrl": "/images/blazer.jpg",
          "stockQuantity": 25,
          "description": "Chất liệu kaki cao cấp...",
          "categoryName": "Áo Nam"
        }
      ]
      ```
  * **`GET /api/Products/{id}`**: Lấy đầy đủ thông tin chi tiết một sản phẩm theo ID.
    * **Phản hồi mẫu (200 OK)**:
      ```json
      {
        "id": 1,
        "name": "Áo Khoác Blazer Hàn Quốc",
        "price": 450000.0,
        "imageUrl": "/images/blazer.jpg",
        "stockQuantity": 25,
        "description": "Chất liệu kaki cao cấp...",
        "categoryProductId": 1
      }
      ```
  * **`GET /api/Products/categoryproduct/{categoryProductId}`**: Lọc danh sách sản phẩm theo CategoryProductId.
    * **Phản hồi mẫu (200 OK)**: Trả về danh sách sản phẩm thuộc danh mục được lọc.

### 4. API Bài Viết Tin Tức (Posts API)
Truy vấn thông tin bài viết xu hướng, tin tức và hỗ trợ tính năng phân trang.
* **Endpoint**: `/api/Posts`
* **Các phương thức**:
  * **`GET /api/Posts`**: Lấy danh sách bài viết.
    * **Tham số truy vấn (Query Parameters)**:
      * `page` (int, optional): Trang cần lấy (Bắt đầu từ 1).
      * `pageSize` (int, optional): Số bài viết trên một trang.
    * **Phản hồi Không phân trang** (Khi không truyền tham số): Trả về mảng JSON chứa toàn bộ bài viết để tương thích ngược với React.
    * **Phản hồi Có phân trang** (Khi truyền đầy đủ `page` và `pageSize`):
      ```json
      {
        "data": [
          {
            "id": 10,
            "title": "Mẹo phối đồ thu đông 2026",
            "content": "Nội dung bài viết...",
            "imageUrl": "/images/phoido.jpg",
            "createdDate": "2026-06-25T10:30:00",
            "categoryId": 1,
            "categoryName": "Xu hướng"
          }
        ],
        "page": 1,
        "pageSize": 1,
        "totalCount": 12,
        "totalPages": 12
      }
      ```
  * **`GET /api/Posts/{id}`**: Lấy chi tiết thông tin bài viết theo ID.
    * **Phản hồi mẫu (200 OK)**: Chi tiết bài viết.
    * **Phản hồi lỗi (404 Not Found)**: `{"message": "Không tìm thấy bài viết"}`

### 5. API Khách Hàng (Customers API)
Xác thực tài khoản khách hàng và đăng ký thành viên.
* **Endpoint**: `/api/Customers`
* **Các phương thức**:
  * **`POST /api/Customers/register`**: Đăng ký tài khoản khách hàng mới.
    * **Yêu cầu Body (Request Body)**:
      ```json
      {
        "fullName": "Nguyen Van A",
        "email": "vana@example.com",
        "password": "hashedpassword123",
        "phone": "0987654321",
        "address": "123 Đường ABC, Quận 1, TP. HCM"
      }
      ```
    * **Phản hồi mẫu (200 OK)**:
      ```json
      {
        "message": "Đăng ký tài khoản thành công!",
        "customer": {
          "id": 5,
          "fullName": "Nguyen Van A",
          "email": "vana@example.com",
          "phone": "0987654321",
          "address": "123 Đường ABC, Quận 1, TP. HCM"
        }
      }
      ```
  * **`POST /api/Customers/login`**: Đăng nhập tài khoản khách hàng.
    * **Yêu cầu Body (Request Body)**:
      ```json
      {
        "email": "vana@example.com",
        "password": "hashedpassword123"
      }
      ```
    * **Phản hồi mẫu (200 OK)**: Trả về trạng thái đăng nhập thành công và thông tin cá nhân của khách hàng.

### 6. API Đơn Hàng & Đặt Hàng (Orders API)
Xử lý các thao tác đặt hàng và lịch sử giao dịch.
* **Endpoint**: `/api/Orders`
* **Các phương thức**:
  * **`GET /api/Orders`**: Lấy toàn bộ danh sách đơn hàng (phục vụ mục đích quản trị).
  * **`GET /api/Orders/{id}`**: Lấy thông tin chi tiết một đơn hàng kèm theo danh sách sản phẩm chi tiết đã đặt mua.
  * **`POST /api/Orders`**: Tạo mới đơn đặt hàng khi khách hàng hoàn thành quy trình thanh toán trên React.
    * **Yêu cầu Body (Request Body)**:
      ```json
      {
        "customerId": 5,
        "notes": "Giao giờ hành chính, gọi điện trước khi giao."
      }
      ```
    * **Phản hồi mẫu (201 Created)**:
      ```json
      {
        "message": "Đặt hàng thành công!",
        "orderId": 18
      }
      ```

### 7. API Chi Tiết Đơn Hàng (OrderDetails API)
Quản lý các dòng sản phẩm chi tiết của từng đơn đặt hàng.
* **Endpoint**: `/api/OrderDetails`
* **Các phương thức**:
  * **`GET /api/OrderDetails`**: Lấy toàn bộ danh sách các dòng chi tiết đơn hàng trong hệ thống.
  * **`GET /api/OrderDetails/order/{orderId}`**: Lấy danh sách sản phẩm đã mua lọc theo mã đơn hàng.
    * **Phản hồi mẫu (200 OK)**:
      ```json
      [
        {
          "id": 1,
          "orderId": 18,
          "productId": 3,
          "productName": "Váy Dạ Hội Đỏ",
          "quantity": 2,
          "unitPrice": 1200000.0,
          "subTotal": 2400000.0
        }
      ]
      ```
  * **`GET /api/OrderDetails/{id}`**: Lấy thông tin chi tiết một dòng dòng đơn hàng theo ID.

### 8. API Tài Khoản Quản Trị Hệ Thống (Users API)
Tra cứu danh sách quản trị viên và biên tập viên.
* **Endpoint**: `/api/Users`
* **Các phương thức**:
  * **`GET /api/Users`**: Lấy danh sách toàn bộ các tài khoản quản trị (tự động ẩn đi các thông tin mật khẩu bảo mật).
    * **Phản hồi mẫu (200 OK)**:
      ```json
      [
        {
          "id": 1,
          "username": "admin",
          "fullName": "Lê Trọng Bảo",
          "role": "Quản trị viên"
        }
      ]
      ```
  * **`GET /api/Users/{id}`**: Lấy chi tiết thông tin một tài khoản quản trị theo ID (ẩn mật khẩu).

---

## 📝 Tính Năng Phân Trang Bài Viết (Backend Pagination)

Chúng tôi đã thiết lập phân trang toàn diện ở Backend theo hai hướng:

### 1. Trang quản trị Admin (ASP.NET MVC)
Khi truy cập danh sách bài viết trong khu vực Admin (`/Post`), dữ liệu sẽ được phân trang tự động phía Server:
- **Số bài viết hiển thị**: 6 bài viết mỗi trang.
- **Giữ bộ lọc danh mục**: Khi bạn đang lọc bài viết theo danh mục (Category) và bấm chuyển sang trang khác, hệ thống vẫn giữ nguyên bộ lọc này nhờ cơ chế truyền `id` (CategoryId) qua liên kết phân trang.
- **Giao diện**: Thanh chuyển trang (Pagination Component) được tạo bằng Bootstrap mượt mà, hỗ trợ trạng thái *Active* và *Disabled* (Ví dụ: không cho bấm nút "Trước" khi đang ở trang 1).

### 2. API Bài viết dành cho React Frontend (`/api/Posts`)
API lấy danh sách bài viết hỗ trợ phân trang với cơ chế **tương thích ngược 100%**:

#### Cách 1: Lấy toàn bộ không phân trang (Dành cho React App cũ)
Nếu client gọi API mà không truyền tham số:
- **Request**: `GET https://localhost:7046/api/Posts`
- **Response**: Trả về một **Mảng phẳng (Array)** chứa toàn bộ các bài viết. Giúp các thành phần cũ trên React không bị lỗi.

#### Cách 2: Lấy danh sách có phân trang (Dành cho các trang tin tức lớn)
Nếu client truyền tham số phân trang:
- **Request**: `GET https://localhost:7046/api/Posts?page=1&pageSize=4`
- **Response**: Trả về một **Đối tượng (Object)** chứa dữ liệu và thông tin bổ trợ phân trang:
  ```json
  {
    "data": [
      {
        "id": 12,
        "title": "Xu Hướng Thời Trang Mùa Hè 2026",
        "content": "<p>Nội dung bài viết...</p>",
        "imageUrl": "/images/summer-fashion.jpg",
        "createdDate": "2026-06-25T10:00:00",
        "categoryId": 2,
        "categoryName": "Xu hướng"
      }
    ],
    "page": 1,
    "pageSize": 4,
    "totalCount": 15,
    "totalPages": 4
  }
  ```

---

## 🛒 Tính Năng Giỏ Hàng & Chi Tiết Sản Phẩm (Frontend React)

Chúng tôi đã hoàn thiện liên kết và lập trình cho hai trang chức năng mua sắm quan trọng nhất trên ứng dụng React Frontend:

### 1. Trang Chi Tiết Sản Phẩm (`/product/:id`)
- **Tập tin liên quan**: [pages/product-detail/index.jsx](file:///d:/BaocaoKetThucMon/letrongbaocms-Solution/cms.frontend/src/pages/product-detail/index.jsx) kết hợp [components/ProductDetail.jsx](file:///d:/BaocaoKetThucMon/letrongbaocms-Solution/cms.frontend/src/components/ProductDetail.jsx)
- **Tính năng**:
  - Tự động lấy tham số động `:id` sản phẩm từ thanh địa chỉ URL của trình duyệt thông qua hook `useParams`.
  - Gọi API `GET /api/Products/{id}` thông qua `productService` để lấy chi tiết thông tin thời trang thời gian thực (tên, giá bán, tồn kho, ảnh, mô tả).
  - Tích hợp nút **Quay lại cửa hàng** và nút **Thêm vào giỏ hàng** (tự động khóa/disable nếu sản phẩm hết hàng).

### 2. Trang Giỏ Hàng cá nhân (`/cart`)
- **Tập tin liên quan**: [pages/cart/index.jsx](file:///d:/BaocaoKetThucMon/letrongbaocms-Solution/cms.frontend/src/pages/cart/index.jsx) kết hợp [components/Cart.jsx](file:///d:/BaocaoKetThucMon/letrongbaocms-Solution/cms.frontend/src/components/Cart.jsx)
- **Tính năng**:
  - Đồng bộ hóa dữ liệu giỏ hàng thông qua cơ chế lưu trữ **`localStorage`** cục bộ để tránh bị mất sản phẩm khi tải lại trang (F5).
  - Cho phép người dùng trực tiếp tăng/giảm số lượng sản phẩm bằng cụm nút `+`/`-` (tự động kiểm tra số lượng tồn kho của sản phẩm từ database để giới hạn tối đa đặt mua).
  - Cho phép xóa từng sản phẩm khỏi giỏ hàng hoặc xóa toàn bộ giỏ hàng qua nút "Xóa tất cả".
  - Tự động tính toán tổng tiền tạm tính và tổng tiền thanh toán theo thời gian thực.
  - Sử dụng cơ chế phát sự kiện **`cartUpdated`** (Custom Window Event) để đồng bộ và cập nhật tức thời số lượng icon Giỏ Hàng trên thanh tiện ích Header mà không cần phải tải lại trang.

---

## 🧑‍💻 Thông Tin Sinh Viên Thực Hiện
- **Họ Tên**: Lê Trọng Bảo
- **MSSV**: 2123110056
