"use strict";

var __ = require("./translate");
var message = require("./message");
var isDeleted = require("./is-deleted");
var modal = require("./modal");

(function ($) {
    if (isDeleted) return;
    $("#move-page").click(function (e) {
        e.preventDefault();
        var handleSubmit = function (e) {
            e.preventDefault();
            $.ajax({
                    type: "PUT",
                    data: {
                        newPath: "/" + $("input[name=path]").val()
                    }
                }).done(function (data) {
                    $("#move-page-dialog").modal("hide").remove();
                    if (data.status == "page-exists") {
                        message("error", __("error-target-path-exists"));
                    } else {
                        message("success", __("page-moved"));
                        location.replace(data.target);
                    }
                }).fail(function () {
                    $("#move-page-dialog").modal("hide").remove();
                    message("error", __("error-400"));
                });
        };

        modal({
                title: __("move-page"),
                description: __("new-page"),
                fields: [{
                        label: __("new-page"),
                        name: "path",
                        placeholder: "/page/subpage",
                        value: location.pathname.substring(1),
                        required: true
                    }
                ]
            }).on("submit", handleSubmit);
    });
}(jQuery));

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
