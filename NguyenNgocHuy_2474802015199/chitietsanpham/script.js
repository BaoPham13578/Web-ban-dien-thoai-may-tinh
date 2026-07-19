// =============================================
// CHITIETSANPHAM / SCRIPT.JS
// Load sản phẩm động từ URL ?id= param
// Sử dụng shared/data.js, shared/auth.js, shared/cart.js
// =============================================

document.addEventListener('DOMContentLoaded', () => {

    // === LẤY SẢN PHẨM TỪ URL ===
    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get('id'));
    const product = productId ? getProductById(productId) : null;

    if (product) {
        loadProductData(product);
    }

    // === 1. TÍNH NĂNG ĐỔI ẢNH GALLERY ===
    const mainImg = document.getElementById('main-product-img');
    const thumbBoxes = document.querySelectorAll('.thumb-box');

    thumbBoxes.forEach(thumb => {
        thumb.addEventListener('click', () => {
            thumbBoxes.forEach(box => box.classList.remove('active'));
            thumb.classList.add('active');
            mainImg.classList.add('main-img-fade');
            setTimeout(() => {
                mainImg.src = thumb.getAttribute('data-img');
                mainImg.classList.remove('main-img-fade');
            }, 150);
        });
    });

    // === 2. TÍNH NĂNG TĂNG GIẢM SỐ LƯỢNG ===
    const qtyInput = document.getElementById('qty-input');
    const qtyMinus = document.getElementById('qty-minus');
    const qtyPlus = document.getElementById('qty-plus');

    if (qtyMinus) {
        qtyMinus.addEventListener('click', () => {
            let currentQty = parseInt(qtyInput.value) || 1;
            if (currentQty > 1) qtyInput.value = currentQty - 1;
        });
    }

    if (qtyPlus) {
        qtyPlus.addEventListener('click', () => {
            let currentQty = parseInt(qtyInput.value) || 1;
            const maxStock = product ? product.stock : 99;
            if (currentQty < maxStock) qtyInput.value = currentQty + 1;
        });
    }

    // === 3. LOGIC LỰA CHỌN CẤU HÌNH ===
    const setupSelection = (buttonsSelector, activeClasses, defaultClasses) => {
        const buttons = document.querySelectorAll(buttonsSelector);
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => {
                    b.className = btn.className.split(' ').filter(c => !activeClasses.includes(c)).join(' ') + ' ' + defaultClasses;
                });
                activeClasses.forEach(c => btn.classList.add(c));
            });
        });
    };

    setupSelection('.ram-btn', ['border-2', 'border-blue-600', 'text-blue-600', 'bg-blue-50/40', 'font-bold'], 'border rounded-xl px-4 py-2 font-medium text-xs text-gray-700');
    setupSelection('.storage-btn', ['border-2', 'border-blue-600', 'text-blue-600', 'bg-blue-50/40', 'font-bold'], 'border rounded-xl px-4 py-2 font-medium text-xs text-gray-700');

    const colorButtons = document.querySelectorAll('.color-btn');
    colorButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            colorButtons.forEach(b => b.classList.remove('ring-2', 'ring-blue-600'));
            btn.classList.add('ring-2', 'ring-blue-600');
        });
    });

    // === 4. NÚT THÊM VÀO GIỎ & MUA NGAY ===
    const btnAddCart = document.getElementById('add-to-cart');
    const btnBuyNow = document.getElementById('buy-now');

    if (btnAddCart) {
        // Xóa onclick cũ
        btnAddCart.removeAttribute('onclick');
        btnAddCart.addEventListener('click', (e) => {
            e.preventDefault();
            const qty = parseInt(qtyInput?.value) || 1;
            const id = product ? product.id : 1;
            tz_addToCart(id, qty);

            btnAddCart.innerHTML = '✓ Đã Thêm Vào Giỏ';
            btnAddCart.classList.remove('bg-blue-600');
            btnAddCart.classList.add('bg-green-600');
            setTimeout(() => {
                btnAddCart.innerHTML = 'Thêm Vào Giỏ Hàng';
                btnAddCart.classList.remove('bg-green-600');
                btnAddCart.classList.add('bg-blue-600');
            }, 2000);
        });
    }

    if (btnBuyNow) {
        btnBuyNow.removeAttribute('onclick');
        btnBuyNow.addEventListener('click', (e) => {
            e.preventDefault();
            const qty = parseInt(qtyInput?.value) || 1;
            const id = product ? product.id : 1;
            tz_addToCart(id, qty);
            window.location.href = '../../Dat/Thanh Toan/index.html';
        });
    }

    // === 5. CẬP NHẬT BADGE GIỎ HÀNG TRÊN HEADER ===
    updateCartBadgeOnPage();

    // === 6. TÌM KIẾM ===
    const searchInputs = document.querySelectorAll('input[placeholder*="Tìm kiếm"]');
    searchInputs.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const q = input.value.trim();
                if (q) window.location.href = '../../TechZone-Website/categories.html?search=' + encodeURIComponent(q);
            }
        });
    });
});

// =============================================
// LOAD DỮ LIỆU SẢN PHẨM TỪ DATABASE
// =============================================
function loadProductData(p) {
    // Tiêu đề trang
    document.title = p.name + ' | TechZone';

    // Tên sản phẩm
    const h1 = document.querySelector('h1');
    if (h1) h1.textContent = p.name;

    // Category badge
    const catBadge = document.querySelector('.text-blue-600.text-xs.font-bold.uppercase');
    if (catBadge) {
        const catNames = {
            phone: "Điện thoại", laptop: "Laptop", tablet: "Máy tính bảng",
            headphone: "Tai nghe", smartwatch: "Đồng hồ thông minh",
            accessory: "Phụ kiện", desktop: "Máy tính để bàn"
        };
        catBadge.textContent = catNames[p.category] || p.brand;
    }

    // Giá
    const priceEl = document.querySelector('.text-3xl.font-black.text-blue-600');
    if (priceEl) priceEl.textContent = formatPrice(p.price);

    const oldPriceEl = document.querySelector('.line-through');
    if (oldPriceEl) {
        if (p.oldPrice) {
            oldPriceEl.textContent = formatPrice(p.oldPrice);
            oldPriceEl.style.display = '';
        } else {
            oldPriceEl.style.display = 'none';
        }
    }

    // Discount badge
    const discountBadge = document.querySelector('.bg-red-50.text-red-500');
    if (discountBadge) {
        if (p.oldPrice) {
            const pct = Math.round((1 - p.price / p.oldPrice) * 100);
            discountBadge.textContent = 'Giảm ' + pct + '%';
            discountBadge.style.display = '';
        } else {
            discountBadge.style.display = 'none';
        }
    }

    // Tình trạng còn hàng
    const stockEl = document.querySelector('.text-green-600.font-medium');
    if (stockEl) {
        if (p.stock > 0) {
            stockEl.innerHTML = '<i class="fa-solid fa-circle-check mr-1 text-[10px]"></i> Còn hàng - ' + p.stock + ' sản phẩm';
        } else {
            stockEl.innerHTML = '<i class="fa-solid fa-circle-xmark mr-1 text-[10px]"></i> Tạm hết hàng';
            stockEl.classList.remove('text-green-600');
            stockEl.classList.add('text-red-600');
        }
    }

    // Rating
    const ratingSpan = document.querySelector('.font-bold.text-xs');
    if (ratingSpan && ratingSpan.textContent.match(/[\d.]+/)) {
        ratingSpan.textContent = p.rating;
    }
    const reviewCountEl = document.querySelector('.text-gray-400.text-xs');
    if (reviewCountEl && reviewCountEl.textContent.includes('Đánh giá')) {
        reviewCountEl.textContent = p.reviewCount + ' Đánh giá từ khách hàng';
    }

    // Hình ảnh chính
    const mainImg = document.getElementById('main-product-img');
    if (mainImg) {
        mainImg.src = p.images[0] || p.image;
        mainImg.alt = p.name;
    }

    // Thumbnails
    const thumbBoxes = document.querySelectorAll('.thumb-box');
    const allImages = p.images.length > 1 ? p.images : [p.image, p.image];
    thumbBoxes.forEach((tb, i) => {
        if (allImages[i]) {
            tb.setAttribute('data-img', allImages[i]);
            const img = tb.querySelector('img');
            if (img) img.src = allImages[i].replace('w=500', 'w=150');
        }
    });

    // Mô tả
    const descPs = document.querySelectorAll('.text-gray-500.leading-relaxed');
    if (descPs.length > 0) descPs[0].textContent = p.description;

    // Thông số kỹ thuật
    const specsList = document.querySelector('.space-y-2.pt-2');
    if (specsList && p.specs) {
        specsList.innerHTML = Object.entries(p.specs).map(([key, val]) => `
            <li class="flex items-center"><i class="fa-solid fa-circle-check text-blue-600 mr-2 text-[10px]"></i> <strong>${key}:</strong>&nbsp;${val}</li>
        `).join('');
    }

    // Bảng thông số kỹ thuật (nếu có table)
    const specTable = document.querySelector('table, .specs-table');
    if (specTable && p.specs) {
        const tbody = specTable.querySelector('tbody') || specTable;
        tbody.innerHTML = Object.entries(p.specs).map(([key, val]) => `
            <tr>
                <td class="py-3 px-4 text-gray-500 font-medium border-b border-gray-50">${key}</td>
                <td class="py-3 px-4 font-semibold text-gray-800 border-b border-gray-50">${val}</td>
            </tr>
        `).join('');
    }
}

// =============================================
// CẬP NHẬT BADGE GIỎ HÀNG
// =============================================
function updateCartBadgeOnPage() {
    const count = tz_getCartCount();
    // Tìm badge cố định trong header
    const badges = document.querySelectorAll('.fa-cart-shopping + span, .fa-cart-shopping ~ span');
    badges.forEach(b => {
        b.textContent = count;
        b.style.display = count > 0 ? 'flex' : 'none';
    });
}