"use strict";
/*global describe:false, it:false, before: false, after: false, beforeEach: false, afterEach: false, expect:false */

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
            expect(res.text).to.not.match(new RegExp("table" + any + versionsLink + any + versionsLink + any + versionsLink + any + versionsLink + any + "table"));

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

    it("should navigate between versions");

    describe("#restore", function () {
        it("should restore to a previous version");
    });
});
