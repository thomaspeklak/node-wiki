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

var deletedPagesShouldBeEmpty = function (cb) {
    request(app)
        .get("/deleted-pages")
        .expect(200)
        .end(function (err, res) {
            expect(res.text).to.include("no archived pages");

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
                expect(res.text).to.include(page.title);
                expect(res.text).to.include(page.path);

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

var deletedPageShouldNotHaveEditableContent = function (page) {
    return function (cb) {
        request(app)
            .get(page.path)
            .end(function (err, res) {
                var text = res.text;
                expect(text).to.include("This page is deleted.");
                expect(text).to.include("container deleted");
                expect(text).to.not.include("contenteditable");
                cb(err);
            });
    };
};

var updateDeletedPageShouldReturnError = function (page) {
    return function (cb) {
        request(app)
            .post(page.path)
            .send({title: "BAZ", lastModified: Date.now()})
            .expect(405)
            .end(cb);
    };
};


var movePageShouldNotBeAllowed = function (page) {
    return function (cb) {
        request(app)
            .put(page.path)
            .send({newPath: "/baz"})
            .expect(405)
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
            expect(err).to.be.null;

            async.series([
                deletedPagesShouldBeEmpty,
                deletePage(page),
                deletedPagesShouldContainPage(page),
                restorePage(page),
                deletedPagesShouldBeEmpty
            ], done);
        });
    });

    it("should not be editable when deleted", function (done) {
        var newPage = pageFactory();
        var page = new Page(newPage);
        page.path = "/foo";
        page.deleted = true;
        page.save(function () {
            async.parallel([
                deletedPageShouldNotHaveEditableContent(page),
                updateDeletedPageShouldReturnError(page),
                movePageShouldNotBeAllowed(page)
            ], done);
        });
    });
});
