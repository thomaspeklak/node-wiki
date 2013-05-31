"use strict";

var Page = require("../models/page");

module.exports = function (req, res, next) {
    var finder = {
        path: req.path
    };

    if (req.method != "GET") {
        finder.deleted = false;
    }

    Page.findOne(finder, function (err, page) {
        if (err) {
            return next(err);
        }

        if (req.method != "GET" && !page) {
            return res.send(405);
        }

        res.locals.page = page;
        next();
    });
};

