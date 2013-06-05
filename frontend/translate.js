"use strict";

//@TODO figure out how to inject external dependency i18n
var translate = function (key) {
    var args = arguments.length > 1 ? [].prototype.slice.call(arguments, 1) : [];
    if (i18n.hasOwnProperty(key)) {
        return window.vsprintf(i18n[key], args);
    }

    throw new Error("I18n: no translation for key: \"" + key + "\"");
};

module.exports = translate;
