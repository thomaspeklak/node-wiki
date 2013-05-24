"use strict";

var config   = require("../config");
var mongoose = require("mongoose");
var Page     = require("../models/page");
var execFile = require("child_process").execFile;
var path     = require("path");

mongoose.connect(process.env.DB || config.db.url, function (err) {
    if (err) {
        process.stderr.write(err);
        process.exit(1);
    }
});

var finder = {
    deleted: true,
    lastModified: {$lt: new Date(Date.now() - config.keepDeleteItemsPeriod)}
};

var cleanUpDirectories = function (ids, cb) {
    var publicPath = path.join(__dirname, "../public");
    var imagesPaths = ids.map(function (id) { return path.join(publicPath, "images", id.toString()); });
    var attachmentsPaths = ids.map(function (id) { return path.join(publicPath, "attachments", id.toString()); });

    execFile("rm", ["-rf"].concat(imagesPaths).concat(attachmentsPaths), cb);
};

Page.find(finder, function (err, pages) {
    if(err) {
        process.stderr.write(err);
        process.exit(1);
    }

    var ids = pages.map(function (page) { return page._id; });


    Page.remove(finder, function (err, pages) {
        if(err) {
            process.stderr.write(err);
            process.exit(1);
        }

        cleanUpDirectories(ids, function (err) {
            if(err) {
                process.stderr.write(err);
                process.exit(1);
            }

            process.send(pages);
            process.exit();
        });
    });
});

