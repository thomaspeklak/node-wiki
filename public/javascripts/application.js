Aloha.ready(function() {
    var $ = Aloha.jQuery;
    $('.editable').aloha();
    var save = function() {
            $.post(document.location.href, {
                content: $('.content.editable').html(),
                title: $('h1.title').html(),
                tags: $(".tags div").html()
            }).success(saved);
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
        var el = $("<div class='alert alert-success'>Saved</div>").appendTo('body .container');
        setTimeout(function() {
            el.remove();
        }, 2e3);
    };
