// =============================================
// DAT / GIO HANG / SCRIPT.JS
// Quản lý giỏ hàng chi tiết và gợi ý sản phẩm
// Sử dụng shared/data.js, shared/auth.js, shared/cart.js
// =============================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Render giỏ hàng
    renderCart();

    // 2. Render sản phẩm gợi ý
    renderSuggestions();

    // 3. Xử lý sự kiện Tìm kiếm
    const searchInput = document.querySelector('.search');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const q = searchInput.value.trim();
                if (q) window.location.href = '../../TechZone-Website/categories.html?search=' + encodeURIComponent(q);
            }
        });
    }

    // 4. Xử lý nút thanh toán
    const btnCheckout = document.querySelector('.checkout');
    if (btnCheckout) {
        btnCheckout.removeAttribute('onclick');
        btnCheckout.addEventListener('click', (e) => {
            e.preventDefault();
            const cart = tz_getCart();
            if (cart.length === 0) {
                alert('Giỏ hàng của bạn đang trống! Vui lòng chọn sản phẩm trước khi thanh toán.');
                return;
            }
            const user = tz_getCurrentUser();
            if (!user) {
                alert('Vui lòng đăng nhập để tiến hành thanh toán.');
                window.location.href = '../../NguyenNgocHuy_2474802015199/dangnhap/index.html';
                return;
            }
            window.location.href = '../Thanh Toan/index.html';
        });
    }
});

// =============================================
// THAY ĐỔI SỐ LƯỢNG SẢN PHẨM TRONG GIỎ
// =============================================
window.changeQty = function(productId, delta) {
    const cart = tz_getCart();
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    const newQty = item.qty + delta;
    if (newQty <= 0) {
        if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?')) {
            tz_removeFromCart(productId);
        }
    } else {
        const prod = getProductById(productId);
        const maxStock = prod ? prod.stock : 99;
        if (newQty > maxStock) {
            alert(`Rất tiếc, TechZone chỉ còn ${maxStock} sản phẩm này trong kho.`);
            return;
        }
        tz_updateCartQty(productId, newQty);
    }
    renderCart();
};

// =============================================
// XÓA SẢN PHẨM KHỎI GIỎ HÀNG
// =============================================
window.removeItem = function(productId) {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?')) {
        tz_removeFromCart(productId);
        renderCart();
    }
};

// =============================================
// HIỂN THỊ CHI TIẾT GIỎ HÀNG
// =============================================
function renderCart() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const summaryContainer = document.querySelector('.summary');

    if (!cartItemsContainer || !summaryContainer) return;

    const cart = tz_getCart();

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: #6B7280; background: white; border-radius: 12px; border: 1px solid #E5E7EB; width: 100%;">
                <i class="fa-solid fa-cart-shopping" style="font-size: 4rem; color: #D1D5DB; margin-bottom: 1rem; display: block;"></i>
                <h3 style="font-size: 1.2rem; font-weight: bold; margin-bottom: 0.5rem; color: #374151;">Giỏ hàng của bạn đang trống</h3>
                <p style="margin-bottom: 1.5rem;">Hãy khám phá các sản phẩm tuyệt vời của TechZone ngay!</p>
                <button onclick="location.href='../../TechZone-Website/categories.html';" style="background: #2563EB; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: bold; cursor: pointer; transition: background 0.2s;">
                    Mua sắm ngay
                </button>
            </div>
        `;
        // Tóm tắt đơn hàng bằng 0
        updateSummary(0);
        return;
    }

    let subtotal = 0;

    cartItemsContainer.innerHTML = cart.map(item => {
        const prod = getProductById(item.id);
        if (!prod) return '';

        const itemTotal = prod.price * item.qty;
        subtotal += itemTotal;

        const detailUrl = `../../NguyenNgocHuy_2474802015199/chitietsanpham/index.html?id=${prod.id}`;

        return `
            <div class="cart-item" style="position: relative; display: flex; align-items: center; gap: 1.5rem; background: white; padding: 1.2rem; border-radius: 12px; border: 1px solid #E5E7EB; margin-bottom: 1rem;">
                <img src="${prod.image}" alt="${prod.name}" onclick="location.href='${detailUrl}';" style="cursor: pointer; width: 80px; height: 80px; object-fit: contain; background: #F9FAFB; padding: 0.5rem; border-radius: 8px;">

                <div class="info" style="flex: 1; display: flex; flex-direction: column; gap: 0.25rem;">
                    <h3 onclick="location.href='${detailUrl}';" style="cursor: pointer; font-size: 1rem; font-weight: bold; margin: 0; color: #111827;">${prod.name}</h3>
                    <p style="margin: 0; font-size: 0.8rem; color: #6B7280;">Danh mục: ${getCategoryName(prod.category)} | Thương hiệu: ${prod.brand}</p>

                    <div class="quantity" style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem;">
                        <button onclick="changeQty(${prod.id}, -1)" style="width: 28px; height: 28px; border: 1px solid #D1D5DB; background: white; border-radius: 6px; cursor: pointer; font-weight: bold; display: flex; align-items: center; justify-content: center;">-</button>
                        <span style="font-weight: bold; font-size: 0.9rem; min-width: 20px; text-align: center;">${item.qty}</span>
                        <button onclick="changeQty(${prod.id}, 1)" style="width: 28px; height: 28px; border: 1px solid #D1D5DB; background: white; border-radius: 6px; cursor: pointer; font-weight: bold; display: flex; align-items: center; justify-content: center;">+</button>
                    </div>
                </div>

                <div class="price" style="text-align: right; display: flex; flex-direction: column; justify-content: space-between; height: 100%; min-width: 100px;">
                    <span style="font-size: 1.1rem; font-weight: bold; color: #2563EB;">${formatPrice(itemTotal)}</span>
                    <span onclick="removeItem(${prod.id})" style="font-size: 0.8rem; color: #EF4444; cursor: pointer; margin-top: 0.5rem; display: inline-block;"><i class="fa-regular fa-trash-can"></i> Xóa</span>
                </div>
            </div>
        `;
    }).join('');

    updateSummary(subtotal);
}

// =============================================
// CẬP NHẬT TÓM TẮT TIỀN ĐƠN HÀNG
// =============================================
function updateSummary(subtotal) {
    const summaryContainer = document.querySelector('.summary');
    if (!summaryContainer) return;

    const shipping = subtotal > 5000000 || subtotal === 0 ? 0 : 35000;
    const vat = Math.round(subtotal * 0.1);
    const total = subtotal + shipping + vat;

    const rows = summaryContainer.querySelectorAll('.row');
    if (rows.length >= 4) {
        // Tạm tính
        rows[0].querySelector('span:last-child').textContent = formatPrice(subtotal);
        // Phí ship
        const shipSpan = rows[1].querySelector('span:last-child');
        if (shipping === 0) {
            shipSpan.textContent = "Miễn phí";
            shipSpan.className = "green";
        } else {
            shipSpan.textContent = formatPrice(shipping);
            shipSpan.className = "";
        }
        // Thuế VAT
        rows[2].querySelector('span:last-child').textContent = formatPrice(vat);
    }

    const totalRow = summaryContainer.querySelector('.row.total span:last-child');
    if (totalRow) {
        totalRow.textContent = formatPrice(total);
    }
}

// =============================================
// RENDER SẢN PHẨM GỢI Ý (ĐỒNG BỘ TỪ DB)
// =============================================
function renderSuggestions() {
    const suggestionsGrid = document.querySelector('.products');
    if (!suggestionsGrid) return;

    // Lấy ngẫu nhiên hoặc 4 sản phẩm đầu tiên từ danh sách
    const items = TECHZONE_PRODUCTS.slice(4, 8);

    suggestionsGrid.innerHTML = items.map(p => {
        const detailUrl = `../../NguyenNgocHuy_2474802015199/chitietsanpham/index.html?id=${p.id}`;
        return `
            <div class="product" onclick="location.href='${detailUrl}';" style="cursor: pointer; background: white; padding: 1rem; border-radius: 12px; border: 1px solid #E5E7EB; text-align: center; transition: all 0.2s;">
                <img src="${p.image}" alt="${p.name}" style="width: 100%; height: 120px; object-fit: contain; margin-bottom: 0.5rem;">
                <h4 style="font-size: 0.85rem; font-weight: bold; margin: 0.25rem 0; color: #1F2937; height: 36px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">${p.name}</h4>
                <p style="font-size: 0.95rem; font-weight: bold; color: #2563EB; margin: 0;">${formatPrice(p.price)}</p>
            </div>
        `;
    }).join('');
}

function getCategoryName(cat) {
    const names = {
        phone: "Điện thoại", laptop: "Laptop", tablet: "Máy tính bảng",
        headphone: "Tai nghe", smartwatch: "Đồng hồ thông minh",
        accessory: "Phụ kiện", desktop: "Máy tính để bàn"
    };
    return names[cat] || cat;
}