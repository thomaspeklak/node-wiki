"use strict";

var fs = require("fs");
var path = require("path");

module.exports = function (app) {
    app.get("/javascripts/locale.js", function (req, res) {
        var locale = req.i18n.getLocale();
        var stream = fs.createReadStream(path.join(__dirname, "..", "locales", locale + ".js"));

        stream.on("error", function (err) {
            console.error(err);
            res.send(404);
        });

        res.write("window.locale = \"" + locale + "\";");
        res.write("window.i18n = ");
        stream.pipe(res);
    });
};
