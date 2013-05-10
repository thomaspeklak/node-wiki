jQuery(document).ready(function() {

    $("#edit-navigation").on("click", function (e) {

        e.preventDefault();
        e.stopPropagation();

        document.location.href = "/navigation";
    });
});