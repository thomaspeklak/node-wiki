"use strict";

(function (exports) {
    var translate = function (key) {
        var args = arguments.length > 1 ? [].prototype.slice.call(arguments, 1) : [];
        if (exports.i18n.hasOwnProperty(key)) {
            return window.vsprintf(exports.i18n[key], args);
        }

        throw new Error("I18n: no translation for key: \"" + key + "\"");
    };

    exports.__ = translate;
}(window));

