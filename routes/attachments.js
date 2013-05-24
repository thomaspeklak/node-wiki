"use strict";

var Page = require("../models/page");
var parse = require("url").parse;
var moveFiles = require("../lib/move-files");
var supportedMediaTypes = require("../config").supportedMediaTypes;
var fs = require("fs");
var path = require("path");
var request = require("request");


var loadPage = function (req, res, next) {
    if (!req.headers.referer) {
        return res.send(400);
    }

    var referer = parse(req.headers.referer);

    Page.findOne({path: referer.pathname, deleted: false}, function (err, page) {
        if (err) {
            console.error(err);
            return res.send(400);
        }

        if (!page) return res.send(404);

        req.page = page;
        next();
    });
};

module.exports = function (app) {

    app.post("/attachments", loadPage, function (req, res) {
        if(!req.files.attachments) { return res.send(400); }
        var files = req.files.attachments[0] ? req.files.attachments : [req.files.attachments];

        var unsupportedMedia = files.some(function (file) {
            return supportedMediaTypes.media.indexOf(file.type) === -1;
        });

        if (unsupportedMedia) {
            return res.send(415);
        }

        var page = req.page;

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
                    pageId: page._id,
                    lastModified: page.lastModified.getTime()
                });
            });
        });
    });

    app.post("/images", loadPage, function (req, res) {
        if(!req.files.images) { return res.send(400); }
        var files = req.files.images[0] ? req.files.images : [req.files.images];

        var unsupportedImageType = files.some(function (file) {
            return supportedMediaTypes.images.indexOf(file.type) === -1;
        });

        if (unsupportedImageType) {
            return res.send(415);
        }

        var page = req.page;
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
                    pageId: page._id,
                    lastModified: page.lastModified.getTime()
                });
            });
        });
    });

    app.delete("/attachments", loadPage, function (req, res) {
        var removedFile = null;
        var page = req.page;
        page.attachments = page.attachments.filter(function (attachment) {
            if (req.body.file == attachment) {
                removedFile = attachment;
                return false;
            }
            return true;
        });

        if (removedFile) {
            return page.save(function(err) {
                if(err) {console.error(err); return 500; }
                fs.unlink(path.join(__dirname, "..", "public", "attachments", page.id, removedFile), function(err) {
                    res.send(200, {
                        lastModified: page.lastModified.getTime()
                    });
                });
            });
        }
        res.send(404);
    });

    app.delete("/images", loadPage, function (req, res) {
        var removedFile = null;
        var page = req.page;
        page.images = page.images.filter(function (image) {
            if (req.body.file == image) {
                removedFile = image;
                return false;
            }
            console.log(true);
            return true;
        });

        if (removedFile) {
            return page.save(function(err) {
                if(err) {console.error(err); return 500; }
                fs.unlink(path.join(__dirname, "..", "public", "images", page.id, removedFile), function(err) {
                    res.send(200, {
                        lastModified: page.lastModified.getTime()
                    });
                });
            });
        }
        res.send(404);
    });

    app.get('/detect-content-type', function(req, res) {
        if(!req.query.uri) return res.send(400);

        request.head(req.query.uri, function(err, data) {
            if (err) return res.send(401);

            if(data && data.headers && data.headers["content-type"]) {
                return res.send(data.headers["content-type"]);
            }

            res.send("unknown/type");
        });
    });
};
