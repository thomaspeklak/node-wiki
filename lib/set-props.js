"use strict";

var sanitize = require("validator").sanitize;

module.exports = function (props, allowedProperties, model) {
    allowedProperties.forEach(function (prop) {
        try {
            if (props[prop]) { model[prop] = sanitize(props[prop]).xss(); }
        } catch (e) {
            console.error(e);
        }
    });
};
