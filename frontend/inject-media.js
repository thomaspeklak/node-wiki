"use strict";

var __ = require("./translate");
var message = require("./message");

var strategies = {
    "youtube.com/watch": function (uri, cb) {
        var match = uri.match(/v=(.*?)(?:$|&)/);
        if (!match[1]) return cb(null);
        cb('<iframe width="640" height="480" src="http://www.youtube.com/embed/' + match[1] + '" frameborder="0" allowfullscreen></iframe>');
    },
    "vimeo.com": function (uri, cb) {
        var match = uri.match(/vimeo.com\/(.*?)(?:$|\?)/);
        if (!match[1]) return;
        cb('<iframe src="http://player.vimeo.com/video/' + match[1] + '" width="640" height="480" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>');
    },
    "gist.github.com": function (uri, cb) {
        cb("<iframe class=\"gist\" seamless src=\"/gist-proxy/" + uri.replace("https://gist.github.com/", "") + "\"/>");
    },
    "slideshare.net": function (uri, cb) {
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

var strategyUrls = Object.keys(strategies).filter(function (k) {
    return k.indexOf(".") > 0;
});

var matcher = function (url) {
    var plainUrl = url.replace(/^.*?\/\/(?:www\.)?/, "");
    for (var i = 0; i < strategyUrls.length; i++) {
        if (plainUrl.substr(0, strategyUrls[i].length) === strategyUrls[i])  {
            return strategyUrls[i];
        }
    }
};

module.exports = function (uri, targetElement) {
    var localInject = inject(targetElement);
    var type = matcher(uri);

    if (type) {
        return strategies[type](uri, localInject);
    }

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
};
