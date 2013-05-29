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

var deletedPagesShouldBeEmpty = function (cb) {
    request(app)
        .get("/deleted-pages")
        .expect(200)
        .end(function (err, res) {
            res.text.should.include("no archived pages");

            cb(err);
        });
};

var deletePage = function (page) {
    return function (cb) {
        request(app)
            .del(page.path)
            .expect(205)
            .end(cb);
    };
};

var deletedPagesShouldContainPage = function (page) {
    return function (cb) {
        request(app)
            .get("/deleted-pages")
            .expect(200)
            .end(function (err, res) {
                res.text.should.include(page.title);
                res.text.should.include(page.path);

                cb(err);
            });
    };
};

var restorePage = function (page) {
    return function (cb) {
        request(app)
           .put(page.path)
           .send({restore: true})
           .expect(205)
           .end(cb);
    };
};


describe("Archive", function () {
    before(db.connect);
    afterEach(db.wipe);
    after(db.close);

    it("should categorize the page accordingly", function (done) {
        var newPage = pageFactory();
        var page = new Page(newPage);
        page.path = "/foo";
        page.save(function (err) {
            should.not.exist(err);

            async.series([
                deletedPagesShouldBeEmpty,
                deletePage(page),
                deletedPagesShouldContainPage(page),
                restorePage(page),
                deletedPagesShouldBeEmpty
            ], done);
        });
    });
});
