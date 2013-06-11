"use strict";

var express = require("express");
var I18n    = require("i18n-2");
var config  = require("./config");

require("express-mongoose");

var app = express();

app.disable("x-powered-by");

app.configure(function () {
    app.set("port", process.env.PORT || 3000);
    app.set("views", __dirname + "/views");
    app.set("view engine", "jade");
    app.use(express.favicon());
    app.use(express.logger("dev"));
    app.use(express.bodyParser({
        uploadDir: __dirname + "/uploads"
    }));
    app.use(express.cookieParser());
    app.use(express.methodOverride());

    I18n.expressBind(app, {
        locales: config.locales
    });

    app.use(express.static(__dirname + "/public"));
});

app.configure("development", function () {
    app.use(express.errorHandler());
});

app.use(require("./middleware/set-locale"));
app.use(require("./middleware/load-navigation"));
app.use(require("./middleware/build-breadcrumbs"));
app.use(require("./middleware/load-page"));

app.use(app.router);
require("./routes")(app);

module.exports = app;
