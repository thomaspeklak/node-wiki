"use strict";
/*global describe:false, it:false, before: false, after: false, beforeEach: false, afterEach: false */

var request = require("supertest");
var expect = require("chai").expect;
var app = require("../app");
var db = require("../db-connector");
var pageFactory = require("./factories/page");
var Page = require("../models/page");
var path = require("path");
var fork = require("child_process").fork;

describe("Uploads", function () {
    before(db.connect);
    beforeEach(function (cb) {
        var newPage = pageFactory();
        var page = new Page(newPage);
        page.path = "/foobar";
        page.save(cb);
    });
    afterEach(function (done) {
        Page.update({}, {
            $set: {
                deleted: true
            }
        }, function (err) {
            expect(err).to.not.exist;
            var cp = fork(path.join(__dirname, "..", "lib", "wipe-deleted-pages"));
            cp.once("message", function () {
                db.wipe(done);
            });
        });
    });
    after(db.close);

    it("should upload attachments", function (done) {
        request(app)
            .post("/attachments")
            .set("Referer", "/foobar")
            .attach("attachments", path.join(__dirname, "attachments/noimg.png"))
            .expect(200)
            .end(function (err, res) {
            expect(res.text).to.include("noimg.png");

            request(app)
                .get("/foobar")
                .end(function (err, res) {

                expect(res.text).to.include("noimg.png");

                done(err);
            });
        });
    });

    it("should reject unsupported attachment media types", function (done) {
        request(app)
            .post("/attachments")
            .set("Referer", "/foobar")
            .attach("attachments", __filename)
            .expect(415)
            .end(done);
    });

    it("should upload images", function (done) {
        request(app)
            .post("/images")
            .set("Referer", "/foobar")
            .attach("images", path.join(__dirname, "attachments/noimg.png"))
            .expect(200)
            .end(function (err, res) {
            expect(res.text).to.include("noimg.png");

            request(app)
                .get("/foobar")
                .end(function (err, res) {

                expect(res.text).to.include("noimg.png");

                done(err);
            });
        });
    });

    it("should reject unsupported image media types", function (done) {
        request(app)
            .post("/images")
            .set("Referer", "/foobar")
            .attach("images", __filename)
            .expect(415)
            .end(done);
    });

    it("should delete attachments", function (done) {
        request(app)
            .post("/attachments")
            .set("Referer", "/foobar")
            .attach("attachments", path.join(__dirname, "attachments/noimg.png"))
            .expect(200)
            .end(function (err) {
            expect(err).to.not.exist;

            request(app)
                .del("/attachments")
                .set("Referer", "/foobar")
                .send({
                "file": "noimg.png"
            })
                .expect(200)
                .end(function (err, res) {
                expect(res.text).to.include("lastModified");
                expect(err).to.not.exist;
                request(app)
                    .get("/foobar")
                    .end(function (err, res) {
                    expect(res.text).to.not.include("noimg.png");
                    done(err);
                });
            });
        });
    });

    it("should delete images", function (done) {
        request(app)
            .post("/images")
            .set("Referer", "/foobar")
            .attach("images", path.join(__dirname, "attachments/noimg.png"))
            .expect(200)
            .end(function (err) {
            expect(err).to.not.exist;

            request(app)
                .del("/images")
                .set("Referer", "/foobar")
                .send({
                "file": "noimg.png"
            })
                .expect(200)
                .end(function (err, res) {
                expect(res.text).to.include("lastModified");
                expect(err).to.not.exist;
                request(app)
                    .get("/foobar")
                    .end(function (err, res) {
                    expect(res.text).to.not.include("noimg.png");
                    done(err);
                });
            });
        });
    });
});
