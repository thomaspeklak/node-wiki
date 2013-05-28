"use strict"

var validPage = {
    title: "Foo Title",
    path: "/foo",
    tags: "foo, bar",
    content: "foo content"
};


var clone = function (obj) {
    if (!obj || typeof obj !== "object") {
        return obj;
    }

    var newInstance = {};
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            newInstance[key] = clone(obj[key]);
        }
    }
    return newInstance;
};

var apply = function (options, page) {
    if (!options || typeof options !== "object") return;

    for (var key in options) {
        if (options.hasOwnProperty(key)) {
            page[key] = options[key];
        }
    }
};

module.exports = function (options) {
    var page = clone(validPage);
    apply(options, page);

    return page;
};
