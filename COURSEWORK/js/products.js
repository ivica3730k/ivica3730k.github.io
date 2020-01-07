function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

$(document).ready(function () {
    var category = getUrlVars()["category"];
    fillWebContent(category, "#fill-items", "#items");


});





