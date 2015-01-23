'use strict';

var documentModel = require('../../../../lib/db/models/model-document').Model,
    baseModel = require('../../../../lib/db/models/model-base').Model,
    commonUtils = require('../../../../lib/utils/common-utils');

describe('modelDocument',  function() {
    var document;

    beforeEach(function() {
        document = new documentModel();
    });

    describe('insertNewDocument', function() {
        var insertSpy,
            documents;

        beforeEach(function() {
            insertSpy = spyOn(baseModel.prototype, 'insert');
            documents = [
                {
                    one: 'one'
                },
                {
                    two: 'two'
                }
            ];
        });

        it('should fail if documentModel.insert fails', function() {
            insertSpy.andCallFake(function(item, success, failure) {
                failure('insert fail');
            });

            document.insertNewDocument(documents, function() {
                expect().toHaveNotExecuted('should not have succeeded');
            }, function(error) {
                expect(error).toBe('insert fail');
            });
        });


        it('should succeed if insert succeeds and document is a mongo object', function() {

            spyOn(commonUtils, 'generateId').andReturn('fakeId');
            spyOn(commonUtils, 'getCurrentDate').andReturn('date');

            insertSpy.andCallFake(function(document, success, failure) {
                expect(document._id).toBeDefined();
                expect(document.requestDate).toBeDefined();
                success();
            });

            document.insertNewDocument(documents, function() {
                expect(baseModel.prototype.insert.callCount).toBe(2);
            }, function(error) {
                expect().toHaveNotExecuted('should not have failed');
            });
        });
    });

    describe('insertNewDocument', function() {
        var insertSpy,
            documents;

        beforeEach(function () {
            insertSpy = spyOn(baseModel.prototype, 'insert');
            documents = {
                one: 'one'
            };
        });

        xit('should fail if documentModel.insert fails', function () {

            insertSpy.andCallFake(function (item, success, failure) {
                failure('insert fail');
            });

            document.insertNewDocument(documents, function () {
                expect().toHaveNotExecuted('should not have succeeded');
            }, function (error) {
                expect(error).toBe('insert fail');
            });
        });


        it('should succeed if insert succeeds', function () {
            document.insertOnedocument(documents, function () {
                expect(baseModel.prototype.insert.callCount).toBe(1);
            }, function (error) {
                expect().toHaveNotExecuted('should not have failed');
            });
        });
    });
});