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

    // populate the details display
    loadDetails(user);

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

    // log out
    $("#logoutBtn").click(function () {
        sessionStorage.removeItem("ironPeakLoggedIn");
        window.location.href = "../homepage.html";
    });

    // show edit form
    $("#editBtn").click(function () {
        $("#currentDetails").slideUp(300, function () {
            // pre-fill the edit form
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
        $(".input-error").removeClass("input-error");

        var newName = $("#editName").val().trim();
        var newPhone = $("#editPhone").val().trim();
        var newMembership = $("#editMembership").val();
        var newPassword = $("#editPassword").val();
        var confirmPassword = $("#editConfirmPassword").val();

        var errors = [];

        if (newName.length < 3) {
            errors.push("Name must be at least 3 characters.");
            $("#editName").addClass("input-error");
        }

        if (newPhone !== "") {
            var phoneRegex = /^[0-9\s\+]{10,15}$/;
            if (!phoneRegex.test(newPhone)) {
                errors.push("Phone number doesn't look right.");
                $("#editPhone").addClass("input-error");
            }
        }

        // only validate password if they're trying to change it
        if (newPassword !== "") {
            if (newPassword.length < 8) {
                errors.push("Password must be at least 8 characters.");
                $("#editPassword").addClass("input-error");
            }
            if (newPassword !== confirmPassword) {
                errors.push("Passwords don't match.");
                $("#editConfirmPassword").addClass("input-error");
            }
        }

        if (errors.length > 0) {
            showMessage(errors.join("<br>"), "error");
            return;
        }

        // update the user object
        user.name = newName;
        user.phone = newPhone;
        user.membership = newMembership;

        if (newPassword !== "") {
            user.password = newPassword;
        }

        localStorage.setItem("ironPeakUser", JSON.stringify(user));

        showMessage("Details updated successfully!", "success");

        // refresh displayed details and swap back
        setTimeout(function () {
            loadDetails(user);
            $("#editSection").slideUp(300, function () {
                $("#currentDetails").slideDown(300);
                // update welcome name in nav
                $(".nav-welcome").text("Hey, " + user.name.split(" ")[0] + "!");
            });
        }, 1200);
    });


    function loadDetails(u) {
        $("#displayName").text(u.name);
        $("#displayEmail").text(u.email);
        $("#displayPhone").text(u.phone || "Not provided");
        $("#displayDob").text(u.dob || "Not provided");
        $("#displayDate").text(u.createdAt || "—");

        // format membership name nicely
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
