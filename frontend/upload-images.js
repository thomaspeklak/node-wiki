"use strict";

(function ($, app) {
    if (app.pageDeleted) return;
    if ($("#content.editable").length == 0) return;

    $(function () {
        if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
            return $(".drop-here").hide();
        }

        // Setup the dnd listeners.
        new app.Dropzone({
            element: document.getElementById("content").parentNode,
            handleFileSelect: handleFileSelect
        });
    });

    function handleFileSelect(evt) {
        evt.stopPropagation();
        evt.preventDefault();

        $("body").trigger("save");

        var uri = evt.dataTransfer.getData("text/uri-list");
        if (uri) {
            return handleUriDrop(uri, evt.target);
        }

        uploadFiles(document.location.href, evt.dataTransfer.files, evt.target);
    }

    function uploadFiles(url, files, targetElement) {
        var formData = new FormData();

        for (var i = 0, file; file = files[i]; ++i) {
            formData.append("images", file);
        }

        var xhr = new XMLHttpRequest();
        var finished = false;
        xhr.open('POST', "/images", true);
        xhr.onload = function (e) {
            if (!finished && xhr.status == 200) {
                finished = true;
                handleResponse.bind(targetElement)(xhr.responseText);
                $.message("success", __("successfully-uploaded"));
            }

            app.handleErrors(xhr);
        };


        var progressBar = new app.ProgressBar("#content", xhr.upload);

        xhr.send(formData); // multipart/form-data
    }

    var appendAssetStrategy = {
        image: function (uri) {
            return "<img class='polaroid' src='" + uri + "'/>";
        },
        video: function (uri) {
            return "<video class='polaroid' width='640' height='480' src='" + uri + "'/>";
        },
        audio: function (uri) {
            return "<audio controls src='" + uri + "'/>";
        },
        text: function (uri) {
            return "<a href='" + uri + "'>" + __("link-title") + "</a>";
        }
    };

    var handleUriDrop = function (uri, targetElement) {
        if (uri.indexOf("youtube.com/watch") !== -1) {
            var youtube = uri.match(/v=(.*?)(?:$|&)/);
            if (!youtube[1]) return;
            $(targetElement)
            .append('<iframe width="640" height="480" src="http://www.youtube.com/embed/' + youtube[1] + '" frameborder="0" allowfullscreen></iframe>');
                $("body")
                .trigger("save");
        } else if (uri.indexOf("vimeo.com/") !== -1) {
            var vimeo = uri.match(/vimeo.com\/(.*?)(?:$|\?)/);
            if (!vimeo[1]) return;
            $(targetElement)
            .append('<iframe src="http://player.vimeo.com/video/' + vimeo[1] + '" width="640" height="480" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>');
                $("body")
                .trigger("save");
        } else if (uri.indexOf("www.slideshare.net/") !== -1) {
            $.getJSON("http://www.slideshare.net/api/oembed/2?url=" + uri + "&format=jsonp&callback=?", function (data) {
                $(targetElement).append(data.html);
                $("body").trigger("save");
            });
        } else if (uri.indexOf("gist.github") !== -1) {
            $(targetElement).append("<iframe class=\"gist\" seamless src=\"/gist-proxy/" + uri.replace("https://gist.github.com/", "") + "\"/>");
            $("body").trigger("save");
        } else {
            $.get("/detect-content-type", {
                uri: uri
            }, function (data) {
                var type = data.replace(/\/.*/, "");
                if (appendAssetStrategy[type]) {
                    $(targetElement)
                    .append(
                        appendAssetStrategy[type](uri));
                        $("body")
                        .trigger("save");
                } else {
                    $.message('warn', __("unsupported-drop"));
                }
            });
        }
    };

    var handleResponse = function (res) {
        var targetElement = $(this);
        var response = JSON.parse(res);
        response.images.forEach(function (image) {
            targetElement.append("<img class='polaroid' src='/images/" + response.pageId + "/" + image + "'/>");
            $('#images')
            .append("<li><a href='/images/" + response.pageId + "/" + image + "' title='" + image + "'><i class='icon-file'></i>" + image + "</a><a href='#' class='icon-remove-sign'</li>");
        });
        $("h1:first").data().lastModified = response.lastModified;
        $("body").trigger("save");
    };
}(jQuery, app));

