$(document).ready(function () {


    /* ==============================
       LOAD BASKET FROM LOCAL STORAGE
    ============================== */


    let basket = JSON.parse(
        localStorage.getItem("ironPeakBasket")
    ) || [];


    updateBasketCount();



    /* ==============================
       SEARCH FUNCTION
    ============================== */


    $("#searchBar").on("keyup", function () {


        let searchValue = $(this)
            .val()
            .toLowerCase();



        $(".product-card").each(function () {


            let productName = $(this)
                .find("h3")
                .text()
                .toLowerCase();



            if(productName.includes(searchValue)) {


                $(this).fadeIn();


            } else {


                $(this).fadeOut();


            }


        });


    });





    /* ==============================
       CATEGORY FILTER
    ============================== */


    $(".filter-btn").click(function () {


        let category =
        $(this).data("category");



        $(".product-card").each(function () {


            let productCategory =
            $(this).data("category");



            if(category === "All" ||
               productCategory === category) {


                $(this).fadeIn();


            } else {


                $(this).fadeOut();


            }


        });


    });





    /* ==============================
       ADD TO BASKET
    ============================== */


    $(".add-btn").click(function () {


        let product =
        $(this).data("product");



        basket.push(product);



        localStorage.setItem(

            "ironPeakBasket",

            JSON.stringify(basket)

        );



        updateBasketCount();



        $(this)
            .text("Added ✓")
            .css(
                "background",
                "#28a745"
            );



        setTimeout(() => {


            $(this)
            .text("Add To Basket")
            .css(
                "background",
                "#cc0000"
            );


        },1500);



    });





    /* ==============================
       UPDATE BASKET COUNTER
    ============================== */


    function updateBasketCount(){


        $("#basketCount")
            .text(
                "Basket: "
                + basket.length
                + " items"
            );


    }



});