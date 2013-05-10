"use strict";

var Page = require("../models/page");
var async = require("async");

var staticNavigation = function (req, res, cb) {
    Page.findOne({path: "/navigation"}, function (err, page) {
        if (!err) {

            if (page) {
                res.locals.staticNavigation = page.content;
            } else {
                res.locals.staticNavigation = req.i18n.__("no-static-navigation-found");
            }
        }
        cb(err);
    });
};

var wrap = function (req, res, fn) {
    return function (cb) {
        fn(req, res, cb);
    };
};

module.exports = function (req, res, next) {
    async.parallel([
        wrap(req, res, staticNavigation)
    ],
        next
    );
};







