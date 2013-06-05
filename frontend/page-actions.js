"use strict";

var __ = require("./translate");
var message = require("./message");
var isDeleted = require("./is-deleted");

(function ($) {
    if (isDeleted) return;
    $("#move-page").click(function (e) {
        e.preventDefault();
        $('<form id="move-page-dialog" class="modal hide fade">\
            <div class="modal-header">\
            <h3>' + __("move-page") + '</h3>\
            </div>\
            <div class="modal-body">\
            <p>' + __("new-page") + '</p>\
            <p class="control-group">/ <input placeholder="/page/subpage" name="path" value="' + location.pathname.substring(1) + '"required/><br/><br/></p>\
            </div>\
            <div class="modal-footer">\
            <button type="submit" class="btn btn-primary">' + __("save-changes") + '</button>\
            </div>\
        </form>')
            .appendTo("body")
            .modal("show");
        $("#move-page-dialog").on("submit", handleSubmit);
    });

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
        }).fail(function (data) {
            $("#move-page-dialog").modal("hide").remove();
            message("error", __("error-400"));
        });
    };
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
