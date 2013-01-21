"use strict";

var Page = require('../models/page');

module.exports = function (req, res, next) {
    Page.subNodes(req.path, function (err, subPages) {
        res.locals.navigation = subPages;

        next(err);
    });
};


