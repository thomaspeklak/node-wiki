"use strict";
/*global describe:false, it:false, before: false, after: false, beforeEach: false, afterEach: false */

var request = require("supertest");
var expect = require("chai").expect;
var app = require("../app");
var db = require("../db-connector");

describe("Locale", function () {
    before(db.connect);
    after(db.close);

    it("should return an english json locale", function (done) {
        request(app)
            .get("/javascripts/locale.js")
            .expect(200)
            .expect("Content-type", "application/javascript")
            .end(function (err, res) {
            var window = {};
            eval(res.text);
            expect(window.i18n["home"]).to.exist;
            expect(window.locale).to.eql("en");

            done(err);
        });
    });

    it("should return an german json locale", function (done) {
        request(app)
            .get("/javascripts/locale.js")
            .set("Cookie", "locale=de")
            .expect(200)
            .expect("Content-type", "application/javascript")
            .end(function (err, res) {
            var window = {};
            eval(res.text);
            expect(window.i18n["home"]).to.exist;
            expect(window.locale).to.eql("de");

            done(err);
        });
    });
});
