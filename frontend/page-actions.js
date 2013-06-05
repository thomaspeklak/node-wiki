"use strict";

var __ = require("./translate");
var message = require("./message");

(function ($) {
    $("#delete-page").click(function (e) {
        e.preventDefault();
        $.ajax({
            type: "DELETE",
            url: location.href
        }).done(function () {
            location.reload();
        }).fail(function () {
            message('error', __("error-500"));
        });
    });

    $("#restore-page").click(function (e) {
        e.preventDefault();
        $.ajax({
            type: "PUT",
            url: location.href,
            data: {
                restore: true
            }
        }).done(function () {
            location.reload();
        }).fail(function (xhr) {
            message('error', __("error-" + xhr.status));
        });
    });

}(jQuery));
