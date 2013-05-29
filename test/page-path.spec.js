"use strict";
/*global describe:false, it:false, beforeEach: false, afterEach: false */
process.env.NODE_ENV = "test";

var request = require("supertest");
var should = require("should");
var app = require("../app");
var db = require("../db-connector");
var pageFactory = require("./factories/page");
var Page = require("../models/page");
var async = require("async");

describe("Page", function () {
    beforeEach(function () {
        db.connect();
    });

    afterEach(function (done) {
        db.wipe(function (err) {
            if (err) throw err;
            db.close(done);
        });
    });

    it("shuold allow path updates", function (done) {
        var newPage = pageFactory();
        request(app)
            .post("/foobar")
            .expect(200)
            .send(newPage)
            .end(function (err, res) {
            request(app)
                .put("/foobar")
                .send({
                newPath: "/foobaz"
            })
                .end(function (err, res) {
                should.not.exist(err);

                async.parallel([
                    function (cb) {
                        Page.count({path: "/foobar"}, function (err, count) {
                            should.not.exist(err);
                            count.should.eql(0);
                            cb(err);
                        });
                    },
                    function (cb) {
                        Page.count({path: "/foobaz"}, function (err, count) {
                            should.not.exist(err);
                            count.should.eql(1);
                            cb(err);
                        });
                    }
                ], done);
            });
        });
    });

    it("shuold not allow path update on existing path", function (done) {
        async.parallel([function (cb) {
            var newPage = pageFactory();
            var page = new Page(newPage);
            page.path = "/foobar";
            page.save(cb);
        },
        function (cb) {
            var newPage = pageFactory();
            var page = new Page(newPage);
            page.path = "/foobaz";
            page.save(cb);
        }], function (err) {
            request(app)
                .put("/foobar")
                .send({newPath: "/foobaz"})
                .expect(200)
                .end( function (err, res) {
                    var response = JSON.parse(res.text);
                    response.status.should.eql("page-exists");

                    done(err);
                });
        });

    });
});
