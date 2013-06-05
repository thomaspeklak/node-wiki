"use strict";

var cookies = require("./cookies");

//Switch language and store it in a cookie
$(".language-switcher").find("a").click(function (e) {
    e.preventDefault();
    cookies.set("locale", this.href.replace(/.*#/, ""), 720);
    location.reload();
});
