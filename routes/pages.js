"use strict";

var Page = require("../models/page");
var setProps = require("../lib/set-props");

var setPage = function (req, res) {
    var page = res.locals.page;

    if (page) {
        setProps(req.body, ["title", "content", "tags"], page);
    } else {
        page = new Page(req.body);
        page.path = req.path;
    }

    page.modifiedBy = req.cookies.username || "";
    return page;
};

module.exports = function (app) {
    app.get("/pages", function (req, res) {
        Page.all(function (err, pages) {
            // TODO: err
            return res.render("pages", {
                title: "All Pages",
                pages: pages
            });
        });
    });

    app.get("*", function (req, res) {
        if (!res.locals.page) {
            res.locals.page = new Page({
                title: "new page",
                tags: "add tags as comma separated list",
                content: "Content"
            });
        }

        return res.render("page", {
            title: res.locals.page.title,
            page: res.locals.page
        });
    });

    app.post("*", function (req, res) {
        var page = setPage(req, res);

        page.save(function (err) {
            if (err) {
                return res.send(400);
            }

            res.send(200);
        });
    });
};
