$(document).ready(function () {

    // Accordion toggle
    $(".accordion-btn").click(function () {
        var content = $(this).next(".accordion-content");
        var isOpen = $(this).attr("aria-expanded") === "true";

        // close all others
        $(".accordion-btn").attr("aria-expanded", "false");
        $(".accordion-content").slideUp(300).attr("aria-hidden", "true");

        // toggle clicked one
        if (!isOpen) {
            $(this).attr("aria-expanded", "true");
            content.slideDown(300).attr("aria-hidden", "false");
        }
    });

    // keyboard support for accordion
    $(".accordion-btn").keydown(function (e) {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            $(this).click();
        }
    });

    // Flip cards on click
    $(".flip-card").click(function () {
        $(this).toggleClass("flipped");
    });

    // keyboard support for flip cards
    $(".flip-card").keydown(function (e) {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            $(this).toggleClass("flipped");
        }
    });

});
