"use strict";
var mongoose = require("mongoose");
var config   = require("./config");
var Page     = require("./models/page");

module.exports = {
    connect: function (cb) {
        mongoose.connect(process.env.DB || config.db.url, function (err) {
            if (err) {
                console.log("Could not connect to database \"" +
                    "mongodb://localhost/nodewiki" +
                    "\". Ensure that a mongo db instance is up and running.");
                console.log(err);
                process.exit(1);
            }

            if (cb) cb(err);
        });
    },
    close: function (cb) {
        mongoose.disconnect(cb);
    },
    wipe: function (cb) {
        Page.remove({}, cb);
    }
};
