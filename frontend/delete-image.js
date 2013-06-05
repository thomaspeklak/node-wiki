"use strict";

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
