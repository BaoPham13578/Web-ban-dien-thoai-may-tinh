/**
 * shared/cart.js - Hệ thống giỏ hàng TechZone
 * Lưu trữ giỏ hàng trong localStorage, đồng bộ badge trên mọi trang.
 */

const TZ_CART_KEY = "tz_cart";
const TZ_WISHLIST_KEY = "tz_wishlist";

// ===== GIỎ HÀNG =====

function tz_getCart() {
  const raw = localStorage.getItem(TZ_CART_KEY);
  return raw ? JSON.parse(raw) : [];
}

function tz_saveCart(cart) {
  localStorage.setItem(TZ_CART_KEY, JSON.stringify(cart));
  tz_updateCartBadge();
}

// Thêm sản phẩm vào giỏ
function tz_addToCart(productId, qty = 1) {
  const product = getProductById(productId);
  if (!product) return false;

  let cart = tz_getCart();
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.qty += qty;
    if (existing.qty > product.stock) existing.qty = product.stock;
  } else {
    cart.push({
      id: productId,
      name: product.name,
      price: product.price,
      image: product.image,
      brand: product.brand,
      qty: Math.min(qty, product.stock)
    });
  }
  tz_saveCart(cart);
  tz_showToast("🛒 " + product.name + " đã được thêm vào giỏ hàng!");
  return true;
}

// Xóa sản phẩm khỏi giỏ
function tz_removeFromCart(productId) {
  let cart = tz_getCart().filter(item => item.id !== productId);
  tz_saveCart(cart);
}

// Cập nhật số lượng
function tz_updateCartQty(productId, qty) {
  let cart = tz_getCart();
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.qty = Math.max(1, qty);
    tz_saveCart(cart);
  }
}

// Xóa toàn bộ giỏ hàng
function tz_clearCart() {
  localStorage.removeItem(TZ_CART_KEY);
  tz_updateCartBadge();
}

// Tính tổng số lượng trong giỏ
function tz_getCartCount() {
  return tz_getCart().reduce((sum, item) => sum + item.qty, 0);
}

// Tính tổng tiền giỏ hàng
function tz_getCartTotal() {
  return tz_getCart().reduce((sum, item) => sum + item.price * item.qty, 0);
}

// Cập nhật badge trên tất cả icon giỏ hàng
function tz_updateCartBadge() {
  const count = tz_getCartCount();
  // Tìm tất cả badge giỏ hàng (nhiều dạng selector khác nhau tuỳ trang)
  document.querySelectorAll(
    ".cart-icon span, .nav-icon-btn[title='Giỏ hàng'] .badge, [title='Giỏ hàng'] .badge"
  ).forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? "flex" : "none";
  });
}

// ===== WISHLIST =====

function tz_getWishlist() {
  const raw = localStorage.getItem(TZ_WISHLIST_KEY);
  return raw ? JSON.parse(raw) : [];
}

function tz_toggleWishlist(productId) {
  let list = tz_getWishlist();
  const idx = list.indexOf(productId);
  if (idx >= 0) {
    list.splice(idx, 1);
    tz_showToast("💔 Đã xóa khỏi danh sách yêu thích");
  } else {
    list.push(productId);
    const p = getProductById(productId);
    tz_showToast("❤️ " + (p ? p.name : "Sản phẩm") + " đã được thêm vào yêu thích!");
  }
  localStorage.setItem(TZ_WISHLIST_KEY, JSON.stringify(list));
  tz_updateWishlistBadge();
  return idx < 0; // true = đã thêm
}

function tz_isInWishlist(productId) {
  return tz_getWishlist().includes(productId);
}

function tz_updateWishlistBadge() {
  const count = tz_getWishlist().length;
  document.querySelectorAll(
    ".nav-icon-btn[title='Yêu thích'] .badge, [title='Yêu thích'] .badge"
  ).forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? "flex" : "none";
  });
}

// ===== THÔNG BÁO TOAST =====
function tz_showToast(message, type = "success") {
  // Xóa toast cũ nếu có
  const old = document.getElementById("tz-toast");
  if (old) old.remove();

  const toast = document.createElement("div");
  toast.id = "tz-toast";
  toast.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    background: ${type === "success" ? "#1e293b" : "#ef4444"};
    color: white;
    padding: 14px 22px;
    border-radius: 12px;
    font-size: 0.9rem;
    font-weight: 500;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    z-index: 99999;
    animation: tzSlideIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    font-family: 'Inter', 'Segoe UI', sans-serif;
    max-width: 320px;
    line-height: 1.4;
  `;
  toast.textContent = message;

  // CSS animation
  if (!document.getElementById("tz-toast-style")) {
    const style = document.createElement("style");
    style.id = "tz-toast-style";
    style.textContent = `
      @keyframes tzSlideIn {
        from { transform: translateX(120%); opacity: 0; }
        to   { transform: translateX(0);    opacity: 1; }
      }
      @keyframes tzSlideOut {
        from { transform: translateX(0);    opacity: 1; }
        to   { transform: translateX(120%); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(toast);
  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.animation = "tzSlideOut 0.3s ease forwards";
      setTimeout(() => toast.remove(), 300);
    }
  }, 3000);
}

// ===== ĐẶT HÀNG =====
const TZ_ORDERS_KEY = "tz_orders";

function tz_placeOrder(orderData) {
  const orders = tz_getOrders();
  const cart = tz_getCart();
  const user = tz_getCurrentUser ? tz_getCurrentUser() : null;

  const orderId = "TZ-" + new Date().toISOString().slice(0, 10).replace(/-/g, "") + "-" + String(orders.length + 1).padStart(3, "0");

  const newOrder = {
    id: orderId,
    userId: user ? user.id : "guest",
    customerName: orderData.name,
    phone: orderData.phone,
    address: orderData.address,
    items: [...cart],
    subtotal: tz_getCartTotal(),
    discount: orderData.discount || 0,
    shippingFee: orderData.shippingFee || 0,
    total: tz_getCartTotal() - (orderData.discount || 0) + (orderData.shippingFee || 0),
    payment: orderData.payment,
    shipping: orderData.shipping,
    status: "Đang xử lý",
    createdAt: new Date().toLocaleString("vi-VN")
  };

  orders.unshift(newOrder);
  localStorage.setItem(TZ_ORDERS_KEY, JSON.stringify(orders));

  // Lưu vào lịch sử user nếu đã đăng nhập
  if (user) {
    const users = tz_getUsers ? tz_getUsers() : [];
    const u = users.find(u => u.id === user.id);
    if (u) {
      if (!u.orders) u.orders = [];
      u.orders.unshift(orderId);
      tz_saveUsers(users);
    }
  }

  tz_clearCart();
  return newOrder;
}

function tz_getOrders() {
  const raw = localStorage.getItem(TZ_ORDERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function tz_getOrdersByUser(userId) {
  return tz_getOrders().filter(o => o.userId === userId);
}

// ===== KHỞI TẠO KHI LOAD TRANG =====
document.addEventListener("DOMContentLoaded", () => {
  tz_updateCartBadge();
  tz_updateWishlistBadge();
});
