"use strict";

var xss = require("../lib/xss");

module.exports = function (props, allowedProperties, model) {
    allowedProperties.forEach(function (prop) {
        try {
            if (typeof props[prop] != 'undefined' && props[prop] != null) {
                model[prop] = xss(props[prop]);
            }
        } catch (e) {
            console.error(e);
        }
    });
};
