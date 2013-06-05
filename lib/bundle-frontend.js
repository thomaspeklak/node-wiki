"use strict";
var browserify = require("browserify");
var path = require("path");
var fs = require("fs");


module.exports = function () {
    var b = browserify({});
    b.add(path.join(__dirname, "..", "frontend", "app.js"));
    b.transform("hbsfy");

    var bundle = function () {
        var wb = b.bundle();
        wb.on("error", function (err) {
            console.error(String(err));
        });

        var target = path.join(__dirname, "..", "public", "javascripts", "app.js");
        wb.pipe(fs.createWriteStream(target));
    };

    bundle();
};
