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

                async.parallel([function (cb) {
                    Page.findOne({path: "/foobar"}, function (err, page) {
                        page.title.should.eql(newPage.title);
                        page.path.should.eql("/foobar");
                        page.tags.join(", ").should.eql(newPage.tags);
                        page.content.should.eql(newPage.content);

                        cb(err);
                    });
                }, function (cb) {
                    request(app)
                        .get("/foobar")
                        .expect(200)
                        .end(function (err, res) {
                            should.not.exist(err);
                            res.text.should.include(newPage.title);
                            res.text.should.include(newPage.content);

                            cb(err);
                        });
                }], done);
            });
    });
});

