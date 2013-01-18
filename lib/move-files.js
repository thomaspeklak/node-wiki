var fs = require('fs');
var path = require('path');

module.exports = function(page, files, cb) {
    var target = path.join(__dirname, "..", "public", "attachments", page._id.toString());

    dirExists(target, function(exists) {
        if (!exists) {
            console.dir("creating new directory");
            return fs.mkdir(target, "0770", function(err) {
                if(err) return cb(err);
                moveFiles(files, target, cb);
            });
        }
        moveFiles(files, target, cb);
    });
};

function dirExists(d, cb) {
    fs.stat(d, function(er, s) {
        cb(!er);
    });
}

function moveFiles(files, target, cb) {
    var moveCount = 0;
    var attachments = [];
    var errors = '';

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
        fs.rename(file.path, target + "/" + file.name, allDone);
        attachments.push(file.name);
    });

}
