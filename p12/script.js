// =============================================
// P12 / SCRIPT.JS - ADMIN ORDERS MANAGEMENT
// Quản lý và cập nhật trạng thái đơn hàng hệ thống
// Sử dụng shared/data.js, shared/auth.js, shared/cart.js
// =============================================

document.addEventListener("DOMContentLoaded", function () {
    // 1. Kiểm tra quyền Admin
    if (!tz_isAdmin()) {
        alert("Cảnh báo: Bạn không có quyền truy cập trang quản trị!");
        window.location.href = "../NguyenNgocHuy_2474802015199/dangnhap/index.html";
        return;
    }

    // 2. Load danh sách đơn hàng thực tế
    renderOrdersTable();

    // 3. Biểu đồ Sparkline Doanh thu hôm nay
    setupSparkline();

    // 4. Modal events
    setupModalEvents();

    // 5. Sidebar active state & navigation
    setupSidebarNavigation();

    // 6. Đăng xuất
    const logoutBtn = document.querySelector(".logout");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (confirm("Bạn có chắc chắn muốn đăng xuất tài khoản quản trị?")) {
                tz_logout();
                window.location.href = "../NguyenNgocHuy_2474802015199/dangnhap/index.html";
            }
        });
    }
});

// =============================================
// RENDER BẢNG ĐƠN HÀNG DỰA TRÊN LOCALSTORAGE
// =============================================
function renderOrdersTable() {
    const tbody = document.querySelector(".data-table tbody");
    if (!tbody) return;

    const orders = tz_getOrders();

    if (orders.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 3rem; color: #94A3B8;">Chưa có đơn hàng nào trên hệ thống</td></tr>`;
        return;
    }

    tbody.innerHTML = orders.map(o => {
        let statusBadge = "status-pending";
        if (o.status === "Đã hoàn thành" || o.status === "Đã giao hàng") statusBadge = "status-paid";
        else if (o.status === "Đang giao hàng") statusBadge = "status-shipped";
        else if (o.status === "Đã hủy") statusBadge = "status-cancelled"; // custom red color if any

        // Tạo chuỗi tóm tắt sản phẩm
        const firstItem = o.items[0];
        const prodName = firstItem ? (getProductById(firstItem.productId)?.name || firstItem.name) : "Sản phẩm";
        const summary = o.items.length > 1 ? `${prodName} (+${o.items.length - 1})` : prodName;

        return `
            <tr class="order-clickable-row" data-order="${o.id}" style="cursor: pointer;">
                <td><strong>#${o.id.substring(3)}</strong></td>
                <td>
                    <div class="cust-cell">
                        <strong>${o.customerName}</strong>
                        <span>${o.phone}</span>
                    </div>
                </td>
                <td title="${prodName}">${summary}</td>
                <td><span class="badge-status ${statusBadge}">${o.status}</span></td>
                <td>${o.createdAt ? o.createdAt.split(" ")[0] : "18/07/2026"}</td>
                <td><strong>${formatPrice(o.total)}</strong></td>
                <td><button class="btn-view-eye" onclick="event.stopPropagation(); openOrderDetails('${o.id}');"><i class="fa-regular fa-eye"></i></button></td>
            </tr>
        `;
    }).join("");

    // Đăng ký sự kiện click hàng để mở Modal
    document.querySelectorAll(".order-clickable-row").forEach(row => {
        row.addEventListener("click", () => {
            const orderId = row.getAttribute("data-order");
            openOrderDetails(orderId);
        });
    });

    // Cập nhật doanh thu góc bên phải
    const todayTotal = orders.filter(o => o.status !== "Đã hủy").reduce((sum, o) => sum + o.total, 0);
    const revenueWidgetH3 = document.querySelector(".mcc-header h3");
    if (revenueWidgetH3) {
        revenueWidgetH3.textContent = formatPrice(todayTotal);
    }
}

// =============================================
// MODAL DETAILS & UPDATE STATUS
// =============================================
let activeOrderId = null;

window.openOrderDetails = function(orderId) {
    activeOrderId = orderId;
    const orders = tz_getOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const modal = document.getElementById("orderModal");
    if (!modal) return;

    // Header modal
    document.getElementById("m-order-id").textContent = `Chi tiết đơn hàng - #${order.id}`;
    const dateText = modal.querySelector(".modal-header p");
    if (dateText) dateText.textContent = `Được đặt vào: ${order.createdAt || order.date}`;

    // Khách hàng
    document.getElementById("m-cust-name").textContent = order.customerName;
    document.getElementById("m-cust-email").textContent = `SĐT: ${order.phone} | Địa chỉ: ${order.address}`;
    
    // Avatar chữ cái đầu
    const imgEl = modal.querySelector(".customer-profile-box img");
    if (imgEl) {
        imgEl.style.display = "none"; // ẩn ảnh mặc định
    }
    let letterBox = modal.querySelector(".customer-profile-box .avatar-letter");
    if (!letterBox) {
        letterBox = document.createElement("div");
        letterBox.className = "avatar-letter";
        letterBox.style.cssText = `
            width: 48px; height: 48px; border-radius: 50%;
            background: #2563EB; color: white; display: flex;
            align-items: center; justify-content: center;
            font-size: 20px; font-weight: bold;
        `;
        imgEl.parentNode.insertBefore(letterBox, imgEl);
    }
    letterBox.textContent = order.customerName[0].toUpperCase();

    // Render danh sách sản phẩm
    const itemsSection = modal.querySelector(".order-items-section");
    if (itemsSection) {
        itemsSection.innerHTML = `
            <h4 style="font-size: 14px; font-weight: 700; margin-bottom: 12px; color: var(--text-dark);">Sản phẩm đã mua</h4>
            ` + order.items.map(item => {
                const prod = getProductById(item.productId);
                const name = prod ? prod.name : item.name;
                const brand = prod ? prod.brand : item.brand;
                return `
                    <div class="order-item" style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px dashed var(--border-color);">
                        <div>
                            <strong style="display: block; font-size: 13px; color: var(--text-dark);">${name}</strong>
                            <span style="font-size: 11px; color: var(--text-muted);">Số lượng: ${item.quantity || item.qty} • Thương hiệu: ${brand}</span>
                        </div>
                        <span style="font-weight: 600; font-size: 13px; color: var(--text-dark);">${formatPrice(item.price * (item.quantity || item.qty))}</span>
                    </div>
                `;
            }).join("");
    }

    // Tóm tắt chi phí
    const summarySection = modal.querySelector(".order-summary-section");
    if (summarySection) {
        const subtotal = order.subtotal || (order.total + (order.discount || 0) - (order.shippingFee || 0));
        summarySection.innerHTML = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px;">
                <span style="color: var(--text-muted);">Tạm tính</span>
                <strong style="color: var(--text-dark);">${formatPrice(subtotal)}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px;">
                <span style="color: var(--text-muted);">Giảm giá</span>
                <strong style="color: #EF4444;">-${formatPrice(order.discount || 0)}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px;">
                <span style="color: var(--text-muted);">Phí vận chuyển</span>
                <strong style="color: var(--green);">${order.shippingFee === 0 ? "Miễn phí" : formatPrice(order.shippingFee)}</strong>
            </div>
            <hr style="border: none; border-top: 1px solid var(--border-color); margin: 12px 0;">
            <div style="display: flex; justify-content: space-between; font-size: 14px;">
                <span style="font-weight: 700; color: var(--text-dark);">Tổng cộng</span>
                <strong style="color: var(--primary-blue); font-size: 16px;">${formatPrice(order.total)}</strong>
            </div>
        `;
    }

    // Tự động chèn ô Cập nhật Trạng thái đơn hàng (Dropdown select)
    let statusSelectDiv = modal.querySelector(".modal-status-select-container");
    if (!statusSelectDiv) {
        statusSelectDiv = document.createElement("div");
        statusSelectDiv.className = "modal-status-select-container";
        statusSelectDiv.style.cssText = "margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid var(--border-color);";
        itemsSection.parentNode.insertBefore(statusSelectDiv, itemsSection);
    }
    statusSelectDiv.innerHTML = `
        <h4 style="font-size: 14px; font-weight: 700; margin-bottom: 12px; color: var(--text-dark);">Cập nhật trạng thái</h4>
        <select id="m-status-dropdown" style="width: 100%; padding: 10px; border-radius: 6px; border: 1px solid var(--border-color); background: white; font-size: 13px;">
            <option value="Chờ xử lý" ${order.status === "Chờ xử lý" ? "selected" : ""}>Chờ xử lý</option>
            <option value="Đang giao hàng" ${order.status === "Đang giao hàng" ? "selected" : ""}>Đang giao hàng</option>
            <option value="Đã hoàn thành" ${order.status === "Đã hoàn thành" ? "selected" : ""}>Đã hoàn thành</option>
            <option value="Đã hủy" ${order.status === "Đã hủy" ? "selected" : ""}>Đã hủy</option>
        </select>
    `;

    // Cập nhật thanh tiến trình bước
    updateProgressBar(order.status);

    modal.style.display = 'flex';
};

function updateProgressBar(status) {
    const steps = document.querySelectorAll(".status-progress-bar .step");
    steps.forEach(s => s.className = "step");

    if (status === "Chờ xử lý") {
        steps[0].classList.add("step-active");
    } else if (status === "Đang giao hàng") {
        steps[0].classList.add("step-done");
        steps[1].classList.add("step-done");
        steps[2].classList.add("step-active");
    } else if (status === "Đã hoàn thành") {
        steps[0].classList.add("step-done");
        steps[1].classList.add("step-done");
        steps[2].classList.add("step-done");
        steps[3].classList.add("step-done");
    } else if (status === "Đã hủy") {
        // Hủy bỏ thì không active bước nào
    }
}

function setupModalEvents() {
    const modal = document.getElementById("orderModal");
    if (!modal) return;

    const closeModal = () => modal.style.display = 'none';

    document.getElementById("closeModalBtn")?.addEventListener('click', closeModal);
    document.getElementById("cancelModalBtn")?.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Sự kiện nút "Cập nhật đơn hàng"
    const updateBtn = modal.querySelector(".btn-primary");
    if (updateBtn) {
        updateBtn.addEventListener("click", () => {
            const dropdown = document.getElementById("m-status-dropdown");
            if (!dropdown || !activeOrderId) return;

            const newStatus = dropdown.value;
            const orders = tz_getOrders();
            const idx = orders.findIndex(o => o.id === activeOrderId);
            
            if (idx !== -1) {
                orders[idx].status = newStatus;
                localStorage.setItem("tz_orders", JSON.stringify(orders));
                alert(`Đã cập nhật trạng thái đơn hàng #${activeOrderId.substring(3)} thành "${newStatus}"!`);
                closeModal();
                renderOrdersTable();
            }
        });
    }
}

// =============================================
// SETUP SPARKLINE DOANH THU NHỎ
// =============================================
function setupSparkline() {
    const canvas = document.getElementById('miniRevenueChart');
    if (!canvas) return;
    const ctxMini = canvas.getContext('2d');
    
    const chartGradient = ctxMini.createLinearGradient(0, 0, 0, 90);
    chartGradient.addColorStop(0, 'rgba(37, 99, 235, 0.15)');
    chartGradient.addColorStop(1, 'rgba(37, 99, 235, 0.0)');

    new Chart(ctxMini, {
        type: 'line',
        data: {
            labels: ['10am', '12pm', '2pm', '4pm', '6pm', '8pm'],
            datasets: [{
                data: [3000, 5000, 4200, 6800, 5100, 12450],
                borderColor: '#2563EB',
                borderWidth: 2,
                pointRadius: 3,
                pointBackgroundColor: '#2563EB',
                tension: 0.4,
                fill: true,
                backgroundColor: chartGradient
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: {
                    grid: { color: '#F1F5F9' },
                    ticks: {
                        color: '#94A3B8',
                        font: { size: 10 },
                        callback: function(val) { return val === 0 ? '0' : (val / 1000) + 'k'; }
                    }
                },
                x: { grid: { display: false }, ticks: { color: '#94A3B8', font: { size: 10 } } }
            }
        }
    });
}

// Sidebar click state navigation
function setupSidebarNavigation() {
    const menuLinks = document.querySelectorAll(".nav-menu li, .navigation li");
    menuLinks.forEach(link => {
        link.addEventListener("click", () => {
            menuLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");
        });
    });
}