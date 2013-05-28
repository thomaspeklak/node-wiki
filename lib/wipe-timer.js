"use strict";

var path = require("path");
var fork = require("child_process").fork;

var wipe = function (verbose) {
    var cp = fork(path.join(__dirname, "wipe-deleted-pages"));
    cp.once("message", function (deletedPages) {
        if (verbose) console.log("Wiped " + deletedPages + " pages");
    });
};

module.exports.start = function () {
    setInterval(wipe, 24 * 60 * 60 * 1000);
    wipe();
};
