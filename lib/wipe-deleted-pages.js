"use strict";

var config = require("../config");
var mongoose = require("mongoose");
var Page = require("../models/page");

mongoose.connect(process.env.DB || config.db.url, function (err) {
    if (err) {
        process.stderr.write(err);
        process.exit(1);
    }
});

Page.remove({
    deleted: true,
    lastModified: {$lt: new Date(Date.now() - config.keepDeleteItemsPeriod)}
}, function (err, pages) {
    if(err) {
        process.stderr.write(err);
        process.exit(1);
    }

    process.send(pages);
    process.exit();
});

