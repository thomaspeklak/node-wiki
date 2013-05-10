jQuery(document).ready(function() {

    $("#new-page").on("click", function (e) {

        e.preventDefault();
        e.stopPropagation();

        var pagePath = prompt(i18n["Please enter the new page's path"]);

        if (pagePath) {

            if (pagePath.indexOf('/') > -1 || pagePath.indexOf('#') > -1 ) {
                $.message("error", i18n["Slashes and hashes are not allowed in page names."], 2e3);
                return;
            }
            document.location.href = "/" + encodeURIComponent(pagePath);
        }
    });
});