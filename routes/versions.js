"use strict";

var Page = require("../models/page");

var next = function (versions, id) {
    for (var i = 0; i < versions.length; i++) {
        if (versions[i]._id == id && versions[i + 1]) return versions[i + 1];
    }
};

var previous = function (versions, id) {
    for (var i = 0; i < versions.length; i++) {
        if (versions[i]._id == id && versions[i - 1]) return versions[i - 1];
    }
};

module.exports = function (app) {
    app.get("/versions", function (req, res) {
        Page.VersionedModel.latest(100, function (err, pages) {
            res.render("versionedpages", {
                pages: pages,
                title: "Page Versions"
            });
        });
    });

    app.get("/versions/:pageId", function (req, res) {
        var pageId = req.param("pageId");

        if (!pageId) {
            return res.send(400);
        }

        res.render("versions", {
            document: Page.VersionedModel.findOne({
                refId: pageId
            }),
            page: Page.findOne({
                _id: pageId
            }),
            title: "Versions"
        });
    });

    app.get("/versions/:pageId/:version", function (req, res) {
        Page.VersionedModel.findOne({
            refId: req.params.pageId
        }).exec(function (err, history) {
            if (err) {
                console.error(err);
                res.send(500);
            }

            var version = history.versions.id(req.params.version);

            if (!version) {
                res.send(404);
            }

            res.render("version", {
                version: version,
                page: Page.findOne({
                    _id: req.params.pageId
                }),
                title: "Version for " + version.title,
                next: next(history.versions, req.params.version),
                previous: previous(history.versions, req.params.version),
            });
        });
    });
};
