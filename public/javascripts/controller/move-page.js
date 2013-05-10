jQuery(document).ready(function() {

    $("#move-page").click(function (e) {
        e.preventDefault();
        $('<form id="move-page-dialog" class="modal hide fade">\
          <div class="modal-header">\
              <h3>' + i18n["Move page"] + '</h3>\
              </div>\
              <div class="modal-body">\
              <p>' + i18n["New path"] + '</p>\
              <p class="control-group">/ <input placeholder="/page/subpage" name="path" value="' + location.pathname.substring(1) + '"required/><br/><br/></p>\
              </div>\
              <div class="modal-footer">\
              <button type="submit" class="btn btn-primary">' + i18n["Save changes"] + '</button>\
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
                $.message("error", i18n["Target path exists already. Can not move the page"]);
            } else {
                $.message("success", i18n["Page succesfully moved"]);
                location.replace(data.target);
            }
        }).fail(function (data) {
            $("#move-page-dialog").modal("hide").remove();
            $.message("error", i18n["Somthing bad happend"]);
        });
    };
});