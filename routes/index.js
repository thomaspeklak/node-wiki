var Page = require('../models/page');

exports.loadPage = function(req,res, next) {
    Page.findOne({ path : req.path }, function(err, page) {
       if (err) { return next(err); }

        res.locals.page = page;
        next();
    });
};

exports.showPage = function(req, res) {
    if (!res.locals.page) {
        res.locals.page = new Page({ title : "new page", tags: "add tags as comma seperated list", content: "Content" });
    }

    return res.render("page", res.locals.page);
};

exports.savePage = function(req, res) {
    var page = res.locals.page;

    if (!page) {
        page= new Page(req.body);
        page.path = req.path;
    } else {
        page.title = req.body.title;
        page.content = req.body.content;
        page.tags = req.body.tags;
    }

    page.save(function(err) {
        // TODO: Err!
        res.send(200);
    });
};
