"use strict";

var path = require("path"),
    fs = require("fs");

var routes = function (app) {
    fs.readdirSync(__dirname).filter(function (file) {
        return path.join(__dirname, file) !== __filename && file !== "pages.js";
    }).forEach(function (file) {
            require("./" + path.basename(file))(app);
        });

    require("./pages")(app);
};

module.exports = routes;
