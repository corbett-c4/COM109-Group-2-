$(document).ready(function () {

    // redirect if not logged in
    var loggedIn = sessionStorage.getItem("ironPeakLoggedIn");
    if (loggedIn !== "true") {
        window.location.href = "../signup/signup.html";
        return;
    }

    var user = JSON.parse(localStorage.getItem("ironPeakUser"));

    if (!user) {
        window.location.href = "../signup/signup.html";
        return;
    }

    loadDetails(user);

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
    $("#editPassword").on("keyup", function () {
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

    // log out
    $("#logoutBtn").click(function () {
        sessionStorage.removeItem("ironPeakLoggedIn");
        window.location.href = "../homepage.html";
    });

    // show edit form
    $("#editBtn").click(function () {
        $("#currentDetails").slideUp(300, function () {
            $("#editName").val(user.name);
            $("#editPhone").val(user.phone);
            $("#editMembership").val(user.membership);
            $("#editSection").slideDown(300);
        });
    });

    // cancel editing
    $("#cancelBtn").click(function () {
        $("#editSection").slideUp(300, function () {
            $("#currentDetails").slideDown(300);
        });
    });

    // save changes
    $("#updateForm").submit(function (e) {
        e.preventDefault();
        clearAllErrors();

        var newName = $("#editName").val().trim();
        var newPhone = $("#editPhone").val().trim();
        var newMembership = $("#editMembership").val();
        var newPassword = $("#editPassword").val();
        var confirmPassword = $("#editConfirmPassword").val();

        var errors = [];

        if (newName.length < 3) {
            errors.push("Name must be at least 3 characters.");
            setFieldError($("#editName"), "editName-error", "At least 3 characters.");
        }

        if (newPhone !== "") {
            var phoneRegex = /^[0-9\s\+]{10,15}$/;
            if (!phoneRegex.test(newPhone)) {
                errors.push("Phone number doesn't look right.");
                setFieldError($("#editPhone"), "editPhone-error", "Use 10-15 digits.");
            }
        }

        if (newPassword !== "") {
            if (newPassword.length < 8) {
                errors.push("Password must be at least 8 characters.");
                setFieldError($("#editPassword"), "editPassword-error", "At least 8 characters.");
            }
            if (newPassword !== confirmPassword) {
                errors.push("Passwords don't match.");
                setFieldError($("#editConfirmPassword"), "editConfirmPassword-error", "Doesn't match.");
            }
        }

        if (errors.length > 0) {
            showMessage(errors.join("<br>"), "error");
            // focus first invalid field
            $(".input-error").first().focus();
            return;
        }

        user.name = newName;
        user.phone = newPhone;
        user.membership = newMembership;

        if (newPassword !== "") {
            user.password = newPassword;
        }

        localStorage.setItem("ironPeakUser", JSON.stringify(user));

        showMessage("Details updated successfully!", "success");

        setTimeout(function () {
            loadDetails(user);
            $("#editSection").slideUp(300, function () {
                $("#currentDetails").slideDown(300);
            });
        }, 1200);
    });

    // helpers
    function setFieldError(field, errorId, msg) {
        field.addClass("input-error").attr("aria-invalid", "true");
        $("#" + errorId).text(msg);
    }

    function clearAllErrors() {
        $(".input-error").removeClass("input-error");
        $("[aria-invalid]").attr("aria-invalid", "false");
        $(".field-error").text("");
    }

    function loadDetails(u) {
        $("#displayName").text(u.name);
        $("#displayEmail").text(u.email);
        $("#displayPhone").text(u.phone || "Not provided");
        $("#displayDob").text(u.dob || "Not provided");
        $("#displayDate").text(u.createdAt || "—");

        var membershipNames = {
            "basic": "Basic",
            "premium": "Premium",
            "student": "Student"
        };
        $("#displayMembership").text(membershipNames[u.membership] || u.membership);
    }

    function showMessage(html, type) {
        $("#updateMessage")
            .hide()
            .html(html)
            .removeClass("msg-error msg-success")
            .addClass(type === "error" ? "msg-error" : "msg-success")
            .slideDown(300);
    }

});
