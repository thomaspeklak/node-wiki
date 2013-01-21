"use strict";

var Page = require('../models/page');

module.exports = function (app) {
    app.get('/pages', function (req, res) {
        Page.all(function (err, pages) {
            // TODO: err
            return res.render('pages', {
                title: 'All Pages',
                pages: pages,
                latest: Page.latest(10),
                recentChanges: Page.recentChanges(10)
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
            page: res.locals.page,
            latest: Page.latest(10),
            recentChanges: Page.recentChanges(10)
        });
    });

    app.post("*", function (req, res) {
        var page = res.locals.page;

        if (!page) {
            page = new Page(req.body);
            page.path = req.path;
        } else {
            page.title = req.body.title;
            page.content = req.body.content;
            page.tags = req.body.tags;
        }

        page.save(function (err) {
            // TODO: Err!
            res.send(200);
        });
    });
};
