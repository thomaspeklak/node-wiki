"use strict";
/*global describe:false, it:false, before: false, after: false, beforeEach: false, afterEach: false, expect:false */

var request = require("supertest");
var expect = require("chai").expect;
var app = require("../app");
var db = require("../db-connector");
var pageFactory = require("./factories/page");
var Page = require("../models/page");
var async = require("async");

describe("Search", function () {
    before(db.connect);
    beforeEach(function (cb) {
        async.parallel([
            function (cb) {
                var newPage = pageFactory();
                var page = new Page(newPage);
                page.path = "/foobar";
                page.save(cb);
            },
            function (cb) {
                var newPage = pageFactory();
                var page = new Page(newPage);
                page.path = "/foobaz";
                page.title = "Baz";
                page.content = "content baz";
                page.tags = "foo, baz";
                page.save(cb);
            }
        ], cb);
    });
    afterEach(db.wipe);
    after(db.close);

    it("should return search results", function (done) {
        request(app)
            .get("/search?q=foo")
            .expect(200)
            .end(function (err, res) {
            expect(res.text).to.include("Foo Title");
            expect(res.text).to.include("Baz");
            expect(res.text).to.include("/foobar");
            expect(res.text).to.include("/foobaz");

            done(err);
        });
    });


    it("should order the results correctly", function (done) {
        request(app)
            .get("/search?q=foo")
            .expect(200)
            .end(function (err, res) {
                expect(res.text).to.match(/Search Results.*Foo Title.*Baz/);
                expect(res.text).to.not.match(/Search Results.*Baz.*Foo Title/);

                done();
            });
    });

    it("should order the results correctly", function (done) {
        request(app)
            .get("/search?q=baz")
            .expect(200)
            .end(function (err, res) {
                expect(res.text).to.match(/Search Results.*Baz/);
                expect(res.text).to.not.match(/Search Results.*Foo Title/);

                done();
            });
    });

});
