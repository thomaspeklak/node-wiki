"use strict";
console.log("starting");
window.app = {};

app.pageDeleted = $("div.container.deleted").length > 0;


require("./cookies");
require("./translate");
require("./modal");
require("./identify-user");
require("./message");
require("./focus-contenteditable");
require("./enable-link-clicking");
require("./ckeditor-wiki-links");
require("./ckeditor-initialize");
require("./progress-bar");
require("./dropzone");
require("./handle-xhr-errors");
require("./upload-attachments");
require("./upload-images");
require("./delete-image");
require("./highlight-code");
require("./move-page");
require("./cover-image-loader");
require("./language-switcher");
require("./page-actions");
require("./resize-iframe");
