$(document).ready(function () {
    var membershipNames = {
        basic: "Basic",
        premium: "Premium",
        student: "Student"
    };

    var loggedIn = sessionStorage.getItem("ironPeakLoggedIn") === "true";
    var user = getStoredUser();

    if (loggedIn && user) {
        showMemberAccount();
    }

    function getStoredUser() {
        try {
            return JSON.parse(localStorage.getItem("ironPeakUser"));
        } catch (error) {
            return null;
        }
    }

    function showMemberAccount() {
        $("#guestAccount").prop("hidden", true);
        $("#memberAccount").prop("hidden", false);

        $("#accountNavLink")
            .attr("href", "../update/update.html")
            .text("My Account")
            .addClass("update-button");

        $(".plan-button")
            .attr("href", "../update/update.html")
            .text("Manage Membership");

        updatePlanDisplay(user.membership);
    }

    function updatePlanDisplay(membership) {
        $("#currentPlan").text(membershipNames[membership] || "Not selected");
        $(".plan-card").removeClass("active-plan");
        $('.plan-card[data-plan="' + membership + '"]').addClass("active-plan");
    }
});