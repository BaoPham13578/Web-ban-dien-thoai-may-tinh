// =============================================
// DAT / TRANG KHUYEN MAI / SCRIPT.JS
// Quản lý tin tức khuyến mãi và tiện ích tìm kiếm
// Sử dụng shared/data.js, shared/auth.js, shared/cart.js
// =============================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Pagination
    const pageButtons = document.querySelectorAll('.page-btn');
    pageButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.querySelector('i')) return;
            document.querySelector('.page-btn.active-page')?.classList.remove('active-page');
            this.classList.add('active-page');
            console.log(`Đang chuyển tới trang số: ${this.innerText}`);
        });
    });

    // 2. Click Tags
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.addEventListener('click', () => {
            const query = tag.innerText.replace('#', '').trim();
            // Lọc theo tag trong danh mục sản phẩm
            window.location.href = '../../TechZone-Website/categories.html?search=' + encodeURIComponent(query);
        });
    });

    // 3. Đăng ký nhận tin ở Footer
    const subBtn = document.querySelector('.subscribe-form button');
    const subInput = document.querySelector('.subscribe-form input');

    if (subBtn && subInput) {
        subBtn.addEventListener('click', () => {
            const email = subInput.value.trim();
            if(email && email.includes('@')) {
                tz_showToast(`✓ Đăng ký thành công! Email ${email} đã được lưu.`);
                subInput.value = "";
            } else {
                tz_showToast("⚠ Vui lòng nhập địa chỉ email hợp lệ!", "error");
            }
        });
    }

    // 4. Cập nhật Badge Giỏ hàng
    const cartBadge = document.querySelector('.icons .fa-cart-shopping + span, .icons .cart-icon span');
    if (cartBadge) {
        const count = tz_getCartCount();
        cartBadge.textContent = count;
        cartBadge.style.display = count > 0 ? 'flex' : 'none';
    }

    // 5. Tìm kiếm sản phẩm
    const searchInput = document.querySelector('.search, input[placeholder*="Tìm kiếm"]');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const q = searchInput.value.trim();
                if (q) window.location.href = '../../TechZone-Website/categories.html?search=' + encodeURIComponent(q);
            }
        });
    }
});