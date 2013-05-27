(function () {
    "use strict";
    window.parent.postMessage({
        message: "resize",
        size: {
            height: document.body.clientHeight,
            width: document.getElementsByTagName("table")[0].scrollWidth
        }
    }, "*");
}());
