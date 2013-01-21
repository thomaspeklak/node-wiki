"use strict";

var Page = require('../models/page');

module.exports = function (req, res, next) {
    if (req.path === '/') {
        res.locals.breadcrumbs = [];
        return next();
    }

    var segments = req.path.split('/');

    var breadcrumbs = [];
    var currentPath = [];

    for (var i = 0; i < segments.length; i++) {
        var segment = segments[i];

        currentPath.push(segment);
        var path = currentPath.join('/');

        breadcrumbs.push({
            path: path.length ? path : '/',
            segment: segment.length ? segment : '/'
        });
    }

    res.locals.breadcrumbs = breadcrumbs;
    next();
};
