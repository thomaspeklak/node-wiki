"use strict";
var mongoose = require("mongoose");
var config   = require("./config");
var Page     = require("./models/page");

module.exports = {
    connect: function () {
        mongoose.connect(process.env.DB || config.db.url, function (err) {
            if (err) {
                console.log("Could not connect to database \"" +
                    "mongodb://localhost/nodewiki" +
                    "\". Ensure that a mongo db instance is up and running.");
                console.log(err);
                process.exit(1);
            }
        });
    },
    close: function (cb) {
        mongoose.connection.close(cb);
    },
    wipe: function (cb) {
        Page.remove({}, cb);
    }
};
