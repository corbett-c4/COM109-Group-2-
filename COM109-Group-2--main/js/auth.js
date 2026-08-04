$(document).ready(function () {

    var loggedIn = sessionStorage.getItem("ironPeakLoggedIn");
    var userData = JSON.parse(localStorage.getItem("ironPeakUser"));

    // work out if we're in a subfolder
    var path = window.location.pathname;
    var prefix = "";

    if (path.includes("/contact/") || path.includes("/signup/") ||
        path.includes("/update/") || path.includes("/supplements/")) {
        prefix = "../";
    }

    // swap Sign Up button for My Account if logged in
    if (loggedIn === "true" && userData) {

        $(".signup-button").each(function () {
            $(this).replaceWith(
                '<a href="' + prefix + 'update/update.html" class="signup-button update-button">My Account</a>'
            );
        });
    }

});
