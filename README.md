# 🚀 TechZone Website - Dự Án Thiết Kế Web Công Nghệ

Một trang web thương mại điện tử hiện đại cho cửa hàng bán lẻ công nghệ với thiết kế chuyên nghiệp và trải nghiệm người dùng tuyệt vời.

## 📋 Nội Dung Dự Án

Dự án này bao gồm **3 trang chính**:

### 1. **📱 Trang Chủ (index.html)**
- Hero section với hình ảnh nổi bật và call-to-action
- Sản phẩm nổi bật và được yêu thích
- Danh mục sản phẩm dưới dạng grid
- Thống kê về công ty (2.5M khách hàng, 500+ chi nhánh, v.v.)
- Các lý do chọn TechZone (vận chuyển, thanh toán, bảo hành, v.v.)
- Form đăng ký nhận tin
- Footer với thông tin liên hệ

### 2. **🏢 Trang Giới Thiệu (about.html)**
- Thông tin chi tiết về công ty
- Giá trị cốt lõi và sứ mệnh
- Thống kê thành công
- Đội ngũ lãnh đạo (CEO, COO, CTO, HR Manager)
- Timeline/Lịch sử phát triển từ 2015 đến 2024
- Các lợi ích khi chọn TechZone
- CTA để khám phá sản phẩm

### 3. **🛍️ Trang Danh Mục (categories.html)**
- Sidebar lọc sản phẩm:
  - Danh mục (Laptop, Điện thoại, Tai nghe, Smartwatch, v.v.)
  - Thương hiệu (Apple, Samsung, Sony, LG, Dell, Lenovo)
  - Mức giá
  - Tính năng (Sản phẩm mới, Đang giảm giá, Bán chạy nhất)
- Grid hiển thị sản phẩm (12 sản phẩm)
- Sắp xếp theo: Nổi bật, Giá, Mới nhất, Bán chạy nhất
- Phân trang
- Mỗi sản phẩm hiển thị:
  - Hình ảnh gradient (emoji)
  - Danh mục sản phẩm
  - Tên sản phẩm
  - Rating ⭐ và số lượng đánh giá
  - Giá cũ/mới
  - Nút "Thêm vào giỏ"

## 📁 Cấu Trúc Thư Mục

```
TechZone-Website/
├── index.html           # Trang Chủ
├── about.html          # Trang Giới Thiệu
├── categories.html     # Trang Danh Mục
├── css/
│   └── style.css       # Tất cả CSS chung cho 3 trang
├── js/
│   └── main.js         # JavaScript cho tương tác
└── images/            # Thư mục (để tương lai)
    └── (Chưa có ảnh - sử dụng emoji và gradient)
```

## 🎨 Tính Năng Thiết Kế

### Màu Sắc (Color Palette)
- **Primary Blue**: `#1e3a8a` - Xanh đậm chính
- **Secondary Blue**: `#3b82f6` - Xanh nhạt
- **Accent Blue**: `#0ea5e9` - Xanh neon
- **Dark Background**: `#0f172a` - Nền tối cho header/footer
- **Light Background**: `#f8fafc` - Nền sáng cho section

### Responsive Design
- ✅ Desktop (1200px+)
- ✅ Tablet (768px - 1199px)
- ✅ Mobile (< 768px)

### Thành Phần UI
- **Header**: Navigation bar sticky với logo, menu, giỏ hàng, đăng nhập
- **Hero Section**: Gradient background với text lớn và CTA buttons
- **Cards**: Product cards, feature cards, team member cards
- **Sidebar**: Filter panel cho danh mục
- **Footer**: 4 cột + social links + copyright

## 🎯 Công Nghệ Sử Dụng

- **HTML5**: Cấu trúc semantic
- **CSS3**: 
  - Flexbox & CSS Grid
  - Gradients
  - Animations
  - Media queries
  - Transitions & hover effects
- **JavaScript (Vanilla)**:
  - Event listeners
  - DOM manipulation
  - Notification system
  - Form handling

## 🚀 Cách Sử Dụng

### Mở Trang Web
1. Mở folder `TechZone-Website` trong VS Code
2. Click chuột phải vào `index.html`
3. Chọn "Open with Live Server" (nếu có extension)
4. Hoặc kéo file vào trình duyệt

### Điều Hướng
- **Trang Chủ**: Click logo hoặc "Trang Chủ" trong menu
- **Danh Mục**: Click "Danh Mục" trong menu
- **Giới Thiệu**: Click "Giới Thiệu" trong menu
- **Liên Hệ**: Scroll xuống footer hoặc click "Liên Hệ"

## ✨ Tính Năng Tương Tác

### JavaScript Features
- ✅ Smooth scrolling cho anchor links
- ✅ "Thêm vào giỏ" với visual feedback
- ✅ Notification system (toast messages)
- ✅ Active navigation links
- ✅ Newsletter signup
- ✅ Price range slider
- ✅ Sort functionality

## 📝 Nội Dung Mẫu

### Sản Phẩm Mẫu
- MacBook Air M3 (2024) - $1,299
- Dell XPS 15 Ultrabook - $1,549
- iPad Air 6 - $749
- Sony WH-1000XM5 - $299.99
- ThinkPad X1 Carbon Gen 12 - $1,899
- Và nhiều hơn nữa...

### Thương Hiệu Đối Tác
- Apple
- Samsung
- Sony
- LG
- Dell
- Lenovo
- ASUS
- HP
- MSI
- ROG
- Acer

## 🔧 Tùy Chỉnh

### Thay Đổi Màu Sắc
Mở `css/style.css` và chỉnh sửa CSS variables ở phần `:root`:
```css
:root {
  --primary-blue: #1e3a8a;
  --secondary-blue: #3b82f6;
  --accent-blue: #0ea5e9;
  /* ... */
}
```

### Thay Đổi Nội Dung
- Chỉnh sửa trực tiếp trong các file HTML
- Tìm và thay thế tên công ty, địa chỉ, điện thoại trong footer

### Thêm Ảnh Thực
Thay thế `<div class="product-image laptop">💻</div>` bằng:
```html
<img src="images/product.jpg" alt="Product name" class="product-image">
```

## 📱 Tương Lai Cải Tiến

- [ ] Thêm ảnh sản phẩm thực
- [ ] Integration với backend API
- [ ] Shopping cart functionality
- [ ] User account system
- [ ] Product detail pages
- [ ] Reviews & ratings system
- [ ] Payment gateway
- [ ] Email notifications
- [ ] Multi-language support (EN/VI)
- [ ] Dark mode toggle

## 👨‍💻 Hỗ Trợ & Liên Hệ

**Email**: support@techzone.vn  
**Hotline**: 1800 1234  
**Website**: www.techzone.vn

---

✨ **Thiết kế bởi**: TechZone Design Team  
📅 **Ngày**: 2024  
🎨 **Phong Cách**: Modern, Professional, Clean

Happy Designing! 🚀
