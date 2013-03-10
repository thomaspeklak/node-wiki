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

module.exports = function (app) {
    app.get("/pages", function (req, res) {
        Page.all(function (err, pages) {
            // TODO: err
            return res.render("pages", {
                title: "All Pages",
                pages: pages,
                content: "Own"
            });
        });
    });

    app.get("/pages/covers", function(req, res){
        Page.allWithImages(function(err, pages){
            // Remove all non-images from attachments
            for (var idx = 0; idx < pages.length; idx ++)
            {
                for(var idy = 0; idy < pages[idx].attachments.length; idy ++)
                {
                    // Remove all non-images
                    if (!pages[idx].attachments[idy].match(/(.jpeg|.gif|.jpg|.png)$/i)) 
                    {
                        pages[idx].attachments.splice(idy,1);
                    }
                }
                // choose random preview image
                if (pages[idx].attachments.length > 1)
                {
                    var rnd = Math.floor(Math.random() * pages[idx].attachments.length); // Random between 0 and arraylength
                    pages[idx].attachments = pages[idx].attachments[rnd];
                }
            }
            return res.render("pages_cover", {
                title: "All Pages",
                pages: pages,
                content: "Own"
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
