"use strict";

var Page = require("../models/page");

module.exports = function (app) {
    app.get("/deleted-pages", function (req, res) {
        Page.deleted(function (err, pages) {
            if (err) {
                console.error(err);
                res.send(500);
            }
            res.render("deleted-pages", {
                pages: pages,
                title: req.i18n.__("deleted-pages")
            });
        });
    });
};
