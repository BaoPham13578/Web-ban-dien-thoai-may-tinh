// =============================================
// QLISANPHAM / SCRIPT.JS - ADMIN PRODUCT MANAGER
// Quản lý kho hàng: Xem, thêm, sửa, xóa sản phẩm
// Sử dụng shared/data.js, shared/auth.js, shared/cart.js
// =============================================

document.addEventListener("DOMContentLoaded", function () {
    // 1. Kiểm tra quyền Admin
    if (!tz_isAdmin()) {
        alert("Cảnh báo: Bạn không có quyền truy cập trang quản trị!");
        window.location.href = "../NguyenNgocHuy_2474802015199/dangnhap/index.html";
        return;
    }

    // 2. Render danh sách sản phẩm động
    renderProductsTable();

    // 3. Setup các tab danh mục bộ lọc
    setupCategoryTabs();

    // 4. Setup ô tìm kiếm sản phẩm trong kho
    setupProductSearch();

    // 5. Nút bấm "Tạo Thêm Sản Phẩm"
    const addProductBtn = document.querySelector(".btn-primary");
    if (addProductBtn) {
        addProductBtn.addEventListener("click", () => {
            openProductModal(); // Mở modal thêm sản phẩm mới
        });
    }

    // 6. Nút sửa sản phẩm ở Detail Panel
    const editProductBtn = document.querySelector(".panel-icons button");
    if (editProductBtn) {
        editProductBtn.addEventListener("click", () => {
            if (selectedProductId) {
                openProductModal(selectedProductId);
            }
        });
    }

    // 7. Nút xóa sản phẩm ở Detail Panel footer
    const deleteProductBtn = document.querySelector(".panel-footer .btn-icon-square");
    if (deleteProductBtn) {
        deleteProductBtn.addEventListener("click", () => {
            if (selectedProductId) {
                handleDeleteProduct(selectedProductId);
            }
        });
    }

    // 8. Đóng panel chi tiết
    const closePanelBtn = document.getElementById("close-panel");
    if (closePanelBtn) {
        closePanelBtn.addEventListener("click", () => {
            const detailPanel = document.getElementById("detail-panel");
            if (detailPanel) detailPanel.style.display = "none";
        });
    }

    // 9. Inject Modal overlay vào body
    injectModalHTML();
});

let selectedProductId = null;
let activeCategoryFilter = "all";

// =============================================
// RENDER BẢNG SẢN PHẨM
// =============================================
function renderProductsTable(filteredProducts) {
    const tbody = document.getElementById("product-rows");
    if (!tbody) return;

    let list = filteredProducts || [...TECHZONE_PRODUCTS];

    // Lọc theo danh mục active tab
    if (activeCategoryFilter !== "all") {
        list = list.filter(p => p.category === activeCategoryFilter);
    }

    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:3rem; color:#94A3B8;">Không có sản phẩm nào phù hợp</td></tr>`;
        // Cập nhật số lượng hiển thị
        updatePaginationText(0, 0);
        return;
    }

    tbody.innerHTML = list.map(p => {
        const isSelected = selectedProductId === p.id;
        const selectedClass = isSelected ? "selected" : "";
        const checkedAttr = isSelected ? "checked" : "";
        const stockStatus = p.stock > 0 
            ? `<p>Còn ${p.stock} sản phẩm</p>` 
            : `<p style="color:var(--red);">Hết hàng</p>`;
        const statusBadge = p.stock > 0 
            ? `<span class="status-badge active">● Active</span>`
            : `<span class="status-badge out">✕ Out of Stock</span>`;

        return `
            <tr class="product-row ${selectedClass}" data-id="${p.id}" style="cursor: pointer;">
                <td><input type="checkbox" ${checkedAttr} onclick="event.stopPropagation();"></td>
                <td>
                    <div class="cell-product">
                        <img src="${p.image}" alt="${p.name}" style="width:36px; height:36px; object-fit:contain; border-radius:4px; border:1px solid #F1F5F9; background:#F8FAFC;">
                        <div>
                            <strong>${p.brand}</strong>
                            <p style="margin:0; font-size:12px; color:#475569;">${p.name}</p>
                        </div>
                    </div>
                </td>
                <td>
                    <strong>${p.brand.substring(0,3).toUpperCase()}-${p.id}-${p.stock}</strong>
                    <p style="margin:0; text-transform:uppercase;">${getCategoryName(p.category)}</p>
                </td>
                <td>
                    <strong>${formatPrice(p.price)}</strong>
                    ${stockStatus}
                </td>
                <td>${statusBadge}</td>
                <td class="actions">
                    <button class="btn-view-eye" onclick="event.stopPropagation(); selectProductRow(${p.id});"><i class="fa-regular fa-eye"></i></button>
                    <button onclick="event.stopPropagation(); handleDeleteProduct(${p.id});"><i class="fa-regular fa-trash-can"></i></button>
                </td>
            </tr>
        `;
    }).join("");

    // Sự kiện click dòng
    tbody.querySelectorAll(".product-row").forEach(row => {
        row.addEventListener("click", () => {
            const id = parseInt(row.getAttribute("data-id"));
            selectProductRow(id);
        });
    });

    // Cập nhật số lượng hiển thị
    updatePaginationText(list.length, TECHZONE_PRODUCTS.length);
}

function updatePaginationText(currentCount, totalCount) {
    const textEl = document.querySelector(".pagination span");
    if (textEl) {
        textEl.textContent = `Hiển thị 1-${currentCount} trên ${totalCount} sản phẩm`;
    }
}

// Chọn một dòng sản phẩm và mở panel chi tiết
function selectProductRow(id) {
    selectedProductId = id;

    // Cập nhật style bảng
    const tbody = document.getElementById("product-rows");
    tbody.querySelectorAll(".product-row").forEach(row => {
        const rowId = parseInt(row.getAttribute("data-id"));
        if (rowId === id) {
            row.classList.add("selected");
            const cb = row.querySelector('input[type="checkbox"]');
            if (cb) cb.checked = true;
        } else {
            row.classList.remove("selected");
            const cb = row.querySelector('input[type="checkbox"]');
            if (cb) cb.checked = false;
        }
    });

    // Hiển thị panel chi tiết bên phải
    const detailPanel = document.getElementById("detail-panel");
    const p = getProductById(id);
    if (detailPanel && p) {
        document.getElementById("detail-name").textContent = p.name;
        document.getElementById("detail-sub-cat").textContent = getCategoryName(p.category).toUpperCase();
        document.getElementById("detail-price").textContent = formatPrice(p.price);

        const statusEl = document.getElementById("detail-status");
        if (p.stock > 0) {
            statusEl.textContent = "● Active";
            statusEl.className = "text-green";
        } else {
            statusEl.textContent = "✕ Out of Stock";
            statusEl.className = "text-danger";
        }

        document.getElementById("detail-stock").textContent = `${p.stock} sản phẩm còn lại`;
        document.getElementById("detail-sku").textContent = `${p.brand.substring(0,3).toUpperCase()}-${p.id}-${p.stock}`;
        document.getElementById("detail-brand").textContent = p.brand;
        document.getElementById("detail-date").textContent = "18/07/2026";
        document.getElementById("detail-img").src = p.image;

        detailPanel.style.display = "flex";
    }
}

// Xử lý Xóa sản phẩm
function handleDeleteProduct(id) {
    const p = getProductById(id);
    if (!p) return;

    if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${p.name}" khỏi hệ thống TechZone?`)) {
        const newList = TECHZONE_PRODUCTS.filter(item => item.id !== id);
        tz_saveProductsDb(newList);
        
        // Reset selected ID nếu bị xóa
        if (selectedProductId === id) {
            selectedProductId = null;
            const detailPanel = document.getElementById("detail-panel");
            if (detailPanel) detailPanel.style.display = "none";
        }

        renderProductsTable();
        alert("Đã xóa sản phẩm thành công!");
    }
}

// =============================================
// TÌM KIẾM SẢN PHẨM & LỌC DANH MỤC
// =============================================
function setupCategoryTabs() {
    const tabs = document.querySelectorAll(".category-tabs .tab");
    const categoryMapping = {
        "Tất Cả Sản Phẩm": "all",
        "Máy Tính Xách Tay": "laptop",
        "Máy Tính Để Bàn": "desktop",
        "Điện Thoại": "phone",
        "Tablet": "tablet"
    };

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            
            activeCategoryFilter = categoryMapping[tab.textContent.trim()] || "all";
            renderProductsTable();
        });
    });
}

function setupProductSearch() {
    const searchInput = document.querySelector(".input-search input");
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            const query = searchInput.value.trim();
            const results = searchProducts(query);
            renderProductsTable(results);
        });
    }
}

// =============================================
// MODAL THÊM / SỬA SẢN PHẨM (INJECTED DYNAMICALLY)
// =============================================
function injectModalHTML() {
    const modalHTML = `
        <div id="product-editor-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:99999; align-items:center; justify-content:center; font-family:'Inter', sans-serif;">
            <div style="background:white; width:90%; max-width:600px; border-radius:12px; padding:24px; box-shadow:0 10px 25px rgba(0,0,0,0.15); display:flex; flex-direction:column; max-height:85vh;">
                <div style="display:flex; justify-content:between; align-items:center; border-bottom:1px solid #E5E7EB; padding-bottom:12px; margin-bottom:16px;">
                    <h3 id="modal-title" style="font-size:18px; font-weight:700; margin:0; color:#1F2937;">Tạo Thêm Sản Phẩm Mới</h3>
                    <button id="close-editor-modal" style="background:none; border:none; font-size:20px; cursor:pointer; color:#9CA3AF;"><i class="fa-solid fa-xmark"></i></button>
                </div>
                
                <div style="overflow-y:auto; flex:1; padding-right:8px; display:flex; flex-direction:column; gap:12px;">
                    <div>
                        <label style="display:block; font-size:12px; font-weight:600; color:#4B5563; margin-bottom:4px;">Tên sản phẩm *</label>
                        <input id="m-prod-name" type="text" style="width:100%; padding:8px 12px; border:1px solid #D1D5DB; border-radius:6px; font-size:13px;" placeholder="Ví dụ: iPhone 15 Pro Max">
                    </div>
                    
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                        <div>
                            <label style="display:block; font-size:12px; font-weight:600; color:#4B5563; margin-bottom:4px;">Thương hiệu *</label>
                            <input id="m-prod-brand" type="text" style="width:100%; padding:8px 12px; border:1px solid #D1D5DB; border-radius:6px; font-size:13px;" placeholder="Ví dụ: Apple, Samsung">
                        </div>
                        <div>
                            <label style="display:block; font-size:12px; font-weight:600; color:#4B5563; margin-bottom:4px;">Danh mục *</label>
                            <select id="m-prod-category" style="width:100%; padding:8px 12px; border:1px solid #D1D5DB; border-radius:6px; font-size:13px; background:white;">
                                <option value="phone">Điện thoại</option>
                                <option value="laptop">Laptop</option>
                                <option value="tablet">Máy tính bảng</option>
                                <option value="smartwatch">Đồng hồ thông minh</option>
                                <option value="accessory">Phụ kiện</option>
                                <option value="desktop">Máy tính để bàn</option>
                            </select>
                        </div>
                    </div>

                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                        <div>
                            <label style="display:block; font-size:12px; font-weight:600; color:#4B5563; margin-bottom:4px;">Giá bán (đ) *</label>
                            <input id="m-prod-price" type="number" style="width:100%; padding:8px 12px; border:1px solid #D1D5DB; border-radius:6px; font-size:13px;" placeholder="Ví dụ: 30990000">
                        </div>
                        <div>
                            <label style="display:block; font-size:12px; font-weight:600; color:#4B5563; margin-bottom:4px;">Số lượng tồn kho *</label>
                            <input id="m-prod-stock" type="number" style="width:100%; padding:8px 12px; border:1px solid #D1D5DB; border-radius:6px; font-size:13px;" placeholder="Ví dụ: 10">
                        </div>
                    </div>

                    <div>
                        <label style="display:block; font-size:12px; font-weight:600; color:#4B5563; margin-bottom:4px;">Đường dẫn ảnh sản phẩm URL</label>
                        <input id="m-prod-image" type="text" style="width:100%; padding:8px 12px; border:1px solid #D1D5DB; border-radius:6px; font-size:13px;" placeholder="Dán link ảnh từ Unsplash hoặc để trống sẽ dùng ảnh mặc định">
                    </div>

                    <div>
                        <label style="display:block; font-size:12px; font-weight:600; color:#4B5563; margin-bottom:4px;">Mô tả sản phẩm *</label>
                        <textarea id="m-prod-desc" rows="3" style="width:100%; padding:8px 12px; border:1px solid #D1D5DB; border-radius:6px; font-size:13px; resize:vertical;" placeholder="Mô tả tóm tắt tính năng sản phẩm..."></textarea>
                    </div>
                </div>

                <div style="display:flex; justify-content:end; gap:10px; border-top:1px solid #E5E7EB; padding-top:16px; margin-top:16px;">
                    <button id="cancel-editor-modal" style="background:#E5E7EB; color:#374151; border:none; padding:10px 18px; border-radius:6px; font-size:13px; font-weight:600; cursor:pointer;">Đóng</button>
                    <button id="save-product-btn" style="background:#2563EB; color:white; border:none; padding:10px 18px; border-radius:6px; font-size:13px; font-weight:600; cursor:pointer;">Lưu Sản Phẩm</button>
                </div>
            </div>
        </div>
    `;
    const div = document.createElement("div");
    div.innerHTML = modalHTML;
    document.body.appendChild(div.firstElementChild);

    // Đăng ký sự kiện đóng modal
    const modal = document.getElementById("product-editor-modal");
    const closeBtn = document.getElementById("close-editor-modal");
    const cancelBtn = document.getElementById("cancel-editor-modal");

    const closeModal = () => modal.style.display = "none";
    closeBtn.addEventListener("click", closeModal);
    cancelBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });

    // Sự kiện lưu sản phẩm
    document.getElementById("save-product-btn").addEventListener("click", handleSaveProduct);
}

let editingProductId = null;

function openProductModal(productId = null) {
    editingProductId = productId;
    const modal = document.getElementById("product-editor-modal");
    const titleEl = document.getElementById("modal-title");

    // Fields
    const nameEl = document.getElementById("m-prod-name");
    const brandEl = document.getElementById("m-prod-brand");
    const catEl = document.getElementById("m-prod-category");
    const priceEl = document.getElementById("m-prod-price");
    const stockEl = document.getElementById("m-prod-stock");
    const imgEl = document.getElementById("m-prod-image");
    const descEl = document.getElementById("m-prod-desc");

    if (productId) {
        // Edit mode
        titleEl.textContent = "Chỉnh Sửa Thông Tin Sản Phẩm";
        const p = getProductById(productId);
        if (p) {
            nameEl.value = p.name;
            brandEl.value = p.brand;
            catEl.value = p.category;
            priceEl.value = p.price;
            stockEl.value = p.stock;
            imgEl.value = p.image;
            descEl.value = p.description || "";
        }
    } else {
        // Add mode
        titleEl.textContent = "Tạo Thêm Sản Phẩm Mới";
        nameEl.value = "";
        brandEl.value = "";
        catEl.value = "phone";
        priceEl.value = "";
        stockEl.value = "";
        imgEl.value = "";
        descEl.value = "";
    }

    modal.style.display = "flex";
}

function handleSaveProduct() {
    const name = document.getElementById("m-prod-name").value.trim();
    const brand = document.getElementById("m-prod-brand").value.trim();
    const category = document.getElementById("m-prod-category").value;
    const price = parseInt(document.getElementById("m-prod-price").value);
    const stock = parseInt(document.getElementById("m-prod-stock").value);
    const image = document.getElementById("m-prod-image").value.trim() || "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=500";
    const description = document.getElementById("m-prod-desc").value.trim();

    const finalDescription = description || "Sản phẩm chất lượng cao từ TechZone.";

    if (!name || !brand || isNaN(price) || isNaN(stock)) {
        alert("Vui lòng điền đầy đủ tất cả các trường bắt buộc (Tên, Thương hiệu, Giá bán, Số lượng)");
        return;
    }

    let newList = [...TECHZONE_PRODUCTS];

    if (editingProductId) {
        // Cập nhật sản phẩm cũ
        const idx = newList.findIndex(item => item.id === editingProductId);
        if (idx !== -1) {
            newList[idx] = {
                ...newList[idx],
                name, brand, category, price, stock, image, description: finalDescription
            };
            alert("Đã cập nhật sản phẩm thành công!");
        }
    } else {
        // Tạo sản phẩm mới
        const newId = newList.length > 0 ? Math.max(...newList.map(p => p.id)) + 1 : 1;
        const newProduct = {
            id: newId,
            name,
            brand,
            category,
            price,
            oldPrice: null,
            image,
            images: [image],
            rating: 5.0,
            reviewCount: 1,
            stock,
            badge: "Mới",
            description: finalDescription,
            specs: {
                "Thương hiệu": brand,
                "Bảo hành": "12 tháng"
            }
        };
        newList.push(newProduct);
        alert("Đã thêm sản phẩm mới thành công!");
    }

    tz_saveProductsDb(newList);
    document.getElementById("product-editor-modal").style.display = "none";
    renderProductsTable();

    // Rerender lại dòng vừa sửa/thêm
    if (editingProductId) {
        selectProductRow(editingProductId);
    }
}

// Helpers
function getCategoryName(cat) {
    const names = {
        phone: "Điện thoại", laptop: "Laptop", tablet: "Máy tính bảng",
        headphone: "Tai nghe", smartwatch: "Đồng hồ thông minh",
        accessory: "Phụ kiện", desktop: "Máy tính để bàn"
    };
    return names[cat] || cat;
}