"use strict";

var fs = require("fs");
var path = require("path");
var markdown = require("markdown").markdown;

module.exports = function (app) {
    app.get("/wiki/help", function (req, res) {
        var locale = req.i18n.getLocale();
        var stream = fs.readFile(path.join(__dirname, "..", "help", locale + ".md"), function (err, data) {
            if (err) {
                console.error(err);
                res.send(404);
            }

            res.render("help", {
                    content: markdown.toHTML(data.toString())
                });
        });
    });
};
