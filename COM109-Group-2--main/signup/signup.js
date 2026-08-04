$(document).ready(function () {

    // toggle password visibility
    $(".toggle-password").on("click keydown", function (e) {
        if (e.type === "keydown" && e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();

        var targetId = $(this).data("target");
        var input = $("#" + targetId);

        if (input.attr("type") === "password") {
            input.attr("type", "text");
            $(this).text("👁‍🗨");
        } else {
            input.attr("type", "password");
            $(this).text("👁");
        }
    });

    // password strength meter
    $("#password").on("keyup", function () {
        var val = $(this).val();
        var strength = getPasswordStrength(val);

        $(".strength-fill").css("width", strength.percent + "%")
                           .css("background", strength.color);
        $(".strength-text").text(strength.label).css("color", strength.color);
    });

    function getPasswordStrength(password) {
        var score = 0;

        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        if (score <= 1) return { percent: 20, color: "#cc0000", label: "Weak" };
        if (score === 2) return { percent: 40, color: "#ff6600", label: "Fair" };
        if (score === 3) return { percent: 60, color: "#ffcc00", label: "Okay" };
        if (score === 4) return { percent: 80, color: "#99cc00", label: "Strong" };
        return { percent: 100, color: "#28a745", label: "Very Strong" };
    }

    // real-time validation on blur
    $("#fullName").on("blur", function () {
        var val = $(this).val().trim();
        if (val.length > 0 && val.length < 3) {
            setFieldError($(this), "fullName-error", "Name must be at least 3 characters.");
        } else {
            clearFieldError($(this), "fullName-error");
        }
    });

    $("#email").on("blur", function () {
        var val = $(this).val().trim();
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (val.length > 0 && !emailRegex.test(val)) {
            setFieldError($(this), "email-error", "Please enter a valid email.");
        } else {
            clearFieldError($(this), "email-error");
        }
    });

    $("#phone").on("blur", function () {
        var val = $(this).val().trim();
        var phoneRegex = /^[0-9\s\+]{10,15}$/;
        if (val !== "" && !phoneRegex.test(val)) {
            setFieldError($(this), "phone-error", "Use 10-15 digits.");
        } else {
            clearFieldError($(this), "phone-error");
        }
    });

    $("#confirmPassword").on("blur", function () {
        if ($(this).val() !== "" && $(this).val() !== $("#password").val()) {
            setFieldError($(this), "confirmPassword-error", "Passwords don't match.");
        } else {
            clearFieldError($(this), "confirmPassword-error");
        }
    });

    // Sign Up form submission
    $("#signupForm").submit(function (e) {
        e.preventDefault();
        clearAllErrors();

        var name = $("#fullName").val().trim();
        var email = $("#email").val().trim();
        var phone = $("#phone").val().trim();
        var dob = $("#dob").val();
        var membership = $("#membership").val();
        var password = $("#password").val();
        var confirmPassword = $("#confirmPassword").val();

        var errors = [];

        if (name.length < 3) {
            errors.push("Please enter your full name (at least 3 characters).");
            setFieldError($("#fullName"), "fullName-error", "At least 3 characters.");
        }

        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.push("Please enter a valid email address.");
            setFieldError($("#email"), "email-error", "Invalid email format.");
        }

        if (phone !== "") {
            var phoneRegex = /^[0-9\s\+]{10,15}$/;
            if (!phoneRegex.test(phone)) {
                errors.push("Phone number doesn't look right. Use 10-15 digits.");
                setFieldError($("#phone"), "phone-error", "Use 10-15 digits.");
            }
        }

        if (!dob) {
            errors.push("Please enter your date of birth.");
            setFieldError($("#dob"), "dob-error", "Required.");
        } else {
            var birthDate = new Date(dob);
            var today = new Date();
            var age = today.getFullYear() - birthDate.getFullYear();
            var monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            if (age < 16) {
                errors.push("You must be at least 16 years old to join.");
                setFieldError($("#dob"), "dob-error", "Must be 16+.");
            }
        }

        if (!membership) {
            errors.push("Please select a membership type.");
            setFieldError($("#membership"), "membership-error", "Choose a plan.");
        }

        if (password.length < 8) {
            errors.push("Password must be at least 8 characters.");
            setFieldError($("#password"), "password-error", "At least 8 characters.");
        }

        if (password !== confirmPassword) {
            errors.push("Passwords do not match.");
            setFieldError($("#confirmPassword"), "confirmPassword-error", "Doesn't match.");
        }

        var existingUser = JSON.parse(localStorage.getItem("ironPeakUser"));
        if (existingUser && existingUser.email === email && errors.length === 0) {
            errors.push("An account with this email already exists. Try logging in.");
        }

        if (errors.length > 0) {
            showMessage("#formMessage", errors.join("<br>"), "error");
            // focus first invalid field
            $(".input-error").first().focus();
            return;
        }

        var user = {
            name: name,
            email: email,
            phone: phone,
            dob: dob,
            membership: membership,
            password: password,
            createdAt: new Date().toLocaleString()
        };

        localStorage.setItem("ironPeakUser", JSON.stringify(user));
        sessionStorage.setItem("ironPeakLoggedIn", "true");

        showMessage("#formMessage", "Account created! Redirecting...", "success");

        setTimeout(function () {
            window.location.href = "../homepage.html";
        }, 1500);
    });


    // Login form submission
    $("#loginForm").submit(function (e) {
        e.preventDefault();
        clearAllErrors();

        var email = $("#loginEmail").val().trim();
        var password = $("#loginPassword").val();

        var storedUser = JSON.parse(localStorage.getItem("ironPeakUser"));

        if (!storedUser) {
            showMessage("#loginMessage", "No account found. Please sign up first.", "error");
            return;
        }

        if (storedUser.email !== email || storedUser.password !== password) {
            showMessage("#loginMessage", "Incorrect email or password.", "error");
            return;
        }

        sessionStorage.setItem("ironPeakLoggedIn", "true");
        showMessage("#loginMessage", "Welcome back, " + storedUser.name.split(" ")[0] + "! Redirecting...", "success");

        setTimeout(function () {
            window.location.href = "../homepage.html";
        }, 1500);
    });


    // helpers
    function setFieldError(field, errorId, msg) {
        field.addClass("input-error").attr("aria-invalid", "true");
        $("#" + errorId).text(msg);
    }

    function clearFieldError(field, errorId) {
        field.removeClass("input-error").attr("aria-invalid", "false");
        $("#" + errorId).text("");
    }

    function clearAllErrors() {
        $(".input-error").removeClass("input-error");
        $("[aria-invalid]").attr("aria-invalid", "false");
        $(".field-error").text("");
    }

    function showMessage(selector, html, type) {
        $(selector)
            .hide()
            .html(html)
            .removeClass("msg-error msg-success")
            .addClass(type === "error" ? "msg-error" : "msg-success")
            .slideDown(300);
    }

});
