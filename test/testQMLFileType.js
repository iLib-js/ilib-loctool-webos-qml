/*
 * testQMLFileType.js - test the QML file type handler object.
 *
 * Copyright © 2020, JEDLSoft
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

if (!QMLFileType) {
    var QMLFileType = require("../QMLFileType.js");
    var CustomProject =  require("loctool/lib/CustomProject.js");
}

var p = new CustomProject({
    id: "app",
    plugins: ["../."],
    sourceLocale: "en-US"
}, "./testfiles", {
    locales:["en-GB"]
});

module.exports.qmlfiletype = {
    testQMLFileTypeConstructor: function(test) {
        test.expect(1);

        var cft = new QMLFileType(p);
        test.ok(cft);
        test.done();
    },

    testQMLFileTypeHandlesQMLFileTrue: function(test) {
        test.expect(2);

        var cft = new QMLFileType(p);
        test.ok(cft);
        test.ok(cft.handles("foo.qml"));
        test.done();
    },
    testQMLFileTypeHandlesQMLFileTrue2: function(test) {
        test.expect(2);

        var cft = new QMLFileType(p);
        test.ok(cft);
        test.ok(cft.handles("foo/bar/test.qml"));
        test.done();
    },

    testQMLFileTypeHandlesJSXFalse: function(test) {
        test.expect(2);

        var cft = new QMLFileType(p);
        test.ok(cft);
        test.ok(!cft.handles("foo.jsx"));
        test.done();
    },
    testQMLFileTypeHandlesCppFalse: function(test) {
        test.expect(2);

        var cft = new QMLFileType(p);
        test.ok(cft);
        test.ok(!cft.handles("foo.cpp"));
        test.done();
    },

    testQMLFileTypeHandlesFalseClose: function(test) {
        test.expect(2);

        var cft = new QMLFileType(p);
        test.ok(cft);
        test.ok(!cft.handles("fooqml"));
        test.done();
    }
};