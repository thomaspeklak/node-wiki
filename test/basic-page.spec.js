"use strict";
/*global describe:false, it:false, before: false, after: false, beforeEach: false, afterEach: false, expect:false */
process.env.NODE_ENV = "test";

var request = require("supertest");
var expect = require("chai").expect;
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
            expect(err).to.be.null;
            expect(page).to.exist;
            expect(page.length).to.eql(0);
            done();
        });
    });

    it("should serve new pages with default content", function (done) {
        request(app)
            .get("/")
            .expect(200)
            .end(function (err, res) {
            expect(err).to.be.null;
            expect(res.text).to.include("New Page");
            expect(res.text).to.include("Content");
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
            expect(err).to.be.null;
            var response = JSON.parse(res.text);
            expect(response.lastModified).to.exist;

            async.parallel([
                function (cb) {
                    Page.findOne({
                        path: "/foobar"
                    }, function (err, page) {
                        expect(page.title).to.eql(newPage.title);
                        expect(page.path).to.eql("/foobar");
                        expect(page.tags.join(", ")).to.eql(newPage.tags);
                        expect(page.content).to.eql(newPage.content);

                        cb(err);
                    });
                },
                function (cb) {
                    request(app)
                        .get("/foobar")
                        .expect(200)
                        .end(function (err, res) {
                        expect(err).to.be.null;
                        expect(res.text).to.include(newPage.title);
                        expect(res.text).to.include(newPage.content);

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
            expect(err).to.be.null;

            var response = JSON.parse(res.text);
            expect(response.lastModified).to.exist;

            newPage.lastModified = response.lastModified;
            newPage.title = "Updated Title";

            request(app)
                .post("/foobar")
                .send(newPage)
                .end(function (err, res) {
                expect(err).to.be.null;
                var response = JSON.parse(res.text);
                expect(response.lastModified).to.exist;

                Page.findOne({
                    path: "/foobar"
                }, function (err, page) {
                    expect(err).to.be.null;
                    expect(page).to.exist;
                    expect(page.title).to.eql("Updated Title");

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
            expect(err).to.be.null;

            var response = JSON.parse(res.text);
            expect(response.lastModified).to.exist;

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
                            expect(err).to.be.null;
                            expect(page.deleted).to.be.true;

                            cb(err);
                        });
                    },
                    function(cb) {
                        request(app)
                            .get("/deleted-pages")
                            .expect(200)
                            .end(function (err, res) {
                                expect(err).to.be.null;
                                expect(res.text).to.include(page.title);

                                cb(err);
                            });
                    }
                ], done);
            });
        });

    });
});
