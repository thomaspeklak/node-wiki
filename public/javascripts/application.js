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

Aloha.ready(function() {
    var getData = function(){
        return {
            content: $('.content.editable').html(),
            title: $('h1.title').html(),
            tags: $(".tags div").html()
        };
    };

    var data = getData();

    var A$ = Aloha.jQuery;
    A$('.editable').aloha();
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
            }).success(saved);
        }
    };
    Aloha.bind('aloha-editable-deactivated', save);
    $('.edit').blur(save).keydown(function(e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            $(this).blur();
        }
    });
});
var saved = function() {
    $.message('success', 'Page saved', 2e3);
};

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
                $.message("success", "Successfully uploaded")
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

        xhr.send(formData);  // multipart/form-data
    }

    var handleResponse = function(res){
        var response = JSON.parse(res);
        response.attachments.forEach(function(attachment){
            $('#attachments').append("<li><a href='/attachments/" + response.pageId + "/" + attachment + "'><i class='icon-file'></i>" + attachment + "</a></li>");
        });
    };
}(jQuery));
