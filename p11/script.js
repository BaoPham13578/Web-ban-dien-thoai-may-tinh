// =============================================
// P11 / SCRIPT.JS - ADMIN DASHBOARD LOGIC
// Quản lý tổng quan doanh số, đơn hàng, biểu đồ
// Sử dụng shared/data.js, shared/auth.js, shared/cart.js
// =============================================

document.addEventListener("DOMContentLoaded", function () {
    // 1. Kiểm tra quyền Admin
    if (!tz_isAdmin()) {
        alert("Cảnh báo: Bạn không có quyền truy cập trang quản trị!");
        window.location.href = "../NguyenNgocHuy_2474802015199/dangnhap/index.html";
        return;
    }

    // 2. Load dữ liệu thống kê từ localStorage
    loadAdminStats();

    // 3. Load Đơn hàng gần đây
    loadRecentOrders();

    // 4. Biểu đồ đường Doanh thu (Revenue Overview)
    setupRevenueChart();

    // 5. Biểu đồ tròn Doanh số thương hiệu (Sales by Brand)
    setupBrandChart();

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
// THỐNG KÊ DOANH THU & ĐƠN HÀNG
// =============================================
function loadAdminStats() {
    const orders = tz_getOrders();
    const users = tz_getUsers();
    
    // Tính tổng doanh thu từ các đơn hàng thành công hoặc đang xử lý
    const validOrders = orders.filter(o => o.status !== "Đã hủy");
    const totalRevenue = validOrders.reduce((sum, o) => sum + o.total, 0);
    
    // Tính tổng số sản phẩm đã bán ra
    const totalProductsSold = validOrders.reduce((sum, o) => {
        return sum + o.items.reduce((itemSum, item) => itemSum + item.qty, 0);
    }, 0);

    // Cập nhật lên UI
    const statValues = document.querySelectorAll(".stat-value");
    if (statValues.length >= 4) {
        // Doanh thu
        statValues[0].textContent = formatPrice(totalRevenue);
        // Đơn hàng
        statValues[1].textContent = orders.length;
        // Khách hàng
        statValues[2].textContent = users.filter(u => u.role !== "admin").length;
        // Sản phẩm bán ra
        statValues[3].textContent = totalProductsSold;
    }

    // Cập nhật banner chào mừng
    const bannerTextP = document.querySelector(".banner-text p");
    if (bannerTextP) {
        const pendingCount = orders.filter(o => o.status === "Chờ xử lý").length;
        bannerTextP.textContent = `Cửa hàng đang hoạt động ổn định. Bạn có ${pendingCount} đơn hàng mới đang chờ xử lý và 0 cảnh báo kho hàng nghiêm trọng.`;
    }
}

// =============================================
// LOAD ĐƠN HÀNG GẦN ĐÂY
// =============================================
function loadRecentOrders() {
    const tbody = document.querySelector(".data-table tbody");
    if (!tbody) return;

    const orders = tz_getOrders().slice(0, 5); // Lấy 5 đơn hàng mới nhất

    if (orders.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 2rem; color: #94A3B8;">Chưa có đơn hàng nào trên hệ thống</td></tr>`;
        return;
    }

    tbody.innerHTML = orders.map(o => {
        const firstItem = o.items[0];
        const prodName = firstItem 
            ? (getProductById(firstItem.productId)?.name || firstItem.name) 
            : "Không xác định";
        const itemSummary = o.items.length > 1 
            ? `${prodName} (+${o.items.length - 1})`
            : prodName;

        let statusClass = "status-pending";
        if (o.status === "Đã giao hàng" || o.status === "Đã hoàn thành") statusClass = "status-paid";
        else if (o.status === "Đang giao hàng") statusClass = "status-shipped";
        else if (o.status === "Đã hủy") statusClass = "status-cancelled"; // Tự thêm css sau nếu cần

        return `
            <tr>
                <td><strong>#${o.id.substring(3)}</strong></td>
                <td><div class="customer-cell"><div class="avatar-placeholder">${o.customerName[0].toUpperCase()}</div> ${o.customerName}</div></td>
                <td title="${prodName}">${itemSummary}</td>
                <td><strong>${formatPrice(o.total)}</strong></td>
                <td><span class="status ${statusClass}">${o.status.toUpperCase()}</span></td>
            </tr>
        `;
    }).join("");
}

// =============================================
// SETUP BIỂU ĐỒ DOANH THU
// =============================================
function setupRevenueChart() {
    const canvas = document.getElementById('revenueChart');
    if (!canvas) return;
    const ctxRevenue = canvas.getContext('2d');
    
    // Thu thập doanh thu theo các tháng (giả lập dựa trên đơn hàng thực tế)
    const orders = tz_getOrders().filter(o => o.status !== "Đã hủy");
    const monthlyData = Array(12).fill(0);
    
    // Gán dữ liệu mặc định ban đầu để trông sinh động
    const defaultData = [450, 500, 480, 580, 560, 650, 720, 680, 780, 880, 980, 1050];
    
    // Thêm các đơn hàng thực tế vào tháng 7 (tương ứng localTime hiện tại là tháng 7/2026)
    let currentMonthTotal = 0;
    orders.forEach(o => {
        // Tóm tắt đơn hàng cộng dồn
        currentMonthTotal += o.total / 1000000; // Đổi ra triệu VND
    });
    
    // Cập nhật dữ liệu tháng 7
    monthlyData.forEach((_, idx) => {
        if (idx === 6) { // Tháng 7
            monthlyData[idx] = defaultData[idx] + currentMonthTotal;
        } else {
            monthlyData[idx] = defaultData[idx];
        }
    });

    const revenueGradient = ctxRevenue.createLinearGradient(0, 0, 0, 250);
    revenueGradient.addColorStop(0, 'rgba(37, 99, 235, 0.2)');
    revenueGradient.addColorStop(1, 'rgba(37, 99, 235, 0.0)');

    new Chart(ctxRevenue, {
        type: 'line',
        data: {
            labels: ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'],
            datasets: [{
                label: 'Doanh thu (triệu đ)',
                data: monthlyData,
                borderColor: '#2563EB',
                borderWidth: 3,
                pointBackgroundColor: '#2563EB',
                pointHoverRadius: 6,
                tension: 0.35,
                fill: true,
                backgroundColor: revenueGradient
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    min: 0,
                    ticks: {
                        callback: function(value) {
                            return value === 0 ? '0đ' : value + 'tr';
                        },
                        color: '#64748B'
                    },
                    grid: { color: '#F1F5F9' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#64748B' }
                }
            }
        }
    });
}

// =============================================
// SETUP BIỂU ĐỒ THƯƠNG HIỆU
// =============================================
function setupBrandChart() {
    const canvas = document.getElementById('brandChart');
    if (!canvas) return;
    const ctxBrand = canvas.getContext('2d');

    // Thống kê thương hiệu sản phẩm bán ra từ đơn hàng thực tế
    const orders = tz_getOrders().filter(o => o.status !== "Đã hủy");
    const brandCounts = { 'Apple': 40, 'Samsung': 25, 'Google': 15, 'Xiaomi': 12, 'Khác': 8 };

    orders.forEach(o => {
        o.items.forEach(item => {
            const prod = getProductById(item.productId);
            if (prod) {
                const brand = prod.brand;
                if (brandCounts[brand] !== undefined) {
                    brandCounts[brand] += item.qty;
                } else {
                    brandCounts['Khác'] += item.qty;
                }
            }
        });
    });

    new Chart(ctxBrand, {
        type: 'doughnut',
        data: {
            labels: Object.keys(brandCounts),
            datasets: [{
                data: Object.values(brandCounts),
                backgroundColor: [
                    '#1D4ED8', // Apple
                    '#3B82F6', // Samsung
                    '#60A5FA', // Google
                    '#93C5FD', // Xiaomi
                    '#EFF6FF'  // Khác
                ],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 12,
                        padding: 15,
                        font: { size: 11 },
                        color: '#64748B'
                    }
                }
            }
        }
    });
}