"use strict";

var Page = require("../models/page");

module.exports = function (app) {
    app.get("/search", function (req, res) {
        var query = req.param("q");

        Page.search(query, function (err, search) {
            return res.render("search", {
                title: "search " + query,
                results: search.results
            });
        });
    });
};
