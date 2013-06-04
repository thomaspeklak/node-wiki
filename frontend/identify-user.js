"use strict";
(function ($) {
    //prompt user for a username if he has not already provided one

    if (readCookie("username")) return;

    function handleSubmit(e) {
        e.preventDefault();
        var username = $("input[name=username]").val();
        if (!username.length) {
            return $("input[name=username]")
            .parent()
            .addClass("error");
        }
        createCookie("username", username, 720);
        modal.modal("hide");

    }

    var modal = $('<form id="saveUsername" class="modal hide fade">\
        <div class="modal-header">\
        <h3>' + __('identify-yourself') + '</h3>\
        </div>\
        <div class="modal-body">\
        <p>' + __('provide-username') + '</p>\
        <p class="control-group"><input placeholder="' + __('username') + '" name="username" required/><br/><br/></p>\
        </div>\
        <div class="modal-footer">\
        <button type="submit" class="btn btn-primary">' + __('save-changes') + '</button>\
        </div>\
    </form>')
.appendTo("body")
.modal("show");
$("#saveUsername")
.on("submit", handleSubmit);

}(jQuery));

