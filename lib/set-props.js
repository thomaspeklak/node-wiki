"use strict";

module.exports = function (props, allowedProperties, model) {
    allowedProperties.forEach(function (prop) {
        if (props[prop]) { model[prop] = props[prop]; }
    });
};
