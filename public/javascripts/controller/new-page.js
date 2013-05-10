jQuery(document).ready(function() {

    $("#new-page").on("click", function (e) {

        e.preventDefault();
        e.stopPropagation();

        var pagePath = prompt(i18n["Please enter the new page's path"]);

        if (pagePath) {
            document.location.href = "/" + encodeURIComponent(pagePath);
        }
    });
});