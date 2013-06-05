"use strict";

// Load Images before show them - pages/covers
// Fix cached images issues
$(".img-polaroid").one("load", function () {
    $(".preview").each(function (index) {
        $(this).delay(100 * index).fadeIn(200);
    });
}).each(function () {
    if (this.complete) $(this).load();
});
