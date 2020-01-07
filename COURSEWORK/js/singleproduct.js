function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

$(document).ready(function () {
    var productId = getUrlVars()["productId"];
    productId = parseInt(productId, 10);
    var cat = getCatById(productId);
    fillWebContentById(productId, "#fillScript", "#filledElement");
    passImagesToSlideshow(returnImagesById(productId));
    fillWebContent(cat, "#fill-similar", "#similar");




});



