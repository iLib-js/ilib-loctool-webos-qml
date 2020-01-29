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

if (!QMLFile) {
    var QMLFile = require("../QMLFile.js");
    var QMLFileType = require("../QMLFileType.js");
    var CustomProject =  require("loctool/lib/CustomProject.js");
}

var p = new CustomProject({
    id: "app",
    plugins: ["../."],
    sourceLocale: "en-US"
}, "./test/testfiles", {
    locales:["en-GB"]
});

var qmlft = new QMLFileType(p);

module.exports.qmlfile = {
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

        qf.parse('string = qsTr("TV: Internal Storage [%1%2 Free / %3%4]").arg(strFreeSpace).arg(capaString[freeCapaIndex]).arg(strTotalSpace).arg(capaString[totalCapaIndex]);');

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
            '    qsTr("My Channels") /*\n' +
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
        test.expect(4);

        var qf = new QMLFile({
            project: p,
            pathName: "./t1.qml",
            type: qmlft
        });
        test.ok(qf);

        // should read the file
        qf.extract();
        var set = qf.getTranslationSet();
        test.equal(set.size(), 36);

        var r = set.getBySource("Error Code : %1");
        test.equal(r.getSource(), "Error Code : %1");

        var r = set.getBySource("(3) For external audio devices, please go to 'Settings > Sound > Sound Out' and change settings to 'HDMI ARC'.");
        test.equal(r.getSource(), "(3) For external audio devices, please go to 'Settings > Sound > Sound Out' and change settings to 'HDMI ARC'.");

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
        test.expect(50);

        var qf = new QMLFile({
            project: p,
            pathName: "./t2.qml",
            type: qmlft
        });
        test.ok(qf);

        qf.extract();
        var set = qf.getTranslationSet();
        test.equal(set.size(), 16);

        var r = set.getBySource("1: Test String for qsTr");
        test.ok(r);
        test.equal(r.getSource(), "1: Test String for qsTr");
        test.equal(r.getKey(), "1: Test String for qsTr");

        var r = set.getBySource("2: Test String for qsTrNoOp");
        test.ok(r);
        test.equal(r.getSource(), "2: Test String for qsTrNoOp");
        test.equal(r.getKey(), "2: Test String for qsTrNoOp");

        var r = set.getBySource("3: Test String for QT_TR_NOOP");
        test.ok(r);
        test.equal(r.getSource(), "3: Test String for QT_TR_NOOP");
        test.equal(r.getKey(), "3: Test String for QT_TR_NOOP");

        var r = set.getBySource("4: Test String for QT_TR_NOOP");
        test.ok(r);
        test.equal(r.getSource(), "4: Test String for QT_TR_NOOP");
        test.equal(r.getKey(), "4: Test String for QT_TR_NOOP");

        var r = set.getBySource("5: Test String for qsTr with disambiguation");
        test.ok(r);
        test.equal(r.getSource(), "5: Test String for qsTr with disambiguation");
        test.equal(r.getKey(), "disambiguation string");

        var r = set.getBySource("6: Test String for qsTrNoOp with disambiguation");
        test.ok(r);
        test.equal(r.getSource(), "6: Test String for qsTrNoOp with disambiguation");
        test.equal(r.getKey(), "disambiguation string");

        var r = set.getBySource("7: Test String for QT_TR_NOOP with disambiguation");
        test.ok(r);
        test.equal(r.getSource(), "7: Test String for QT_TR_NOOP with disambiguation");
        test.equal(r.getKey(), "disambiguation string");

        var r = set.getBySource("8: Test String for QT_TR_NOOP with disambiguation");
        test.ok(r);
        test.equal(r.getSource(), "8: Test String for QT_TR_NOOP with disambiguation");
        test.equal(r.getKey(), "disambiguation string");

        var r = set.getBySource("9: Test String for qsTranslate");
        test.ok(r);
        test.equal(r.getSource(), "9: Test String for qsTranslate");
        test.equal(r.getKey(), "Test String for qsTranslate");

        var r = set.getBySource("10: Test String for qsTranslateNoOp");
        test.ok(r);
        test.equal(r.getSource(), "10: Test String for qsTranslateNoOp");
        test.equal(r.getKey(), "10: Test String for qsTranslateNoOp");

        var r = set.getBySource("11: Test String for QT_TRANSLATE_NOOP");
        test.ok(r);
        test.equal(r.getSource(), "11: Test String for QT_TRANSLATE_NOOP");
        test.equal(r.getKey(), "11: Test String for QT_TRANSLATE_NOOP");

        var r = set.getBySource("12: Test String for QT_TRANSLATE_NOOP3");
        test.ok(r);
        test.equal(r.getSource(), "12: Test String for QT_TRANSLATE_NOOP3");
        test.equal(r.getKey(), "12: Test String for QT_TRANSLATE_NOOP3");

        var r = set.getBySource("13: Test String for QT_TRANSLATE_N_NOOP");
        test.ok(r);
        test.equal(r.getSource(), "13: Test String for QT_TRANSLATE_N_NOOP");
        test.equal(r.getKey(), "13: Test String for QT_TRANSLATE_N_NOOP");

        var r = set.getBySource("14: Test String for qsTranslate with disambiguation");
        test.ok(r);
        test.equal(r.getSource(), "14: Test String for qsTranslate with disambiguation");
        test.equal(r.getKey(), "disambiguation string");

        var r = set.getBySource("15: Test String for qsTranslateNoOp with disambiguation");
        test.ok(r);
        test.equal(r.getSource(), "15: Test String for qsTranslateNoOp with disambiguation");
        test.equal(r.getKey(), "disambiguation string");

        var r = set.getBySource("16: Test String for QT_TRANSLATE_NOOP3 with disambiguation");
        test.ok(r);
        test.equal(r.getSource(), "16: Test String for QT_TRANSLATE_NOOP3 with disambiguation");
        test.equal(r.getKey(), "disambiguation string");

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
    }
};