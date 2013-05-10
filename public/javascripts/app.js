"use strict";

/**
 * @class app
 * Application base class implementation
 */
window.app = {

    dependencies: [

        // Application sub-classes
        'javascripts/app/cookie',
        'javascripts/app/progressbar',
        'javascripts/app/dropzone',

        // Controllers
        'javascripts/controller/move-page',
        'javascripts/controller/delete-page',
        'javascripts/controller/delete-attachment',
        'javascripts/controller/new-page',

        // External modules auto-loading
        'javascripts/modules'
    ],

    preloadImages: function ($) {

        // Load Images before show them - pages/covers
        // Fix cached images issues
        $(".img-polaroid").one("load",function () {
            $(".preview").each(function (index) {
                $(this).delay(100 * index).fadeIn(200);
            });
        }).each(function () {
                if (this.complete) {
                    $(this).load();
                }
            });
    },

    checkUserAuth: function ($) {

        if (app.cookie.read("username")) {
            return;
        }

        function handleSubmit(e) {
            e.preventDefault();
            var username = $("input[name=username]").val();
            if (!username.length) {
                return $("input[name=username]")
                    .parent()
                    .addClass("error");
            }
            app.cookie.create("username", username, 720);
            modal.modal("hide");

        }

        var modal = $('<form id="saveUsername" class="modal hide fade">\
                      <div class="modal-header">\
                          <h3>' + i18n["Identify yourself"] + '</h3>\
                          </div>\
                          <div class="modal-body">\
                          <p>' + i18n["Just type a username, node wiki ain\'t no high security vault."] + '</p>\
                      <p class="control-group"><input placeholder="Username" name="username" required/><br/><br/></p>\
                          </div>\
                          <div class="modal-footer">\
                          <button type="submit" class="btn btn-primary">' + i18n["Save changes"] + '</button>\
                          </div>\
                          </form>')
            .appendTo("body")
            .modal("show");

        $("#saveUsername")
            .on("submit", handleSubmit);
    },

    handleLinksNoEditor: function ($) {

        //Enable link clicking if editor is not active
        var clickingLink = false;
        $(".content.editable")
            .on("mousedown", function (e) {
                if (e.target.tagName == "A" && !$(this)
                    .hasClass("cke_focus")) {
                    clickingLink = true;
                    e.preventDefault();
                    e.stopImmediatePropagation();
                }
            })
            .on("mouseup", function (e) {
                if (clickingLink) {
                    location.href = e.target.href;
                    e.preventDefault();
                    e.stopImmediatePropagation();
                }
                clickingLink = false;
            });
    },

    prepareMessageInterface: function ($) {

        //provide an interface to display a message to the user
        $.message = function (type, message, delay) {
            delay = delay || 5e3;
            var html = '<div class="alert alert-' + type + '"> \
            <button type="button" class="close" data-dismiss="alert">&times;</button> \
                ' + message + '\
                </div>';

            $(html)
                .appendTo('#messages')
                .delay(delay)
                .fadeOut(function () {
                    $(this).remove();
                });
        };
    },

    initCKEditor: function (CKEDITOR) {

        //initize CK editor and page save events
        if ($(".content.editable")
            .length == 0) {
            return;
        }
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

            // update HTML document title
            document.title = $("h1.title").html();

            if (changed) {
                data = newData;
                $.post(document.location.href, {
                    content: $(".content.editable").html(),
                    title: $("h1.title").html(),
                    tags: $(".tags div").html()
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

        var saved = function () {
            $.message("success", i18n["Page saved"], 2e3);
            $(".modified-by strong")
                .text(app.cookie.read("username"));
        };
        var savingError = function () {
            $.message("error", i18n["Page could not be saved, please try again later"], 2e3);
        };
    },

    highlightTextForReplacement: function ($) {

        //if not changed highlight text for easy replacement
        var getTextNodesIn = function (node) {
            var textNodes = [];
            if (node.nodeType == 3) {
                textNodes.push(node);
            } else {
                var children = node.childNodes;
                for (var i = 0, len = children.length; i < len; ++i) {
                    textNodes.push.apply(textNodes, getTextNodesIn(children[i]));
                }
            }
            return textNodes;
        };

        var setSelectionRange = function (el, start, end) {
            if (document.createRange && window.getSelection) {
                var range = document.createRange();
                range.selectNodeContents(el);
                var textNodes = getTextNodesIn(el);
                var foundStart = false;
                var charCount = 0,
                    endCharCount;

                for (var i = 0, textNode; textNode = textNodes[i++];) {
                    endCharCount = charCount + textNode.length;
                    if (!foundStart && start >= charCount && (start < endCharCount || (start == endCharCount && i < textNodes.length))) {
                        range.setStart(textNode, start - charCount);
                        foundStart = true;
                    }
                    if (foundStart && end <= endCharCount) {
                        range.setEnd(textNode, end - charCount);
                        break;
                    }
                    charCount = endCharCount;
                }

                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            } else if (document.selection && document.body.createTextRange) {
                var textRange = document.body.createTextRange();
                textRange.moveToElementText(el);
                textRange.collapse(true);
                textRange.moveEnd("character", end);
                textRange.moveStart("character", start);
                textRange.select();
            }
        };

        $(".tags .edit")
            .focus(function () {
                if (this.innerText == i18n["add tags as comma separated list"]) {
                    var el = this;
                    setTimeout(function () {
                        setSelectionRange(el, 0, el.innerText.length);
                    }, 30);
                }
            });

        $("h1.edit")
            .focus(function () {
                if (this.innerText == i18n["new page"]) {
                    var el = this;
                    setTimeout(function () {
                        setSelectionRange(el, 0, el.innerText.length);
                    }, 30);
                }
            });
    },

    initDropZoneDropping: function ($) {

        if ($(".drop-here").length == 0) {
            return;
        }

        $(function () {
            if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
                return $('.drop-here').hide();
            }

            // Setup the dnd listeners.
            new app.Dropzone({
                element: document.getElementById('drop-zone'),
                handleFileSelect: handleFileSelect
            });
        });

        function handleFileSelect(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            uploadFiles(document.location.href, evt.dataTransfer.files);
        }

        function uploadFiles(url, files) {
            var formData = new FormData();

            for (var i = 0, file; file = files[i]; ++i) {
                formData.append("attachments", file);
            }

            var xhr = new XMLHttpRequest();
            var finished = false;
            xhr.open('POST', "/attachments", true);
            xhr.onload = function (e) {

                // TODO: Duplicate code, see below
                if (!finished && xhr.status == 200) {
                    finished = true;
                    handleResponse(xhr.responseText);
                    $.message("success", i18n["Successfully uploaded"]);
                }

                if (xhr.status >= 500) {
                    $.message('error', i18n['Internal Server Error']);
                }

                if (xhr.status == 415) {
                    $.message('error', i18n['Unsupported media type']);
                }

                if (xhr.status == 400) {
                    $.message("error", i18n["I don't know"]);
                }
            };

            var progressBar = new app.ProgressBar('#attachments', xhr.upload);

            xhr.send(formData); // multipart/form-data
        }

        var handleResponse = function (res) {
            var response = JSON.parse(res);
            response.attachments.forEach(function (attachment) {
                $('#attachments').append("<li><a href='/attachments/" + response.pageId + "/" + attachment + "' title='" + attachment + "'><i class='icon-file'></i>" + attachment + "</a><a href='#' class='icon-remove-sign'</li>");
            });
        };
    },

    initContentDropping: function ($) {

        if ($("#content.editable").length == 0) {
            return;
        }

        $(function () {
            if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
                return $(".drop-here").hide();
            }

            // Setup the dnd listeners.
            new app.Dropzone({
                element: document.getElementById("content"),
                handleFileSelect: handleFileSelect
            });
        });

        var handleFileSelect = function (evt) {
            evt.stopPropagation();
            evt.preventDefault();

            var uri = evt.dataTransfer.getData("text/uri-list");
            if (uri) {
                return handleUriDrop(uri, evt.target);
            }

            uploadFiles(document.location.href, evt.dataTransfer.files, evt.target);
        };

        var uploadFiles = function (url, files, targetElement) {
            var formData = new FormData();

            for (var i = 0, file; file = files[i]; ++i) {
                formData.append("images", file);
            }

            var xhr = new XMLHttpRequest();
            var finished = false;
            xhr.open('POST', "/images", true);
            xhr.onload = function (e) {

                // TODO: Duplicate code (see above)
                if (!finished && xhr.status == 200) {
                    finished = true;
                    handleResponse(xhr.responseText);
                    $.message("success", i18n["Successfully uploaded"]);
                }

                if (xhr.status >= 500) {
                    $.message('error', i18n['Internal Server Error']);
                }

                if (xhr.status == 415) {
                    $.message('error', i18n['Unsupported media type']);
                }

                if (xhr.status == 400) {
                    $.message("error", i18n["I don't know"]);
                }
            };

            new app.ProgressBar("#content", xhr.upload);

            xhr.send(formData); // multipart/form-data
        };

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
                return "<a href='" + uri + "'>" + i18n["Link Title"] + "</a>";
            }
        };

        var handleUriDrop = function (uri, targetElement) {
            if (uri.indexOf("youtube.com/watch") !== -1) {
                var youtube = uri.match(/v=(.*?)(?:$|&)/);
                if (!youtube[1]) {
                    return;
                }
                $(targetElement)
                    .append('<iframe width="640" height="480" src="http://www.youtube.com/embed/' + youtube[1] + '" frameborder="0" allowfullscreen></iframe>');
                $("body")
                    .trigger("save");
            } else if (uri.indexOf("vimeo.com/") !== -1) {
                var vimeo = uri.match(/vimeo.com\/(.*?)(?:$|\?)/);
                if (!vimeo[1]) {
                    return;
                }
                $(targetElement)
                    .append('<iframe src="http://player.vimeo.com/video/' + vimeo[1] + '" width="640" height="480" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>');
                $("body")
                    .trigger("save");
            } else if (uri.indexOf("www.slideshare.net/" !== -1)) {
                $.getJSON("http://www.slideshare.net/api/oembed/2?url=" + uri + "&format=jsonp&callback=?",
                    function (data) {
                        $(targetElement).append(data.html);
                        $("body").trigger("save");
                    });
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
                        $.message('warn', i18n['Unsupported media type']);
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
            $("body")
                .trigger("save");
        };
    },

    initSyntaxHighlighting: function ($) {

        $('pre, code').each(function (i, e) {
            hljs.highlightBlock(e);
        });
    },

    /**
     * Calls static methods to be executed on app launch
     * when the DOM is ready.
     * @return void
     */
    launch: function () {

        console.log('Launching...');

        this.preloadImages(jQuery);
        this.checkUserAuth(jQuery);
        this.handleLinksNoEditor(jQuery);
        this.prepareMessageInterface(jQuery);
        this.initCKEditor(CKEDITOR);
        this.highlightTextForReplacement(jQuery);
        this.initDropZoneDropping(jQuery);
        this.initContentDropping(jQuery);
        this.initSyntaxHighlighting(jQuery);

        console.log('Launched.');
    }
};

// Require libraries
require(app.dependencies, function () {

    // Call app's launch() method when DOM is ready
    $(document).ready(function () {
        window.app.launch();
    });
});
