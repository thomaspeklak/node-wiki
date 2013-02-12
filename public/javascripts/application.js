var app = {};

function createCookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

(function($){
    //prompt user for a username if he has not already provided one

    if(readCookie("username")) return;

    function handleSubmit (e) {
        e.preventDefault();
        var username = $("input[name=username]").val();
        if(!username.length){
            return $("input[name=username]").parent().addClass('error');
        }
        createCookie("username", username, 720);
        modal.modal("hide");

    }

    var modal = $('<form id="saveUsername" class="modal hide fade">\
                  <div class="modal-header">\
                  <h3>Identify yourself</h3>\
                  </div>\
                  <div class="modal-body">\
                  <p>Just type a username, node wiki ain\'t no high security vault.</p>\
                  <p class="control-group"><input placeholder="Username" name="username" required/><br/><br/></p>\
                  </div>\
                  <div class="modal-footer">\
                  <button type="submit" class="btn btn-primary">Save changes</button>\
                  </div>\
                  </form>')
                  .appendTo("body")
                  .modal("show");
                  $("#saveUsername").on("submit",handleSubmit);

}(jQuery));

(function($){
    //Enable link clicking if editor is not active
    clickingLink = false;
    $(".content.editable").on("mousedown", function(e){
        if(e.target.tagName == "A" && !$(this).hasClass("cke_focus")){
            clickingLink = true;
            e.preventDefault();
            e.stopImmediatePropagation();
        }
    }).on("mouseup", function(e){
        if(clickingLink){
            location.href = e.target.href;
            e.preventDefault();
            e.stopImmediatePropagation();
        }
        clickingLink = false;
    });
}(jQuery));

(function($){
    //provide an interface to display a message to the user
    $.message = function(type, message, delay){
        delay = delay || 5e3;
        var html = '<div class="alert alert-' + type +'"> \
        <button type="button" class="close" data-dismiss="alert">&times;</button> \
        ' + message + '\
        </div>';

        $(html).appendTo('#messages').delay(delay).fadeOut(remove);
    };

    function remove(){
        $(this).remove();
    }
}(jQuery));

(function(CKEDITOR){
    //initize CK editor and page save events
    var getData = function(){
        return {
            content: $('.content.editable').html().replace(" class=\"aloha-link-text\"", ""),
            title: $('h1.title').html(),
            tags: $(".tags div").html()
        };
    };
    var data = getData();
    var save = function() {
        var newData = getData();
        var changed = ["content", "title", "tags"].some(function(key){
            return data[key] != newData[key];
        });

        if(changed){
            data  = newData;
            $.post(document.location.href, {
                content: $('.content.editable').html(),
                title: $('h1.title').html(),
                tags: $(".tags div").html()
            }).success(saved)
            .error(savingError);
        }
    };

    setInterval(save, 6e4);
    $("body").bind("save", save);

    CKEDITOR.inline('content', {
        on: {
            blur: save
        }
    });

    $('.edit').blur(save).keydown(function(e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            $(this).blur();
        }
    });

    var saved = function() {
        $.message('success', 'Page saved', 2e3);
        $(".modified-by strong").text(readCookie("username"));
    };
    var savingError = function() {
        $.message('error', 'Page could not be saved, please try again later', 2e3);
    };

}(CKEDITOR));

(function(app) {
    app.ProgressBar = function (target) {
        this.element = $('<progress min="0" max="100" value="0">0% complete</progress>').appendTo(target)[0];
        Object.defineProperties(this, {
            value : {
                get: function(){return this.element.value;},
                set: function(value) {this.element.value = value;},
                writeable: true
            },

            textContent : {
                get: function(){return this.element.textContent;},
                set: function(value) {this.element.textContent = value; },
                writeable: true
            }
        });
    };

    app.ProgressBar.prototype.remove = function(){
        $(this.element).fadeOut(function(){
            $(this).remove();
        });
    };

})(app);

(function(app) {
    var Dropzone = function (options) {
        this.element = options.element;
        this.toggleState = options.toggleState || toggleState;
        this.handleDragOver = options.handleDragOver || handleDragOver;
        this.handleFileSelect = options.handleFileSelect || handleFileSelect;

        this.addEventListeners();
    };

    Dropzone.prototype.addEventListeners = function() {
        this.element.addEventListener('dragover'  , this.handleDragOver   , false);
        this.element.addEventListener('dragenter' , this.toggleState      , false);
        this.element.addEventListener('dragleave' , this.toggleState      , false);
        this.element.addEventListener('drop'      , this.handleFileSelect , false);
    };

    function handleDragOver(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    }

    function toggleState(ev){
        $(ev.target).toggleClass('active');
    }




    app.Dropzone = Dropzone;
}(app));


(function($){

    $(function(){
        if(!(window.File && window.FileReader && window.FileList && window.Blob)) {
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
        xhr.onload = function(e) {
            if(!finished && xhr.status == 200){
                finished = true;
                handleResponse(xhr.responseText);
                $.message("success", "Successfully uploaded");
            }

            if(xhr.status >= 500){
                $.message('error', 'Internal Server Error');
            }

            if(xhr.status == 415){
                $.message('error', 'Unsupported media type');
            }

            if(xhr.status == 400){
                $.message("error", "I don't know");
            }
        };


        var progressBar = new app.ProgressBar('#attachments');

        xhr.upload.onprogress = function(e) {
            if (e.lengthComputable) {
                progressBar.value= (e.loaded / e.total) * 100;
                progressBar.textContent = progressBar.value; // Fallback for unsupported browsers.

                if(progressBar.value == 100){
                    progressBar.remove();
                }
            }
        };


        xhr.send(formData);  // multipart/form-data
    }

    var handleResponse = function(res){
        var response = JSON.parse(res);
        response.attachments.forEach(function(attachment){
            $('#attachments').append("<li><a href='/attachments/" + response.pageId + "/" + attachment + "' title='" + attachment + "'><i class='icon-file'></i>" + attachment + "</a><a href='#' class='icon-remove-sign'</li>");
        });
    };
}(jQuery));

(function($){

    $(function(){
        if(!(window.File && window.FileReader && window.FileList && window.Blob)) {
            return $('.drop-here').hide();
        }

        // Setup the dnd listeners.
        new app.Dropzone({
            element: document.getElementById('content'),
            handleFileSelect: handleFileSelect
        });
    });

    function handleFileSelect(evt) {
        evt.stopPropagation();
        evt.preventDefault();

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
        xhr.onload = function(e) {
            if(!finished && xhr.status == 200){
                finished = true;
                handleResponse.bind(targetElement)(xhr.responseText);
                $.message("success", "Successfully uploaded");
            }

            if(xhr.status >= 500){
                $.message('error', 'Internal Server Error');
            }

            if(xhr.status == 415){
                $.message('error', 'Unsupported media type');
            }

            if(xhr.status == 400){
                $.message("error", "I don't know");
            }
        };


        var progressBar = new app.ProgressBar("#content");

        xhr.upload.onprogress = function(e) {
            if (e.lengthComputable) {
                progressBar.value= (e.loaded / e.total) * 100;
                progressBar.textContent = progressBar.value; // Fallback for unsupported browsers.

                if(progressBar.value == 100){
                    progressBar.remove();
                }
            }
        };

        xhr.send(formData);  // multipart/form-data
    }

    var handleUriDrop = function (uri, targetElement) {
        if(uri.indexOf("youtube.com/watch") !== -1) {
            var youtube = uri.match(/v=(.*?)(?:$|&)/);
            if(!youtube[1]) return;
            $(targetElement).append('<iframe width="640" height="480" src="http://www.youtube.com/embed/'+youtube[1]+'" frameborder="0" allowfullscreen></iframe>');
        } else if(uri.indexOf("vimeo.com/") !== -1) {
            var vimeo = uri.match(/vimeo.com\/(.*?)(?:$|\?)/);
            if(!vimeo[1]) return;
            $(targetElement).append('<iframe src="http://player.vimeo.com/video/'+vimeo[1]+'" width="640" height="480" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>');
        } else {
            $(targetElement).append("<img class='polaroid' src='" + uri + "'/>");
        }
        $("body").trigger("save");
    };

    var handleResponse = function(res){
        var targetElement = $(this);
        var response = JSON.parse(res);
        response.images.forEach(function(image){
            targetElement.append("<img class='polaroid' src='/images/" + response.pageId + "/" + image + "'/>");
            $('#images').append("<li><a href='/images/" + response.pageId + "/" + image + "' title='" + image + "'><i class='icon-file'></i>" + image + "</a><a href='#' class='icon-remove-sign'</li>");
        });
        $("body").trigger("save");
    };
}(jQuery));

(function($) {
    $(".plain-list").on("click", ".icon-remove-sign", function(e) {
        e.preventDefault();
        e.stopPropagation();
        var li = $(this).closest('li');
        var type = $(this).closest(".plain-list")[0].id;
        $.ajax({
            url: "/" + type,
            type: "DELETE",
            data: {
                file: $(this).prev("a")[0].title
            }
        }).done(function(){
            li.remove();
        });
    });
}(jQuery));

(function($){
    $('pre, code').each(function(i, e) {hljs.highlightBlock(e)});
}(jQuery));
