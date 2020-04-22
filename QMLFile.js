/*
 * QMLFile.js - plugin to extract resources from a QML source code file
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

var fs = require("fs");
var path = require("path");
var log4js = require("log4js");
var logger = log4js.getLogger("loctool.plugin.QMLFile");

/**
 * Create a new QML file with the given path name and within
 * the given project.
 *
 * @param {Project} project the project object
 * @param {String} pathName path to the file relative to the root
 * of the project file
 * @param {FileType} type the file type of this instance
 */
var QMLFile = function(props) {
    this.project = props.project;
    this.pathName = props.pathName;
    this.type = props.type;
    this.API = props.project.getAPI();
    this.set = this.API.newTranslationSet(this.project ? this.project.sourceLocale : "zxx-XX");
};

/**
 * Unescape the string to make the same string that would be
 * in memory in the target programming language.
 *
 * @static
 * @param {String} string the string to unescape
 * @returns {String} the unescaped string
 */
QMLFile.unescapeString = function(string) {
    var unescaped = string;
    unescaped = unescaped.
        replace(/^\\\\/, "\\").             // unescape backslashes
        replace(/([^\\])\\\\/g, "$1\\").
        replace(/^\\"/, '"').
        replace(/([^\\])\\"/g, '$1"').
        replace(/\\"/g, '"');
    return unescaped;
};

/**
 * Use a key for the given string as it is. Not manipulating at all.
 *
 * @private
 * @param {String} source the source string to make a resource
 * key for
 * @returns {String} a unique key for this string
 */
QMLFile.prototype.makeKey = function(source) {
    return QMLFile.unescapeString(source);
};

QMLFile.trimComment = function(commentString) {
    if (!commentString) return;

    var trimComment = commentString.
        replace(/\s*\*\//, "").
        replace(/\s*\:\s*/, "").
        replace(/\/\s*\**\s*/, "").
        replace(/\s*\*\s*/, "").
        trim();
    return trimComment;
}

QMLFile.makeContextValue = function(fullpath) {
    if (!fullpath) return;
    var path = fullpath.replace(/^.*[\\\/]/, '').replace(/\.(qml|js)/, "");
    return path;
};

var reqsTrString = new RegExp(/\b(qsTr|qsTrNoOp|QT_TR_NOOP|QT_TR_N_NOOP)\s*\(\s*("((\\"|[^"])*)"|'((\\'|[^'])*)')\s*\)/g);
var reqsTrWithDisambiguation = new RegExp(/\b(qsTr|qsTrNoOp|QT_TR_NOOP|QT_TR_N_NOOP)\s*\(\s*("((\\"|[^"])*)"|'((\\'|[^'])*)')\s*,\s*("((\\"|[^"])*)"|'((\\'|[^'])*)')\s*\)/g);
var reqsTranslateString = new RegExp(/\b(qsTranslate|qsTranslateNoOp|QT_TRANSLATE_NOOP|QT_TRANSLATE_NOOP3|QT_TRANSLATE_N_NOOP)\s*\(\s*("((\\"|[^"])*)"|'((\\'|[^'])*)')\s*,\s*("((\\"|[^"])*)"|'((\\'|[^'])*)')\s*\)/g);
var reqsTranslateStringWithDisambiguation = new RegExp(/\b(qsTranslate|qsTranslateNoOp|QT_TRANSLATE_NOOP3)\s*\(\s*("((\\"|[^"])*)"|'((\\'|[^'])*)')\s*,\s*("((\\"|[^"])*)"|'((\\'|[^'])*)')\s*,\s*("((\\"|[^"])*)"|'((\\'|[^'])*)')\s*\)/g);

var reI18nwebOSComment = new RegExp(/\/(\*|\/)\s*i18n\s*(.*)($|\*\/)/);
var reI18nMainComment = new RegExp(/\/\/:\s+(.*)\n/);
var reI18nExtraComment = new RegExp(/\/\/~\s+(.*)\n/);

/**
 * Parse the data string looking for the localizable strings and add them to the
 * project's translation set.
 * @param {String} data the string to parse
 */
QMLFile.prototype.parse = function(data) {
    logger.debug("Extracting strings from " + this.pathName);
    this.resourceIndex = 0;

    var match, key;

    // To extract resBundle_qsTr()
    reqsTrString.lastIndex = 0; // just to be safe
    var result = reqsTrString.exec(data);

    while (result && result.length > 3 && result[2]) {
        match = (result[2][0] === '"')? result[3]: result[5];

        var comment = undefined, commentArr = [], commentResult = [];

        if (match && match.length) {
            logger.trace("Found string key: " + this.makeKey(match) + ", string: '" + match + "'");

            var last = data.indexOf('\n', reqsTrString.lastIndex);
            last = (last === -1) ? data.length : last;
            var line = data.substring(reqsTrString.lastIndex, last);

            commentResult = reI18nMainComment.exec(data);
            commentArr.push((commentResult && commentResult.length >= 1) ? commentResult[1] : undefined);
            commentwebOSResult = reI18nwebOSComment.exec(line);
            commentArr.push((commentwebOSResult && commentwebOSResult.length > 1) ? commentwebOSResult[2] : undefined);
            commentResult = reI18nExtraComment.exec(data);
            commentArr.push((commentResult && commentResult.length >= 1) ? commentResult[1] : undefined);
            comment = commentArr.join(" ");

            match = QMLFile.unescapeString(match);
            var params = {
                resType: "string",
                project: this.project.getProjectId(),
                key: match,
                sourceLocale: this.project.sourceLocale,
                source: match,
                autoKey: true,
                pathName: this.pathName,
                state: "new",
                comment: QMLFile.trimComment(comment),
                datatype: this.type.datatype,
                index: this.resourceIndex++,
                context: QMLFile.makeContextValue(this.pathName)
            }
            var r = this.API.newResource(params);
            /*var r = this.API.newResource();*/
            this.set.add(r);
        } else {
            logger.warn("Warning: Bogus empty string in get string call: ");
            logger.warn("... " + data.substring(result.index, reGetString.lastIndex) + " ...");
        }
        result = reqsTrString.exec(data);
    }

    // To extract resBundle_qsTr() with disambiguation(key)
    reqsTrWithDisambiguation.lastIndex = 0; // just to be safe
    var result = reqsTrWithDisambiguation.exec(data);
    while (result && result.length > 1 && result[2]) {
        match = (result[2][0] === '"')? result[3]: result[5];
        key = (result[7][0] === '"')? result[8]: result[10];

        var comment = undefined, commentArr = [], commentResult = [];

        if (match && match.length) {
            logger.trace("Found string key: " + this.makeKey(match) + ", string: '" + match + "'");

            var last = data.indexOf('\n', reqsTrWithDisambiguation.lastIndex);
            last = (last === -1) ? data.length : last;
            var line = data.substring(reqsTrWithDisambiguation.lastIndex, last);

            commentResult = reI18nMainComment.exec(data);
            commentArr.push((commentResult && commentResult.length >= 1) ? commentResult[1] : undefined);
            commentwebOSResult = reI18nwebOSComment.exec(line);
            commentArr.push((commentwebOSResult && commentwebOSResult.length > 1) ? commentwebOSResult[2] : undefined);
            commentResult = reI18nExtraComment.exec(data);
            commentArr.push((commentResult && commentResult.length >= 1) ? commentResult[1] : undefined);
            comment = commentArr.join(" ");

            match = QMLFile.unescapeString(match);
            key = QMLFile.unescapeString(key);

            var params = {
                resType: "string",
                project: this.project.getProjectId(),
                key: key,
                sourceLocale: this.project.sourceLocale,
                source: match,
                autoKey: true,
                pathName: this.pathName,
                state: "new",
                comment: QMLFile.trimComment(comment),
                datatype: this.type.datatype,
                index: this.resourceIndex++,
                context: QMLFile.makeContextValue(this.pathName)
            };
            var r = this.API.newResource(params);

            this.set.add(r);
        } else {
            logger.warn("Warning: Bogus empty string in get string call: ");
            logger.warn("... " + data.substring(result.index, reqsTrWithDisambiguation.lastIndex) + " ...");
        }
        result = reqsTrWithDisambiguation.exec(data);
    }

    // To extract resBundle_qsTranslate()
    reqsTranslateString.lastIndex = 0; // just to be safe
    var result = reqsTranslateString.exec(data);
    while (result && result.length > 7 && result[7]) {
        match = (result[7][0] === '"')? result[8]: result[10];

        var comment = undefined, commentArr = [], commentResult = [];

        if (match && match.length) {
            logger.trace("Found string key: " + this.makeKey(match) + ", string: '" + match + "'");

            var last = data.indexOf('\n', reqsTranslateString.lastIndex);
            last = (last === -1) ? data.length : last;
            var line = data.substring(reqsTranslateString.lastIndex, last);

            commentResult = reI18nMainComment.exec(data);
            commentArr.push((commentResult && commentResult.length >= 1) ? commentResult[1] : undefined);
            commentwebOSResult = reI18nwebOSComment.exec(line);
            commentArr.push((commentwebOSResult && commentwebOSResult.length > 1) ? commentwebOSResult[2] : undefined);
            commentResult = reI18nExtraComment.exec(data);
            commentArr.push((commentResult && commentResult.length >= 1) ? commentResult[1] : undefined);
            comment = commentArr.join(" ");

            match = QMLFile.unescapeString(match);

            var params = {
                resType: "string",
                project: this.project.getProjectId(),
                key: match,
                sourceLocale: this.project.sourceLocale,
                source: match,
                autoKey: true,
                pathName: this.pathName,
                state: "new",
                comment: QMLFile.trimComment(comment),
                datatype: this.type.datatype,
                index: this.resourceIndex++,
                context: QMLFile.makeContextValue(this.pathName)
            };
            var r = this.API.newResource(params);
            this.set.add(r);
        } else {
            logger.warn("Warning: Bogus empty string in get string call: ");
            logger.warn("... " + data.substring(result.index, reqsTranslateString.lastIndex) + " ...");
        }
        result = reqsTranslateString.exec(data);
    }

    // To extract resBundle_qsTranslate() with disambiguation(key)
    reqsTranslateStringWithDisambiguation.lastIndex = 0; // just to be safe
    var result = reqsTranslateStringWithDisambiguation.exec(data);
    while (result && result.length > 7 && result[7]) {
        match = result[4];
        key = result[6];

        match = (result[7][0] === '"')? result[8]: result[10];
        key = (result[12][0] === '"')? result[13]: result[15];

        var comment = undefined, commentArr = [], commentResult = [];

        if (match && match.length) {
            logger.trace("Found string key: " + this.makeKey(match) + ", string: '" + match + "'");

            var last = data.indexOf('\n', reqsTranslateStringWithDisambiguation.lastIndex);
            last = (last === -1) ? data.length : last;
            var line = data.substring(reqsTranslateStringWithDisambiguation.lastIndex, last);

            commentResult = reI18nMainComment.exec(data);
            commentArr.push((commentResult && commentResult.length >= 1) ? commentResult[1] : undefined);
            commentwebOSResult = reI18nwebOSComment.exec(line);
            commentArr.push((commentwebOSResult && commentwebOSResult.length > 1) ? commentwebOSResult[2] : undefined);
            commentResult = reI18nExtraComment.exec(data);
            commentArr.push((commentResult && commentResult.length >= 1) ? commentResult[1] : undefined);
            comment = commentArr.join(" ");

            match = QMLFile.unescapeString(match);

            var params ={
                resType: "string",
                project: this.project.getProjectId(),
                key: key,
                sourceLocale: this.project.sourceLocale,
                source: match,
                autoKey: true,
                pathName: this.pathName,
                state: "new",
                comment: QMLFile.trimComment(comment),
                datatype: this.type.datatype,
                index: this.resourceIndex++,
                context: QMLFile.makeContextValue(this.pathName)
            };
            var r = this.API.newResource(params);
            this.set.add(r);
        } else {
            logger.warn("Warning: Bogus empty string in get string call: ");
            logger.warn("... " + data.substring(result.index, reqsTranslateStringWithDisambiguation.lastIndex) + " ...");
        }
        result = reqsTranslateStringWithDisambiguation.exec(data);
    }
};

/**
 * Extract all the localizable strings from the QML file and add them to the
 * project's translation set.
 */
QMLFile.prototype.extract = function() {
    logger.debug("Extracting strings from " + this.pathName);
    if (this.pathName) {
        var p = path.join(this.project.root, this.pathName);
        try {
            var data = fs.readFileSync(p, "utf8");
            if (data) {
                this.parse(data);
            }
        } catch (e) {
            logger.warn("Could not read file: " + p);
        }
    }
};

/**
 * Return the set of resources found in the current QML file.
 *
 * @returns {TranslationSet} The set of resources found in the
 * current QML file.
 */
QMLFile.prototype.getTranslationSet = function() {
    return this.set;
}

// we don't localize or write c source files
QMLFile.prototype.localize = function() {};
QMLFile.prototype.write = function() {};

module.exports = QMLFile;