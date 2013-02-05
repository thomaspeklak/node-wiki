"use strict";

var Page = require("../models/page");
var parse = require("url").parse;
var moveFiles = require("../lib/move-files");
var supportedMediaTypes = require("../config").supportedMediaTypes;

module.exports = function (app) {

    app.post("/attachments", function (req, res) {
        if (!req.headers.referer || !req.files.attachments) {
            return res.send(400);
        }

        var files = req.files.attachments[0] ? req.files.attachments : [req.files.attachments];

        var unsupportedMedia = files.some(function (file) {
            return supportedMediaTypes.media.indexOf(file.type) === -1;
        });

        if (unsupportedMedia) {
            return res.send(415);
        }

        var referer = parse(req.headers.referer);

        Page.findOne({path: referer.path}, function (err, page) {
            if (err) {
                console.error(err);
                return res.send(400);
            }

            moveFiles(page, files, "attachments", function (err, attachments) {
                if (err) {
                    console.error(err);
                    return res.send(400);
                }

                page.attachments = page.attachments.concat(attachments);
                page.save(function (err) {
                    if (err) { return res.send(500); }

                    res.send({
                        attachments: attachments,
                        pageId: page._id
                    });
                });
            });
        });
    });

    app.post("/images", function (req, res) {
        if (!req.headers.referer) {
            res.send(400);
        }
        if(req.files.images) {
            return uploadImages(req, res);
        }

        if(req.body.images) {
            return storeUrlReferences(req, res);
        }

    });

    var uploadImages = function (req, res) {
        var files = req.files.images[0] ? req.files.images : [req.files.images];

        var unsupportedImageType = files.some(function (file) {
            return supportedMediaTypes.images.indexOf(file.type) === -1;
        });

        var referer = parse(req.headers.referer);

        Page.findOne({path: referer.path}, function (err, page) {
            if(err) {
                console.error(err);
                return res.send(400);
            }

            moveFiles(page, files, "images", function (err, images) {
                if (err) {
                    console.error(err);
                    return res.send(400);
                }

                page.images = page.images.concat(images);
                page.save(function (err) {
                    if (err) {
                        console.error(err);
                        return res.send(500);
                    }

                    res.send({
                        images: images,
                        pageId: page._id
                    });
                });

            });
        });
    };
};
