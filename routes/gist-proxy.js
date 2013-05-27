"use strict";

module.exports = function(app) {
    app.get("/gist-proxy/*", function (req, res) {
        res.render("gist-proxy", {
            uri: req.path.replace("/gist-proxy/", "https://gist.github.com/") + ".js"
        });
    });
};
