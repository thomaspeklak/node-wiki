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

    page.modifiedBy = req.cookies.username || "";
    return page;
};

var randomItem = function (items) {
    if (!items.length) return null;

    return items[Math.floor(Math.random() * items.length)];
};

var getImage = function (page) {
    var randomImage = randomItem(page.images);
    if (randomImage) return "/images/" + page._id + "/" + randomImage;

    var attachments = page.attachments.filter(function (attachment) {
        return attachment.match(/(.jpeg|.gif|.jpg|.png)$/i);
    });

    var randomAttachment = randomItem(attachments);
    if (randomAttachment) return "/attachments/" + page._id + "/" + randomAttachment;

    return "/static-images/noimg.png";
};

module.exports = function (app) {

    app.get("/pages", function (req, res) {
        Page.all(function (err, pages) {
            // TODO: err
            return res.render("pages", {
                title: req.i18n.__("All Pages"),
                pages: pages,
                content: "-"
            });
        });
    });

    app.post("/page/deleteprompt", function(req, res) {

        var password = req.body.password;

        if (password === config.contentManagerPassword) {

            res.json({
                status: 'OK'
            });

        } else {
            res.json({
                status: 'ERROR'
            });
        }
    });

    app.delete("/page", function(req, res) {

        var pageTitle = req.body.file;

        Page.findOne({title: pageTitle}, function(err, page) {

            if (page && page.remove) {
                page.remove();

                res.json({
                    status: 'OK'
                });
            } else {

                res.json({
                    status: 'ERROR'
                });
            }
        });
    });


    app.get("/pages/covers", function (req, res) {
        Page.allWithImages(function (err, pages) {
            return res.render("pages_cover", {
                title: req.i18n.__("All Pages"),
                pages: pages.map(function (page) {
                    return {
                        title: page.title,
                        image: getImage(page),
                        path: page.path
                    };
                })
            });
        });
    });
    app.get("*", function (req, res) {
        if (!res.locals.page) {
            res.locals.page = new Page({
                title: req.i18n.__("click here and enter page title"),
                tags: req.i18n.__("add tags as comma separated list"),
                content: req.i18n.__("click here and enter new content...")
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
            if (err)  {
                return res.send(400);
            }

            res.send(200);
        });
    });

    app.put("*", function (req, res) {
        if (!res.locals.page) {
            return res.send(404);
        }

        var page = res.locals.page;
        Page.findOne({
            path: req.body.newPath
        }, function (err, existingPage) {
            if (err) {
                console.error(err);
                return res.send(500);
            }

            if (existingPage) {
                return res.json({
                    status: "page-exists"
                });
            }

            page.path = req.body.newPath;
            page.save(function (err) {
                if (err) {
                    console.log(err);
                    return res.send(500);
                }

                res.json({
                    status: "page-moved",
                    target: req.body.newPath
                });
            });
        });
    });
};
