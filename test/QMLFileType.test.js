/*
 * QMLFileType.test.js - test the QML file type handler object.
 *
 * Copyright (c) 2020-2021, 2023 JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var path = require("path");

if (!QMLFileType) {
    var QMLFileType = require("../QMLFileType.js");
    var CustomProject =  require("loctool/lib/CustomProject.js");
}

var p = new CustomProject({
    id: "app",
    plugins: [path.resolve(".")],
    sourceLocale: "en-US"
}, "./testfiles", {
    locales:["en-GB"]
});

describe("qmlfiletype", function() {
    test("QMLFileTypeConstructor", function() {
        expect.assertions(1);

        var cft = new QMLFileType(p);
        expect(cft).toBeTruthy();
    });
    test("QMLFileTypeHandlesQMLFileTrue", function() {
        expect.assertions(2);

        var cft = new QMLFileType(p);
        expect(cft).toBeTruthy();
        expect(cft.handles("foo.qml")).toBeTruthy();
    });
    test("QMLFileTypeHandlesQMLFileTrue2", function() {
        expect.assertions(2);

        var cft = new QMLFileType(p);
        expect(cft).toBeTruthy();
        expect(cft.handles("foo/bar/test.qml")).toBeTruthy();
    });
    test("QMLFileTypeHandlesJSTrue", function() {
        expect.assertions(2);

        var cft = new QMLFileType(p);
        expect(cft).toBeTruthy();
        expect(cft.handles("foo.js")).toBeTruthy();
    });
    test("QMLFileTypeHandlesJSTrue2", function() {
        expect.assertions(2);

        var cft = new QMLFileType(p);
        expect(cft).toBeTruthy();
        expect(cft.handles("foo/bar.js")).toBeTruthy();
    });
    test("QMLFileTypeHandlesJSXFalse", function() {
        expect.assertions(2);

        var cft = new QMLFileType(p);
        expect(cft).toBeTruthy();
        expect(!cft.handles("foo.jsx")).toBeTruthy();
    });
    test("QMLFileTypeHandlesCppFalse", function() {
        expect.assertions(2);

        var cft = new QMLFileType(p);
        expect(cft).toBeTruthy();
        expect(!cft.handles("foo.cpp")).toBeTruthy();
    });
    test("QMLFileTypeHandlesFalseClose", function() {
        expect.assertions(2);

        var cft = new QMLFileType(p);
        expect(cft).toBeTruthy();
        expect(!cft.handles("fooqml")).toBeTruthy();
    });
});