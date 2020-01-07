$(document).ready(function () {

    $("#colaps-profile-btn").click(function () {
        hideCart();
        $("#colaps-profile-content").toggle("fast", function () {

        });
    });

    $("#colaps-cart-btn").click(function () {
        hideProfile();
        $("#colaps-cart-content").toggle("fast", function () {

        });
    });
});

function hideProfile() {
    $("#colaps-profile-content").hide();
}

function hideCart() {
    $("#colaps-cart-content").hide();
}