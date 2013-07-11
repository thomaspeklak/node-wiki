"use strict";

var sanitize = require("validator").sanitize;

module.exports = function (props, allowedProperties, model) {
    allowedProperties.forEach(function (prop) {
        if (props[prop]) { model[prop] = props[prop]; }
    });
};
