"use strict";

var sanitize = require("validator").sanitize;

module.exports = function (props, allowedProperties, model) {
    allowedProperties.forEach(function (prop) {
        try {
            if (typeof props[prop] != 'undefined' && props[prop] != null) {
                //model[prop] = sanitize(props[prop]).xss();
                // We need a different XSS implementation here which doesn't remove <img>'s style attribute!
                model[prop] = props[prop];
            }
        } catch (e) {
            console.error(e);
        }
    });
};
