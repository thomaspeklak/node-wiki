"use strict";
/*global describe:false, it:false, before: false, after: false, beforeEach: false, afterEach: false */

var request = require("supertest");
var expect = require("chai").expect;
var app = require("../app");
var db = require("../db-connector");
var pageFactory = require("./factories/page");
var Page = require("../models/page");
var async = require("async");

describe("Page Versioning", function () {
    var page;

    before(db.connect);
    beforeEach(function (cb) {
        var newPage = pageFactory();
        page = new Page(newPage);
        page.path = "/foobar";
        async.series([
            function (cb) {
                page.save(cb);
            },
            function (cb) {
                page.title = "Bazbaz Title";
                page.content = "baz content";
                page.tags = "baz";

                page.save(cb);
            },
            function (cb) {
                page.title = "Bar Title";
                page.content = "bar content";
                page.tags = "bar";

                page.save(cb);
            }
        ], cb);
    });
    afterEach(db.wipe);
    after(db.close);

    it("should have a versions link on the page", function (done) {
        request(app)
            .get("/foobar")
            .end(function (err, res) {
            expect(res.text).to.include("/versions/");

            done(err);
        });
    });

    it("should have 3 versions on the versions page", function (done) {
        request(app)
            .get("/versions/" + page._id)
            .expect(200)
            .end(function (err, res) {
            var versionsLink = "/versions/" + page._id + ".*";
            var any = ".*";
            expect(res.text).to.match(new RegExp("table" + any + versionsLink + any + versionsLink + any + versionsLink + any + "table"));

            done(err);
        });
    });

    it("should not influence search", function (done) {
        request(app)
            .get("/search?q=bazbaz")
            .expect(200)
            .end(function (err, res) {
            expect(res.text).to.not.match(new RegExp("Search Results.*" + page.path));

            done(err);
        });
    });

    describe("#navgate versions", function () {
        var getFirstVersion = function (cb) {
            request(app)
                .get("/versions/" + page._id)
                .end(function (err, res) {
                    var link = res.text.match(new RegExp("/versions/" + page._id + "/[0-9a-f]+"))[0];
                    request(app)
                        .get(link)
                        .end(cb);
                });
        };

        var verifyAndFollowNext = function (res, cb) {
            expect(res.text).to.include("Foo Title");

            var link = res.text.match(/href="([^"]+)"[^>]+>Next<\/a>/)[1];
            request(app)
                .get(link)
                .expect(200)
                .end(cb);
        };

        var goToPrevious = function (res, cb) {
            expect(res.text).to.include("Bazbaz Title");

            var link = res.text.match(/href="([^"]+)"[^>]+>Previous<\/a>/)[1];
            request(app)
                .get(link)
                .expect(200)
                .end(cb);
        };

        var verifyPrevious = function (res, cb) {
            expect(res.text).to.include("Foo Title");
            cb();
        };

        it("should navigate between versions", function (done) {
            async.waterfall([
                getFirstVersion,
                verifyAndFollowNext,
                goToPrevious,
                verifyPrevious
            ], done);
        });
    });

    describe.skip("#restore", function () {
        it("should restore to a previous version");
    });
});
