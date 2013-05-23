"use strict";

var Page = require("../models/page");

module.exports = function (req, res, next) {
    var finder = {
        path: req.path
    };
    if (req.method != "get") {
        finder.deleted = false;
    }

    Page.findOne(finder, function (err, page) {
        if (err) {
            return next(err);
        }

        res.locals.page = page;
        next();
    });
};

