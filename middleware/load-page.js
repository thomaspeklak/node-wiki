"use strict";

var Page = require('../models/page');

module.exports = function (req, res, next) {
    Page.findOne({
        path: req.path
    }, function (err, page) {
        if (err) {
            return next(err);
        }

        res.locals.page = page;
        next();
    });
};

