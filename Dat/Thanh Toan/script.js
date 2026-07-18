// =============================================
// DAT / THANH TOAN / SCRIPT.JS
// Quản lý thông tin thanh toán, tính tổng tiền, đặt hàng
// Sử dụng shared/data.js, shared/auth.js, shared/cart.js
// =============================================

document.addEventListener("DOMContentLoaded", () => {
    // 1. Kiểm tra giỏ hàng
    const cart = tz_getCart();
    if (cart.length === 0) {
        alert("Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm trước!");
        window.location.href = "../gio hang/index.html";
        return;
    }

    // 2. Prefill thông tin khách hàng nếu đã đăng nhập
    const user = tz_getCurrentUser();
    if (user) {
        prefillUserInfo(user);
    }

    // 3. Render danh sách sản phẩm tóm tắt ở cột phải
    renderCheckoutSummary();

    // 4. Xử lý lựa chọn Phương thức vận chuyển
    const shippingItems = document.querySelectorAll(".shipping-item");
    shippingItems.forEach(item => {
        item.addEventListener("click", () => {
            shippingItems.forEach(i => i.classList.remove("active"));
            item.classList.add("active");
            updateTotal();
        });
    });

    // 5. Xử lý lựa chọn Phương thức thanh toán
    const paymentItems = document.querySelectorAll(".payment-item");
    const cardForm = document.querySelector(".card-form");
    paymentItems.forEach(item => {
        item.addEventListener("click", () => {
            paymentItems.forEach(i => i.classList.remove("active"));
            item.classList.add("active");
            
            // Ẩn/Hiện form nhập thẻ tín dụng nếu không phải thẻ tín dụng
            const isCard = item.innerText.includes("Thẻ tín dụng");
            if (cardForm) {
                cardForm.style.display = isCard ? "block" : "none";
            }
        });
    });

    // 6. Xử lý mã giảm giá Coupon
    setupCoupon();

    // 7. Xử lý đặt hàng thực tế
    const checkoutBtn = document.querySelector(".checkout-btn");
    if (checkoutBtn) {
        checkoutBtn.removeAttribute("onclick");
        checkoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            handleCheckout();
        });
    }

    // 8. Định dạng các ô nhập thẻ tín dụng
    setupCardInputs();

    // 9. Ô tìm kiếm
    const searchInput = document.querySelector(".search-box input");
    if (searchInput) {
        searchInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                const q = searchInput.value.trim();
                if (q) window.location.href = '../../TechZone-Website/categories.html?search=' + encodeURIComponent(q);
            }
        });
    }

    // 10. Cập nhật số lượng giỏ hàng ở header
    const cartCountEl = document.querySelector(".cart-icon span");
    if (cartCountEl) {
        cartCountEl.textContent = tz_getCartCount();
    }
});

// Dữ liệu tiền đơn hàng
let subtotal = tz_getCartTotal();
let discount = 0;
let shippingFee = 0;

// Prefill form
function prefillUserInfo(user) {
    const inputs = document.querySelectorAll(".checkout-left input");
    if (inputs.length >= 8) {
        // Tên
        inputs[0].value = user.name || "";
        // SĐT
        inputs[1].value = user.phone || "";
        // Email
        inputs[2].value = user.email || "";
        
        // Địa chỉ chi tiết
        if (user.address) {
            inputs[7].value = user.address;
            // Tách tỉnh thành quận huyện đơn giản nếu địa chỉ có dấu phẩy
            const parts = user.address.split(",");
            if (parts.length >= 2) {
                inputs[6].value = parts[parts.length - 2].trim(); // Quận/Huyện
                inputs[4].value = parts[parts.length - 1].trim(); // Tỉnh/Thành
            }
        }
    }
}

// Render danh sách sản phẩm tóm tắt
function renderCheckoutSummary() {
    const summaryCard = document.querySelector(".summary-card");
    if (!summaryCard) return;

    // Xóa các sản phẩm mẫu cũ
    const oldItems = summaryCard.querySelectorAll(".product-item");
    oldItems.forEach(i => i.remove());

    const cart = tz_getCart();
    
    // Tạo danh sách HTML các sản phẩm
    const itemsHTML = cart.map(item => {
        const prod = getProductById(item.id);
        const imgUrl = prod ? prod.image : item.image;
        const name = prod ? prod.name : item.name;
        const priceTotal = item.price * item.qty;
        const detailUrl = `../../NguyenNgocHuy_2474802015199/chitietsanpham/index.html?id=${item.id}`;

        return `
            <div class="product-item" onclick="location.href='${detailUrl}';" style="cursor: pointer; display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                <img src="${imgUrl}" alt="${name}" style="width: 50px; height: 50px; object-fit: contain; border-radius: 8px; background: #F9FAFB; padding: 0.25rem; border: 1px solid #E5E7EB;">
                <div class="product-info" style="flex: 1;">
                    <h4 style="font-size: 0.85rem; font-weight: bold; margin: 0; color: #1F2937;">${name}</h4>
                    <small style="color: #6B7280; font-size: 0.75rem;">Số lượng: ${item.qty} × ${formatPrice(item.price)}</small>
                </div>
                <div class="product-price" style="font-weight: bold; font-size: 0.9rem; color: #1F2937;">
                    ${formatPrice(priceTotal)}
                </div>
            </div>
        `;
    }).join("");

    // Chèn danh sách sản phẩm vào trước coupon-box
    const couponBox = summaryCard.querySelector(".coupon-box");
    if (couponBox) {
        couponBox.insertAdjacentHTML("beforebegin", itemsHTML);
    }

    updateTotal();
}

// Cập nhật giá tổng cộng
function updateTotal() {
    const activeShipping = document.querySelector(".shipping-item.active");
    if (activeShipping && activeShipping.innerText.toLowerCase().includes("hỏa tốc")) {
        shippingFee = 50000;
    } else {
        shippingFee = 0;
    }

    const vat = Math.round(subtotal * 0.1);
    const total = subtotal - discount + shippingFee + vat;

    const summaryRows = document.querySelectorAll(".summary-detail div");
    if (summaryRows.length >= 4) {
        // Tạm tính
        summaryRows[0].querySelector("span:last-child").textContent = formatPrice(subtotal);
        // Vận chuyển
        summaryRows[1].querySelector("span:last-child").textContent = shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee);
        // Giảm giá
        summaryRows[2].querySelector("span:last-child").textContent = discount === 0 ? "0đ" : "-" + formatPrice(discount);
        summaryRows[2].querySelector("span:last-child").className = "discount" + (discount > 0 ? " red" : "");
        // Thuế VAT
        summaryRows[3].querySelector("span:last-child").textContent = formatPrice(vat);
    }

    const totalEl = document.querySelector(".total-price h2");
    if (totalEl) {
        totalEl.textContent = formatPrice(total);
    }
}

// Setup coupon
function setupCoupon() {
    const couponBtn = document.querySelector(".coupon-box button");
    const couponInput = document.querySelector(".coupon-box input");

    if (couponBtn && couponInput) {
        couponBtn.addEventListener("click", () => {
            const code = couponInput.value.trim().toUpperCase();
            if (!code) return;

            switch (code) {
                case "TECHZONE10":
                    discount = Math.round(subtotal * 0.1);
                    alert(`Áp dụng mã TECHZONE10 thành công! Giảm 10% (${formatPrice(discount)})`);
                    break;
                case "GIAMGIA500":
                    discount = Math.min(500000, subtotal);
                    alert("Áp dụng mã GIAMGIA500 thành công! Giảm 500.000đ");
                    break;
                case "WELCOME":
                    discount = Math.min(300000, subtotal);
                    alert("Áp dụng mã WELCOME thành công! Giảm 300.000đ");
                    break;
                default:
                    alert("Mã giảm giá không hợp lệ hoặc đã hết hạn!");
                    return;
            }

            updateTotal();
        });
    }
}

// Xử lý Validate Form
function validateForm() {
    const inputs = document.querySelectorAll(".checkout-left input:not([readonly])");
    for (let input of inputs) {
        // Bỏ qua ô nhập địa chỉ phụ và coupon
        if (input.placeholder.includes("phụ") || input.placeholder.includes("Mã khuyến mãi")) {
            continue;
        }

        // Bỏ qua các ô nhập thẻ tín dụng nếu không chọn phương thức thẻ tín dụng
        const isCardActive = document.querySelector(".payment-item.active").innerText.includes("Thẻ tín dụng");
        if (!isCardActive && (input.placeholder.includes("****") || input.placeholder.includes("12/") || input.placeholder.includes("***"))) {
            continue;
        }

        if (input.value.trim() === "") {
            input.focus();
            const labelText = input.previousElementSibling ? input.previousElementSibling.innerText : "thông tin cần thiết";
            alert(`Vui lòng nhập ${labelText}`);
            return false;
        }
    }
    return true;
}

// Xử lý nút Đặt hàng thực tế
function handleCheckout() {
    if (!validateForm()) return;

    const nameInput = document.querySelectorAll(".checkout-left input")[0];
    const phoneInput = document.querySelectorAll(".checkout-left input")[1];
    const cityInput = document.querySelector('input[value*="Hồ Chí Minh"]') || document.querySelectorAll(".checkout-left input")[4];
    const districtInput = document.querySelectorAll(".checkout-left input")[5] || document.querySelectorAll(".checkout-left input")[6];
    const addressInput = document.querySelectorAll(".checkout-left input")[7] || document.querySelectorAll(".checkout-left input")[8];

    const customerName = nameInput ? nameInput.value.trim() : "Khách hàng TechZone";
    const phone = phoneInput ? phoneInput.value.trim() : "";
    const address = `${addressInput ? addressInput.value.trim() : ""}, ${districtInput ? districtInput.value.trim() : ""}, ${cityInput ? cityInput.value.trim() : ""}`;

    const paymentMethod = document.querySelector(".payment-item.active span").innerText;
    const shippingMethod = document.querySelector(".shipping-item.active h4").innerText;

    // Đặt hàng qua API shared/cart.js
    const orderData = {
        name: customerName,
        phone: phone,
        address: address,
        discount: discount,
        shippingFee: shippingFee,
        payment: paymentMethod,
        shipping: shippingMethod
    };

    const order = tz_placeOrder(orderData);

    // Hiển thị popup thành công bằng SweetAlert2
    Swal.fire({
        icon: 'success',
        title: '🎉 Đặt hàng thành công!',
        html: `
            <div style="text-align:left; font-size:14px; line-height: 1.6; padding: 10px 20px;">
                <p>🆔 <b>Mã đơn hàng:</b> ${order.id}</p>
                <p>👤 <b>Người nhận:</b> ${order.customerName}</p>
                <p>📞 <b>Số điện thoại:</b> ${order.phone}</p>
                <p>📍 <b>Địa chỉ:</b> ${order.address}</p>
                <p>💳 <b>Thanh toán:</b> ${order.payment}</p>
                <p>🚚 <b>Vận chuyển:</b> ${order.shipping}</p>
                <p style="font-size: 16px; color: #2563eb;">💰 <b>Tổng tiền:</b> ${formatPrice(order.total)}</p>
            </div>
        `,
        confirmButtonText: 'Xem lịch sử đơn hàng',
        confirmButtonColor: '#2563eb',
        width: 550
    }).then(() => {
        window.location.href = '../../NguyenNgocHuy_2474802015199/taikhoancanhan/index.html';
    });
}

// Định dạng Card Inputs
function setupCardInputs() {
    const cardInput = document.querySelector('input[placeholder="**** **** **** 4242"]');
    if (cardInput) {
        cardInput.addEventListener("input", e => {
            let value = e.target.value.replace(/\D/g, "");
            value = value.match(/.{1,4}/g)?.join(" ") || "";
            e.target.value = value.substring(0, 19);
        });
    }

    const cvvInput = document.querySelector('input[placeholder="***"]');
    if (cvvInput) {
        cvvInput.addEventListener("input", e => {
            e.target.value = e.target.value.replace(/\D/g, "").substring(0, 3);
        });
    }

    const expInput = document.querySelector('input[placeholder="12/26"]');
    if (expInput) {
        expInput.addEventListener("input", e => {
            let value = e.target.value.replace(/\D/g, "");
            if (value.length >= 3) {
                value = value.substring(0, 2) + "/" + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }
}