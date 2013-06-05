"use strict";

var ProgressBar = function (target, upload) {
    var self = this;

    this.element = $('<progress min="0" max="100" value="0">0%</progress>')
        .appendTo(target)[0];

    upload.onprogress = function (e) {
        if (e.lengthComputable) {
            self.value = (e.loaded / e.total) * 100;
        }
    };

    Object.defineProperties(this, {
        value: {
            get: function () {
                return this.element.value;
            },
            set: function (value) {
                this.element.value = value;
                this.textContent = this.value + "%"; // Fallback for unsupported browsers.

                if (this.value == 100) {
                    this.remove();
                }

            },
            writeable: true
        },

        textContent: {
            get: function () {
                return this.element.textContent;
            },
            set: function (value) {
                this.element.textContent = value;
            },
            writeable: true
        }
    });
};

ProgressBar.prototype.remove = function () {
    $(this.element).fadeOut(function () {
        $(this).remove();
    });
};

module.exports = ProgressBar;
