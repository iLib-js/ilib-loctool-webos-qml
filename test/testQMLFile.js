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

module.exports.cfile = {
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
        test.expect(17:q);

        var qf = new QMLFile({
            project: p,
            pathName: undefined,
            type: qmlft
        });
        test.ok(qf);

        qf.parse('var guideText = qsTr("Music Recording Settings") + " , " + qsTr("Cancel") + " " + qsTr("Music Record") + " , " + qsTr("Music Record") + " " + qsTr("button") + " , " + qsTr("Press Down button on remote to set details for music recording.");');

        var set = qf.getTranslationSet();
        test.equal(set.size(), 4);


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

    testQMLFileExtractFile: function(test) {
        test.expect(14);

        var qf = new QMLFile({
            project: p,
            pathName: "./t1.qml",
            type: qmlft
        });
        test.ok(qf);

        // should read the file
        qf.extract();
        var set = qf.getTranslationSet();
        test.equal(set.size(), 29);

        var r = set.getBySource("Decline");
        test.ok(r);
        test.equal(r.getSource(), "Decline");
        test.equal(r.getKey(), "Decline");

        var r = set.getBy({
            reskey: "Do you want to \naccept this request?"
        });
        test.ok(r);
        test.equal(r[0].getSource(), "Do you want to \naccept this request?");
        test.equal(r[0].getKey(), "Do you want to \naccept this request?");

        var r = set.getBy({
            reskey: "%s is blocked."
        });
        test.ok(r);
        test.equal(r[0].getSource(), "%s is blocked.");
        test.equal(r[0].getKey(), "%s is blocked.");

        var r = set.getBy({
            reskey: "\"Overlay Mode\" will be off now to start recording or Live Playback."
        });
        test.ok(r);
        test.equal(r[0].getSource(), "\"Overlay Mode\" will be off now to start recording or Live Playback.");
        test.equal(r[0].getKey(), "\"Overlay Mode\" will be off now to start recording or Live Playback.");

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
        test.expect(14);

        var qf = new QMLFile({
            project: p,
            pathName: "./t2.qml",
            type: qmlft
        });
        test.ok(qf);

        qf.extract();
        var set = qf.getTranslationSet();
        test.equal(set.size(), 4);

        var r = set.getBySource("Please say \"Stop\" when you see the desired channel.");
        test.ok(r);
        test.equal(r.getSource(), "Please say \"Stop\" when you see the desired channel.");
        test.equal(r.getKey(), "Please say \"Stop\" when you see the desired channel.");

        var r = set.getBySource("You've declined the request from [{deviceName}].");
        test.ok(r);
        test.equal(r.getSource(), "You've declined the request from [{deviceName}].");
        test.equal(r.getKey(), "You've declined the request from [{deviceName}].");

        var r = set.getBySource("Hello\n\t there");
        test.ok(r);
        test.equal(r.getSource(), "Hello\n\t there");
        test.equal(r.getKey(), "Hello\n\t there");

        var r = set.getBySource("hi\n\t\t there \vwelcome");
        test.ok(r);
        test.equal(r.getSource(), "hi\n\t\t there \vwelcome");
        test.equal(r.getKey(), "hi\n\t\t there \vwelcome");

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
    }
};