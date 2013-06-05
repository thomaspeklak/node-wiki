"use strict";

var __ = require("./translate");

(function (app) {
    app.handleErrors = function (xhr) {
        if (xhr.status >= 500) {
            $.message('error', __("error-500"));
        }

        if (xhr.status == 415) {
            $.message('error', __("error-415"));
        }

        if (xhr.status == 400) {
            $.message("error", __("error-400"));
        }
    };
}(app));

