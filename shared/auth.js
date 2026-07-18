/**
 * shared/auth.js - Hệ thống xác thực người dùng TechZone
 * Lưu trữ tài khoản và session trong localStorage.
 */

const TZ_USERS_KEY = "tz_users";
const TZ_SESSION_KEY = "tz_session";

// ===== QUẢN LÝ NGƯỜI DÙNG =====

function tz_getUsers() {
  const raw = localStorage.getItem(TZ_USERS_KEY);
  const users = raw ? JSON.parse(raw) : [];
  // Thêm tài khoản admin mặc định nếu chưa có
  if (!users.find(u => u.email === "admin@techzone.vn")) {
    users.push({
      id: "admin-001",
      name: "Quản trị viên",
      email: "admin@techzone.vn",
      password: "admin123",
      role: "admin",
      phone: "0900 000 000",
      address: "Đặng Thùy Trâm, Bình Thạnh, TP.HCM",
      createdAt: new Date().toISOString(),
      orders: []
    });
    localStorage.setItem(TZ_USERS_KEY, JSON.stringify(users));
  }
  return users;
}

function tz_saveUsers(users) {
  localStorage.setItem(TZ_USERS_KEY, JSON.stringify(users));
}

// Đăng ký tài khoản mới
function tz_register(name, email, password) {
  const users = tz_getUsers();
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, message: "Email này đã được đăng ký. Vui lòng đăng nhập!" };
  }
  const newUser = {
    id: "u-" + Date.now(),
    name,
    email: email.toLowerCase(),
    password,
    role: email.toLowerCase().includes("admin") ? "admin" : "customer",
    phone: "",
    address: "",
    createdAt: new Date().toISOString(),
    orders: []
  };
  users.push(newUser);
  tz_saveUsers(users);
  return { success: true, user: newUser };
}

// Đăng nhập
function tz_login(email, password) {
  const users = tz_getUsers();
  const user = users.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!user) {
    return { success: false, message: "Email hoặc mật khẩu không đúng!" };
  }
  // Lưu session (không lưu password)
  const session = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    address: user.address
  };
  localStorage.setItem(TZ_SESSION_KEY, JSON.stringify(session));
  return { success: true, user: session };
}

// Đăng xuất
function tz_logout() {
  localStorage.removeItem(TZ_SESSION_KEY);
  window.location.href = tz_getRelativePath() + "NguyenNgocHuy_2474802015199/dangnhap/index.html";
}

// Lấy người dùng hiện tại
function tz_getCurrentUser() {
  const raw = localStorage.getItem(TZ_SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

// Kiểm tra đã đăng nhập chưa
function tz_isLoggedIn() {
  return !!tz_getCurrentUser();
}

// Kiểm tra có phải admin không
function tz_isAdmin() {
  const user = tz_getCurrentUser();
  return user && user.role === "admin";
}

// ===== TÍNH ĐƯỜNG DẪN TƯƠNG ĐỐI =====
// Dùng để tạo link đúng từ bất kỳ thư mục nào
function tz_getRelativePath() {
  const path = window.location.pathname;
  if (path.includes("/TechZone-Website/")) return "../";
  if (path.includes("/NguyenNgocHuy_2474802015199/dangnhap/")) return "../../";
  if (path.includes("/NguyenNgocHuy_2474802015199/taikhoancanhan/")) return "../../";
  if (path.includes("/NguyenNgocHuy_2474802015199/chitietsanpham/")) return "../../";
  if (path.includes("/Dat/gio hang/") || path.includes("/Dat/gio%20hang/")) return "../../";
  if (path.includes("/Dat/Thanh Toan/") || path.includes("/Dat/Thanh%20Toan/")) return "../../";
  if (path.includes("/Dat/Trang Khuyen Mai/") || path.includes("/Dat/Trang%20Khuyen%20Mai/")) return "../../";
  if (path.includes("/p11/") || path.includes("/p12/") || path.includes("/qlisanpham/")) return "../";
  return "";
}

// ===== UPDATE HEADER KHI ĐÃ ĐĂNG NHẬP =====
function tz_updateHeaderUI() {
  const user = tz_getCurrentUser();
  // Cập nhật icon user → hiện tên / avatar nếu đã đăng nhập
  const userIcons = document.querySelectorAll(".fa-user, .fa-regular.fa-user, [title='Tài khoản']");
  userIcons.forEach(icon => {
    if (user) {
      const parent = icon.closest("a") || icon.parentElement;
      if (parent) parent.setAttribute("title", user.name);
    }
  });
}

// Gọi khi DOM sẵn sàng
document.addEventListener("DOMContentLoaded", tz_updateHeaderUI);
