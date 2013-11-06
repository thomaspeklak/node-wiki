"use strict"

var injectMedia = require("./inject-media");

module.exports = function (el) {
    el.addEventListener("paste", function (e) {
        injectMedia(e.clipboardData.getData("text/plain"), e.target);
    });
};
