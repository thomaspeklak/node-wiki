"use strict";

var ProgressBar = require("./progress-bar");
var Dropzone = require("./dropzone");
var handleErrors = require("./handle-xhr-errors");
var __ = require("./translate");
var injectMedia = require("./inject-media");

if ($("#content.editable").length == 0) return;

$(function () {
    if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
        return $(".drop-here").hide();
    }

    // Setup the dnd listeners.
    new Dropzone({
        element: document.getElementById("content").parentNode,
        handleFileSelect: handleDrop
    });
});

function handleDrop(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    $("body").trigger("save");

    var uri = evt.dataTransfer.getData("text/uri-list");
    if (uri && !uri.match('^file:\/\//')) {
        return injectMedia(uri, evt.target);
    }

    uploadFiles(document.location.href, evt.dataTransfer.files, evt.target);
}

function uploadFiles(url, files, targetElement) {
    var formData = new FormData();

    for (var i = 0, file; file = files[i]; ++i) {
        formData.append("images", file);
    }

    var xhr = new XMLHttpRequest();
    var finished = false;
    xhr.open('POST', "/images", true);
    xhr.onload = function (e) {
        if (!finished && xhr.status == 200) {
            finished = true;
            handleResponse.bind(targetElement)(xhr.responseText);
            message("success", __("successfully-uploaded"));
        }

        handleErrors(xhr);
    };


    var progressBar = new ProgressBar("#content", xhr.upload);

    xhr.send(formData); // multipart/form-data
}


var handleResponse = function (res) {
    var targetElement = $(this);
    var response = JSON.parse(res);
    response.images.forEach(function (image) {
        targetElement.append("<img class='polaroid' src='/images/" + response.pageId + "/" + image + "'/>");
        $('#images')
            .append("<li><a href='/images/" + response.pageId + "/" + image + "' title='" + image + "'><i class='icon-file'></i>" + image + "</a><a href='#' class='icon-remove-sign'</li>");
    });
    $("h1:first").data().lastModified = response.lastModified;
    $("body").trigger("save");
};
