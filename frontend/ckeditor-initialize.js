"use strict";

var cookies = require("./cookies");
var __ = require("./translate");
var modal = require("./modal");
var message = require("./message");

module.exports = function (CKEDITOR) {
    require("./ckeditor-wiki-links")(CKEDITOR);
    //initize CK editor and page save events
    if ($(".content.editable").length == 0) return;
    var getData = function () {
        return {
            content: $('.content.editable')
                .html()
                .replace(" class=\"aloha-link-text\"", ""),
            title: $('h1.title').html(),
            tags: $(".tags div").html()
        };
    };
    var data = getData();
    var save = function () {
        var newData = getData();
        var changed = ["content", "title", "tags"].some(function (key) {
            return data[key] != newData[key];
        });

        if (changed) {
            data = newData;
            $.post(document.location.href, {
                content: $(".content.editable").html(),
                title: $("h1.title").html(),
                tags: $(".tags div").html(),
                lastModified: $("h1.title").data().lastModified
            })
                .success(saved)
                .error(savingError);
        }
    };

    setInterval(save, 6e4);
    $("body")
        .bind("save", save);

    CKEDITOR.inline("content", {
        on: {
            blur: save
        }
    });

    $(".edit")
        .blur(save)
        .keydown(function (e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            $(this)
                .blur();
        }
    });

    var saved = function (data) {
        message("success", __("page-saved"), 2e3);
        $(".modified-by strong")
            .text(cookies.read("username"));
        $("h1:first").data().lastModified = data.lastModified;
    };
    var savingError = function (xhr, error, type) {
        if (type == "Conflict") {
            return modal(__("page-conflict-title"), __("page-conflict-description"))
                .on("click", "btn-confirm", function () {
                location.reload();
            })
                .on("click", "btn-cancle", function () {
                $(this).closest("modal").modal("hide").remove();
            });
        }
        if (xhr.responseText) {
            return message("error", __(xhr.responseText), 2e3);
        }
        message("error", __("page-could-not-be-saved"), 2e3);
    };
};
