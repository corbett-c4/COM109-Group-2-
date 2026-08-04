$(document).ready(function () {

    // toggle password visibility
    $(".toggle-password").click(function () {
        var targetId = $(this).data("target");
        var input = $("#" + targetId);

        if (input.attr("type") === "password") {
            input.attr("type", "text");
            $(this).text("🙈");
        } else {
            input.attr("type", "password");
            $(this).text("👁");
        }
    });

    // Sign Up form submission
    $("#signupForm").submit(function (e) {
        e.preventDefault();

        // clear previous errors
        $(".input-error").removeClass("input-error");

        var name = $("#fullName").val().trim();
        var email = $("#email").val().trim();
        var phone = $("#phone").val().trim();
        var dob = $("#dob").val();
        var membership = $("#membership").val();
        var password = $("#password").val();
        var confirmPassword = $("#confirmPassword").val();

        var errors = [];

        // name
        if (name.length < 3) {
            errors.push("Please enter your full name (at least 3 characters).");
            $("#fullName").addClass("input-error");
        }

        // email
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.push("Please enter a valid email address.");
            $("#email").addClass("input-error");
        }

        // phone (optional but validate if entered)
        if (phone !== "") {
            var phoneRegex = /^[0-9\s\+]{10,15}$/;
            if (!phoneRegex.test(phone)) {
                errors.push("Phone number doesn't look right. Use 10-15 digits.");
                $("#phone").addClass("input-error");
            }
        }

        // date of birth - must be at least 16
        if (!dob) {
            errors.push("Please enter your date of birth.");
            $("#dob").addClass("input-error");
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
                $("#dob").addClass("input-error");
            }
        }

        // membership
        if (!membership) {
            errors.push("Please select a membership type.");
            $("#membership").addClass("input-error");
        }

        // password
        if (password.length < 8) {
            errors.push("Password must be at least 8 characters.");
            $("#password").addClass("input-error");
        }

        if (password !== confirmPassword) {
            errors.push("Passwords do not match.");
            $("#confirmPassword").addClass("input-error");
        }

        // check if email already taken
        var existingUser = JSON.parse(localStorage.getItem("ironPeakUser"));
        if (existingUser && existingUser.email === email && errors.length === 0) {
            errors.push("An account with this email already exists. Try logging in.");
        }

        // show errors or save
        if (errors.length > 0) {
            showMessage("#formMessage", errors.join("<br>"), "error");
            return;
        }

        // save to localStorage
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

        // auto log in
        sessionStorage.setItem("ironPeakLoggedIn", "true");

        showMessage("#formMessage", "Account created! Redirecting...", "success");

        // redirect after a moment
        setTimeout(function () {
            window.location.href = "../homepage.html";
        }, 1500);
    });


    // Login form submission
    $("#loginForm").submit(function (e) {
        e.preventDefault();

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

        // success - set session
        sessionStorage.setItem("ironPeakLoggedIn", "true");
        showMessage("#loginMessage", "Welcome back, " + storedUser.name.split(" ")[0] + "! Redirecting...", "success");

        setTimeout(function () {
            window.location.href = "../homepage.html";
        }, 1500);
    });


    // helper to show messages
    function showMessage(selector, html, type) {
        $(selector)
            .hide()
            .html(html)
            .removeClass("msg-error msg-success")
            .addClass(type === "error" ? "msg-error" : "msg-success")
            .slideDown(300);
    }

});
