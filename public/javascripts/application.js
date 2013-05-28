"use strict";

var app = {};

(function (app) {
    app.pageDeleted = $("div.container.deleted").length > 0;
}(app));

function createCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

(function (exports) {
    var translate = function (key) {
        var args = arguments.length > 1 ? [].prototype.slice.call(arguments, 1) : [];
        if (exports.i18n.hasOwnProperty(key)) {
            return window.vsprintf(exports.i18n[key], args);
        }

        throw new Error("I18n: no translation for key: \"" + key + "\"");
    };

    exports.__ = translate;
}(window));

(function ($) {
    $(".tags").click(function () {
        $(".tags div").focus();
    });
}(jQuery));


(function (app) {
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


    app.modal = function (title, description) {
        var modal = template.replace("%TITLE%", title)
        .replace("%DESCRIPTION%", description);

        return $(modal)
        .appendTo("body")
        .modal("show");
    };
}(app));

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

(function ($) {
    //Enable link clicking if editor is not active
    var clickingLink = false;

    var openLink = function (el, e) {
        if (e.ctrlKey ||  e.metaKey ||  e.button === 1) {
            window.open(el.href);
        } else {
            location.href = el.href;
        }
    };

    var content = document.querySelector(".content.editable");
    if (!content) return;

    content.addEventListener("focus", function (e) {
        if (clickingLink) {
            e.stopImmediatePropagation();
            e.preventDefault();
            this.contentEditable = true;
            this.blur();
        }
    }, true);

    $(".content.editable")
    .on("mousedown", function (e) {
        var link = $(e.target).closest("a");
        if (link.length && !$(this)
            .hasClass("cke_focus")) {
                clickingLink = true;
                this.contentEditable = false;
                e.stopImmediatePropagation();
                openLink(link[0], e);
            }
    }).on("click", function (e) {
        if (clickingLink) {
            e.preventDefault();
            clickingLink = false;
        }
    });
}(jQuery));


(function (CKEDITOR) {
    if (app.pageDeleted) return;
    var getById = function (array, id, recurse) {
        for (var i = 0, item;
            (item = array[i]); i++) {
                if (item.id == id) return item;
                if (recurse && item[recurse]) {
                    var retval = getById(item[recurse], id, recurse);
                    if (retval) return retval;
                }
            }
            return null;
    };

    var extractTitleAndPath = function (page) {
        return [page.title, page.path];
    };

    CKEDITOR.plugins.add('wiki_link', {
        init: function (editor, pluginPath) {
            CKEDITOR.on('dialogDefinition', function (e) {
                if ((e.editor != editor) || (e.data.name != 'link')) return;

                // Overrides definition.
                var definition = e.data.definition;
                definition.onFocus = CKEDITOR.tools.override(definition.onFocus, function (original) {
                    return function () {
                        original.call(this);
                        if (this.getValueOf('info', 'linkType') == 'wiki') {
                            this.getContentElement('info', 'wiki_link').selectParentTab();
                        }
                    };
                });

                var infoTab = definition.getContents('info');
                var content = getById(infoTab.elements, 'linkType');
                content.items.unshift(["Wiki link", 'wiki']);
                infoTab.elements.push({
                    type: 'vbox',
                    id: 'wikiOptions',
                    children: [{
                        type: 'select',
                        items: [],
                        id: 'wiki_link',
                        label: editor.lang.link.title,
                        required: true,
                        onLoad: function () {
                            //getAllPages
                        },
                        setup: function (data) {
                            var element_id = '#' + this.getInputElement().$.id;
                            var self = this;
                            $.getJSON("/pages.json?sort_by=path", function (pages) {
                                pages.forEach(function(page) {
                                    $(element_id).get(0).options[$(element_id).get(0).options.length] = new Option(page.title + " | " + page.path, page.path);
                                });
                                self.setValue(data.wiki_link || '');
                                self.getDialog().getContentElement('info', 'wiki_link').selectParentTab();
                            });
                        },
                    }
                    ]
                });
                content.onChange = CKEDITOR.tools.override(content.onChange, function (original) {
                    return function () {
                        original.call(this);
                        var dialog = this.getDialog();
                        var element = dialog.getContentElement('info', 'wikiOptions').getElement().getParent().getParent();
                        if (this.getValue() == 'wiki') {
                            element.show();
                            if (editor.config.linkShowTargetTab) {
                                dialog.showPage('target');
                            }
                            var uploadTab = dialog.definition.getContents('upload');
                            if (uploadTab && !uploadTab.hidden) {
                                dialog.hidePage('upload');
                            }
                        } else {
                            element.hide();
                        }
                    };
                });
                content.setup = function (data) {
                    if (data.type == "url" && data.url && data.url.protocol == undefined) {
                        data.type = 'wiki';
                        data.wiki_link = data.url.url;
                        delete data.url;
                    }
                    this.setValue(data.type);
                };
                content.commit = function (data) {
                    data.type = this.getValue();
                    if (data.type == 'wiki') {
                        data.type = 'url';
                        var dialog = this.getDialog();
                        dialog.setValueOf('info', 'protocol', '');
                        dialog.setValueOf('info', 'url', dialog.getValueOf('info', 'wiki_link'));
                    }
                };
            });
        }
    });
}(CKEDITOR));


(function (CKEDITOR) {
    //initize CK editor and page save events
    if (app.pageDeleted) return;
    if ($(".content.editable").length == 0) return;
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

        if (changed) {
            data = newData;
            $.post(document.location.href, {
                content: $(".content.editable").html(),
                title: $("h1.title").html(),
                tags: $(".tags div").html(),
                lastModified: $("h1.title").data().lastModified
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

    var saved = function (data) {
        $.message("success", __("page-saved"), 2e3);
        $(".modified-by strong")
        .text(readCookie("username"));
        $("h1:first").data().lastModified = data.lastModified;
    };
    var savingError = function (xhr, error, type) {
        if (type == "Conflict") {
            return app.modal(__("page-conflict-title"), __("page-conflict-description"))
            .on("click", "btn-confirm", function () {
                location.reload();
            })
            .on("click", "btn-cancle", function () {
                $(this).closest("modal").modal("hide").remove();
            });
        }
        if (xhr.responseText) {
            return $.message("error", __(xhr.responseText), 2e3);
        }
        $.message("error", __("page-could-not-be-saved"), 2e3);
    };
}(CKEDITOR));

(function ($) {
    //if not changed highlight text for easy replacement
    function getTextNodesIn(node) {
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
    }

    function setSelectionRange(el, start, end) {
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
    }

    $(".tags .edit")
    .focus(function () {
        if (this.innerText == __("tags-description")) {
            var el = this;
            setTimeout(function () {
                setSelectionRange(el, 0, el.innerText.length);
            }, 30);
        }
    });

    $("h1.edit")
    .focus(function () {
        if (this.innerText == __("new-page")) {
            var el = this;
            setTimeout(function () {
                setSelectionRange(el, 0, el.innerText.length);
            }, 30);
        }
    });
}(jQuery));

(function (app) {
    app.ProgressBar = function (target, upload) {
        var self = this;

        this.element = $('<progress min="0" max="100" value="0">0%</progress>')
        .appendTo(target)[0];

        upload.onprogress = function (e) {
            if (e.lengthComputable) {
                self.value = (e.loaded / e.total) * 100;
            }
        };

        Object.defineProperties(this, {
            value: {
                get: function () {
                    return this.element.value;
                },
                set: function (value) {
                    this.element.value = value;
                    this.textContent = this.value + "%"; // Fallback for unsupported browsers.

                    if (this.value == 100) {
                        this.remove();
                    }

                },
                writeable: true
            },

            textContent: {
                get: function () {
                    return this.element.textContent;
                },
                set: function (value) {
                    this.element.textContent = value;
                },
                writeable: true
            }
        });
    };

    app.ProgressBar.prototype.remove = function () {
        $(this.element).fadeOut(function () {
            $(this).remove();
        });
    };

})(app);

(function (app) {
    if (app.pageDeleted) return;
    var Dropzone = function (options) {
        this.element = options.element;
        this.toggleState = options.toggleState ||  toggleState;
        this.handleDragOver = options.handleDragOver ||  handleDragOver;
        this.handleFileSelect = options.handleFileSelect ||  handleFileSelect;

        this.addEventListeners();
    };

    Dropzone.prototype.addEventListeners = function () {
        this.element.addEventListener('dragover', this.handleDragOver, false);
        this.element.addEventListener('dragenter', this.toggleState, false);
        this.element.addEventListener('dragleave', this.toggleState, false);
        this.element.addEventListener('drop', this.handleFileSelect, false);
    };

    function handleDragOver(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    }

    function toggleState(ev) {
        $(ev.target).toggleClass('active');
    }

    app.Dropzone = Dropzone;
}(app));

(function (app) {
    app.handleErrors = function (xhr) {
        if (xhr.status >= 500) {
            $.message('error', __("error-500"));
        }

        if (xhr.status == 415) {
            $.message('error', __("error-415"));
        }

        if (xhr.status == 400) {
            $.message("error", __("error-400"));
        }
    };
}(app));

(function ($, app) {
    if (app.pageDeleted) return;
    if ($(".drop-here").length == 0) return;

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
        $("body").trigger("save");

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
            if (!finished && xhr.status == 200) {
                finished = true;
                handleResponse(xhr.responseText);
                $.message("success", __("successfully-uploaded"));
            }

            app.handleErrors(xhr);
        };


        var progressBar = new app.ProgressBar('#attachments', xhr.upload);

        xhr.send(formData); // multipart/form-data
    }

    var handleResponse = function (res) {
        var response = JSON.parse(res);
        response.attachments.forEach(function (attachment) {
            $('#attachments').append("<li><a href='/attachments/" + response.pageId + "/" + attachment + "' title='" + attachment + "'><i class='icon-file'></i>" + attachment + "</a><a href='#' class='icon-remove-sign'</li>");
        });
        $("h1:first").data().lastModified = response.lastModified;
    };
}(jQuery, app));

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

(function ($) {
    if (app.pageDeleted) return;
    $(".plain-list")
    .on("click", ".icon-remove-sign", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var li = $(this)
        .closest('li');
        var type = $(this)
        .closest(".plain-list")[0].id;
        $.ajax({
            url: "/" + type,
            type: "DELETE",
            data: {
                file: $(this)
                .prev("a")[0].title
            }
        })
        .done(function () {
            li.remove();
        });
    });
}(jQuery));

(function ($) {
    $('pre, code').each(function (i, e) {
        hljs.highlightBlock(e)
    });
}(jQuery));

(function ($) {
    if (app.pageDeleted) return;
    $("#move-page").click(function (e) {
        e.preventDefault();
        $('<form id="move-page-dialog" class="modal hide fade">\
            <div class="modal-header">\
            <h3>' + __("move-page") + '</h3>\
            </div>\
            <div class="modal-body">\
            <p>" + __("new-page") + "</p>\
            <p class="control-group">/ <input placeholder="/page/subpage" name="path" value="' + location.pathname.substring(1) + '"required/><br/><br/></p>\
            </div>\
            <div class="modal-footer">\
            <button type="submit" class="btn btn-primary">' + __("save-changes") + '</button>\
            </div>\
        </form>')
    .appendTo("body")
    .modal("show");
    $("#move-page-dialog").on("submit", handleSubmit);
    });

    var handleSubmit = function (e) {
        e.preventDefault();
        $.ajax({
            type: "PUT",
            data: {
                newPath: "/" + $("input[name=path]").val()
            }
        }).done(function (data) {
            $("#move-page-dialog").modal("hide").remove();
            if (data.status == "page-exists") {
                $.message("error", __("error-target-path-exists"));
            } else {
                $.message("success", __("page-moved"));
                location.replace(data.target);
            }
        }).fail(function (data) {
            $("#move-page-dialog").modal("hide").remove();
            $.message("error", __("error-400"));
        });
    };
}(jQuery));

(function ($) {
    // Load Images before show them - pages/covers
    // Fix cached images issues
    $(".img-polaroid").one("load", function () {
        $(".preview").each(function (index) {
            $(this).delay(100 * index).fadeIn(200);
        });
    }).each(function () {
        if (this.complete) $(this).load();
    });
}(jQuery));

(function ($) {
    //Switch language and store it in a cookie
    $(".language-switcher").find("a").click(function (e) {
        e.preventDefault();
        createCookie("locale", this.href.replace(/.*#/, ""), 720);
        location.reload();
    });
}(jQuery));

(function ($) {
    $("#delete-page").click(function (e) {
        e.preventDefault();
        $.ajax({
            type: "DELETE",
            url: location.href
        }).done(function () {
            location.reload();
        }).fail(function () {
            $.message('error', __("error-500"));
        });
    });

    $("#restore-page").click(function (e) {
        e.preventDefault();
        $.ajax({
            type: "PUT",
            url: location.href,
            data: {
                restore: true
            }
        }).done(function () {
            location.reload();
        }).fail(function (xhr) {
            $.message('error', __("error-" + xhr.status));
        });
    });

}(jQuery));

(function () {
    window.addEventListener("message", function(e) {
        if(e.data.message == "resize") {
            $("iframe").each(function () {
                if(this.contentWindow !== e.source) return;

                this.width = e.data.size.width;
                this.height = e.data.size.height;
            });
        }
    });
}());
