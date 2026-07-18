// =============================================
// TAIKHOANCANHAN / SCRIPT.JS
// Quản lý thông tin cá nhân, lịch sử đơn hàng
// Sử dụng shared/data.js, shared/auth.js, shared/cart.js
// =============================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Kiểm tra đăng nhập
    const user = tz_getCurrentUser();
    if (!user) {
        // Chưa đăng nhập -> Chuyển hướng sang trang đăng nhập
        alert('Vui lòng đăng nhập để xem thông tin cá nhân!');
        window.location.href = '../dangnhap/index.html';
        return;
    }

    // 2. Hiển thị thông tin người dùng
    updateUserInfoDOM(user);

    // 3. Hiển thị danh sách đơn hàng thực tế của user từ localStorage
    renderUserOrders(user.id);

    // 4. Xử lý chuyển đổi qua lại giữa các Tab Menu ở Sidebar
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navItems.forEach(nav => nav.classList.remove('active', 'text-blue-600', 'bg-blue-50/50'));
            navItems.forEach(nav => {
                if (nav !== item) {
                    nav.classList.add('text-gray-500');
                }
            });
            item.classList.add('active', 'text-blue-600', 'bg-blue-50/50');
            item.classList.remove('text-gray-500');

            const tabName = item.querySelector('span').innerText;
            console.log(`Đã chuyển sang tab: ${tabName}`);
        });
    });

    // 5. Sự kiện nút bấm Edit Profile
    const btnEditProfile = document.getElementById('btnEditProfile');
    if (btnEditProfile) {
        btnEditProfile.addEventListener('click', () => {
            const newName = prompt('Nhập tên mới của bạn:', user.name);
            if (newName && newName.trim()) {
                user.name = newName.trim();
                // Lưu lại thông tin cập nhật
                const users = JSON.parse(localStorage.getItem('techzone_users') || '[]');
                const idx = users.findIndex(u => u.email === user.email);
                if (idx !== -1) {
                    users[idx].name = user.name;
                    localStorage.setItem('techzone_users', JSON.stringify(users));
                }
                localStorage.setItem('techzone_session', JSON.stringify(user));
                updateUserInfoDOM(user);
                tz_showToast('Đã cập nhật tên thành công!');
            }
        });
    }

    // 6. Sự kiện nút bấm Download Report
    const btnDownload = document.getElementById('btnDownload');
    if (btnDownload) {
        btnDownload.addEventListener('click', () => {
            alert('Báo cáo chi tiết mua sắm của bạn đang được khởi tạo để tải về.');
        });
    }

    // 7. Sự kiện Đăng xuất
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Bạn có chắc chắn muốn đăng xuất tài khoản?')) {
                tz_logout();
                window.location.href = '../../TechZone-Website/index.html';
            }
        });
    }

    // 8. Cập nhật Badge Giỏ hàng ở Header
    const cartBadge = document.querySelector('.fa-cart-shopping + span');
    if (cartBadge) {
        const count = tz_getCartCount();
        cartBadge.textContent = count;
        cartBadge.style.display = count > 0 ? 'flex' : 'none';
    }

    // 9. Tìm kiếm sản phẩm
    const searchInput = document.querySelector('input[placeholder*="Tìm kiếm"]');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const q = searchInput.value.trim();
                if (q) window.location.href = '../../TechZone-Website/categories.html?search=' + encodeURIComponent(q);
            }
        });
    }
});

// =============================================
// CẬP NHẬT GIAO DIỆN THÔNG TIN USER
// =============================================
function updateUserInfoDOM(user) {
    // Tên hiển thị ở header và sidebar
    const headerUserName = document.querySelector('header .font-semibold.text-xs');
    if (headerUserName) headerUserName.textContent = user.name;

    const welcomeTitle = document.querySelector('h1');
    if (welcomeTitle) welcomeTitle.textContent = `Chào mừng trở lại, ${user.name}!`;

    const sidebarName = document.querySelector('aside h3');
    if (sidebarName) sidebarName.textContent = user.name;

    const sidebarEmail = document.querySelector('aside p.text-gray-400');
    if (sidebarEmail) sidebarEmail.textContent = user.email;

    // Chi tiết thông tin
    const infoParagraphs = document.querySelectorAll('.grid.grid-cols-1.md\\:grid-cols-2 p');
    if (infoParagraphs.length >= 4) {
        infoParagraphs[0].textContent = user.name;
        infoParagraphs[1].textContent = user.email;
        infoParagraphs[2].textContent = user.phone || 'Chưa cập nhật';
        infoParagraphs[3].textContent = user.dob || 'Chưa cập nhật';
    }

    // Địa chỉ mặc định
    const addressEl = document.querySelector('.lg\\:col-span-2 p span');
    if (addressEl) addressEl.textContent = user.address || 'Chưa cập nhật địa chỉ giao hàng';
}

// =============================================
// LOAD DANH SÁCH ĐƠN HÀNG THỰC TẾ
// =============================================
function renderUserOrders(userId) {
    const ordersContainer = document.querySelector('.space-y-3');
    if (!ordersContainer) return;

    const allOrders = tz_getOrders();
    // Lọc các đơn hàng của user hiện tại
    const userOrders = allOrders.filter(o => o.userId === userId);

    // Cập nhật số lượng đơn hàng ở sidebar
    const orderCountEl = document.querySelector('aside p.text-gray-700');
    if (orderCountEl) orderCountEl.textContent = userOrders.length;

    if (userOrders.length === 0) {
        ordersContainer.innerHTML = `
            <div class="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center text-gray-500">
                <i class="fa-regular fa-folder-open text-4xl mb-2 text-gray-300 block"></i>
                <p>Bạn chưa có đơn hàng nào.</p>
                <a href="../../TechZone-Website/categories.html" class="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-blue-700 transition">Mua sắm ngay</a>
            </div>
        `;
        return;
    }

    ordersContainer.innerHTML = userOrders.map(o => {
        // Lấy sản phẩm đầu tiên hoặc tóm tắt
        const firstItem = o.items[0];
        const product = getProductById(firstItem.productId) || {
            name: "Sản phẩm TechZone",
            image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=150",
            price: firstItem.price
        };

        const statusClasses = {
            "Chờ xử lý": "text-blue-600",
            "Đang giao hàng": "text-orange-600",
            "Đã hoàn thành": "text-green-600",
            "Đã hủy": "text-red-600"
        };
        const statusDots = {
            "Chờ xử lý": "bg-blue-500",
            "Đang giao hàng": "bg-orange-500",
            "Đã hoàn thành": "bg-green-500",
            "Đã hủy": "bg-red-500"
        };

        const statusClass = statusClasses[o.status] || "text-gray-600";
        const statusDot = statusDots[o.status] || "bg-gray-500";

        const itemsSummary = o.items.length > 1 
            ? `${product.name} và ${o.items.length - 1} sản phẩm khác`
            : product.name;

        return `
            <div class="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center justify-between flex-wrap gap-4 order-card transition hover:shadow-md">
                <div class="flex items-center space-x-4">
                    <div class="w-16 h-16 bg-white rounded-xl overflow-hidden flex items-center justify-center p-2 border">
                        <img src="${product.image}" alt="${product.name}" class="object-contain w-full h-full">
                    </div>
                    <div>
                        <div class="flex items-center space-x-2 text-xs mb-0.5">
                            <span class="text-blue-600 font-semibold uppercase">Đơn hàng #${o.id}</span>
                            <span class="text-gray-300">•</span>
                            <span class="text-gray-400">${o.date}</span>
                        </div>
                        <h4 class="font-bold text-gray-800 text-sm">${itemsSummary}</h4>
                        <p class="text-xs text-gray-400 mt-0.5">${o.paymentMethod || 'Thanh toán COD'}</p>
                    </div>
                </div>
                <div class="flex items-center space-x-6">
                    <div class="text-right">
                        <p class="text-base font-bold text-gray-900">${formatPrice(o.total)}</p>
                        <span class="inline-flex items-center text-xs ${statusClass} font-medium mt-0.5">
                            <span class="w-1.5 h-1.5 ${statusDot} rounded-full mr-1.5"></span> ${o.status}
                        </span>
                    </div>
                    <button class="btn-detail bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-xs font-semibold transition" onclick="showOrderDetails('${o.id}')">Chi tiết</button>
                </div>
            </div>
        `;
    }).join('');
}

// Hàm hiển thị chi tiết đơn hàng
window.showOrderDetails = function(orderId) {
    const allOrders = tz_getOrders();
    const order = allOrders.find(o => o.id === orderId);
    if (!order) return;

    let detailsMsg = `Chi tiết đơn hàng #${order.id}\n`;
    detailsMsg += `Ngày đặt: ${order.date}\n`;
    detailsMsg += `Trạng thái: ${order.status}\n`;
    detailsMsg += `Người nhận: ${order.customerName}\n`;
    detailsMsg += `Địa chỉ: ${order.address}\n`;
    detailsMsg += `SĐT: ${order.phone}\n\nSản phẩm:\n`;
    
    order.items.forEach((item, index) => {
        const prod = getProductById(item.productId);
        const name = prod ? prod.name : "Sản phẩm #" + item.productId;
        detailsMsg += `${index + 1}. ${name} - Số lượng: ${item.quantity} - Giá: ${formatPrice(item.price)}\n`;
    });
    
    detailsMsg += `\nTổng tiền: ${formatPrice(order.total)}`;
    alert(detailsMsg);
};