var mongoose = require('mongoose'),
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
    return tags.split(',');
});

module.exports = mongoose.model('Page', Page);