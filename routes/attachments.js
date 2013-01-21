"use strict";

var Page = require("../models/page");
var parse = require("url").parse;
var moveFiles = require("../lib/move-files");

var supportedTypes = [
    "text/plain",
    "application/zip",
    "application/pdf",
    "image/gif",
    "image/jpeg",
    "image/pjpeg",
    "image/png",
    "image/svg+xml",
    "text/csv"
];

module.exports = function (app) {

    app.post('/attachments', function (req, res) {
        if (!req.headers.referer || !req.files.attachments) { return res.send(400); }

        var files = req.files.attachments[0] ? req.files.attachments : [req.files.attachments];

        var unsupportedMedia = files.some(function (file) {
            return supportedTypes.indexOf(file.type) === -1;
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

            moveFiles(page, files, function (err, attachments) {
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
};
