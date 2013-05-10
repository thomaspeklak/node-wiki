"use strict";

var Page = require('../models/page');
var async = require("async");
var config = require("../config/app");
var i18n = require("../public/locale/" + config.locale);

var staticNavigation = function (req, res, cb) {
    Page.findOne({path: '/navigation'}, function (err, page) {
        if (!err) {

            if (page) {
                res.locals.staticNavigation = page.content;
            } else {
                res.locals.staticNavigation = '<div>' + i18n["No static navigation found. Create page 'navigation' first."] + '</div>';
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







