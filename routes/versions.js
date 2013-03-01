var Page = require('../models/page');

module.exports = function (app) {
    app.get("/versions", function (req, res) {
        Page.VersionedModel.latest(100, function (err, pages) {
            res.render('versionedpages', {
                pages: pages,
                title: 'Page Versions'
            });
        });
    });

    app.get("/versions/:pageId", function (req, res) {
        var pageId = req.param('pageId');

        if (!pageId) {
            return res.send(400);
        }

        res.render('versions', {
            document: Page.VersionedModel.findOne({
                refId: pageId
            }),
            page: Page.findOne({
                _id: pageId
            }),
            title: 'Versions'
        });
    });
}
