/*jslint node:true*/
/*global describe, it*/
'use strict';
var client = new (require('./index.js'))();
var expect = require('unexpected');
describe('CouchDBClient', function () {
    describe('#welcome', function () {
        it('should give a welcome response', function (done) {
            client.welcome(function (err, data) {
                expect(err, 'to be falsy');
                expect(data, 'to be ok');
                expect(data, 'to contain', '{"couchdb":"Welcome"');
                done(err);
            });
        });
        it('should through an error with no callback', function (done) {
            try {
                client.welcome();
                done(new Error('Should have thrown error!'));
            } catch (e) {
                expect(e, 'to have message', 'No callback supplied!');
                done();
            }
        });
    });
    describe('#getUUIDs', function () {
        it('should give 1 for num of 1', function (done) {
            client.getUUIDs(1, function (err, data) {
                expect(err, 'to be falsy');
                expect(data, 'to be ok');
                expect(data, 'to be a', 'string');
                done(err);
            });
        });
        it('should give 1 for a num of null', function (done) {
            client.getUUIDs(null, function (err, data) {
                expect(err, 'to be falsy');
                expect(data, 'to be ok');
                expect(data, 'to be a', 'string');
                done(err);
            });
        });
        it('should give multiple for other nums', function (done) {
            client.getUUIDs(5, function (err, data) {
                expect(err, 'to be falsy');
                expect(data, 'to be ok');
                expect(data, 'to be a', 'array');
                expect(data, 'to have length', 5);
                done(err);
            });
        });
    });
    describe('#createDB', function () {
        it('should give a response', function (done) {
            client.createDB('test', function (err, data) {
                expect(err, 'to be falsy');
                expect(data, 'to be a', 'object');
                expect(data, 'to satisfy', {"ok": true});
                done(err);
            });
        });
    });
    describe('#getDB', function () {
        it('should get the db', function (done) {
            client.getDB('test', function (err, data) {
                expect(err, 'to be falsy');
                expect(data, 'to be a', 'object');
                done(err);
            });
        });
    });
    describe('#addDoc', function () {
        var rev;
        it('should add a doc', function (done) {
            client.addDoc('test', 'test', {hi: "moo"}, function (err, data) {
                expect(err, 'to be falsy');
                expect(data, 'to be a', 'object');
                expect(data, 'to satisfy', {"ok": true});
                rev = data.rev;
                expect(rev, 'to be a string');
                done(err);
            });
        });
        it('should update the doc', function (done) {
            client.addDoc('test', 'test', {hi: "moo", bye: "boo"}, rev, function (err, data) {
                expect(err, 'to be falsy');
                expect(data, 'to be a', 'object');
                expect(data, 'to satisfy', {"ok": true});
                done(err);
            });
        });
    });
    var rev, rev2;
    describe('#getDoc', function () {
        it('should get the doc', function (done) {
            client.getDoc('test', 'test', function (err, data) {
                expect(err, 'to be falsy');
                expect(data, 'to be a', 'object');
                expect(data, 'to have keys', '_id', '_rev', 'rev');
                rev = data.rev;
                expect(rev, 'to be a string');
                done(err);
            });
        });
    });
    describe('#addView', function () {
        var rev;
        it('should add the view', function (done) {
            client.addView('test', 'stuff', {all: {map: "function (doc){emit(null,doc)}"}}, function (err, data) {
                expect(err, 'to be falsy');
                expect(data, 'to be a', 'object');
                expect(data, 'to have keys', 'rev');
                rev = rev2 = data.rev;
                expect(rev2, 'to be a string');
                expect(rev, 'to be a string');
                done(err);
            });
        });
        it('should update the view', function (done) {
            client.addView('test', 'stuff', {all: {map: "function (doc){emit(null,doc)}"}, none: {map: "function (doc){}"}}, rev, function (err, data) {
                expect(err, 'to be falsy');
                expect(data, 'to be an', 'object');
                expect(data, 'to have keys', 'rev');
                rev2 = data.rev;
                expect(rev2, 'to be a string');
                done(err);
            });
        });
    });
    describe('#useView', function () {
        it('should return without error', function (done) {
            client.useView('test', 'stuff', 'all', 'hi', function (err, data) {
                expect(err, 'to be falsy');
                expect(data, 'to be a', 'object');
                expect(data, 'to have keys', 'rows');
                done(err);
            });
        });
    });
    describe('#deleteView', function () {
        it('should delete the view', function (done) {
            client.deleteView('test', 'stuff', rev2, function (err, data) {
                expect(err, 'to be falsy');
                expect(data, 'to be a', 'object');
                expect(data, 'to satisfy', {ok: true});
                expect(rev, 'to be a string');
                done(err);
            });
        });
    });
    describe('#deleteDoc', function () {
        it('should delete the doc', function (done) {
            client.deleteDoc('test', 'test', rev, function (err, data) {
                expect(err, 'to be falsy');
                expect(data, 'to be a', 'object');
                expect(data, 'to satisfy', {"ok": true});
                done(err);
            });
        });
    });
    describe('#deleteDB', function () {
        it('should delete the db', function (done) {
            client.deleteDB('test', function (err, data) {
                expect(err, 'to be falsy');
                expect(data, 'to be a', 'object');
                expect(data, 'to satisfy', {"ok": true});
                done(err);
            });
        });
    });
});