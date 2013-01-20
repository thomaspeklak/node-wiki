var Page = require('../models/page');
var parse = require('url').parse;
var moveFiles = require('../lib/move-files');

exports.loadPage = function(req, res, next) {
    Page.findOne({
        path: req.path
    }, function(err, page) {
        if (err) {
            return next(err);
        }

        res.locals.page = page;
        next();
    });
};

exports.loadNavigation = function(req, res, next) {
    Page.subNodes(req.path, function(err, subPages) {
        res.locals.navigation = subPages;

        next(err);
    });
};

exports.buildBreadcrumbs = function(req, res, next) {
    if (req.path=='/') {
        res.locals.breadcrumbs = [];
        return next();
    }

    var segments = req.path.split('/');

    var breadcrumbs = [];
    var currentPath = [];

    for (var i=0;i<segments.length;i++) {
        var segment = segments[i];

        currentPath.push(segment);
        var path = currentPath.join('/');

        breadcrumbs.push({ path : path.length?path:'/', segment : segment.length?segment:'/' });
    }

    res.locals.breadcrumbs = breadcrumbs;
    next();
};

exports.showPage = function(req, res) {
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
};

exports.savePage = function(req, res) {
    var page = res.locals.page;

    if (!page) {
        page = new Page(req.body);
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

exports.searchPages = function(req, res) {
    var query = req.param('q');

    Page.search(query, function(err, results) {
        // TODO: err
        return res.render('search', {
            title: 'search ' + query,
            results: results,
            latest: Page.latest(10),
            recentChanges: Page.recentChanges(10)
        });
    });
};

exports.allPages = function(req, res) {
    Page.all(function(err, pages) {
        // TODO: err
        return res.render('pages', {
            title: 'All Pages',
            pages: pages,
            latest: Page.latest(10),
            recentChanges: Page.recentChanges(10)
        });
    });
};

exports.allTags = function(req, res) {
    var map = function() {
        if (!this.tags) {
            return;
        }

        for (var index in this.tags) {
            if (this.tags[index]) {
                emit(this.tags[index], 1);
            }
        }
    };

    var reduce = function(previous, current) {
        var count = 0;

        for (var index in current) {
            count += current[index];
        }

        return count;
    };

    Page.mapReduce({
        map: map,
        reduce: reduce

    }, function(err, result) {
        if (err) {
            return res.send(500);
        }
        res.render('tags', {
            title: 'All Pages',
            tags: result,
            latest: Page.latest(10),
            recentChanges: Page.recentChanges(10)
        });
    });
};

exports.tag = function(req, res) {
    console.dir(req.params.tag);
    Page.find({
        tags: req.params.tag
    }, function(err, result) {
        if (err) {
            res.send(500);
        }

        res.render("tag", {
            title: "Tag: " + req.params.tag,
            pages: result,
            latest: Page.latest(10),
            recentChanges: Page.recentChanges(10)
        });
    });
};

var supportedTypes = [
    "text/plain",
    "application/zip",
    "application/pdf",
    "image/gif",
    "image/jpeg",
    "image/pjpeg",
    "image/png",
    "image/svg+xml",
    "text/csv"
];

exports.attachments = function(req, res){
    if(!req.headers.referer || !req.files.attachments) return res.send(400);

    var files = req.files.attachments[0]? req.files.attachments : [req.files.attachments];

    var unsupportedMedia = files.some(function(file){
        return supportedTypes.indexOf(file.type) == -1;
    });

    if(unsupportedMedia) {
        return res.send(415);
    }

    var referer = parse(req.headers.referer);

    Page.findOne({path: referer.path}, function(err, page){
        if(err){
            console.error(err);
            return res.send(400);
        }

        moveFiles(page, files, function(err, attachments){
            if(err){
                console.error(err);
                return res.send(400);
            }

            page.attachments = page.attachments.concat(attachments);
            page.save(function(err){
                if(err) return res.send(500);

                res.send({
                    attachments: attachments,
                    pageId: page._id
                });
            });
        });
    });
};
