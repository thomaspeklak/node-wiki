"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schema = new Schema({
    version: String,
    installDate: {
        type: Date,
        default: Date.now
    },
    lastStart: {
        type: Date
    }
});

var App = mongoose.model("App", schema);
module.exports = App;

module.exports.initialize = function (cb) {
    App.findOne(function (err, app) {
        if (err) throw err;

        if (!app) {
            app = new App({
                version: 0
            });
        }

        app.lastStart = Date.now();

        app.save(function (err) {
            if (err) console.error(err);

            if (cb) cb(err, app);
        });
    });
};
