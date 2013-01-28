"use strict";

module.exports = function () {
    var livereload = require("livereload");

    var server = livereload.createServer({
        applyJSLive: true,
        applyCSSLive: true,
        exts: ["jade", "js", "css", "jpg", "png"]
    });

    server.watch(__dirname + "/../public");
    server.watch(__dirname + "/../views");

    console.log("Live reload watching public dir");
};
