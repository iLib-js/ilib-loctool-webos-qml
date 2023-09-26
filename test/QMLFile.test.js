/*
 * QMLFile.test.js - test the qml file handler object.
 *
 * Copyright (c) 2020-2023, JEDLSoft
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

const ContextResourceString = require("loctool/lib/ContextResourceString.js");
var path = require("path");

if (!QMLFile) {
    var QMLFile = require("../QMLFile.js");
    var QMLFileType = require("../QMLFileType.js");
    var CustomProject =  require("loctool/lib/CustomProject.js");
    var RegularPseudo =  require("loctool/lib/RegularPseudo.js");
    var ResourceFactory = require("loctool/lib/ResourceFactory.js");
    var SourceContextResourceString =  require("loctool/lib/SourceContextResourceString.js");
    var utils = require("loctool/lib/utils.js");
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

describe("qmlfile", function() {
    test("QMLFileConstructor", function() {
        expect.assertions(1);

        var qf = new QMLFile({project: p});
        expect(qf).toBeTruthy();
    });
    test("QMLFileConstructorParams", function() {
        expect.assertions(1);

        var qf = new QMLFile({
            project: p,
            pathName: "./testfiles/js/t1.qml",
            type: qmlft
        });

        expect(qf).toBeTruthy();
    });
    test("QMLFileConstructorNoFile", function() {
        expect.assertions(1);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        expect(qf).toBeTruthy();
    });
    test("QMLFileMakeKey", function() {
        expect.assertions(2);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        expect(qf).toBeTruthy();
        expect(qf.makeKey("This is a test")).toBe("This is a test");
    });
    test("QMLFileMakeKey2", function() {
        expect.assertions(2);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        expect(qf).toBeTruthy();
        expect(qf.makeKey("This is a \"real\" test")).toBe("This is a \"real\" test");
    });
    test("QMLFileMakeKeyWithSpace", function() {
        expect.assertions(2);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        expect(qf).toBeTruthy();
        expect(qf.makeKey(" This is a test ")).toBe(" This is a test ");
    });
    test("QMLFileMakeKeyWithSpaces", function() {
        expect.assertions(2);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        expect(qf).toBeTruthy();
        expect(qf.makeKey("   This is a test   ")).toBe("   This is a test   ");
    });
    test("QMLFileParseSimpleGetByKey", function() {
        expect.assertions(5);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        expect(qf).toBeTruthy();

        qf.parse('button2: qsTr("Start") + _emptyString');

        var set = qf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBy({
            reskey: "Start"
        });
        expect(r).toBeTruthy();

        expect(r[0].getSource()).toBe("Start");
        expect(r[0].getKey()).toBe("Start");
    });
    test("QMLFileParseSimpleGetByKeywithSingleQuote", function() {
        expect.assertions(5);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        expect(qf).toBeTruthy();

        qf.parse("button2: qsTr('Start') + _emptyString");

        var set = qf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBy({
            reskey: 'Start'
        });
        expect(r).toBeTruthy();

        expect(r[0].getSource()).toBe("Start");
        expect(r[0].getKey()).toBe("Start");
    });
    test("QMLFileParseSimpleGetBySource", function() {
        expect.assertions(5);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        expect(qf).toBeTruthy();

        qf.parse('button2: qsTr("Start") + _emptyString');

        var set = qf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("Start");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Start");
        expect(r.getKey()).toBe("Start");
    });
    test("QMLFileParseSimpleGetBySourceWithSpace", function() {
        expect.assertions(5);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        expect(qf).toBeTruthy();

        qf.parse('button2: qsTr("  Start  ") + _emptyString');

        var set = qf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("  Start  ");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("  Start  ");
        expect(r.getKey()).toBe("  Start  ");
    });
    test("QMLFileParseSimpleGetBySourceWithSpaces", function() {
        expect.assertions(5);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        expect(qf).toBeTruthy();

        qf.parse('button2: qsTr("   Start       ") + _emptyString');

        var set = qf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("   Start       ");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("   Start       ");
        expect(r.getKey()).toBe("   Start       ");
    });
    test("QMLFileParseSimple", function() {
        expect.assertions(5);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        expect(qf).toBeTruthy();

        qf.parse('return qsTr("Stop Music \nRecording") + emptyString;');

        var set = qf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("Stop Music \nRecording");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Stop Music \nRecording");
        expect(r.getKey()).toBe("Stop Music \nRecording");
    });
    test("QMLFileParseSimple2", function() {
        expect.assertions(5);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        expect(qf).toBeTruthy();

        qf.parse('inputGuide = qsTr("(1) \tPlease check the power of the external devices and cable connection status.")');

        var set = qf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("(1) \tPlease check the power of the external devices and cable connection status.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("(1) \tPlease check the power of the external devices and cable connection status.");
        expect(r.getKey()).toBe("(1) \tPlease check the power of the external devices and cable connection status.");
    });
    test("QMLFileParseSimple3", function() {
        expect.assertions(5);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        expect(qf).toBeTruthy();

        qf.parse("string = qsTr('TV: Internal Storage [%1%2 Free / %3%4]').arg(strFreeSpace).arg(capaString[freeCapaIndex]).arg(strTotalSpace).arg(capaString[totalCapaIndex]);");

        var set = qf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("TV: Internal Storage [%1%2 Free / %3%4]");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("TV: Internal Storage [%1%2 Free / %3%4]");
        expect(r.getKey()).toBe("TV: Internal Storage [%1%2 Free / %3%4]");
    });
    test("QMLFileParseWithdisambiguation", function() {
        expect.assertions(5);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        expect(qf).toBeTruthy();

        qf.parse('qsTr("Ep", "Episode Abbreviation") + localeService.emptyString');

        var set = qf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("Ep");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Ep");
        expect(r.getKey()).toBe("Episode Abbreviation");
    });
    test("QMLFileParseWithdisambiguationwithSingleQuote", function() {
        expect.assertions(5);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        expect(qf).toBeTruthy();

        qf.parse("qsTr('Ep', 'Episode Abbreviation') + localeService.emptyString");

        var set = qf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("Ep");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Ep");
        expect(r.getKey()).toBe("Episode Abbreviation");
    });
    test("QMLFileParseWithqtTranslateWithdisambiguation", function() {
        expect.assertions(6);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        expect(qf).toBeTruthy();

        qf.parse('qsTranslate("appLaunch", "This function is not available.", "disambiguation text")');

        var set = qf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This function is not available.", "appLaunch");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This function is not available.");
        expect(r.getKey()).toBe("disambiguation text");
        expect(r.getContext()).toBe("appLaunch");
    });
    test("QMLFileParseWithqtTranslateWithdisambiguationwithSingleQuote", function() {
        expect.assertions(6);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        expect(qf).toBeTruthy();

        qf.parse("qsTranslate('appLaunch', 'This function is not available.', 'disambiguation text')");

        var set = qf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This function is not available.", "appLaunch");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This function is not available.");
        expect(r.getKey()).toBe("disambiguation text");
        expect(r.getContext()).toBe("appLaunch");
    });
    test("QMLFileParseWithqtTranslate", function() {
        expect.assertions(6);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        expect(qf).toBeTruthy();

        qf.parse('qsTranslate("appLaunch", "This function is not available.")');

        var set = qf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This function is not available.", "appLaunch");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This function is not available.");
        expect(r.getKey()).toBe("This function is not available.");
        expect(r.getContext()).toBe("appLaunch");
    });
    test("QMLFileParseWithqtTranslatewithSingleQuote", function() {
        expect.assertions(6);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        expect(qf).toBeTruthy();

        qf.parse("qsTranslate('appLaunch', 'This function is not available.')");

        var set = qf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This function is not available.", "appLaunch");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This function is not available.");
        expect(r.getKey()).toBe("This function is not available.");
        expect(r.getContext()).toBe("appLaunch");
    });
    test("QMLFileParseSimpleWithTranslatorComment", function() {
        expect.assertions(6);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        expect(qf).toBeTruthy();

        qf.parse('"Voice_530": qsTr("Cancel") + _transObj.emptyString, // i18n CANCEL for TTS');

        var set = qf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("Cancel");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Cancel");
        expect(r.getKey()).toBe("Cancel");
        expect(r.getComment()).toBe("CANCEL for TTS");
    });
    test("QMLFileParseSimpleWithTranslatorComment2", function() {
        expect.assertions(6);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        expect(qf).toBeTruthy();

        qf.parse('        \n'+
            '    //: General main Comment\n' +
            '    qsTr("My Channels") // i18n webOS Comment\n' +
            '\n');

        var set = qf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("My Channels");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("My Channels");
        expect(r.getKey()).toBe("My Channels");
        expect(r.getComment()).toBe("webOS Comment");
    });
    test("QMLFileParseSimpleWithTranslatorComment3", function() {
        expect.assertions(6);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        expect(qf).toBeTruthy();

        qf.parse('        \n'+
            '    //: General main Comment\n' +
            '    //~ General additional Comment\n' +
            '    qsTr("My Channels") // i18n webOS Comment\n' +
            '\n');

        var set = qf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("My Channels");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("My Channels");
        expect(r.getKey()).toBe("My Channels");
        expect(r.getComment()).toBe("webOS Comment");
    });
    test("QMLFileParseSimpleWithTranslatorComment4", function() {
        expect.assertions(6);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        expect(qf).toBeTruthy();

        qf.parse('"Voice_531": qsTr("Close") + _transObj.emptyString, // i18n guidance sentence for focusing on app closing button (x button)');

        var set = qf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("Close");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Close");
        expect(r.getKey()).toBe("Close");
        expect(r.getComment()).toBe("guidance sentence for focusing on app closing button (x button)");
    });
    test("QMLFileParseSimpleWithTranslatorComment5", function() {
        expect.assertions(6);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        expect(qf).toBeTruthy();

        qf.parse('        \n'+
            '    //: General main Comment\n' +
            '    qsTr("My Channels\n \t ...", "number") // i18n info to translator\n' +
            '\n');

        var set = qf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("My Channels\n \t ...");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("My Channels\n \t ...");
        expect(r.getKey()).toBe("number");
        expect(r.getComment()).toBe("info to translator");
    });
    test("QMLFileParseSimpleWithTranslatorComment6", function() {
        expect.assertions(6);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        expect(qf).toBeTruthy();

        qf.parse('        \n'+
            '    //: General main Comment\n' +
            '    qsTranslate("context", "My Channels\n \t ...", "number") // i18n info to translator\n' +
            '\n');

        var set = qf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("My Channels\n \t ...", "context");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("My Channels\n \t ...");
        expect(r.getKey()).toBe("number");
        expect(r.getComment()).toBe("info to translator");
    });
    test("QMLFileParseSimpleWithTranslatorComment7", function() {
        expect.assertions(5);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        expect(qf).toBeTruthy();

        qf.parse('        \n'+
            '    //: comment1\n' +
            '    //~ comment2\n' +
            '    qsTranslate("context", "My Channels\n \t ...") // i18n comment3\n' +
            '\n');

        var set = qf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("My Channels\n \t ...", "context");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("My Channels\n \t ...");
        expect(r.getComment()).toBe("comment3");
    });
    test("QMLFileParseMultiple", function() {
        expect.assertions(8);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        expect(qf).toBeTruthy();

        qf.parse('popupUtil.createAlert(channelMapEmptyTitle, channelMapEmptyMessage, _callBack_channelMap, qsTr("No"), qsTr("Yes"), 0 , false, false);');

        var set = qf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("No");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("No");
        expect(r.getKey()).toBe("No");

        r = set.getBySource("Yes");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Yes");
        expect(r.getKey()).toBe("Yes");
    });
    test("QMLFileParseMultiple2", function() {
        expect.assertions(8);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        expect(qf).toBeTruthy();

        qf.parse('result = result + " " + qsTr("Blue Button") + " " + qsTr("Object Audio");');

        var set = qf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("Blue Button");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Blue Button");
        expect(r.getKey()).toBe("Blue Button");

        r = set.getBySource("Object Audio");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Object Audio");
        expect(r.getKey()).toBe("Object Audio");
    });
    test("QMLFileParseMultiple3", function() {
        expect.assertions(17);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        expect(qf).toBeTruthy();

        qf.parse('var guideText = qsTr("Music Recording Settings") + " , " + qsTr("Cancel") + " " + qsTr("Music Record") + " , " + qsTr("Music Record") + " " + qsTr("button") + " , " + qsTr("Press Down button on remote to set details for music recording.");');

        var set = qf.getTranslationSet();
        expect(set.size()).toBe(5);


        var r = set.getBySource("Music Recording Settings");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Music Recording Settings");
        expect(r.getKey()).toBe("Music Recording Settings");

        r = set.getBySource("Cancel");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Cancel");
        expect(r.getKey()).toBe("Cancel");

        r = set.getBySource("Music Record");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Music Record");
        expect(r.getKey()).toBe("Music Record");

        r = set.getBySource("button");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("button");
        expect(r.getKey()).toBe("button");

        r = set.getBySource("Press Down button on remote to set details for music recording.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Press Down button on remote to set details for music recording.");
        expect(r.getKey()).toBe("Press Down button on remote to set details for music recording.");
    });
    test("QMLFileParseBogusNonStringParam", function() {
        expect.assertions(2);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        expect(qf).toBeTruthy();

        qf.parse('button2: qsTr(Start) + _emptyString');

        var set = qf.getTranslationSet();
        expect(set.size()).toBe(0);
    });
    test("QMLFileParseEmptyParams", function() {
        expect.assertions(2);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        expect(qf).toBeTruthy();

        qf.parse('button2: qsTr() + _emptyString');

        var set = qf.getTranslationSet();
        expect(set.size()).toBe(0);
    });
    test("QMLFileParseWholeWord", function() {
        expect.assertions(2);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        expect(qf).toBeTruthy();

        qf.parse('button2: qqsTr() + _emptyString');

        var set = qf.getTranslationSet();
        expect(set.size()).toBe(0);
    });
    test("QMLFileParsePunctuationBeforeRB", function() {
        expect.assertions(15);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        expect(qf).toBeTruthy();
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
        expect(set).toBeTruthy();
        expect(set.size()).toBe(5);

        var r = set.getBySource("Antenna");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Antenna");
        expect(r.getKey()).toBe("Antenna");
        expect(r.getComment()).toBe("description of TV type");

        r = set.getBySource("Satellite");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Satellite");
        expect(r.getKey()).toBe("Satellite");
        expect(r.getComment()).toBe("description of Satelite type");

        r = set.getBySource("CI+");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("CI+");
        expect(r.getKey()).toBe("CI+");
        expect(r.getComment()).toBe("item name of LiveTV for DVB Source choose combobox");
    });
    test("QMLFileParseMultilineComment", function() {
        expect.assertions(7);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });

        expect(qf).toBeTruthy();
        qf.parse('        \n'+
            '    qsTr("My Channels") // i18n some comment messages... \n' +
            '    //some comment messages...\n' +
            '    // qsTr("Another day")\n' +
            '\n');
        var set = qf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);

        var r = set.getBySource("My Channels");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("My Channels");
        expect(r.getKey()).toBe("My Channels");
        expect(r.getComment()).toBe("some comment messages...");
    });
    test("QMLFileExtractFile", function() {
        expect.assertions(10);

        var qf = new QMLFile({
            project: p,
            pathName: "./t1.qml",
            type: qmlft
        });
        expect(qf).toBeTruthy();
        ResourceFactory.registerDataType("x-qml", "string", SourceContextResourceString);

        qf.extract();
        var set = qf.getTranslationSet();
        expect(set.size()).toBe(8);
        var sourceHash = utils.hashKey("Invalid Format");
        var r = set.get(SourceContextResourceString.hashKey("app", "t1", set.sourceLocale, "Invalid Format", "x-qml", undefined, sourceHash));
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("Invalid Format");
        expect(r.getKey()).toBe("Invalid Format");
        expect(r.getContext()).toBe("t1");

        var sourceHash = utils.hashKey("(1) Please check the power of the external devices and cable connection status.");
        var r = set.get(SourceContextResourceString.hashKey("app", "t1", set.sourceLocale, "(1) Please check the power of the external devices and cable connection status.", "x-qml", undefined, sourceHash));
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("(1) Please check the power of the external devices and cable connection status.");
        expect(r.getKey()).toBe("(1) Please check the power of the external devices and cable connection status.");
        expect(r.getContext()).toBe("t1");
    });
    test("QMLFileExtractUndefinedFile", function() {
        expect.assertions(2);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        expect(qf).toBeTruthy();

        // should attempt to read the file and not fail
        qf.extract();

        var set = qf.getTranslationSet();
        expect(set.size()).toBe(0);
    });
    test("QMLFileTest2", function() {
        expect.assertions(57);

        var qf = new QMLFile({
            project: p,
            pathName: "./t2.qml",
            type: qmlft
        });
        expect(qf).toBeTruthy();

        qf.extract();
        var set = qf.getTranslationSet();
        expect(set.size()).toBe(18);

        var sourceHash = utils.hashKey("1: Test String for qsTr");
        var r = set.get(SourceContextResourceString.hashKey("app", "t2", set.sourceLocale, "1: Test String for qsTr", "x-qml", undefined, sourceHash));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("1: Test String for qsTr");
        expect(r.getKey()).toBe("1: Test String for qsTr");

        sourceHash = utils.hashKey("2: Test String for qsTrNoOp");
        var r = set.get(SourceContextResourceString.hashKey("app", "t2", set.sourceLocale, "2: Test String for qsTrNoOp", "x-qml", undefined, sourceHash));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("2: Test String for qsTrNoOp");
        expect(r.getKey()).toBe("2: Test String for qsTrNoOp");

        sourceHash = utils.hashKey("3: Test String for QT_TR_NOOP");
        var r = set.get(SourceContextResourceString.hashKey("app", "t2", set.sourceLocale, "3: Test String for QT_TR_NOOP", "x-qml", undefined, sourceHash));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("3: Test String for QT_TR_NOOP");
        expect(r.getKey()).toBe("3: Test String for QT_TR_NOOP");

        sourceHash = utils.hashKey("4: Test String for QT_TR_N_NOOP");
        var r = set.get(SourceContextResourceString.hashKey("app", "t2", set.sourceLocale, "4: Test String for QT_TR_N_NOOP", "x-qml", undefined, sourceHash));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("4: Test String for QT_TR_N_NOOP");
        expect(r.getKey()).toBe("4: Test String for QT_TR_N_NOOP");

        sourceHash = utils.hashKey("5: Test String for qsTr with disambiguation");
        var r = set.get(SourceContextResourceString.hashKey("app", "t2", set.sourceLocale, "5: disambiguation string", "x-qml", undefined, sourceHash));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("5: Test String for qsTr with disambiguation");
        expect(r.getKey()).toBe("5: disambiguation string");

        sourceHash = utils.hashKey("6: Test String for qsTrNoOp with disambiguation");
        var r = set.get(SourceContextResourceString.hashKey("app", "t2", set.sourceLocale, "6: disambiguation string", "x-qml", undefined, sourceHash));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("6: Test String for qsTrNoOp with disambiguation");
        expect(r.getKey()).toBe("6: disambiguation string");

        sourceHash = utils.hashKey("7: Test String for QT_TR_NOOP with disambiguation");
        var r = set.get(SourceContextResourceString.hashKey("app", "t2", set.sourceLocale, "7: disambiguation string", "x-qml", undefined, sourceHash));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("7: Test String for QT_TR_NOOP with disambiguation");
        expect(r.getKey()).toBe("7: disambiguation string");

        sourceHash = utils.hashKey("8: Test String for QT_TR_N_NOOP with disambiguation");
        var r = set.get(SourceContextResourceString.hashKey("app", "t2", set.sourceLocale, "8: disambiguation string", "x-qml", undefined, sourceHash));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("8: Test String for QT_TR_N_NOOP with disambiguation");
        expect(r.getKey()).toBe("8: disambiguation string");

        sourceHash = utils.hashKey("9: Test String for qsTranslate");
        var r = set.get(SourceContextResourceString.hashKey("app", "context", set.sourceLocale, "9: Test String for qsTranslate", "x-qml", undefined, sourceHash));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("9: Test String for qsTranslate");
        expect(r.getKey()).toBe("9: Test String for qsTranslate");

        sourceHash = utils.hashKey("10: Test String for qsTranslateNoOp");
        var r = set.get(SourceContextResourceString.hashKey("app", "context", set.sourceLocale, "10: Test String for qsTranslateNoOp", "x-qml", undefined, sourceHash));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("10: Test String for qsTranslateNoOp");
        expect(r.getKey()).toBe("10: Test String for qsTranslateNoOp");
        expect(r.getComment()).toBe("translation comment for webOS,");

        sourceHash = utils.hashKey("11: Test String for QT_TRANSLATE_NOOP");
        var r = set.get(SourceContextResourceString.hashKey("app", "context", set.sourceLocale, "11: Test String for QT_TRANSLATE_NOOP", "x-qml", undefined, sourceHash));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("11: Test String for QT_TRANSLATE_NOOP");
        expect(r.getKey()).toBe("11: Test String for QT_TRANSLATE_NOOP");

        sourceHash = utils.hashKey("12: Test String for QT_TRANSLATE_NOOP3");
        var r = set.get(SourceContextResourceString.hashKey("app", "context", set.sourceLocale, "12: Test String for QT_TRANSLATE_NOOP3", "x-qml", undefined, sourceHash));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("12: Test String for QT_TRANSLATE_NOOP3");
        expect(r.getKey()).toBe("12: Test String for QT_TRANSLATE_NOOP3");

        sourceHash = utils.hashKey("13: Test String for QT_TRANSLATE_N_NOOP");
        var r = set.get(SourceContextResourceString.hashKey("app", "context", set.sourceLocale, "13: Test String for QT_TRANSLATE_N_NOOP", "x-qml", undefined, sourceHash));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("13: Test String for QT_TRANSLATE_N_NOOP");
        expect(r.getKey()).toBe("13: Test String for QT_TRANSLATE_N_NOOP");

        sourceHash = utils.hashKey("14: Test String for qsTranslate with disambiguation");
        var r = set.get(SourceContextResourceString.hashKey("app", "context", set.sourceLocale, "14: disambiguation string", "x-qml", undefined, sourceHash));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("14: Test String for qsTranslate with disambiguation");
        expect(r.getKey()).toBe("14: disambiguation string");

        sourceHash = utils.hashKey("15: Test String for qsTranslateNoOp with disambiguation");
        var r = set.get(SourceContextResourceString.hashKey("app", "context", set.sourceLocale, "15: disambiguation string", "x-qml", undefined, sourceHash));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("15: Test String for qsTranslateNoOp with disambiguation");
        expect(r.getKey()).toBe("15: disambiguation string");

        sourceHash = utils.hashKey("16: Test String for QT_TRANSLATE_NOOP3 with disambiguation");
        var r = set.get(SourceContextResourceString.hashKey("app", "context", set.sourceLocale, "16: disambiguation string", "x-qml", undefined, sourceHash));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("16: Test String for QT_TRANSLATE_NOOP3 with disambiguation");
        expect(r.getKey()).toBe("16: disambiguation string");

        sourceHash = utils.hashKey("17: single-quote string test");
        var r = set.get(SourceContextResourceString.hashKey("app", "context", set.sourceLocale, "17: single-quote string test", "x-qml", undefined, sourceHash));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("17: single-quote string test");
        expect(r.getKey()).toBe("17: single-quote string test");

        sourceHash = utils.hashKey('18: Test "String" for qsTr');
        var r = set.get(SourceContextResourceString.hashKey("app", "t2", set.sourceLocale, '18: Test "String" for qsTr', "x-qml", undefined, sourceHash));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('18: Test "String" for qsTr');
        expect(r.getKey()).toBe('18: Test "String" for qsTr');
    });
    test("QMLFileTest3", function() {
        expect.assertions(2);

        var qf = new QMLFile({
            project: p,
            pathName: "./t3.qml",
            type: qmlft
        });
        expect(qf).toBeTruthy();
        // should attempt to read the file and not fail
        qf.extract();

        var set = qf.getTranslationSet();
        expect(set.size()).toBe(0);
    });
    test("QMLFileTest4", function() {
        expect.assertions(12);

        var qf = new QMLFile({
            project: p,
            pathName: "./t4.qml",
            type: qmlft
        });
        expect(qf).toBeTruthy();
        qf.extract();

        var set = qf.getTranslationSet();
        expect(set.size()).toBe(2);

        var sourceHash = utils.hashKey('1: Test String for qsTr');
        var r = set.get(SourceContextResourceString.hashKey("app", "t4", set.sourceLocale,"1: Test String for qsTr", "x-qml", undefined, sourceHash));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("1: Test String for qsTr");
        expect(r.getKey()).toBe("1: Test String for qsTr");
        expect(r.getComment()).toBe("--> main comment for the translator--> Additional comment for the translator");

        sourceHash = utils.hashKey('1: Test String for qsTr');
        var r = set.get(SourceContextResourceString.hashKey("app", "t4", set.sourceLocale, "7: disambiguation string", "x-qml", undefined, sourceHash));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("1: Test String for qsTr");
        expect(r.getKey()).toBe("7: disambiguation string");

        var r = set.getBy({
            reskey: "7: disambiguation string"
        });
        expect(r).toBeTruthy();

        expect(r[0].getSource()).toBe("1: Test String for qsTr");
        expect(r[0].getKey()).toBe("7: disambiguation string");
    });
    test("QMLFileParseMacro", function() {
        expect.assertions(5);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        expect(qf).toBeTruthy();

        qf.parse(' QT_TR_NOOP("Goodbye")');

        var set = qf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBy({
            reskey: "Goodbye"
        });
        expect(r).toBeTruthy();

        expect(r[0].getSource()).toBe("Goodbye");
        expect(r[0].getKey()).toBe("Goodbye");
    });
    test("QMLFileParseMacro2", function() {
        expect.assertions(5);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        expect(qf).toBeTruthy();

        qf.parse('QT_TR_N_NOOP("There are %n new message(s)")');

        var set = qf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBy({
            reskey: "There are %n new message(s)"
        });
        expect(r).toBeTruthy();

        expect(r[0].getSource()).toBe("There are %n new message(s)");
        expect(r[0].getKey()).toBe("There are %n new message(s)");
    });
    test("QMLFileTest5", function() {
        expect.assertions(50);

        var qf = new QMLFile({
            project: p,
            pathName: "./t5.js",
            type: qmlft
        });
        expect(qf).toBeTruthy();

        qf.extract();
        var set = qf.getTranslationSet();
        expect(set.size()).toBe(16);

        var sourceHash = utils.hashKey("1: Test String for qsTr");
        var r = set.get(SourceContextResourceString.hashKey("app", "t5", set.sourceLocale, "1: Test String for qsTr", "x-qml", undefined, sourceHash));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("1: Test String for qsTr");
        expect(r.getKey()).toBe("1: Test String for qsTr");

        sourceHash = utils.hashKey("2: Test String for qsTrNoOp");
        var r = set.get(SourceContextResourceString.hashKey("app", "t5", set.sourceLocale, "2: Test String for qsTrNoOp", "x-qml", undefined, sourceHash));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("2: Test String for qsTrNoOp");
        expect(r.getKey()).toBe("2: Test String for qsTrNoOp");

        sourceHash = utils.hashKey("3: Test String for QT_TR_NOOP");
        var r = set.get(SourceContextResourceString.hashKey("app", "t5", set.sourceLocale, "3: Test String for QT_TR_NOOP", "x-qml", undefined, sourceHash));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("3: Test String for QT_TR_NOOP");
        expect(r.getKey()).toBe("3: Test String for QT_TR_NOOP");

        sourceHash = utils.hashKey("4: Test String for QT_TR_N_NOOP");
        var r = set.get(SourceContextResourceString.hashKey("app", "t5", set.sourceLocale, "4: Test String for QT_TR_N_NOOP", "x-qml", undefined, sourceHash));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("4: Test String for QT_TR_N_NOOP");
        expect(r.getKey()).toBe("4: Test String for QT_TR_N_NOOP");

        sourceHash = utils.hashKey("5: Test String for qsTr with disambiguation");
        var r = set.get(SourceContextResourceString.hashKey("app", "t5", set.sourceLocale, "5: disambiguation string", "x-qml", undefined, sourceHash));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("5: Test String for qsTr with disambiguation");
        expect(r.getKey()).toBe("5: disambiguation string");

        sourceHash = utils.hashKey("6: Test String for qsTrNoOp with disambiguation");
        var r = set.get(SourceContextResourceString.hashKey("app", "t5", set.sourceLocale, "6: disambiguation string", "x-qml", undefined, sourceHash));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("6: Test String for qsTrNoOp with disambiguation");
        expect(r.getKey()).toBe("6: disambiguation string");

        sourceHash = utils.hashKey("7: Test String for QT_TR_NOOP with disambiguation");
        var r = set.get(SourceContextResourceString.hashKey("app", "t5", set.sourceLocale, "7: disambiguation string", "x-qml", undefined, sourceHash));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("7: Test String for QT_TR_NOOP with disambiguation");
        expect(r.getKey()).toBe("7: disambiguation string");

        sourceHash = utils.hashKey("8: Test String for QT_TR_N_NOOP with disambiguation");
        var r = set.get(SourceContextResourceString.hashKey("app", "t5", set.sourceLocale, "8: disambiguation string", "x-qml", undefined, sourceHash));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("8: Test String for QT_TR_N_NOOP with disambiguation");
        expect(r.getKey()).toBe("8: disambiguation string");

        sourceHash = utils.hashKey("9: Test String for qsTranslate");
        var r = set.get(SourceContextResourceString.hashKey("app", "context", set.sourceLocale, "9: Test String for qsTranslate", "x-qml", undefined, sourceHash));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("9: Test String for qsTranslate");
        expect(r.getKey()).toBe("9: Test String for qsTranslate");

        sourceHash = utils.hashKey("10: Test String for qsTranslateNoOp");
        var r = set.get(SourceContextResourceString.hashKey("app", "context", set.sourceLocale, "10: Test String for qsTranslateNoOp", "x-qml", undefined, sourceHash));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("10: Test String for qsTranslateNoOp");
        expect(r.getKey()).toBe("10: Test String for qsTranslateNoOp");

        sourceHash = utils.hashKey("11: Test String for QT_TRANSLATE_NOOP");
        var r = set.get(SourceContextResourceString.hashKey("app", "context", set.sourceLocale, "11: Test String for QT_TRANSLATE_NOOP", "x-qml", undefined, sourceHash));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("11: Test String for QT_TRANSLATE_NOOP");
        expect(r.getKey()).toBe("11: Test String for QT_TRANSLATE_NOOP");

        sourceHash = utils.hashKey("12: Test String for QT_TRANSLATE_NOOP3");
        var r = set.get(SourceContextResourceString.hashKey("app", "context", set.sourceLocale, "12: Test String for QT_TRANSLATE_NOOP3", "x-qml", undefined, sourceHash));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("12: Test String for QT_TRANSLATE_NOOP3");
        expect(r.getKey()).toBe("12: Test String for QT_TRANSLATE_NOOP3");

        sourceHash = utils.hashKey("13: Test String for QT_TRANSLATE_N_NOOP");
        var r = set.get(SourceContextResourceString.hashKey("app", "context", set.sourceLocale, "13: Test String for QT_TRANSLATE_N_NOOP", "x-qml", undefined, sourceHash));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("13: Test String for QT_TRANSLATE_N_NOOP");
        expect(r.getKey()).toBe("13: Test String for QT_TRANSLATE_N_NOOP");

        sourceHash = utils.hashKey("14: Test String for qsTranslate with disambiguation");
        var r = set.get(SourceContextResourceString.hashKey("app", "context", set.sourceLocale, "14: disambiguation string", "x-qml", undefined, sourceHash));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("14: Test String for qsTranslate with disambiguation");
        expect(r.getKey()).toBe("14: disambiguation string");

        sourceHash = utils.hashKey("15: Test String for qsTranslateNoOp with disambiguation");
        var r = set.get(SourceContextResourceString.hashKey("app", "context", set.sourceLocale, "15: disambiguation string", "x-qml", undefined, sourceHash));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("15: Test String for qsTranslateNoOp with disambiguation");
        expect(r.getKey()).toBe("15: disambiguation string");

        sourceHash = utils.hashKey("16: Test String for QT_TRANSLATE_NOOP3 with disambiguation");
        var r = set.get(SourceContextResourceString.hashKey("app", "context", set.sourceLocale, "16: disambiguation string", "x-qml", undefined, sourceHash));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("16: Test String for QT_TRANSLATE_NOOP3 with disambiguation");
        expect(r.getKey()).toBe("16: disambiguation string");
    });
    test("QMLPseudoLocalization1", function() {
        expect.assertions(6);

        var qf = new QMLFile({
            project: p,
            pathName: "./t1.qml",
            type: qmlft
        });
        expect(qf).toBeTruthy();

        qf.extract();
        var set = qf.getTranslationSet();
        expect(set.size()).toBe(8);

        var sourceHash = utils.hashKey("Invalid Format");
        var r = set.get(SourceContextResourceString.hashKey("app", "t1", set.sourceLocale, "Invalid Format", "x-qml", undefined, sourceHash));
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("Invalid Format");
        expect(r.getKey()).toBe("Invalid Format");

        var rb = new RegularPseudo({
            type: "text"
        });
        var rs2 = r.generatePseudo("zxx-XX", rb);
        expect(rs2.getTarget()).toBe('[Ïñvàľíð Fõŕmàţ6543210]');
    });
    test("QMLPseudoLocalization2", function() {
        expect.assertions(6);

        var qf = new QMLFile({
            project: p,
            pathName: "./t1.qml",
            type: qmlft
        });
        expect(qf).toBeTruthy();

        qf.extract();
        var set = qf.getTranslationSet();
        expect(set.size()).toBe(8);
        var sourceHash = utils.hashKey("Invalid Format");
        var r = set.get(SourceContextResourceString.hashKey("app", "t1", set.sourceLocale, "Invalid Format", "x-qml", undefined, sourceHash));
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("Invalid Format");
        expect(r.getKey()).toBe("Invalid Format");

        var rb = new RegularPseudo({
            type: "text",
            targetLocale: "zxx-Cyrl-XX"
        });
        var rs2 = r.generatePseudo("zxx-Cyrl-XX", rb);
        expect(rs2.getTarget()).toBe("[Инвалид Формат6543210]");
    });
    test("QMLPseudoLocalization3", function() {
        expect.assertions(6);

        var qf = new QMLFile({
            project: p,
            pathName: "./t1.qml",
            type: qmlft
        });
        expect(qf).toBeTruthy();

        qf.extract();
        var set = qf.getTranslationSet();
        expect(set.size()).toBe(8);
        var sourceHash = utils.hashKey("Invalid Format");
        var r = set.get(SourceContextResourceString.hashKey("app", "t1", set.sourceLocale, "Invalid Format", "x-qml", undefined, sourceHash));
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("Invalid Format");
        expect(r.getKey()).toBe("Invalid Format");

        var rb = new RegularPseudo({
            type: "text",
            targetLocale: "zxx-Hebr-XX"
        });
        var rs2 = r.generatePseudo("zxx-Hebr-XX", rb);
        expect(rs2.getTarget()).toBe('[ִנבַלִד פֹרמַט6543210]');
    });
    test("QMLPseudoLocalization4", function() {
        expect.assertions(6);

        var qf = new QMLFile({
            project: p,
            pathName: "./t1.qml",
            type: qmlft
        });
        expect(qf).toBeTruthy();

        qf.extract();
        var set = qf.getTranslationSet();
        expect(set.size()).toBe(8);
        var sourceHash = utils.hashKey("Invalid Format");
        var r = set.get(SourceContextResourceString.hashKey("app", "t1", set.sourceLocale, "Invalid Format", "x-qml", undefined, sourceHash));
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("Invalid Format");
        expect(r.getKey()).toBe("Invalid Format");

        var rb = new RegularPseudo({
            type: "text",
            targetLocale: "zxx-Hans-XX"
        });
        var rs2 = r.generatePseudo("zxx-Hans-XX", rb);
        expect(rs2.getTarget()).toBe("[意尼於阿了意的凡夥熱们阿推6543210]");
    });
    test("QMLFileTest6", function() {
        expect.assertions(26);

        var qf = new QMLFile({
            project: p,
            pathName: "./t6.qml",
            type: qmlft
        });
        expect(qf).toBeTruthy();
        // should attempt to read the file and not fail
        qf.extract();

        var set = qf.getTranslationSet();
        expect(set.size()).toBe(6);

        var sourceHash = utils.hashKey("Minimum");
        var r = set.get(SourceContextResourceString.hashKey("app", "t6", set.sourceLocale, "energy", "x-qml", undefined, sourceHash));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Minimum");
        expect(r.getKey()).toBe("energy");
        expect(r.getContext()).toBe("t6");

        var sourceHash = utils.hashKey("Maximum");
        var r = set.get(SourceContextResourceString.hashKey("app", "t6", set.sourceLocale, "energy", "x-qml", undefined, sourceHash));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Maximum");
        expect(r.getKey()).toBe("energy");
        expect(r.getContext()).toBe("t6");

        var sourceHash = utils.hashKey("Don\'t save");
        var r = set.get(SourceContextResourceString.hashKey("app", "t6", set.sourceLocale, "Don\'t save", "x-qml", undefined, sourceHash));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Don't save");
        expect(r.getKey()).toBe("Don't save");
        expect(r.getContext()).toBe("t6");

        var sourceHash = utils.hashKey("\'hello\' there");
        var r = set.get(SourceContextResourceString.hashKey("app", "t6", set.sourceLocale, "\'hello\' there", "x-qml", undefined, sourceHash));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("'hello' there");
        expect(r.getKey()).toBe("'hello' there");
        expect(r.getContext()).toBe("t6");

        var sourceHash = utils.hashKey("This function is not supported.");
        var r = set.get(SourceContextResourceString.hashKey("app", "appLaunch", set.sourceLocale, "This function is not supported.", "x-qml", undefined, sourceHash));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This function is not supported.");
        expect(r.getKey()).toBe("This function is not supported.");
        expect(r.getContext()).toBe("appLaunch");
        var sourceHash = utils.hashKey("Average");

        var r = set.get(SourceContextResourceString.hashKey("app", "appLaunch", set.sourceLocale, "energy", "x-qml", undefined, sourceHash));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Average");
        expect(r.getKey()).toBe("energy");
        expect(r.getContext()).toBe("appLaunch");
    });
    test("QMLFileTest7", function() {
        expect.assertions(12);

        var qf = new QMLFile({
            project: p,
            pathName: "./t7.qml",
            type: qmlft
        });
        expect(qf).toBeTruthy();
        // should attempt to read the file and not fail
        qf.extract();

        var set = qf.getTranslationSet();
        expect(set.size()).toBe(7);

        var sourceHash = utils.hashKey("My Channels");
        var r = set.get(SourceContextResourceString.hashKey("app", "t7", set.sourceLocale, "My Channels", "x-qml", undefined, sourceHash));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("My Channels");
        expect(r.getKey()).toBe("My Channels");
        expect(r.getComment()).toBe("some comment messages...");

        var sourceHash = utils.hashKey("Network is not connected.\nPlease check the Network Settings and try again.");
        var r = set.get(SourceContextResourceString.hashKey("app", "t7", set.sourceLocale, "Network is not connected.\nPlease check the Network Settings and try again.", "x-qml", undefined, sourceHash));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Network is not connected.\nPlease check the Network Settings and try again.");
        expect(r.getKey()).toBe("Network is not connected.\nPlease check the Network Settings and try again.");

        var sourceHash = utils.hashKey("hello \n Nice \n to meet \n you.");
        var r = set.get(SourceContextResourceString.hashKey("app", "t7", set.sourceLocale, "hello \n Nice \n to meet \n you.", "x-qml", undefined, sourceHash));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("hello \n Nice \n to meet \n you.");
        expect(r.getKey()).toBe("hello \n Nice \n to meet \n you.");
    });
    test("QMLFileTestFileComment", function() {
        expect.assertions(10);

        var qf = new QMLFile({
            project: p,
            pathName: "./t7.qml",
            type: qmlft
        });
        expect(qf).toBeTruthy();
        // should attempt to read the file and not fail
        qf.extract();

        var set = qf.getTranslationSet();
        expect(set.size()).toBe(7);

        var sourceHash = utils.hashKey("Channel Locked");
        var r = set.get(SourceContextResourceString.hashKey("app", "t7", set.sourceLocale, "Channel Locked", "x-qml", undefined, sourceHash));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Channel Locked");
        expect(r.getKey()).toBe("Channel Locked");
        expect(r.getComment()).toBe("--> main comment for the translator");

        var sourceHash = utils.hashKey("Invalid Format");
        var r = set.get(SourceContextResourceString.hashKey("app", "t7", set.sourceLocale, "Invalid Format", "x-qml", undefined, sourceHash));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Invalid Format");
        expect(r.getKey()).toBe("Invalid Format");
        expect(r.getComment()).toBe("--> main comment for the translator--> Additional comment for the translator");
    });
    test("QMLFileNotParseCommentedParts", function() {
        expect.assertions(2);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        expect(qf).toBeTruthy();

        qf.parse('        \n'+
            '    /* qsTr("My Channels") // i18n some comment messages... */\n' +
            '    //some comment messages...\n' +
            '    // qsTr("Another day")\n' +
            '\n');

        var set = qf.getTranslationSet();
        expect(set.size()).toBe(0);
    });
    test("QMLFileNotParseCommentedParts2", function() {
        expect.assertions(2);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        expect(qf).toBeTruthy();

        qf.parse('        \n'+
            '    /* qsTr("Today") // i18n some comment messages... */\n' +
            '    //some comment messages...\n' +
            '    // qsTr("Another day")\n' +
            '    //: qsTr("(1) Last day")\n' +
            '    //~ qsTr("(2) Some day")\n' +
            '    // i18n qsTr("(3) First day")\n' +
            '\n');

        var set = qf.getTranslationSet();
        expect(set.size()).toBe(3);
    });
    test("QMLFileParseCommentedWindowStyle", function() {
        expect.assertions(2);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        expect(qf).toBeTruthy();

        qf.parse('        \n'+
            '    /* qsTr("Today") // i18n some comment messages... */\n' +
            '    //some comment messages...\n' +
            '    // qsTr("Another day")\n' +
            '    //: qsTr("(1) Last day")\r\n' +
            '    //~ qsTr("(2) Some day")\r' +
            '    // i18n qsTr("(3) First day")\r\n' +
            '    // qsTr("Another day (1)")\r\n' +
            '    // qsTr("Another day (2)")\r' +
            '\n');

        var set = qf.getTranslationSet();
        expect(set.size()).toBe(3);
    });
    test("QMLFileParseCommentedWindowStyle2", function() {
        expect.assertions(2);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        expect(qf).toBeTruthy();

        qf.parse('        \n'+
        '    // qsTr("Another day")\n' +
        '    // qsTr("Another day (1)")\r\n' +
        '    // qsTr("Another day (2)")\r' +
        '\n');

        var set = qf.getTranslationSet();
        expect(set.size()).toBe(0);
    });
    test("QMLFileParseSingleQuote", function() {
        expect.assertions(2);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        expect(qf).toBeTruthy();

        qf.parse('        \n'+
        '    qsTr("Don\'t save");\n' +
        '\n');

        var set = qf.getTranslationSet();
        expect(set.size()).toBe(1);
    });
});