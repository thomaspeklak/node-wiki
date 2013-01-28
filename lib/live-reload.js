"use strict";

module.exports = function () {
    var livereload = require("livereload");

    var server = livereload.createServer({
        applyJSLive: true,
        applyCSSLive: true
    });

    server.watch(__dirname + "/../public");

    console.log("Live reload watching public dir");
};
