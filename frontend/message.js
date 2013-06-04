"use strict";

(function ($) {
    //provide an interface to display a message to the user
    $.message = function (type, message, delay) {
        delay = delay ||  5e3;
        var html = '<div class="alert alert-' + type + '"> \
            <button type="button" class="close" data-dismiss="alert">&times;</button> \
            ' + message + '\
            </div>';

        $(html)
        .appendTo('#messages')
        .delay(delay)
        .fadeOut(remove);
    };

    function remove() {
        $(this).remove();
    }
}(jQuery));

