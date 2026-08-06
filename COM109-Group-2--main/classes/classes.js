$(document).ready(function () {
    var loggedIn = sessionStorage.getItem("ironPeakLoggedIn") === "true";
    var user = getStoredUser();

    if (loggedIn && user) {
        $("#accountNavLink")
            .attr("href", "../update/update.html")
            .text("My Account")
            .addClass("update-button");

        $("#myBookings").prop("hidden", false);
        renderBookings();
    }

    $(".filter-button").click(function () {
        var level = $(this).data("level");

        $(".filter-button").removeClass("active-filter");
        $(this).addClass("active-filter");

        $(".class-card").each(function () {
            if (level === "all" || $(this).data("level") === level) {
                $(this).fadeIn(250);
            } else {
                $(this).hide();
            }
        });
    });

    $(".book-button").click(function () {
        var button = $(this);
        var className = button.data("class");

        if (!loggedIn || !user) {
            showBookingMessage("Please sign up or log in before booking a class.", true);
            return;
        }

        var bookings = getBookings();
        if (bookings.includes(className)) {
            showBookingMessage(className + " is already in your bookings.", false);
            return;
        }

        bookings.push(className);
        localStorage.setItem("ironPeakBookings", JSON.stringify(bookings));
        button.text("Booked ✓").addClass("booked");
        renderBookings();
        showBookingMessage(className + " has been added to your bookings.", false);
    });

    $("#bookingsList").on("click", ".cancel-booking", function () {
        var className = $(this).data("class");
        var bookings = getBookings().filter(function (booking) {
            return booking !== className;
        });

        localStorage.setItem("ironPeakBookings", JSON.stringify(bookings));
        $('.book-button[data-class="' + className + '"]')
            .text("Book Class")
            .removeClass("booked");

        renderBookings();
        showBookingMessage(className + " has been cancelled.", false);
    });

    function getStoredUser() {
        try {
            return JSON.parse(localStorage.getItem("ironPeakUser"));
        } catch (error) {
            return null;
        }
    }

    function getBookings() {
        try {
            return JSON.parse(localStorage.getItem("ironPeakBookings")) || [];
        } catch (error) {
            return [];
        }
    }

    function renderBookings() {
        var bookings = getBookings();
        var list = $("#bookingsList").empty();

        $("#noBookings").prop("hidden", bookings.length > 0);

        $(".book-button").each(function () {
            var isBooked = bookings.includes($(this).data("class"));
            $(this)
                .toggleClass("booked", isBooked)
                .text(isBooked ? "Booked ✓" : "Book Class");
        });

        bookings.forEach(function (className) {
            var item = $("<li>").addClass("booking-item");
            var name = $("<span>").addClass("booking-name").text(className);
            var cancelButton = $("<button>")
                .attr("type", "button")
                .addClass("cancel-booking")
                .data("class", className)
                .text("Cancel Booking");

            item.append(name, cancelButton);
            list.append(item);
        });
    }

    function showBookingMessage(message, isError) {
        $("#bookingMessage")
            .stop(true, true)
            .hide()
            .text(message)
            .toggleClass("booking-error", isError)
            .slideDown(250);
    }
});