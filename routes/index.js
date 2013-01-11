var pages = {};

exports.index = function(req, res) {
    if (pages[req.url]) {
        return res.render("page", {title: "Test", data: pages[req.url]});
    }
    res.render('index', {
        title: 'Express'
    });
};

exports.indexPost = function(req, res) {
    pages[req.url] = req.body.data;
    res.send(200);
};
