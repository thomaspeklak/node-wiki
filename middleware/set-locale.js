"use strict";
var config = require("../config");

module.exports = function (req, res, next) {
    req.i18n.setLocale(req.cookies.locale || config.locales[0]);
    next();
};
