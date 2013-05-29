"use strict";
/*global describe:false, it:false, before: false, after: false, beforeEach: false, afterEach: false, expect:false */
process.env.NODE_ENV = "test";

var request = require("supertest");
var should = require("should");
var app = require("../app");
var db = require("../db-connector");
var pageFactory = require("./factories/page");
var Page = require("../models/page");
var async = require("async");

describe("Tags", function () {
    before(db.connect);
    afterEach(db.wipe);
    after(db.close);

    it("should display a list of tags", function (done) {
        var newPage = pageFactory();
        var page = new Page(newPage);
        page.path = "/foobar";
        page.save(function (err) {
            request(app)
                .get("/tags")
                .expect(200)
                .end(function (err, res) {
                should.not.exist(err);
                page.tags.forEach(function (tag) {
                    res.text.should.include(tag + " (1)");
                    res.text.should.include("/tags/" + tag);
                });

                done(err);
            });
        });
    });

    it("should have correct tag detail pages", function (done) {
        var newPage = pageFactory();
        var page1 = new Page(newPage);
        page1.path = "/foobar";

        var page2 = new Page(newPage);
        page2.path = "/foobaz";
        page2.tags = "foo, baz";

        async.parallel([
            function (cb) {
                page1.save(cb);
            },
            function (cb) {
                page2.save(cb);
            }
        ], function (err) {
            should.not.exist(err);
            request(app)
                .get("/tags/foo")
                .expect(200)
                .end(function (err, res) {
                should.not.exist(err);

                res.text.should.include(page1.title);
                res.text.should.include(page1.path);

                res.text.should.include(page2.title);
                res.text.should.include(page2.path);

                done();
            });
        });
    });
});
