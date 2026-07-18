// =============================================
// DANGNHAP / SCRIPT.JS - Đăng nhập & Đăng ký thực sự
// Sử dụng shared/auth.js để xác thực
// =============================================

document.addEventListener("DOMContentLoaded", function () {

  // --- Toggle hiện/ẩn mật khẩu ---
  const eye = document.getElementById("eye");
  const passwordInput = document.getElementById("password");

  if (eye && passwordInput) {
    eye.onclick = function () {
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        eye.classList.replace("fa-eye", "fa-eye-slash");
      } else {
        passwordInput.type = "password";
        eye.classList.replace("fa-eye-slash", "fa-eye");
      }
    };
  }

  // --- Trạng thái đăng nhập / đăng ký ---
  let isLoginMode = true;

  // --- Gắn sự kiện cho link "Đăng ký miễn phí" / "Đăng nhập ngay" ---
  function setupSwitchBtn() {
    const switchBtns = document.querySelectorAll(".switch-mode");
    switchBtns.forEach(function (btn) {
      btn.onclick = function (e) {
        e.preventDefault();
        toggleMode();
      };
    });
  }

  // Gắn lần đầu (DOM đã sẵn sàng)
  setupSwitchBtn();

  // --- Chuyển đổi giữa Đăng nhập / Đăng ký ---
  function toggleMode() {
    isLoginMode = !isLoginMode;

    var titleEl = document.querySelector(".login-card h1");
    var btnEl = document.querySelector(".login-btn");
    var nameGroup = document.getElementById("name-group");
    var signupPara = document.querySelector(".signup");
    var hintP = document.querySelector(".login-card p");

    // Cập nhật tiêu đề
    if (titleEl) titleEl.textContent = isLoginMode ? "Đăng nhập" : "Tạo tài khoản";

    // Cập nhật nút chính
    if (btnEl) btnEl.textContent = isLoginMode ? "Đăng nhập" : "Đăng ký ngay";

    // Hiện / ẩn ô "Họ và tên"
    if (nameGroup) nameGroup.style.display = isLoginMode ? "none" : "block";

    // Ẩn / hiện hint text
    if (hintP) hintP.style.display = isLoginMode ? "block" : "none";

    // Ẩn / hiện hint test box
    var hintBox = document.getElementById("test-hint");
    if (hintBox) hintBox.style.display = isLoginMode ? "block" : "none";

    // Ẩn / hiện "Ghi nhớ 30 ngày" và "Quên mật khẩu"
    var optionDiv = document.querySelector(".option");
    if (optionDiv) optionDiv.style.display = isLoginMode ? "flex" : "none";

    // Xóa giá trị mặc định khi chuyển sang đăng ký
    if (!isLoginMode) {
      var emailInput = document.querySelector("input[type=email]");
      if (emailInput && emailInput.value === "admin@techzone.vn") {
        emailInput.value = "";
      }
      if (passwordInput && passwordInput.value === "123456") {
        passwordInput.value = "";
      }
    }

    // Cập nhật link toggle ở cuối form
    if (signupPara) {
      signupPara.innerHTML = isLoginMode
        ? 'Chưa có tài khoản? <a href="#" class="switch-mode">Đăng ký miễn phí</a>'
        : 'Đã có tài khoản? <a href="#" class="switch-mode">Đăng nhập ngay</a>';
      // Gắn lại sự kiện cho link mới
      setupSwitchBtn();
    }
  }

  // --- Xử lý nút Đăng nhập / Đăng ký ---
  var loginBtn = document.querySelector(".login-btn");

  if (loginBtn) {
    loginBtn.onclick = function () {
      var emailInput = document.querySelector("input[type=email]");
      var email = emailInput ? emailInput.value.trim() : "";
      var pass = passwordInput ? passwordInput.value : "";

      if (!email || !pass) {
        alert("Vui lòng nhập đầy đủ Email và Mật khẩu!");
        return;
      }

      if (!isLoginMode) {
        // === CHẾ ĐỘ ĐĂNG KÝ ===
        var nameInput = document.getElementById("full-name");
        var name = nameInput ? nameInput.value.trim() : "";

        if (!name) {
          alert("Vui lòng nhập họ và tên của bạn!");
          return;
        }

        if (pass.length < 6) {
          alert("Mật khẩu phải có ít nhất 6 ký tự!");
          return;
        }

        var result = tz_register(name, email, pass);
        if (!result.success) {
          alert(result.message);
          return;
        }

        // Tự động đăng nhập sau khi đăng ký
        tz_login(email, pass);
        alert("🎉 Tạo tài khoản thành công! Chào mừng " + name + " đến với TechZone!");
        window.location.href = "../../TechZone-Website/index.html";

      } else {
        // === CHẾ ĐỘ ĐĂNG NHẬP ===
        var result = tz_login(email, pass);
        if (!result.success) {
          alert("❌ " + result.message);
          return;
        }

        alert("✅ Đăng nhập thành công! Xin chào " + result.user.name);

        if (result.user.role === "admin") {
          window.location.href = "../../p11/index.html";
        } else {
          window.location.href = "../taikhoancanhan/index.html";
        }
      }
    };
  }

  // --- Hint tài khoản test (nhỏ gọn, đặt trước nút login) ---
  var hint = document.createElement("div");
  hint.id = "test-hint";
  hint.style.cssText = "background:#f0f9ff; border:1px solid #bae6fd; border-radius:8px; padding:8px 12px; margin-bottom:12px; font-size:0.75rem; color:#0369a1; line-height:1.5;";
  hint.innerHTML = '💡 Test: <b>admin@techzone.vn</b> / <b>admin123</b>';
  var formArea = document.querySelector(".login-btn");
  if (formArea && formArea.parentElement) {
    formArea.parentElement.insertBefore(hint, formArea);
  }
});