"use strict";
var watchify = require("watchify");
var path = require("path");
var fs = require("fs");


module.exports = function () {
    console.log("watching frontend for changes");
    var w = watchify({});
    w.add(path.join(__dirname, "..", "frontend", "app.js"));
    w.transform("hbsfy");

    var bundle = function () {
        var wb = w.bundle({
            debug: true
        });
        wb.on("error", function (err) {
            console.error(String(err));
        });

        var target = path.join(__dirname, "..", "public", "javascripts", "app.js");
        wb.pipe(fs.createWriteStream(target));
    };

    w.on("update", function () {
        console.log("frontend bundle updated");
        bundle();
    });

    bundle();
};
