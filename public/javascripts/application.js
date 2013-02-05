(function($){
    clickingLink = false;
    $(".content.editable").on("mousedown", function(e){
        if(e.target.tagName == "A" && !$(this).hasClass("aloha-editable-active")){
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
    };
    var savingError = function() {
        $.message('error', 'Page could not be saved, please try again later', 2e3);
    };

}(CKEDITOR));

(function($){

    $(function(){
        if(!(window.File && window.FileReader && window.FileList && window.Blob)) {
            return $('.drop-here').hide();
        }

        // Setup the dnd listeners.
        var dropZone = document.getElementById('drop-zone');
        dropZone.addEventListener('dragover', handleDragOver, false);
        dropZone.addEventListener('dragenter', toggleState, false);
        dropZone.addEventListener('dragleave', toggleState, false);
        dropZone.addEventListener('drop', handleFileSelect, false);
    });

    function handleFileSelect(evt) {
        evt.stopPropagation();
        evt.preventDefault();

        uploadFiles(document.location.href, evt.dataTransfer.files);
    }

    function handleDragOver(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    }

    function toggleState(ev){
        $(ev.target).toggleClass('active');
    }

    var ProgressBar = function(){
        return $('<progress min="0" max="100" value="0">0% complete</progress>').appendTo('#attachments')[0];
    };

    var remove = function(progressBar){
        $(progressBar).fadeOut(function(){
            $(this).remove();
        });
    };

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


        var progressBar = new ProgressBar();

        xhr.upload.onprogress = function(e) {
            if (e.lengthComputable) {
                progressBar.value = (e.loaded / e.total) * 100;
                progressBar.textContent = progressBar.value; // Fallback for unsupported browsers.

                if(progressBar.value == 100){
                    remove(progressBar);
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
        var dropZone = document.getElementById('content');
        dropZone.addEventListener('dragover', handleDragOver, false);
        dropZone.addEventListener('dragenter', toggleState, false);
        dropZone.addEventListener('dragleave', toggleState, false);
        dropZone.addEventListener('drop', handleFileSelect, false);
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

    function handleDragOver(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    }

    function toggleState(ev){
        $(ev.target).toggleClass('active');
    }

    var ProgressBar = function(){
        return $('<progress min="0" max="100" value="0">0% complete</progress>').after('#content')[0];
    };

    var remove = function(progressBar){
        $(progressBar).fadeOut(function(){
            $(this).remove();
        });
    };

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


        var progressBar = new ProgressBar();

        xhr.upload.onprogress = function(e) {
            if (e.lengthComputable) {
                progressBar.value = (e.loaded / e.total) * 100;
                progressBar.textContent = progressBar.value; // Fallback for unsupported browsers.

                if(progressBar.value == 100){
                    remove(progressBar);
                }
            }
        };


        xhr.send(formData);  // multipart/form-data
    }

    var handleUriDrop = function (uri, targetElement) {
        $(targetElement).append("<img class='polaroid' src='" + uri + "'/>");
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
