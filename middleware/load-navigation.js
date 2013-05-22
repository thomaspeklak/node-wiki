"use strict";
var config = require("../config");

var Page = require('../models/page');
var async = require("async");

var subNodes = function (req, res, cb) {
    Page.subNodes(req.path, function (err, subPages) {
        if (!err) {res.locals.navigation = subPages; }

        cb(err);
    });
};

var recentChanges = function (req, res, cb) {
    Page.recentChanges(10, function (err, pages) {
        if (!err) {res.locals.recentChanges = pages; }

        cb(err);
    });
};

var latestPages = function (req, res, cb) {
    Page.latest(10, function (err, pages) {
        if (!err) {res.locals.latest = pages; }

        cb(err);
    });
};

var setTitle  = function (req, res, cb) {
    res.locals.siteName = config.siteName;
    cb();
};

var setLocales = function (req, res, cb) {
    res.locals.locales = config.locales;
    res.locals.currentLocale = req.cookies.locale || config.locales[0];
    cb();
};

var wrap = function (req, res, fn) {
    return function (cb) {
        fn(req, res, cb);
    };
};

module.exports = function (req, res, next) {
    async.parallel([
        wrap(req, res, subNodes),
        wrap(req, res, recentChanges),
        wrap(req, res, latestPages),
        wrap(req, res, setTitle),
        wrap(req, res, setLocales)
    ],
        next
    );
};







