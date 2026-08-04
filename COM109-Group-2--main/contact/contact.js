$(document).ready(function () {


    /* ==============================
       CHARACTER COUNTER
    ============================== */

    $("#message").on("keyup", function () {

        let length = $(this).val().length;

        $("#characterCount").text(
            length + " / 500 characters"
        );

    });



    /* ==============================
       FAQ ACCORDION
    ============================== */

    $(".faq-question").click(function () {

        $(this)
            .next(".faq-answer")
            .slideToggle();

    });



    /* ==============================
       CONTACT FORM VALIDATION
    ============================== */

    $("#contactForm").submit(function (event) {


        event.preventDefault();


        let name = $("#name").val().trim();

        let email = $("#email").val().trim();

        let phone = $("#phone").val().trim();

        let message = $("#message").val().trim();

        let membership = $("#membership").val();

        let reason = $("#reason").val();



        let errors = [];



        // Name validation

        if (name.length < 3) {

            errors.push(
                "Please enter your full name."
            );

        }



        // Email validation

        let emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailPattern.test(email)) {

            errors.push(
                "Please enter a valid email address."
            );

        }



        // Phone validation

        if (phone !== "") {

            let phonePattern =
            /^[0-9\s]{10,15}$/;


            if (!phonePattern.test(phone)) {

                errors.push(
                    "Please enter a valid phone number."
                );

            }

        }



        // Message validation

        if (message.length < 10) {

            errors.push(
                "Your message must be at least 10 characters."
            );

        }



        /* ==============================
           DISPLAY ERRORS
        ============================== */


        if (errors.length > 0) {


            $("#successMessage")
                .hide()
                .html(
                    errors.join("<br>")
                )
                .css({

                    "background": "rgba(204,0,0,.2)",

                    "border-left":
                    "5px solid #cc0000",

                    "color":
                    "#ff6666"

                })
                .slideDown();


            return;


        }



        /* ==============================
           SAVE DATA TO LOCAL STORAGE
        ============================== */


        let contactDetails = {


            name: name,

            email: email,

            phone: phone,

            membership: membership,

            reason: reason,

            message: message,

            newsletter:
            $("#newsletter").is(":checked"),


            date:
            new Date().toLocaleString()


        };



        localStorage.setItem(

            "ironPeakContact",

            JSON.stringify(contactDetails)

        );



        /* ==============================
           SUCCESS MESSAGE
        ============================== */


        $("#successMessage")
            .hide()
            .html(
                "Thank you for contacting Iron Peak Fitness. We will get back to you soon!"
            )
            .css({

                "background":
                "rgba(40,167,69,.2)",

                "border-left":
                "5px solid #28a745",

                "color":
                "#66ff66"

            })
            .slideDown();



        // Reset form

        $("#contactForm")[0].reset();


        $("#characterCount")
            .text("0 / 500 characters");


    });



    /* ==============================
       LEAFLET MAP
    ============================== */


    const gymLocation =
    [54.5973, -5.9301];


    const map =
    L.map("map")
    .setView(gymLocation, 14);



    L.tileLayer(

        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",

        {

            maxZoom: 20,

            subdomains:
            "abcd",

            attribution:
            "&copy; OpenStreetMap contributors &copy; CARTO"

        }

    ).addTo(map);



    L.marker(gymLocation)

        .addTo(map)

        .bindPopup(

            "<strong>Iron Peak Fitness</strong><br>123 Fitness Street, Belfast"

        )

        .openPopup();



});