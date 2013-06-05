"use strict";

//provide an interface to display a message to the user

function remove() {
    $(this).remove();
}

module.exports = function (type, message, delay) {
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

