"use strict";
var config = require("../config");
var mongoose = require("mongoose");
var App = require("../models/app");
var Page = require("../models/page");
var Package = require("../package");
var semver = require("semver");

mongoose.connect(config.db.url);

var migrations = [{
        version: "0.2.0",
        run: function (cb) {
            Page.update({}, {
                $set: {
                    deleted: false
                }
            }, {
                multi: true
            }, function (err) {
                cb(err);
            });
        }
    }
];

var Queue = function (migrations) {
    this.migrations = migrations;
    this.length = migrations.length;
    this.current = 0;
};

Queue.prototype.run = function (cb) {
    this.cb = cb;
    if (this.length === 0) return cb();

    this.next();
};

Queue.prototype.next = function (err) {
    if (err) this.exit(err);

    if (this.length == this.current) {
        return this.cb(null, this.migrations[this.current - 1].version);
    }

    this.migrations[this.current++].run(this.next.bind(this));
};

Queue.prototype.exit = function (err) {
    this.cb(err, this.migrations[this.current - 1].version);
};

var checkVersion = function (err, app) {
    if (app.version == Package.version) {
        console.log("nothing to migrate");
        process.exit();
    }

    var queue = new Queue(migrations.filter(function (migration) {
        return semver.gt(migration.version, app.version);
    }));
    queue.run(function (err, version) {
        if (err) {
            console.dir(err);
        }

        app.version = err ? version : Package.version;
        app.save(function (err) {
            if(err) console.error(err);
            console.log("finished");
            process.exit();
        });
    });

};

App.findOne(function (err, app) {
    if (err) throw err;

    if (!app) {
        return require("../models/app").initialize(checkVersion);
    }

    checkVersion(err, app);
});
