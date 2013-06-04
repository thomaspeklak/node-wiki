"use strict";

(function () {
    window.addEventListener("message", function(e) {
        if(e.data.message == "resize") {
            $("iframe").each(function () {
                if(this.contentWindow !== e.source) return;

                this.width = e.data.size.width;
                this.height = e.data.size.height;
            });
        }
    });
}());

