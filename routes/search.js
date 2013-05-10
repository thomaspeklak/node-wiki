"use strict";

var Page = require("../models/page");

module.exports = function (app) {
    app.get("/search", function (req, res) {
        var query = req.param("q");

        Page.search(query, function (err, results) {
            // TODO: err
            return res.render("search", {
                title: req.i18n.__("search") + " " + query,
                results: results
            });
        });
    });
};
