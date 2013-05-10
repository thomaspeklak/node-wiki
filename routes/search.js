"use strict";

var Page = require("../models/page");
var config = require("../config/app");
var i18n = require("../public/locale/" + config.locale);

module.exports = function (app) {
    app.get("/search", function (req, res) {
        var query = req.param("q");

        Page.search(query, function (err, results) {
            // TODO: err
            return res.render("search", {
                title: i18n["search"] + " " + query,
                results: results
            });
        });
    });
};
