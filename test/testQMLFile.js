/*
 * testQMLFile.js - test the qml file handler object.
 *
 * Copyright © 2019-2020, JEDLSoft
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

if (!QMLFile) {
    var QMLFile = require("../QMLFile.js");
    var QMLFileType = require("../QMLFileType.js");
    var CustomProject =  require("loctool/lib/CustomProject.js");
    var ContextResourceString =  require("loctool/lib/ContextResourceString.js");
}

var p = new CustomProject({
    id: "app",
    plugins: [path.resolve(".")],
    sourceLocale: "en-US"},
    "./test/testfiles",
    {
        locales:["en-GB"]
    });

var qmlft = new QMLFileType(p);


module.exports.qmlfile = {
    setUp: function(callback) {
        p.init(callback);
    },
    testQMLFileConstructor: function(test) {
        test.expect(1);

        var qf = new QMLFile({project: p});
        test.ok(qf);
        test.done();
    },

    testQMLFileConstructorParams: function(test) {
        test.expect(1);

        var qf = new QMLFile({
            project: p,
            pathName: "./testfiles/js/t1.qml",
            type: qmlft
        });

        test.ok(qf);
        test.done();
    },

    testQMLFileConstructorNoFile: function(test) {
        test.expect(1);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        test.ok(qf);
        test.done();
    },

    testQMLFileMakeKey: function(test) {
        test.expect(2);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        test.ok(qf);
        test.equal(qf.makeKey("This is a test"), "This is a test");
        test.done();
    },

    testQMLFileMakeKey2: function(test) {
        test.expect(2);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        test.ok(qf);
        test.equal(qf.makeKey("This is a \"real\" test"), "This is a \"real\" test");
        test.done();
    },

    testQMLFileMakeKeyWithSpace: function(test) {
        test.expect(2);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        test.ok(qf);
        test.equal(qf.makeKey(" This is a test "), " This is a test ");
        test.done();
    },

    testQMLFileMakeKeyWithSpaces: function(test) {
        test.expect(2);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        test.ok(qf);
        test.equal(qf.makeKey("   This is a test   "), "   This is a test   ");
        test.done();
    },

    testQMLFileParseSimpleGetByKey: function(test) {
        test.expect(5);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        test.ok(qf);

        qf.parse('button2: qsTr("Start") + _emptyString');

        var set = qf.getTranslationSet();
        test.ok(set);

        var r = set.getBy({
            reskey: "Start"
        });
        test.ok(r);

        test.equal(r[0].getSource(), "Start");
        test.equal(r[0].getKey(), "Start");

        test.done();
    },
    testQMLFileParseSimpleGetByKeywithSingleQuote: function(test) {
        test.expect(5);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        test.ok(qf);

        qf.parse("button2: qsTr('Start') + _emptyString");

        var set = qf.getTranslationSet();
        test.ok(set);

        var r = set.getBy({
            reskey: 'Start'
        });
        test.ok(r);

        test.equal(r[0].getSource(), "Start");
        test.equal(r[0].getKey(), "Start");

        test.done();
    },

    testQMLFileParseSimpleGetBySource: function(test) {
        test.expect(5);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        test.ok(qf);

        qf.parse('button2: qsTr("Start") + _emptyString');

        var set = qf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("Start");
        test.ok(r);
        test.equal(r.getSource(), "Start");
        test.equal(r.getKey(), "Start");

        test.done();
    },

    testQMLFileParseSimpleGetBySourceWithSpace: function(test) {
        test.expect(5);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        test.ok(qf);

        qf.parse('button2: qsTr("  Start  ") + _emptyString');

        var set = qf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("  Start  ");
        test.ok(r);
        test.equal(r.getSource(), "  Start  ");
        test.equal(r.getKey(), "  Start  ");

        test.done();
    },

    testQMLFileParseSimpleGetBySourceWithSpaces: function(test) {
        test.expect(5);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        test.ok(qf);

        qf.parse('button2: qsTr("   Start       ") + _emptyString');

        var set = qf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("   Start       ");
        test.ok(r);
        test.equal(r.getSource(), "   Start       ");
        test.equal(r.getKey(), "   Start       ");

        test.done();
    },

    testQMLFileParseSimple: function(test) {
        test.expect(5);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        test.ok(qf);

        qf.parse('return qsTr("Stop Music \nRecording") + emptyString;');

        var set = qf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("Stop Music \nRecording");
        test.ok(r);
        test.equal(r.getSource(), "Stop Music \nRecording");
        test.equal(r.getKey(), "Stop Music \nRecording");

        test.done();
    },

    testQMLFileParseSimple2: function(test) {
        test.expect(5);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        test.ok(qf);

        qf.parse('inputGuide = qsTr("(1) \tPlease check the power of the external devices and cable connection status.")');

        var set = qf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("(1) \tPlease check the power of the external devices and cable connection status.");
        test.ok(r);
        test.equal(r.getSource(), "(1) \tPlease check the power of the external devices and cable connection status.");
        test.equal(r.getKey(), "(1) \tPlease check the power of the external devices and cable connection status.");

        test.done();
    },

    testQMLFileParseSimple3: function(test) {
        test.expect(5);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        test.ok(qf);

        qf.parse("string = qsTr('TV: Internal Storage [%1%2 Free / %3%4]').arg(strFreeSpace).arg(capaString[freeCapaIndex]).arg(strTotalSpace).arg(capaString[totalCapaIndex]);");

        var set = qf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("TV: Internal Storage [%1%2 Free / %3%4]");
        test.ok(r);
        test.equal(r.getSource(), "TV: Internal Storage [%1%2 Free / %3%4]");
        test.equal(r.getKey(), "TV: Internal Storage [%1%2 Free / %3%4]");

        test.done();
    },

    testQMLFileParseWithdisambiguation: function(test) {
        test.expect(5);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        test.ok(qf);

        qf.parse('qsTr("Ep", "Episode Abbreviation") + localeService.emptyString');

        var set = qf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("Ep");
        test.ok(r);
        test.equal(r.getSource(), "Ep");
        test.equal(r.getKey(), "Episode Abbreviation");

        test.done();
    },

    testQMLFileParseWithdisambiguationwithSingleQuote: function(test) {
        test.expect(5);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        test.ok(qf);

        qf.parse("qsTr('Ep', 'Episode Abbreviation') + localeService.emptyString");

        var set = qf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("Ep");
        test.ok(r);
        test.equal(r.getSource(), "Ep");
        test.equal(r.getKey(), "Episode Abbreviation");

        test.done();
    },

    testQMLFileParseWithqtTranslateWithdisambiguation: function(test) {
        test.expect(5);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        test.ok(qf);

        qf.parse('qsTranslate("appLaunch", "This function is not available.", "disambiguation text")');

        var set = qf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This function is not available.");
        test.ok(r);
        test.equal(r.getSource(), "This function is not available.");
        test.equal(r.getKey(), "disambiguation text");

        test.done();
    },

    testQMLFileParseWithqtTranslateWithdisambiguationwithSingleQuote: function(test) {
        test.expect(5);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        test.ok(qf);

        qf.parse("qsTranslate('appLaunch', 'This function is not available.', 'disambiguation text')");

        var set = qf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This function is not available.");
        test.ok(r);
        test.equal(r.getSource(), "This function is not available.");
        test.equal(r.getKey(), "disambiguation text");

        test.done();
    },

    testQMLFileParseWithqtTranslate: function(test) {
        test.expect(5);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        test.ok(qf);

        qf.parse('qsTranslate("appLaunch", "This function is not available.")');

        var set = qf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This function is not available.");
        test.ok(r);
        test.equal(r.getSource(), "This function is not available.");
        test.equal(r.getKey(), "This function is not available.");

        test.done();
    },

    testQMLFileParseWithqtTranslatewithSingleQuote: function(test) {
        test.expect(5);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        test.ok(qf);

        qf.parse("qsTranslate('appLaunch', 'This function is not available.')");

        var set = qf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This function is not available.");
        test.ok(r);
        test.equal(r.getSource(), "This function is not available.");
        test.equal(r.getKey(), "This function is not available.");

        test.done();
    },

    testQMLFileParseSimpleWithTranslatorComment: function(test) {
        test.expect(6);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        test.ok(qf);

        qf.parse('"Voice_530": qsTr("Cancel") + _transObj.emptyString, // i18n CANCEL for TTS');

        var set = qf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("Cancel");
        test.ok(r);
        test.equal(r.getSource(), "Cancel");
        test.equal(r.getKey(), "Cancel");
        test.equal(r.getComment(), "CANCEL for TTS");

        test.done();
    },

    testQMLFileParseSimpleWithTranslatorComment2: function(test) {
        test.expect(6);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        test.ok(qf);

        qf.parse('        \n'+
            '    //: General main Comment\n' +
            '    qsTr("My Channels") // i18n webOS Comment\n' +
            '\n');

        var set = qf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("My Channels");
        test.ok(r);
        test.equal(r.getSource(), "My Channels");
        test.equal(r.getKey(), "My Channels");
        test.equal(r.getComment(), "General main Comment webOS Comment");

        test.done();
    },

    testQMLFileParseSimpleWithTranslatorComment3: function(test) {
        test.expect(6);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        test.ok(qf);

        qf.parse('        \n'+
            '    //: General main Comment\n' +
            '    //~ General additional Comment\n' +
            '    qsTr("My Channels") // i18n webOS Comment\n' +
            '\n');

        var set = qf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("My Channels");
        test.ok(r);
        test.equal(r.getSource(), "My Channels");
        test.equal(r.getKey(), "My Channels");
        test.equal(r.getComment(), "General main Comment webOS Comment General additional Comment");

        test.done();
    },

    testQMLFileParseSimpleWithTranslatorComment4: function(test) {
        test.expect(6);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        test.ok(qf);

        qf.parse('"Voice_531": qsTr("Close") + _transObj.emptyString, // i18n guidance sentence for focusing on app closing button (x button)');

        var set = qf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("Close");
        test.ok(r);
        test.equal(r.getSource(), "Close");
        test.equal(r.getKey(), "Close");
        test.equal(r.getComment(), "guidance sentence for focusing on app closing button (x button)");

        test.done();
    },

    testQMLFileParseSimpleWithTranslatorComment5: function(test) {
        test.expect(6);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        test.ok(qf);

        qf.parse('        \n'+
            '    //: General main Comment\n' +
            '    qsTr("My Channels\n \t ...", "number") // i18n info to translator\n' +
            '\n');

        var set = qf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("My Channels\n \t ...");
        test.ok(r);
        test.equal(r.getSource(), "My Channels\n \t ...");
        test.equal(r.getKey(), "number");
        test.equal(r.getComment(), "General main Comment info to translator");

        test.done();
    },

    testQMLFileParseSimpleWithTranslatorComment6: function(test) {
        test.expect(6);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        test.ok(qf);

        qf.parse('        \n'+
            '    //: General main Comment\n' +
            '    qsTranslate("context", "My Channels\n \t ...", "number") // i18n info to translator\n' +
            '\n');

        var set = qf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("My Channels\n \t ...");
        test.ok(r);
        test.equal(r.getSource(), "My Channels\n \t ...");
        test.equal(r.getKey(), "number");
        test.equal(r.getComment(), "General main Comment info to translator");

        test.done();
    },

    testQMLFileParseSimpleWithTranslatorComment7: function(test) {
        test.expect(5);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        test.ok(qf);

        qf.parse('        \n'+
            '    //: comment1\n' +
            '    //~ comment2\n' +
            '    qsTranslate("context", "My Channels\n \t ...") // i18n comment3\n' +
            '\n');

        var set = qf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("My Channels\n \t ...");
        test.ok(r);
        test.equal(r.getSource(), "My Channels\n \t ...");
        test.equal(r.getComment(), "comment1 comment3 comment2");

        test.done();
    },

    testQMLFileParseMultiple: function(test) {
        test.expect(8);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        test.ok(qf);

        qf.parse('popupUtil.createAlert(channelMapEmptyTitle, channelMapEmptyMessage, _callBack_channelMap, qsTr("No"), qsTr("Yes"), 0 , false, false);');

        var set = qf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("No");
        test.ok(r);
        test.equal(r.getSource(), "No");
        test.equal(r.getKey(), "No");

        r = set.getBySource("Yes");
        test.ok(r);
        test.equal(r.getSource(), "Yes");
        test.equal(r.getKey(), "Yes");

        test.done();
    },

    testQMLFileParseMultiple2: function(test) {
        test.expect(8);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        test.ok(qf);

        qf.parse('result = result + " " + qsTr("Blue Button") + " " + qsTr("Object Audio");');

        var set = qf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("Blue Button");
        test.ok(r);
        test.equal(r.getSource(), "Blue Button");
        test.equal(r.getKey(), "Blue Button");

        r = set.getBySource("Object Audio");
        test.ok(r);
        test.equal(r.getSource(), "Object Audio");
        test.equal(r.getKey(), "Object Audio");

        test.done();
    },

    testQMLFileParseMultiple3: function(test) {
        test.expect(17);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        test.ok(qf);

        qf.parse('var guideText = qsTr("Music Recording Settings") + " , " + qsTr("Cancel") + " " + qsTr("Music Record") + " , " + qsTr("Music Record") + " " + qsTr("button") + " , " + qsTr("Press Down button on remote to set details for music recording.");');

        var set = qf.getTranslationSet();
        test.equal(set.size(), 5);


        var r = set.getBySource("Music Recording Settings");
        test.ok(r);
        test.equal(r.getSource(), "Music Recording Settings");
        test.equal(r.getKey(), "Music Recording Settings");

        r = set.getBySource("Cancel");
        test.ok(r);
        test.equal(r.getSource(), "Cancel");
        test.equal(r.getKey(), "Cancel");

        r = set.getBySource("Music Record");
        test.ok(r);
        test.equal(r.getSource(), "Music Record");
        test.equal(r.getKey(), "Music Record");

        r = set.getBySource("button");
        test.ok(r);
        test.equal(r.getSource(), "button");
        test.equal(r.getKey(), "button");

        r = set.getBySource("Press Down button on remote to set details for music recording.");
        test.ok(r);
        test.equal(r.getSource(), "Press Down button on remote to set details for music recording.");
        test.equal(r.getKey(), "Press Down button on remote to set details for music recording.");

        test.done();
    },

    testQMLFileParseBogusNonStringParam: function(test) {
        test.expect(2);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        test.ok(qf);

        qf.parse('button2: qsTr(Start) + _emptyString');

        var set = qf.getTranslationSet();
        test.equal(set.size(), 0);

        test.done();
    },

    testQMLFileParseEmptyParams: function(test) {
        test.expect(2);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        test.ok(qf);

        qf.parse('button2: qsTr() + _emptyString');

        var set = qf.getTranslationSet();
        test.equal(set.size(), 0);

        test.done();
    },

    testQMLFileParseWholeWord: function(test) {
        test.expect(2);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        test.ok(qf);

        qf.parse('button2: qqsTr() + _emptyString');

        var set = qf.getTranslationSet();
        test.equal(set.size(), 0);

        test.done();
    },

    testQMLFileParsePunctuationBeforeRB: function(test) {
        test.expect(15);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        test.ok(qf);
        qf.parse('        \n'+
            '    switch(modeId) {\n' +
            '    case 0:\n' +
            '        if(systemSettings.country === "JPN") {\n' +
            '            modeString = qsTr("Terrestrial DTV") + localeService.emptyString; // i18n description of TV type\n' +
            '        } else {\n' +
            '            modeString = qsTr("Antenna") + localeService.emptyString; // i18n description of TV type\n' +
            '        }\n' +
            '        break;\n' +
            '    case 1:\n' +
            '        modeString = qsTr("Cable") + localeService.emptyString; // i18n description of Cable type\n' +
            '        break;\n' +
            '    case 2:\n' +
            '        modeString = qsTr("Satellite") + localeService.emptyString; // i18n description of Satelite type\n' +
            '        break;\n' +
            '    case 3:\n' +
            '        modeString = qsTr("CI+") + localeService.emptyString // i18n item name of LiveTV for DVB Source choose combobox\n' +
            '        break;\n' +
            '\n');
        var set = qf.getTranslationSet();
        test.ok(set);
        test.equal(set.size(), 5);

        var r = set.getBySource("Antenna");
        test.ok(r);
        test.equal(r.getSource(), "Antenna");
        test.equal(r.getKey(), "Antenna");
        test.equal(r.getComment(), "description of TV type");

        r = set.getBySource("Satellite");
        test.ok(r);
        test.equal(r.getSource(), "Satellite");
        test.equal(r.getKey(), "Satellite");
        test.equal(r.getComment(), "description of Satelite type");

        r = set.getBySource("CI+");
        test.ok(r);
        test.equal(r.getSource(), "CI+");
        test.equal(r.getKey(), "CI+");
        test.equal(r.getComment(), "item name of LiveTV for DVB Source choose combobox");

        test.done();
    },

    testQMLFileParseMultilineComment: function(test) {
        test.expect(10);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });

        test.ok(qf);
        qf.parse('        \n'+
            '    qsTr("My Channels") // i18n some comment messages... /*\n' +
            '    //some comment messages...\n' +
            '    //*/ qsTr("Another day")\n' +
            '\n');
        var set = qf.getTranslationSet();
        test.ok(set);
        test.equal(set.size(), 2);

        var r = set.getBySource("My Channels");
        test.ok(r);
        test.equal(r.getSource(), "My Channels");
        test.equal(r.getKey(), "My Channels");
        test.equal(r.getComment(), "some comment messages...");

        r = set.getBySource("Another day");
        test.ok(r);
        test.equal(r.getSource(), "Another day");
        test.equal(r.getKey(), "Another day");

        test.done();
    },

    testQMLFileExtractFile: function(test) {
        test.expect(8);

        var qf = new QMLFile({
            project: p,
            pathName: "./t1.qml",
            type: qmlft
        });
        test.ok(qf);

        qf.extract();
        var set = qf.getTranslationSet();
        test.equal(set.size(), 8);

        var r = set.get(ContextResourceString.hashKey("app", "t1", set.sourceLocale, "Invalid Format", "x-qml"));
        test.ok(r);

        test.equal(r.getSource(), "Invalid Format");
        test.equal(r.getKey(), "Invalid Format");

        var r = set.get(ContextResourceString.hashKey("app", "t1", set.sourceLocale, "(1) Please check the power of the external devices and cable connection status.", "x-qml"));
        test.ok(r);
 
        test.equal(r.getSource(), "(1) Please check the power of the external devices and cable connection status.");
        test.equal(r.getKey(), "(1) Please check the power of the external devices and cable connection status.");

        test.done();
    },

    testQMLFileExtractUndefinedFile: function(test) {
        test.expect(2);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        test.ok(qf);

        // should attempt to read the file and not fail
        qf.extract();

        var set = qf.getTranslationSet();
        test.equal(set.size(), 0);
        test.done();
    },
    testQMLFileTest2: function(test) {
        test.expect(57);

        var qf = new QMLFile({
            project: p,
            pathName: "./t2.qml",
            type: qmlft
        });
        test.ok(qf);

        qf.extract();
        var set = qf.getTranslationSet();
        test.equal(set.size(), 18);

        //var r = set.get(ContextResourceString.hashKey("app", "t1", "en-US", "(1) Please check the power of the external devices and cable connection status.", "x-qml"));
        var r = set.get(ContextResourceString.hashKey("app", "t2", set.sourceLocale, "1: Test String for qsTr", "x-qml"));
        test.ok(r);
        test.equal(r.getSource(), "1: Test String for qsTr");
        test.equal(r.getKey(), "1: Test String for qsTr");

        var r = set.get(ContextResourceString.hashKey("app", "t2", set.sourceLocale, "2: Test String for qsTrNoOp", "x-qml"));
        test.ok(r);
        test.equal(r.getSource(), "2: Test String for qsTrNoOp");
        test.equal(r.getKey(), "2: Test String for qsTrNoOp");

        var r = set.get(ContextResourceString.hashKey("app", "t2", set.sourceLocale, "3: Test String for QT_TR_NOOP", "x-qml"));
        test.ok(r);
        test.equal(r.getSource(), "3: Test String for QT_TR_NOOP");
        test.equal(r.getKey(), "3: Test String for QT_TR_NOOP");

        var r = set.get(ContextResourceString.hashKey("app", "t2", set.sourceLocale, "4: Test String for QT_TR_N_NOOP", "x-qml"));
        test.ok(r);
        test.equal(r.getSource(), "4: Test String for QT_TR_N_NOOP");
        test.equal(r.getKey(), "4: Test String for QT_TR_N_NOOP");

        var r = set.get(ContextResourceString.hashKey("app", "t2", set.sourceLocale, "5: disambiguation string", "x-qml"));
        test.ok(r);
        test.equal(r.getSource(), "5: Test String for qsTr with disambiguation");
        test.equal(r.getKey(), "5: disambiguation string");

        var r = set.get(ContextResourceString.hashKey("app", "t2", set.sourceLocale, "6: disambiguation string", "x-qml"));
        test.ok(r);
        test.equal(r.getSource(), "6: Test String for qsTrNoOp with disambiguation");
        test.equal(r.getKey(), "6: disambiguation string");

        var r = set.get(ContextResourceString.hashKey("app", "t2", set.sourceLocale, "7: disambiguation string", "x-qml"));
        test.ok(r);
        test.equal(r.getSource(), "7: Test String for QT_TR_NOOP with disambiguation");
        test.equal(r.getKey(), "7: disambiguation string");

        var r = set.get(ContextResourceString.hashKey("app", "t2", set.sourceLocale, "8: disambiguation string", "x-qml"));
        test.ok(r);
        test.equal(r.getSource(), "8: Test String for QT_TR_N_NOOP with disambiguation");
        test.equal(r.getKey(), "8: disambiguation string");

        var r = set.get(ContextResourceString.hashKey("app", "t2", set.sourceLocale, "9: Test String for qsTranslate", "x-qml"));
        test.ok(r);
        test.equal(r.getSource(), "9: Test String for qsTranslate");
        test.equal(r.getKey(), "9: Test String for qsTranslate");

        var r = set.get(ContextResourceString.hashKey("app", "t2", set.sourceLocale, "10: Test String for qsTranslateNoOp", "x-qml"));
        test.ok(r);
        test.equal(r.getSource(), "10: Test String for qsTranslateNoOp");
        test.equal(r.getKey(), "10: Test String for qsTranslateNoOp");
        test.equal(r.getComment(), "translation comment for webOS,");

        var r = set.get(ContextResourceString.hashKey("app", "t2", set.sourceLocale, "11: Test String for QT_TRANSLATE_NOOP", "x-qml"));
        test.ok(r);
        test.equal(r.getSource(), "11: Test String for QT_TRANSLATE_NOOP");
        test.equal(r.getKey(), "11: Test String for QT_TRANSLATE_NOOP");

        var r = set.get(ContextResourceString.hashKey("app", "t2", set.sourceLocale, "12: Test String for QT_TRANSLATE_NOOP3", "x-qml"));
        test.ok(r);
        test.equal(r.getSource(), "12: Test String for QT_TRANSLATE_NOOP3");
        test.equal(r.getKey(), "12: Test String for QT_TRANSLATE_NOOP3");

        var r = set.get(ContextResourceString.hashKey("app", "t2", set.sourceLocale, "13: Test String for QT_TRANSLATE_N_NOOP", "x-qml"));
        test.ok(r);
        test.equal(r.getSource(), "13: Test String for QT_TRANSLATE_N_NOOP");
        test.equal(r.getKey(), "13: Test String for QT_TRANSLATE_N_NOOP");

        var r = set.get(ContextResourceString.hashKey("app", "t2", set.sourceLocale, "14: disambiguation string", "x-qml"));
        test.ok(r);
        test.equal(r.getSource(), "14: Test String for qsTranslate with disambiguation");
        test.equal(r.getKey(), "14: disambiguation string");

        var r = set.get(ContextResourceString.hashKey("app", "t2", set.sourceLocale, "15: disambiguation string", "x-qml"));
        test.ok(r);
        test.equal(r.getSource(), "15: Test String for qsTranslateNoOp with disambiguation");
        test.equal(r.getKey(), "15: disambiguation string");

        var r = set.get(ContextResourceString.hashKey("app", "t2", set.sourceLocale, "16: disambiguation string", "x-qml"));
        test.ok(r);
        test.equal(r.getSource(), "16: Test String for QT_TRANSLATE_NOOP3 with disambiguation");
        test.equal(r.getKey(), "16: disambiguation string");

        var r = set.get(ContextResourceString.hashKey("app", "t2", set.sourceLocale, "17: single-quote string test", "x-qml"));
        test.ok(r);
        test.equal(r.getSource(), "17: single-quote string test");
        test.equal(r.getKey(), "17: single-quote string test");

        var r = set.get(ContextResourceString.hashKey("app", "t2", set.sourceLocale, '18: Test "String" for qsTr', "x-qml"));
        test.ok(r);
        test.equal(r.getSource(), '18: Test "String" for qsTr');
        test.equal(r.getKey(), '18: Test "String" for qsTr');

        test.done();
    },
    testQMLFileTest3: function(test) {
        test.expect(2);

        var qf = new QMLFile({
            project: p,
            pathName: "./t3.qml",
            type: qmlft
        });
        test.ok(qf);
        // should attempt to read the file and not fail
        qf.extract();

        var set = qf.getTranslationSet();
        test.equal(set.size(), 0);

        test.done();
    },
    testQMLFileTest4: function(test) {
        test.expect(12);

        var qf = new QMLFile({
            project: p,
            pathName: "./t4.qml",
            type: qmlft
        });
        test.ok(qf);
        qf.extract();

        var set = qf.getTranslationSet();
        test.equal(set.size(), 2);

        var r = set.get(ContextResourceString.hashKey("app", "t4", set.sourceLocale,"1: Test String for qsTr", "x-qml"));
        test.ok(r);
        test.equal(r.getSource(), "1: Test String for qsTr");
        test.equal(r.getKey(), "1: Test String for qsTr");
        test.equal(r.getComment(), "--> main comment for the translator  --> Additional comment for the translator");

        var r = set.get(ContextResourceString.hashKey("app", "t4", set.sourceLocale, "7: disambiguation string", "x-qml"));
        test.ok(r);
        test.equal(r.getSource(), "1: Test String for qsTr");
        test.equal(r.getKey(), "7: disambiguation string");

        var r = set.getBy({
            reskey: "7: disambiguation string"
        });
        test.ok(r);

        test.equal(r[0].getSource(), "1: Test String for qsTr");
        test.equal(r[0].getKey(), "7: disambiguation string");

        test.done();
    },
    testQMLFileParseMacro: function(test) {
        test.expect(5);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        test.ok(qf);

        qf.parse(' QT_TR_NOOP("Goodbye")');

        var set = qf.getTranslationSet();
        test.ok(set);

        var r = set.getBy({
            reskey: "Goodbye"
        });
        test.ok(r);

        test.equal(r[0].getSource(), "Goodbye");
        test.equal(r[0].getKey(), "Goodbye");

        test.done();
    },
    testQMLFileParseMacro2: function(test) {
        test.expect(5);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        test.ok(qf);

        qf.parse('QT_TR_N_NOOP("There are %n new message(s)")');

        var set = qf.getTranslationSet();
        test.ok(set);

        var r = set.getBy({
            reskey: "There are %n new message(s)"
        });
        test.ok(r);

        test.equal(r[0].getSource(), "There are %n new message(s)");
        test.equal(r[0].getKey(), "There are %n new message(s)");

        test.done();
    },
    testQMLFileTest5: function(test) {
        test.expect(50);

        var qf = new QMLFile({
            project: p,
            pathName: "./t5.js",
            type: qmlft
        });
        test.ok(qf);

        qf.extract();
        var set = qf.getTranslationSet();
        test.equal(set.size(), 16);

        var r = set.get(ContextResourceString.hashKey("app", "t5", set.sourceLocale, "1: Test String for qsTr", "x-qml"));
        test.ok(r);
        test.equal(r.getSource(), "1: Test String for qsTr");
        test.equal(r.getKey(), "1: Test String for qsTr");

        var r = set.get(ContextResourceString.hashKey("app", "t5", set.sourceLocale, "2: Test String for qsTrNoOp", "x-qml"));
        test.ok(r);
        test.equal(r.getSource(), "2: Test String for qsTrNoOp");
        test.equal(r.getKey(), "2: Test String for qsTrNoOp");

        var r = set.get(ContextResourceString.hashKey("app", "t5", set.sourceLocale, "3: Test String for QT_TR_NOOP", "x-qml"));
        test.ok(r);
        test.equal(r.getSource(), "3: Test String for QT_TR_NOOP");
        test.equal(r.getKey(), "3: Test String for QT_TR_NOOP");

        var r = set.get(ContextResourceString.hashKey("app", "t5", set.sourceLocale, "4: Test String for QT_TR_N_NOOP", "x-qml"));
        test.ok(r);
        test.equal(r.getSource(), "4: Test String for QT_TR_N_NOOP");
        test.equal(r.getKey(), "4: Test String for QT_TR_N_NOOP");

        var r = set.get(ContextResourceString.hashKey("app", "t5", set.sourceLocale, "5: disambiguation string", "x-qml"));
        test.ok(r);
        test.equal(r.getSource(), "5: Test String for qsTr with disambiguation");
        test.equal(r.getKey(), "5: disambiguation string");

        var r = set.get(ContextResourceString.hashKey("app", "t5", set.sourceLocale, "6: disambiguation string", "x-qml"));
        test.ok(r);
        test.equal(r.getSource(), "6: Test String for qsTrNoOp with disambiguation");
        test.equal(r.getKey(), "6: disambiguation string");

        var r = set.get(ContextResourceString.hashKey("app", "t5", set.sourceLocale, "7: disambiguation string", "x-qml"));
        test.ok(r);
        test.equal(r.getSource(), "7: Test String for QT_TR_NOOP with disambiguation");
        test.equal(r.getKey(), "7: disambiguation string");

        var r = set.get(ContextResourceString.hashKey("app", "t5", set.sourceLocale, "8: disambiguation string", "x-qml"));
        test.ok(r);
        test.equal(r.getSource(), "8: Test String for QT_TR_N_NOOP with disambiguation");
        test.equal(r.getKey(), "8: disambiguation string");

        var r = set.get(ContextResourceString.hashKey("app", "t5", set.sourceLocale, "9: Test String for qsTranslate", "x-qml"));
        test.ok(r);
        test.equal(r.getSource(), "9: Test String for qsTranslate");
        test.equal(r.getKey(), "9: Test String for qsTranslate");

        var r = set.get(ContextResourceString.hashKey("app", "t5", set.sourceLocale, "10: Test String for qsTranslateNoOp", "x-qml"));
        test.ok(r);
        test.equal(r.getSource(), "10: Test String for qsTranslateNoOp");
        test.equal(r.getKey(), "10: Test String for qsTranslateNoOp");

        var r = set.get(ContextResourceString.hashKey("app", "t5", set.sourceLocale, "11: Test String for QT_TRANSLATE_NOOP", "x-qml"));
        test.ok(r);
        test.equal(r.getSource(), "11: Test String for QT_TRANSLATE_NOOP");
        test.equal(r.getKey(), "11: Test String for QT_TRANSLATE_NOOP");

        var r = set.get(ContextResourceString.hashKey("app", "t5", set.sourceLocale, "12: Test String for QT_TRANSLATE_NOOP3", "x-qml"));
        test.ok(r);
        test.equal(r.getSource(), "12: Test String for QT_TRANSLATE_NOOP3");
        test.equal(r.getKey(), "12: Test String for QT_TRANSLATE_NOOP3");

        var r = set.get(ContextResourceString.hashKey("app", "t5", set.sourceLocale, "13: Test String for QT_TRANSLATE_N_NOOP", "x-qml"));
        test.ok(r);
        test.equal(r.getSource(), "13: Test String for QT_TRANSLATE_N_NOOP");
        test.equal(r.getKey(), "13: Test String for QT_TRANSLATE_N_NOOP");

        var r = set.get(ContextResourceString.hashKey("app", "t5", set.sourceLocale, "14: disambiguation string", "x-qml"));
        test.ok(r);
        test.equal(r.getSource(), "14: Test String for qsTranslate with disambiguation");
        test.equal(r.getKey(), "14: disambiguation string");

        var r = set.get(ContextResourceString.hashKey("app", "t5", set.sourceLocale, "15: disambiguation string", "x-qml"));
        test.ok(r);
        test.equal(r.getSource(), "15: Test String for qsTranslateNoOp with disambiguation");
        test.equal(r.getKey(), "15: disambiguation string");

        var r = set.get(ContextResourceString.hashKey("app", "t5", set.sourceLocale, "16: disambiguation string", "x-qml"));
        test.ok(r);
        test.equal(r.getSource(), "16: Test String for QT_TRANSLATE_NOOP3 with disambiguation");
        test.equal(r.getKey(), "16: disambiguation string");

        test.done();
    }
};