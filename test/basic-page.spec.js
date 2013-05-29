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

describe("Page", function () {
    before(db.connect);
    afterEach(db.wipe);
    after(db.close);

    it("should have no pages when none was created", function (done) {
        Page.find({}, function (err, page) {
            should.not.exist(err);
            should.exist(page);
            page.length.should.eql(0);
            done();
        });
    });

    it("should serve new pages with default content", function (done) {
        request(app)
            .get("/")
            .expect(200)
            .end(function (err, res) {
            should.not.exist(err);
            res.text.should.include("New Page");
            res.text.should.include("Content");
            done();
        });
    });

    it("should create a new page", function (done) {
        var newPage = pageFactory();
        request(app)
            .post("/foobar")
            .expect(200)
            .send(newPage)
            .end(function (err, res) {
            should.not.exist(err);
            var response = JSON.parse(res.text);
            response.lastModified.should.exist;

            async.parallel([
                function (cb) {
                    Page.findOne({
                        path: "/foobar"
                    }, function (err, page) {
                        page.title.should.eql(newPage.title);
                        page.path.should.eql("/foobar");
                        page.tags.join(", ").should.eql(newPage.tags);
                        page.content.should.eql(newPage.content);

                        cb(err);
                    });
                },
                function (cb) {
                    request(app)
                        .get("/foobar")
                        .expect(200)
                        .end(function (err, res) {
                        should.not.exist(err);
                        res.text.should.include(newPage.title);
                        res.text.should.include(newPage.content);

                        cb(err);
                    });
                }
            ], done);
        });
    });

    it("should update an existing page", function (done) {
        var newPage = pageFactory();
        request(app)
            .post("/foobar")
            .expect(200)
            .send(newPage)
            .end(function (err, res) {
            should.not.exist(err);

            var response = JSON.parse(res.text);
            response.lastModified.should.exist;

            newPage.lastModified = response.lastModified;
            newPage.title = "Updated Title";

            request(app)
                .post("/foobar")
                .send(newPage)
                .end(function (err, res) {
                should.not.exist(err);
                var response = JSON.parse(res.text);
                response.lastModified.should.exist;

                Page.findOne({
                    path: "/foobar"
                }, function (err, page) {
                    should.not.exist(err);
                    should.exist(page);
                    page.title.should.eql("Updated Title");

                    done();
                });
            });

        });
    });

    it("should respond with 409 Conflict when sending data from a previous version", function (done) {
        var newPage = pageFactory();
        request(app)
            .post("/foobar")
            .expect(200)
            .send(newPage)
            .end(function (err, res) {
            should.not.exist(err);

            var response = JSON.parse(res.text);
            response.lastModified.should.exist;

            newPage.lastModified = response.lastModified - 10;
            newPage.title = "Updated Title";

            request(app)
                .post("/foobar")
                .send(newPage)
                .expect(409)
                .end(done);
        });
    });

    it("should be able to delete a page", function (done) {
        var newPage = pageFactory();
        var page = new Page(newPage);
        page.path = "/foobar";
        page.save(function (err) {
            request(app)
                .del("/foobar")
                .expect(200)
                .end(function (err, res) {
                async.parallel([
                    function (cb) {
                        Page.findOne({
                            path: "/foobar"
                        }, function (err, page) {
                            should.not.exist(err);
                            page.deleted.should.be.true;

                            cb(err);
                        });
                    },
                    function(cb) {
                        request(app)
                            .get("/deleted-pages")
                            .expect(200)
                            .end(function (err, res) {
                                should.not.exist(err);
                                res.text.should.include(page.title);

                                cb(err);
                            });
                    }
                ], done);
            });
        });

    });
});
