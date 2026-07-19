// =============================================
// TechZone-Website/js/main.js
// Logic chính cho trang chủ và trang danh mục
// Sử dụng shared/data.js, shared/auth.js, shared/cart.js
// =============================================

document.addEventListener("DOMContentLoaded", function () {

  // === 1. TRANG DANH MỤC: Render sản phẩm động ===
  var categoryGrid = document.querySelector("main .products");
  if (categoryGrid) {
    // Đây là trang categories.html
    renderCategoryProducts();
    setupCategoryFilters();
  }

  // === 2. TÌM KIẾM ===
  setupSearch();

  // === 3. CẬP NHẬT GIỎ HÀNG BADGE ===
  tz_updateCartBadge();

  // === 4. TRANG CHỦ: Gắn nút "Thêm vào giỏ" cho sản phẩm tĩnh ===
  var homeCards = document.querySelectorAll(".section .products .product-card");
  if (homeCards.length > 0) {
    // Gắn onclick cho từng card trên trang chủ để dẫn đến chi tiết sản phẩm
    homeCards.forEach(function (card, idx) {
      var productId = idx + 1; // Sản phẩm 1-8 theo thứ tự
      var product = TECHZONE_PRODUCTS[idx];
      if (!product) return;

      // Cập nhật giá và link chi tiết
      var detailUrl = "../NguyenNgocHuy_2474802015199/chitietsanpham/index.html?id=" + product.id;

      var images = card.querySelectorAll(".product-image");
      images.forEach(function (img) {
        img.setAttribute("onclick", "location.href='" + detailUrl + "';");
      });

      var names = card.querySelectorAll(".product-name");
      names.forEach(function (name) {
        name.setAttribute("onclick", "location.href='" + detailUrl + "';");
      });
    });
  }

  // === 5. NAV LINK GIỎ HÀNG ===
  var cartNavLinks = document.querySelectorAll("a[href*='gio hang'], a[href*='gio%20hang']");
  cartNavLinks.forEach(function (link) {
    // Đảm bảo link giỏ hàng vẫn hoạt động
  });

  console.log("TechZone main.js loaded");
});

// =============================================
// RENDER SẢN PHẨM TRANG DANH MỤC (categories.html)
// =============================================
function renderCategoryProducts(products) {
  var grid = document.querySelector("main .products");
  if (!grid) return;

  var params = new URLSearchParams(window.location.search);
  var searchQuery = params.get("search");
  var categoryFilter = params.get("category");

  var items = products || TECHZONE_PRODUCTS.slice();

  // Lọc theo search query từ URL
  if (searchQuery && !products) {
    items = searchProducts(searchQuery);
    var title = document.querySelector("main h2");
    if (title) title.textContent = 'Kết quả tìm kiếm: "' + searchQuery + '"';
  }

  // Lọc theo danh mục từ URL
  if (categoryFilter && !products) {
    items = items.filter(function (p) { return p.category === categoryFilter; });
  }

  // Render
  if (items.length === 0) {
    grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:3rem; color:#6B7280;">' +
      '<i class="fa-solid fa-box-open" style="font-size:3rem; margin-bottom:1rem; display:block;"></i>' +
      '<p style="font-size:1.1rem;">Không tìm thấy sản phẩm phù hợp</p></div>';
  } else {
    grid.innerHTML = items.map(function (p) { return renderCategoryCard(p); }).join("");
  }

  // Cập nhật số lượng
  var countSpan = document.querySelector("main p span[style]");
  if (countSpan) countSpan.textContent = items.length;
}

// =============================================
// RENDER 1 CARD SẢN PHẨM CHO TRANG DANH MỤC
// =============================================
function renderCategoryCard(p) {
  var detailUrl = "../NguyenNgocHuy_2474802015199/chitietsanpham/index.html?id=" + p.id;
  var stars = renderStars(p.rating);

  var badgeClass = "badge-new";
  if (p.badge && (p.badge.toLowerCase() === "sale" || p.badge === "Bán chạy" || p.badge === "Hot")) badgeClass = "badge-sale";
  var badgeHTML = p.badge ? '<span class="grid-product-badge ' + badgeClass + '">' + p.badge + '</span>' : "";

  var oldPriceHTML = p.oldPrice
    ? '<span style="font-size:0.85rem; color:var(--text-secondary,#6B7280); text-decoration:line-through;">' + formatPrice(p.oldPrice) + '</span>'
    : "";
  var discountHTML = p.oldPrice
    ? '<span style="font-size:0.75rem; color:#EF4444; font-weight:700;">' + Math.round((1 - p.price / p.oldPrice) * 100) + '% OFF</span>'
    : "";

  var specsHTML = "";
  if (p.specs.CPU) specsHTML += '<span class="specs-tag">' + p.specs.CPU + '</span>';
  if (p.specs.RAM) specsHTML += '<span class="specs-tag">' + p.specs.RAM + '</span>';
  var storage = p.specs["Ổ cứng"] || p.specs["Bộ nhớ"] || "";
  if (storage) specsHTML += '<span class="specs-tag">' + storage + '</span>';

  return '<div class="grid-product-card" data-id="' + p.id + '">' +
    '<div>' +
      '<div class="grid-product-image">' +
        badgeHTML +
        '<button class="heart-btn"><i class="fa-regular fa-heart"></i></button>' +
        '<img src="' + p.image + '" alt="' + p.name + '" onclick="location.href=\'' + detailUrl + '\';" style="cursor:pointer;">' +
      '</div>' +
      '<div style="margin-bottom:1rem;">' +
        '<span style="font-size:0.7rem; color:var(--primary,#2563EB); font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">' + p.brand + '</span>' +
        '<div class="product-rating" style="margin:0.25rem 0;">' + stars +
          '<span style="font-size:0.75rem; color:var(--text-secondary,#6B7280); margin-left:0.25rem;">(' + p.reviewCount + ')</span>' +
        '</div>' +
        '<h3 style="font-size:1rem; font-weight:700; color:var(--text-primary,#111827); margin-bottom:0.5rem; cursor:pointer;" onclick="location.href=\'' + detailUrl + '\';">' + p.name + '</h3>' +
        '<div style="margin-bottom:0.5rem;">' + specsHTML + '</div>' +
      '</div>' +
    '</div>' +
    '<div>' +
      '<div style="display:flex; align-items:baseline; gap:0.5rem; margin-bottom:1rem;">' +
        '<span style="font-size:1.2rem; font-weight:800; color:var(--text-primary,#111827);">' + formatPrice(p.price) + '</span>' +
        oldPriceHTML + ' ' + discountHTML +
      '</div>' +
      '<div style="display:flex; gap:0.5rem;">' +
        '<button class="add-to-cart-btn" onclick="handleAddToCart(' + p.id + ', this);" style="flex:1;"><i class="fa-solid fa-cart-shopping"></i> Thêm vào giỏ</button>' +
        '<button class="eye-btn" onclick="location.href=\'' + detailUrl + '\';"><i class="fa-regular fa-eye"></i></button>' +
      '</div>' +
    '</div>' +
  '</div>';
}

// =============================================
// THÊM VÀO GIỎ HÀNG (global function)
// =============================================
function handleAddToCart(productId, btn) {
  tz_addToCart(productId);
  if (btn) {
    var originalHTML = btn.innerHTML;
    btn.innerHTML = "✓ Đã Thêm";
    btn.style.background = "#10b981";
    btn.style.color = "white";
    setTimeout(function () {
      btn.innerHTML = originalHTML;
      btn.style.background = "";
      btn.style.color = "";
    }, 2000);
  }
}

// =============================================
// BỘ LỌC DANH MỤC (categories.html)
// =============================================
function setupCategoryFilters() {
  // Gắn sự kiện cho tất cả checkbox bộ lọc
  var allCheckboxes = document.querySelectorAll('aside.sidebar input[type="checkbox"]');
  allCheckboxes.forEach(function (cb) {
    cb.addEventListener("change", applyFilters);
  });

  // Gắn sự kiện cho dropdown sắp xếp
  var sortSelect = document.getElementById("sort");
  if (sortSelect) {
    sortSelect.addEventListener("change", applyFilters);
  }

  // Nút "Xác Nhận Lọc"
  var filterBtn = document.querySelector("aside.sidebar .btn-primary");
  if (filterBtn) {
    filterBtn.addEventListener("click", function (e) {
      e.preventDefault();
      applyFilters();
    });
  }

  // Nút "Reset All"
  var resetLink = document.querySelector('aside.sidebar a[href="#"]');
  if (resetLink && resetLink.textContent.trim().includes("Reset")) {
    resetLink.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelectorAll('aside.sidebar input[type="checkbox"]').forEach(function (cb) { cb.checked = false; });
      var minP = document.getElementById("price-min");
      var maxP = document.getElementById("price-max");
      if (minP) minP.value = "";
      if (maxP) maxP.value = "";
      applyFilters();
    });
  }

  // Nav category tabs (Laptops, Điện Thoại, Tablets, Phụ Kiện)
  var navItems = document.querySelectorAll(".cat-nav-item");
  var categoryMap = {
    "Laptops": "laptop",
    "Điện Thoại": "phone",
    "Tablets": "tablet",
    "Phụ Kiện": "accessory"
  };
  navItems.forEach(function (item) {
    item.addEventListener("click", function (e) {
      var text = item.textContent.trim();
      if (text === "Trang Chủ") return; // Cho phép navigate bình thường

      e.preventDefault();
      navItems.forEach(function (n) { n.classList.remove("active"); });
      item.classList.add("active");

      var cat = categoryMap[text];
      if (cat) {
        var filtered = TECHZONE_PRODUCTS.filter(function (p) { return p.category === cat; });
        renderCategoryProducts(filtered);
        // Cập nhật tiêu đề
        var title = document.querySelector("main h2");
        if (title) title.textContent = "Bộ Sưu Tập " + text;
      } else {
        renderCategoryProducts();
      }
    });
  });
}

function applyFilters() {
  var items = TECHZONE_PRODUCTS.slice();

  // 1. Lọc theo search query
  var params = new URLSearchParams(window.location.search);
  var searchQuery = params.get("search");
  if (searchQuery) items = searchProducts(searchQuery);

  // 2. Lọc theo thương hiệu (Brand)
  var checkedBrands = [];
  document.querySelectorAll('input[id^="brand-"]:checked').forEach(function (cb) {
    var label = document.querySelector('label[for="' + cb.id + '"]');
    if (label) checkedBrands.push(label.textContent.trim());
  });
  if (checkedBrands.length > 0) {
    items = items.filter(function (p) {
      return checkedBrands.some(function (b) { return p.brand.toLowerCase() === b.toLowerCase(); });
    });
  }

  // 3. Lọc theo khoảng giá
  var minPriceEl = document.getElementById("price-min");
  var maxPriceEl = document.getElementById("price-max");
  if (minPriceEl && maxPriceEl) {
    var minVal = parseFloat(minPriceEl.value) || 0;
    var maxVal = parseFloat(maxPriceEl.value) || Infinity;
    // Nếu giá trị nhỏ (< 100000) thì nhân lên vì UI dùng đơn vị USD/nghìn đ
    if (minVal > 0 && minVal < 100000) minVal = minVal * 10000;
    if (maxVal > 0 && maxVal < 100000) maxVal = maxVal * 10000;
    items = items.filter(function (p) { return p.price >= minVal && p.price <= maxVal; });
  }

  // 4. Lọc theo Tình trạng hàng
  var availStock = document.getElementById("avail-stock");
  if (availStock && availStock.checked) {
    items = items.filter(function (p) { return p.stock > 0; });
  }

  // 5. Sắp xếp
  var sortSelect = document.getElementById("sort");
  if (sortSelect) {
    var sortVal = sortSelect.value;
    if (sortVal.indexOf("Thấp đến Cao") >= 0) {
      items.sort(function (a, b) { return a.price - b.price; });
    } else if (sortVal.indexOf("Cao đến Thấp") >= 0) {
      items.sort(function (a, b) { return b.price - a.price; });
    } else if (sortVal.indexOf("Mới nhất") >= 0) {
      items.sort(function (a, b) { return b.id - a.id; });
    } else {
      // Featured: sắp xếp theo rating
      items.sort(function (a, b) { return b.rating - a.rating; });
    }
  }

  renderCategoryProducts(items);
}

// =============================================
// TÌM KIẾM
// =============================================
function setupSearch() {
  var searchInputs = document.querySelectorAll('.nav-search-box input, input[placeholder*="Tìm Sản Phẩm"]');
  searchInputs.forEach(function (input) {
    input.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        var query = input.value.trim();
        if (query) {
          var basePath = window.location.pathname.includes("/TechZone-Website/") ? "" : "../TechZone-Website/";
          window.location.href = basePath + "categories.html?search=" + encodeURIComponent(query);
        }
      }
    });
  });

  // Điền lại ô tìm kiếm nếu có query
  var params = new URLSearchParams(window.location.search);
  var q = params.get("search");
  if (q) {
    searchInputs.forEach(function (input) { input.value = q; });
  }
}

// =============================================
// HELPERS
// =============================================
function renderStars(rating) {
  var html = "";
  for (var i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) html += '<i class="fa-solid fa-star" style="color:#FBBF24; font-size:0.8rem;"></i>';
    else if (i - rating < 1) html += '<i class="fa-solid fa-star-half-stroke" style="color:#FBBF24; font-size:0.8rem;"></i>';
    else html += '<i class="fa-regular fa-star" style="color:#FBBF24; font-size:0.8rem;"></i>';
  }
  return html;
}
