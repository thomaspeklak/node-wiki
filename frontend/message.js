"use strict";
//provide an interface to display a message to the user

var messageTemplate = require("./templates/message.hbs");

function remove() {
    $(this).remove();
}

module.exports = function (type, message, delay) {
    delay = delay ||  5e3;
    var html = messageTemplate({
            type: type,
            message: message
        });

    $(html)
        .appendTo('#messages')
        .delay(delay)
        .fadeOut(remove);
};
