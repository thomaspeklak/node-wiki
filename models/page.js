var util = require('util'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Page = new Schema({
    title : { type : String, required : true},
    content : { type : String, required : true },
    path : { type : String, required : true},
    tags : [String],

    lastModified : Date,
    created : Date
});

Page.pre('save', function(next) {
    if (!this.created) {
        this.created = new Date();
    }

    this.lastModified = new Date();

    next();
});

Page.path('tags').set(function(tags) {
    if (util.isArray(tags)) {
        return tags;
    }

    return tags.split(',').map(function(tag) { return tag.trim(); });
});

// Pre-defined Queries
Page.statics.all = function(cb) {
    return this
        .find({})
        .select('title path')
        .sort('title')
        .exec(cb);
}

Page.methods.getPathSegments = function() {
    if (this.path == '/') {
        return ['/'];
    }
    
    var path = this.path;
    if (path[path.length-1] == '/') {
        path = path.substr(0, path.length -1);
    }
    
    var segments = path.split('/');
    segments[0] = '/';
    
    return segments;
}

var findNode = function(nodes, segment) {
    for (var i=0;i<nodes.length;i++) {
        if (nodes[i].segment == segment) {
            return nodes[i];
        }
    }
}

var ensurePath = function(nodes, segments) {
    var currentNode;

    segments.forEach(function(segment) {
        currentNode = findNode(nodes, segment);

        if (!currentNode) {
            currentNode = { segment : segment, nodes : [] }
            nodes.push(currentNode);
        }

        nodes = currentNode.nodes;
    });
    
    return currentNode;
}

Page.statics.buildTree = function(pages) {
    var tree = [];

    pages.forEach(function(page) {
        var currentNode = ensurePath(tree, page.getPathSegments());

        if (currentNode) {
            // Last segment was reached
            currentNode.path = page.path;
            currentNode.title = page.title;            
        }
    });
    
    return tree;
}

Page.statics.getTree = function(cb) {
    var self = this;
    
    return this
        .find({})
        .select('title path')
        .sort('title')
        .exec(function(err, pages) {
            if (err) {
                return cb(err);
            }

            cb(undefined, self.buildTree(pages));
        });
}

Page.statics.latest = function(count, cb) {
    return this
        .find({})
        .limit(count)
        .sort('-created')
        .select('title path')
        .exec(cb);
}

Page.statics.recentChanges = function(count, cb) {
    return this
        .find({})
        .limit(count)
        .sort('-lastModified')
        .select('title path')
        .exec(cb);
}

Page.statics.search = function(query, count, cb) {
    if (typeof(count) == 'function') {
        cb = count;
        count = 100;
    }

    return this
        .find({ $or : [ { title : { $regex : query }}, { content:  { $regex : query }} ]})
        .limit(count)
        .sort('title')
        .select('title path')
        .exec(cb);
}

module.exports = mongoose.model('Page', Page);
