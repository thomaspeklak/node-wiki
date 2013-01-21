"use strict";

var Page = require("../models/page");

module.exports = function (app) {
    app.get('/search', function (req, res) {
        var query = req.param('q');

        Page.search(query, function (err, results) {
            // TODO: err
            return res.render('search', {
                title: 'search ' + query,
                results: results,
                latest: Page.latest(10),
                recentChanges: Page.recentChanges(10)
            });
        });
    });
};
