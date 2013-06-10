"use strict";

var __ = require("./translate");
var message = require("./message");

var strategies = {
    youtube: function (uri, cb) {
        cb('<iframe width="640" height="480" src="http://www.youtube.com/embed/' + uri + '" frameborder="0" allowfullscreen></iframe>');
    },
    vimeo: function (uri, cb) {
        cb('<iframe src="http://player.vimeo.com/video/' + uri + '" width="640" height="480" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>');
    },
    gist: function (uri, cb) {
        cb("<iframe class=\"gist\" seamless src=\"/gist-proxy/" + uri + "\"/>");
    },
    slideshare: function (uri, cb) {
        $.getJSON("http://www.slideshare.net/api/oembed/2?url=" + uri + "&format=jsonp&callback=?", function (data) {
            cb(data.html);
        });
    },
    image: function (uri, cb) {
        return cb("<img class='polaroid' src='" + uri + "'/>");
    },
    video: function (uri, cb) {
        return cb("<video class='polaroid' width='640' height='480' src='" + uri + "'/>");
    },
    audio: function (uri, cb) {
        return cb("<audio controls src='" + uri + "'/>");
    },
    text: function (uri, cb) {
        return cb("<a href='" + uri + "'>" + __("link-title") + "</a>");
    }
};

var inject = function (targetElement) {
    return function (htmlFragment) {
        $(targetElement).append(htmlFragment);
        $("body").trigger("save");
    };
};

module.exports = function (uri, targetElement) {
    var localInject = inject(targetElement);
    if (uri.indexOf("youtube.com/watch") !== -1) {
        var youtube = uri.match(/v=(.*?)(?:$|&)/);
        if (!youtube[1]) return;
        strategies.youtube(youtube[1], localInject);
    } else if (uri.indexOf("vimeo.com/") !== -1) {
        var vimeo = uri.match(/vimeo.com\/(.*?)(?:$|\?)/);
        if (!vimeo[1]) return;
        strategies.vimeo(vimeo[1], localInject);
    } else if (uri.indexOf("www.slideshare.net/") !== -1) {
        strategies.slideshare(uri, localInject);
    } else if (uri.indexOf("gist.github") !== -1) {
        strategies.gist(uri.replace("https://gist.github.com/", ""), localInject);
    } else {
        $.get("/detect-content-type", {
                uri: uri
            }, function (data) {
                var type = data.replace(/\/.*/, "");
                if (strategies[type]) {
                    strategies[type](uri, localInject);
                } else {
                    message("warn", __("unsupported-drop"));
                }
            });
    }
};
