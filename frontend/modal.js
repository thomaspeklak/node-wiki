"use strict";

//@todos
// - use templateing system
//   all dialogs should use this module

var __ = require("./translate");

var template = '<form id="%ID%" class="modal hide fade">\
    <div class="modal-header">\
    <h3>%TITLE%</h3>\
    </div>\
    <div class="modal-body">\
    <p>%DESCRIPTION%</p>\
    </div>\
    <div class="modal-footer">\
    <button type="submit" class="btn btn-warning">' + __("button-confirm") + '</button>\
    <button type="submit" class="btn btn-cancle">' + __("button-cancle") + '</button>\
    </div>\
    </form>';


module.exports = function (title, description) {
    var modal = template.replace("%TITLE%", title)
        .replace("%DESCRIPTION%", description);

    return $(modal)
        .appendTo("body")
        .modal("show");
};
