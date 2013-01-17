var Page = require('../models/page');

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
}

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
        latest: Page.latest(),
        recentChanges: Page.recentChanges()
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
            latest: Page.latest(),
            recentChanges: Page.recentChanges()
        });
    });
};

exports.allPages = function(req, res) {
    Page.all(function(err, pages) {
        // TODO: err
        return res.render('pages', {
            title: 'All Pages',
            pages: pages,
            latest: Page.latest(),
            recentChanges: Page.recentChanges()
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
            latest: Page.latest(),
            recentChanges: Page.recentChanges()
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
            latest: Page.latest(),
            recentChanges: Page.recentChanges()
        });
    });

};
