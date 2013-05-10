jQuery(document).ready(function() {

    $("#delete-page").on("click", function (e) {

        e.preventDefault();
        e.stopPropagation();

        var passwordEntered = prompt(i18n["Please enter content manager password:"]);

        if (passwordEntered) {

            $.ajax({
                url: "/page/deleteprompt",
                type: "POST",
                data: {
                    password: passwordEntered
                },
                complete: function(jqXHR, textStatus) {

                    if (JSON.parse(jqXHR.responseText).status === "OK") {

                        $.ajax({
                            url: "/page",
                            type: "DELETE",
                            data: {
                                file: document.title
                            },
                            complete: function (jqXHR, textStatus) {

                                if (JSON.parse(jqXHR.responseText).status === "OK") {
                                    document.location.href = "/";
                                } else {

                                    $.message("error", i18n["Could not delete page."], 2e3);
                                }
                            }
                        });
                    } else {
                        $.message("error", i18n["Password wrong. Page wasn't deleted."], 2e3);
                    }
                }
            });
        }
    });
});