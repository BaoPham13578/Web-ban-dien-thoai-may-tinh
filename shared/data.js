/**
 * shared/data.js - Cơ sở dữ liệu sản phẩm TechZone
 * File này được dùng chung bởi tất cả các trang trong website.
 */

const DEFAULT_TECHZONE_PRODUCTS = [
  {
    id: 1,
    name: "MacBook Air M4 (2024)",
    brand: "Apple",
    category: "laptop",
    price: 28990000,
    oldPrice: 32990000,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500"
    ],
    rating: 4.9,
    reviewCount: 145,
    stock: 12,
    badge: "Mới",
    description: "MacBook Air M4 mới nhất với chip M4 mạnh mẽ, màn hình Liquid Retina 13.6 inch sắc nét, pin 18 giờ và thiết kế siêu mỏng nhẹ.",
    specs: {
      "CPU": "Apple M4 (8-core)",
      "RAM": "16GB Unified Memory",
      "Ổ cứng": "512GB SSD",
      "Màn hình": "13.6\" Liquid Retina 2560x1664",
      "Pin": "18 giờ",
      "Trọng lượng": "1.24 kg",
      "Hệ điều hành": "macOS Sequoia"
    }
  },
  {
    id: 2,
    name: "iPhone 15 Pro Max",
    brand: "Apple",
    category: "phone",
    price: 30990000,
    oldPrice: null,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500",
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500"
    ],
    rating: 4.8,
    reviewCount: 312,
    stock: 8,
    badge: null,
    description: "iPhone 15 Pro Max với chip A17 Pro, camera 48MP và titanium cao cấp. Màn hình Super Retina XDR 6.7 inch ProMotion 120Hz.",
    specs: {
      "CPU": "Apple A17 Pro",
      "RAM": "8GB",
      "Bộ nhớ": "256GB",
      "Màn hình": "6.7\" OLED 120Hz",
      "Camera chính": "48MP Fusion",
      "Pin": "4422 mAh",
      "Hệ điều hành": "iOS 17"
    }
  },
  {
    id: 3,
    name: "Dell XPS 13 Ultrabook",
    brand: "Dell",
    category: "laptop",
    price: 34590000,
    oldPrice: 41990000,
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500",
    images: [
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500"
    ],
    rating: 4.6,
    reviewCount: 32,
    stock: 5,
    badge: "Sale",
    description: "Dell XPS 13 siêu mỏng với màn hình InfinityEdge không viền, chip Intel Core i7 thế hệ mới và RAM 32GB mạnh mẽ.",
    specs: {
      "CPU": "Intel Core i7-1360U",
      "RAM": "32GB LPDDR5",
      "Ổ cứng": "1TB NVMe SSD",
      "Màn hình": "13.4\" FHD+ OLED",
      "Pin": "55Wh (~12 giờ)",
      "Trọng lượng": "1.17 kg",
      "Hệ điều hành": "Windows 11 Pro"
    }
  },
  {
    id: 4,
    name: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    category: "phone",
    price: 28490000,
    oldPrice: 33990000,
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500",
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500"
    ],
    rating: 4.7,
    reviewCount: 89,
    stock: 15,
    badge: "Sale",
    description: "Galaxy S24 Ultra với bút S Pen tích hợp, camera 200MP đỉnh cao và chip Snapdragon 8 Gen 3 cho hiệu năng vượt trội.",
    specs: {
      "CPU": "Snapdragon 8 Gen 3",
      "RAM": "12GB",
      "Bộ nhớ": "512GB",
      "Màn hình": "6.8\" Dynamic AMOLED 120Hz",
      "Camera chính": "200MP",
      "Pin": "5000 mAh",
      "Hệ điều hành": "Android 14 (One UI 6.1)"
    }
  },
  {
    id: 5,
    name: "ASUS ROG Zephyrus G16",
    brand: "ASUS",
    category: "laptop",
    price: 49990000,
    oldPrice: null,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500",
    images: [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500"
    ],
    rating: 4.8,
    reviewCount: 116,
    stock: 3,
    badge: "Hot",
    description: "ROG Zephyrus G16 laptop gaming cao cấp với RTX 4070, màn hình QHD 240Hz và thiết kế mỏng nhẹ đẳng cấp.",
    specs: {
      "CPU": "Intel Core i9-14900HX",
      "GPU": "NVIDIA RTX 4070 8GB",
      "RAM": "32GB DDR5",
      "Ổ cứng": "2TB PCIe 4.0 SSD",
      "Màn hình": "16\" QHD 240Hz ROG Nebula",
      "Pin": "90Wh",
      "Hệ điều hành": "Windows 11 Home"
    }
  },
  {
    id: 6,
    name: "iPad Pro M4 13\"",
    brand: "Apple",
    category: "tablet",
    price: 32990000,
    oldPrice: null,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500",
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500"
    ],
    rating: 4.9,
    reviewCount: 67,
    stock: 7,
    badge: "Mới",
    description: "iPad Pro M4 siêu mỏng chỉ 5.1mm, màn hình Ultra Retina XDR OLED tuyệt đẹp và chip M4 mạnh hơn nhiều laptop.",
    specs: {
      "CPU": "Apple M4",
      "RAM": "16GB",
      "Bộ nhớ": "512GB",
      "Màn hình": "13\" Ultra Retina XDR OLED",
      "Camera": "12MP (sau) + 12MP TrueDepth (trước)",
      "Pin": "Cả ngày",
      "Hệ điều hành": "iPadOS 17"
    }
  },
  {
    id: 7,
    name: "Sony WH-1000XM5",
    brand: "Sony",
    category: "headphone",
    price: 7990000,
    oldPrice: 9490000,
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500",
    images: [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500"
    ],
    rating: 4.8,
    reviewCount: 203,
    stock: 20,
    badge: "Sale",
    description: "Tai nghe chống ồn hàng đầu thế giới WH-1000XM5 với chất âm LDAC hi-res và pin 30 giờ.",
    specs: {
      "Driver": "30mm",
      "Kết nối": "Bluetooth 5.2, 3.5mm",
      "Chống ồn": "ANC thế hệ mới (8 microphone)",
      "Pin": "30 giờ (ANC bật) / 40 giờ (ANC tắt)",
      "Sạc nhanh": "3 phút = 3 giờ nghe",
      "Trọng lượng": "250g"
    }
  },
  {
    id: 8,
    name: "Apple Watch Ultra 2",
    brand: "Apple",
    category: "smartwatch",
    price: 23990000,
    oldPrice: null,
    image: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=500",
    images: [
      "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=500"
    ],
    rating: 4.9,
    reviewCount: 78,
    stock: 6,
    badge: null,
    description: "Apple Watch Ultra 2 dành cho người yêu thể thao mạo hiểm. Vỏ titan 49mm, GPS chính xác cao và pin 60 giờ.",
    specs: {
      "Vỏ": "Titanium 49mm",
      "Màn hình": "LTPO OLED 2000 nits",
      "GPS": "L1 + L5 chính xác cao",
      "Pin": "60 giờ (normal) / 36 giờ (high accuracy)",
      "Kháng nước": "100m (EN 13319)",
      "Hệ điều hành": "watchOS 10"
    }
  },
  {
    id: 9,
    name: "Lenovo ThinkPad X1 Carbon Gen 12",
    brand: "Lenovo",
    category: "laptop",
    price: 42990000,
    oldPrice: null,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500",
    images: [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500"
    ],
    rating: 4.7,
    reviewCount: 214,
    stock: 4,
    badge: null,
    description: "ThinkPad X1 Carbon Gen 12 laptop doanh nhân huyền thoại với chip Intel Core Ultra 7, siêu bền và bảo mật vân tay + camera IR.",
    specs: {
      "CPU": "Intel Core Ultra 7 165U",
      "RAM": "32GB LPDDR5",
      "Ổ cứng": "1TB PCIe SSD",
      "Màn hình": "14\" IPS 2.8K OLED",
      "Pin": "57Wh (~15 giờ)",
      "Trọng lượng": "1.12 kg",
      "Hệ điều hành": "Windows 11 Pro"
    }
  },
  {
    id: 10,
    name: "Xiaomi 14 Ultra",
    brand: "Xiaomi",
    category: "phone",
    price: 24990000,
    oldPrice: 27990000,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500",
    images: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500"
    ],
    rating: 4.6,
    reviewCount: 54,
    stock: 10,
    badge: "Sale",
    description: "Xiaomi 14 Ultra với camera Leica 1-inch sensor, sạc siêu nhanh 90W và chip Snapdragon 8 Gen 3.",
    specs: {
      "CPU": "Snapdragon 8 Gen 3",
      "RAM": "16GB",
      "Bộ nhớ": "512GB",
      "Màn hình": "6.73\" AMOLED 120Hz",
      "Camera chính": "50MP 1-inch (Leica)",
      "Pin": "5000 mAh, sạc 90W",
      "Hệ điều hành": "HyperOS (Android 14)"
    }
  },
  {
    id: 11,
    name: "HP Spectre x360 14\"",
    brand: "HP",
    category: "laptop",
    price: 32490000,
    oldPrice: 37990000,
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500",
    images: [
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500"
    ],
    rating: 4.5,
    reviewCount: 185,
    stock: 9,
    badge: "Sale",
    description: "HP Spectre x360 laptop 2-in-1 cao cấp với màn hình OLED cảm ứng xoay 360 độ và bút HP Tilt Pen.",
    specs: {
      "CPU": "Intel Core Ultra 7 165H",
      "RAM": "32GB LPDDR5",
      "Ổ cứng": "1TB SSD",
      "Màn hình": "14\" OLED 2.8K 120Hz cảm ứng",
      "Pin": "66Wh",
      "Trọng lượng": "1.43 kg",
      "Hệ điều hành": "Windows 11 Home"
    }
  },
  {
    id: 12,
    name: "AirPods Pro 2 (USB-C)",
    brand: "Apple",
    category: "headphone",
    price: 6490000,
    oldPrice: 7490000,
    image: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=500",
    images: [
      "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=500"
    ],
    rating: 4.8,
    reviewCount: 421,
    stock: 30,
    badge: null,
    description: "AirPods Pro 2 với chip H2, chống ồn ANC thế hệ 2, âm thanh không gian và case sạc USB-C.",
    specs: {
      "Driver": "Custom Apple",
      "Kết nối": "Bluetooth 5.3",
      "Chống ồn": "ANC (chip H2)",
      "Pin tai": "6 giờ (ANC bật)",
      "Pin case": "30 giờ tổng",
      "Kháng nước": "IPX4",
      "Sạc": "USB-C / MagSafe"
    }
  },
  {
    id: 13,
    name: "Samsung Galaxy Tab S9 Ultra",
    brand: "Samsung",
    category: "tablet",
    price: 26990000,
    oldPrice: null,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500"
    ],
    rating: 4.6,
    reviewCount: 43,
    stock: 5,
    badge: null,
    description: "Galaxy Tab S9 Ultra với màn hình Dynamic AMOLED 14.6 inch khổng lồ và bút S Pen tích hợp, lý tưởng cho sáng tạo nội dung.",
    specs: {
      "CPU": "Snapdragon 8 Gen 2",
      "RAM": "12GB",
      "Bộ nhớ": "256GB",
      "Màn hình": "14.6\" Dynamic AMOLED 120Hz",
      "Camera": "13MP + 8MP (sau)",
      "Pin": "11200 mAh",
      "Kháng nước": "IP68"
    }
  },
  {
    id: 14,
    name: "Samsung Galaxy Book5 Pro 360",
    brand: "Samsung",
    category: "laptop",
    price: 38490000,
    oldPrice: null,
    image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500",
    images: [
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500"
    ],
    rating: 4.4,
    reviewCount: 42,
    stock: 6,
    badge: null,
    description: "Galaxy Book5 Pro 360 laptop 2-in-1 với màn hình AMOLED 16 inch và tích hợp Galaxy AI.",
    specs: {
      "CPU": "Intel Core Ultra 7 155H",
      "RAM": "16GB LPDDR5",
      "Ổ cứng": "512GB NVMe SSD",
      "Màn hình": "16\" AMOLED 2880x1800 120Hz",
      "Pin": "76Wh",
      "Trọng lượng": "1.67 kg",
      "Hệ điều hành": "Windows 11 Home"
    }
  },
  {
    id: 15,
    name: "Chuột Logitech MX Master 3S",
    brand: "Logitech",
    category: "accessory",
    price: 2490000,
    oldPrice: 2990000,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500",
    images: [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500"
    ],
    rating: 4.9,
    reviewCount: 876,
    stock: 50,
    badge: "Bán chạy",
    description: "Chuột không dây Logitech MX Master 3S với cảm biến Darkfield 8000 DPI, nút giữa Ma-Fi không tiếng ồn và sạc USB-C.",
    specs: {
      "Cảm biến": "Darkfield High Precision 8000 DPI",
      "Kết nối": "Bluetooth / USB Receiver 2.4GHz",
      "Pin": "70 ngày (sạc USB-C)",
      "Sạc nhanh": "1 phút = 3 giờ",
      "Nút": "7 nút có thể lập trình",
      "Trọng lượng": "141g"
    }
  },
  {
    id: 16,
    name: "Bàn phím Keychron K8 Pro",
    brand: "Keychron",
    category: "accessory",
    price: 2190000,
    oldPrice: null,
    image: "https://images.unsplash.com/photo-1595044426077-d36d9236d54a?w=500",
    images: [
      "https://images.unsplash.com/photo-1595044426077-d36d9236d54a?w=500"
    ],
    rating: 4.7,
    reviewCount: 134,
    stock: 25,
    badge: null,
    description: "Bàn phím cơ Keychron K8 Pro TKL không dây với đèn RGB, kết nối Bluetooth 5.1 và switch Gateron.",
    specs: {
      "Layout": "TKL (87 phím)",
      "Switch": "Gateron G Pro (Red/Blue/Brown)",
      "Kết nối": "Bluetooth 5.1 / USB-C",
      "Đèn": "RGB",
      "Pin": "4000 mAh",
      "Tương thích": "Windows, macOS, iOS, Android"
    }
  },
  {
    id: 17,
    name: "Google Pixel 8 Pro",
    brand: "Google",
    category: "phone",
    price: 21490000,
    oldPrice: 24990000,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500",
    images: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500"
    ],
    rating: 4.5,
    reviewCount: 67,
    stock: 12,
    badge: "Sale",
    description: "Pixel 8 Pro với AI tốt nhất trên Android, camera 50MP Tensor G3 và 7 năm cập nhật phần mềm.",
    specs: {
      "CPU": "Google Tensor G3",
      "RAM": "12GB",
      "Bộ nhớ": "256GB",
      "Màn hình": "6.7\" LTPO OLED 1-120Hz",
      "Camera chính": "50MP (OIS)",
      "Pin": "5050 mAh, 30W",
      "Hệ điều hành": "Android 14"
    }
  },
  {
    id: 18,
    name: "Màn hình Dell UltraSharp U2723D",
    brand: "Dell",
    category: "accessory",
    price: 15990000,
    oldPrice: 18990000,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500",
    images: [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500"
    ],
    rating: 4.8,
    reviewCount: 92,
    stock: 8,
    badge: "Sale",
    description: "Màn hình Dell UltraSharp 27 inch 4K IPS chuẩn màu 99% sRGB, cổng USB-C 90W và tích hợp KVM switch.",
    specs: {
      "Kích thước": "27 inch",
      "Độ phân giải": "3840x2160 (4K UHD)",
      "Tấm nền": "IPS",
      "Tần số": "60Hz",
      "Màu sắc": "99% sRGB, 95% DCI-P3",
      "Cổng kết nối": "USB-C 90W, HDMI, DisplayPort, USB-A x4"
    }
  },
  {
    id: 19,
    name: "Apple Mac Mini M4",
    brand: "Apple",
    category: "desktop",
    price: 17990000,
    oldPrice: null,
    image: "https://images.unsplash.com/photo-1527443153049-e2b8a1bb47b5?w=500",
    images: [
      "https://images.unsplash.com/photo-1527443153049-e2b8a1bb47b5?w=500"
    ],
    rating: 4.9,
    reviewCount: 58,
    stock: 10,
    badge: "Mới",
    description: "Mac Mini M4 nhỏ gọn nhất từ trước đến nay với chip M4, 3 cổng USB-C phía trước và hiệu năng đáng kinh ngạc.",
    specs: {
      "CPU": "Apple M4 (10-core)",
      "RAM": "16GB Unified Memory",
      "Ổ cứng": "256GB SSD",
      "Kết nối": "Thunderbolt 4 x3, USB-A x2, HDMI",
      "Ethernet": "10Gb",
      "Kích thước": "127 x 127 x 50mm"
    }
  },
  {
    id: 20,
    name: "Samsung Galaxy Watch 7",
    brand: "Samsung",
    category: "smartwatch",
    price: 7490000,
    oldPrice: 8990000,
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500",
    images: [
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500"
    ],
    rating: 4.5,
    reviewCount: 143,
    stock: 18,
    badge: "Sale",
    description: "Galaxy Watch 7 với cảm biến sức khỏe tiên tiến, chip mới nhanh hơn 30%, theo dõi giấc ngủ AI và pin 2 ngày.",
    specs: {
      "Kích thước": "44mm",
      "Màn hình": "Super AMOLED 1.5\"",
      "Chip": "Exynos W1000",
      "Pin": "425 mAh (~48 giờ)",
      "Kháng nước": "5ATM + IP68",
      "Hệ điều hành": "Wear OS 5 (One UI Watch 6)"
    }
  }
];

// Khởi tạo database sản phẩm trong localStorage nếu chưa có
if (!localStorage.getItem("tz_db_products")) {
  localStorage.setItem("tz_db_products", JSON.stringify(DEFAULT_TECHZONE_PRODUCTS));
}
let TECHZONE_PRODUCTS = JSON.parse(localStorage.getItem("tz_db_products"));

// Hàm lưu database sản phẩm
function tz_saveProductsDb(productsList) {
  localStorage.setItem("tz_db_products", JSON.stringify(productsList));
  TECHZONE_PRODUCTS = productsList;
}

// Helper: Tìm sản phẩm theo ID
function getProductById(id) {
  return TECHZONE_PRODUCTS.find(p => p.id === parseInt(id));
}

// Helper: Lọc sản phẩm theo danh mục
function getProductsByCategory(category) {
  if (!category || category === "all") return TECHZONE_PRODUCTS;
  return TECHZONE_PRODUCTS.filter(p => p.category === category);
}

// Helper: Tìm kiếm sản phẩm
function searchProducts(query) {
  const q = query.toLowerCase().trim();
  if (!q) return TECHZONE_PRODUCTS;
  return TECHZONE_PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.brand.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q)
  );
}

// Helper: Format giá tiền
function formatPrice(price) {
  return price.toLocaleString("vi-VN") + "₫";
}

