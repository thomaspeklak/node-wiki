"use strict";

(function ($) {
    //Switch language and store it in a cookie
    $(".language-switcher").find("a").click(function (e) {
        e.preventDefault();
        createCookie("locale", this.href.replace(/.*#/, ""), 720);
        location.reload();
    });
}(jQuery));

