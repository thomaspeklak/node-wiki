"use strict";

var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');    

module.exports = function(page, files, type, cb) {
    var target = path.join(__dirname, "..", "public", type, page._id.toString());

    mkdirp(target, "0770", function(err) {
        if(err) return cb(err);
        moveFiles(files, target, cb);
    });
};

function moveFiles(files, target, cb) {
    var moveCount = 0;
    var attachments = [];
    var errors = '';
    var isWindows = process.platform.search(/^win/) !== -1;

    var allDone = function(err){
        moveCount += 1;
        if(err){
            errors += err;
        }
        if(moveCount == attachments.length){
            cb(errors, attachments);
        }
    };

    files.forEach(function(file) {
        (isWindows ? moveFile : renameFile)(file.path, target + "/" + file.name, allDone);
        attachments.push(file.name);
    });
}

function renameFile(from, to, cb){
    fs.rename(from, to, cb);
}

function moveFile(from, to, cb){
    fs.createReadStream(from).pipe(fs.createWriteStream(to)).on('close', cb);
}
