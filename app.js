"use strict";

var express = require("express"),
    http = require("http"),
    mongoose = require("mongoose"),
    config = require("./config");

mongoose.connect(process.env.DB || config.db, function (err) {
    if (err) {
        console.log("Could not connect to database \"" +
            "mongodb://localhost/nodewiki-" + config.locale +
            "\". Ensure that a mongo db instance is up and running.");
        console.log(err);
        process.exit(1);
    }
});
require("express-mongoose");

var app = express();
app.disable("x-powered-by");

app.configure(function () {
    app.set("port", process.env.PORT || config.port);
    app.set("views", __dirname + "/views/" + config.locale);
    app.set("view engine", "jade");
    app.use(express.favicon());
    app.use(express.logger("dev"));
    app.use(express.bodyParser({
        uploadDir: __dirname + "/uploads"
    }));
    app.use(express.cookieParser());
    app.use(express.methodOverride());

    app.use(express.static(__dirname + "/public"));
    app.use(app.router);
});

app.configure("development", function () {
    app.use(express.errorHandler());
});

app.all("*", require("./middleware/load-navigation"));
app.all("*", require("./middleware/load-static-navigation"));
app.all("*", require("./middleware/build-breadcrumbs"));
app.all("*", require("./middleware/load-page"));

require("./routes")(app);

http.createServer(app).listen(app.get("port"), function () {
    console.log("Express server listening on port " + app.get("port"));
});

if (process.env.NODE_ENV == "development" ||  !process.env.NODE_ENV) {
    require("./lib/live-reload")();
}
