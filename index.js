"use strict";

var app = require("./app");
var db = require("./db-connector");
var http = require("http");

db.connect();

http.createServer(app).listen(app.get("port"), function () {
    console.log("Express server listening on port " + app.get("port"));
});

if (process.env.NODE_ENV == "development" ||  !process.env.NODE_ENV) {
    require("./lib/live-reload")();
}

require("./lib/wipe-timer").start();
require("./models/app").initialize();

