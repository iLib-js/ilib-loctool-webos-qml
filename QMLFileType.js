/*
 * QMLFileType.js - Represents a collection of QML files
 *
 * Copyright (c) 2020-2022, JEDLSoft
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
var QMLFile = require("./QMLFile.js");
var TSResourceFileType = require("ilib-loctool-webos-ts-resource");

var QMLFileType = function(project) {
    this.type = "x-qml";
    this.datatype = "x-qml";
    this.resourceType = "ts";
    this.extensions = [ ".qml", ".js"];

    this.project = project;
    this.API = project.getAPI();
    this.extracted = this.API.newTranslationSet(project.getSourceLocale());
    this.newres = this.API.newTranslationSet(project.getSourceLocale());
    this.pseudo = this.API.newTranslationSet(project.getSourceLocale());
    this.logger = this.API.getLogger("loctool.plugin.webOSQmlFileType");
    if (typeof project.pseudoLocale === "string") {
        project.pseudoLocale = [project.pseudoLocale];
    }

    // generate all the pseudo bundles we'll need
    if (project.pseudoLocale && Array.isArray(project.pseudoLocale)) {
        this.pseudos = {};
        project.pseudoLocale && project.pseudoLocale.forEach(function(locale) {
            var pseudo = this.API.getPseudoBundle(locale, this, project);
            if (pseudo) {
                this.pseudos[locale] = pseudo;
            }
        }.bind(this));
    }
    if (project.pseudoLocales && typeof project.pseudoLocales == 'object') {
        this.pseudos = {};
        for (locale in project.pseudoLocales) {
            var pseudo = this.API.getPseudoBundle(locale, this, project);
            if (pseudo) {
                this.pseudos[locale] = pseudo;
            }
        }
    }

    // for use with missing strings
    if (!project.settings.nopseudo) {
        this.missingPseudo = this.API.getPseudoBundle(project.pseudoLocale, this, project);
    }

};

/**
 * Return true if the given path is a qml or js file and is handled
 * by the current file type.
 *
 * @param {String} pathName path to the file being questions
 * @returns {boolean} true if the path is a qml file, or false
 * otherwise
 */
QMLFileType.prototype.handles = function(pathName) {
    this.logger.debug("QMLFileType handles " + pathName + "?");
    var ret = false;
    if ((pathName.length > 4 && pathName.substring(pathName.length - 4) === ".qml") ||
        (pathName.length > 3 && pathName.substring(pathName.length - 3) === ".js")) {
        ret = true;
    } 

    this.logger.debug(ret ? "Yes" : "No");
    return ret;
};

QMLFileType.prototype.name = function() {
    return "QML File Type";
};

/**
 * Write out the aggregated resources for this file type. In
 * some cases, the string are written out to a common resource
 * file, and in other cases, to a type-specific resource file.
 * In yet other cases, nothing is written out, as the each of
 * the files themselves are localized individually, so there
 * are no aggregated strings.
 * @param {TranslationSet} translations the set of translations from the
 * repository
 * @param {Array.<String>} locales the list of locales to localize to
 */
QMLFileType.prototype.write = function(translations, locales) {
    // distribute all the resources to their resource files
    // and then let them write themselves out

    var resFileType = this.project.getResourceFileType(this.resourceType);

    var res, file,
        resources = this.extracted.getAll(),
        db = this.project.db,
        translationLocales = locales.filter(function(locale) {
            return locale !== this.project.sourceLocale && locale !== this.project.pseudoLocale;
        }.bind(this));
    var customInheritLocale;

    for (var i = 0; i < resources.length; i++) {
        res = resources[i];
        // for each extracted string, write out the translations of it
        translationLocales.forEach(function(locale) {
            this.logger.trace("Localizing QML strings to " + locale);
            customInheritLocale = this.project.getLocaleInherit(locale);

            db.getResourceByCleanHashKey(res.cleanHashKeyForTranslation(locale), function(err, translated) {
                var r = translated;
                if (!translated) {
                    var manipulateKey = res.cleanHashKeyForTranslation(locale).replace(res.getContext(),"");
                    db.getResourceByCleanHashKey(manipulateKey, function(err, translated) {
                    var r = translated;
                    if (!translated && customInheritLocale) {
                        var manipulateKey = res.cleanHashKeyForTranslation(customInheritLocale).replace(res.getContext(),"");
                        db.getResourceByCleanHashKey(manipulateKey, function(err, translated) {
                            var r = translated;
                            if (translated){
                                var storeResource = r.clone();
                                storeResource.pathName = res.getPath();
                                storeResource.context = res.getPath().replace(/^.*[\\\/]/, '').replace(/\.(qml|js)/, "");
                                storeResource.setTargetLocale(locale);
                                file = resFileType.getResourceFile(locale);
                                file.addResource(storeResource);
                            } else {
                                var newres = res.clone();
                                newres.setTargetLocale(locale);
                                newres.setTarget((r && r.getTarget()) || res.getSource());
                                newres.setState("new");
                                this.newres.add(newres);
                                this.logger.trace("No translation for " + res.reskey + " to " + locale);
                            }
                        }.bind(this));
                    } else if (!translated || ( this.API.utils.cleanString(res.getSource()) !== this.API.utils.cleanString(r.getSource()) &&
                        this.API.utils.cleanString(res.getSource()) !== this.API.utils.cleanString(r.getKey()))) {
                        if (r) {
                            this.logger.trace("extracted   source: " + this.API.utils.cleanString(res.getSource()));
                            this.logger.trace("translation source: " + this.API.utils.cleanString(r.getSource()));
                        }
                        var note = r && 'The source string has changed. Please update the translation to match if necessary. Previous source: "' + r.getSource() + '"';
                        var newres = res.clone();
                        newres.setTargetLocale(locale);
                        newres.setTarget((r && r.getTarget()) || res.getSource());
                        newres.setState("new");
                        newres.setComment(note);

                        this.newres.add(newres);

                        this.logger.trace("No translation for " + res.reskey + " to " + locale);
                    } else {
                        if (res.reskey != r.reskey) {
                            // if reskeys don't match, we matched on cleaned string.
                            //so we need to overwrite reskey of the translated resource to match
                            r = r.clone();
                            r.reskey = res.reskey;
                        }
                        var storeResource = r.clone();

                        // To keep the extracted source's filename.  If not, xliff file name will be wrote to ts resource file.
                        storeResource.pathName = res.getPath();
                        storeResource.context = res.getPath().replace(/^.*[\\\/]/, '').replace(/\.(qml|js)/, "");

                        file = resFileType.getResourceFile(locale);
                        file.addResource(storeResource);
                        this.logger.trace("Added " + r.reskey + " to " + file.pathName);
                    }
                }.bind(this));
                } else {
                    if (( this.API.utils.cleanString(res.getSource()) !== this.API.utils.cleanString(r.getSource()) &&
                            this.API.utils.cleanString(res.getSource()) !== this.API.utils.cleanString(r.getKey()))) {
                            if (r) {
                                this.logger.trace("extracted   source: " + this.API.utils.cleanString(res.getSource()));
                                this.logger.trace("translation source: " + this.API.utils.cleanString(r.getSource()));
                            }
                            var note = r && 'The source string has changed. Please update the translation to match if necessary. Previous source: "' + r.getSource() + '"';
                            var newres = res.clone();
                            newres.setTargetLocale(locale);
                            newres.setTarget((r && r.getTarget()) || res.getSource());
                            newres.setState("new");
                            newres.setComment(note);

                            this.newres.add(newres);

                            this.logger.trace("No translation for " + res.reskey + " to " + locale);
                        } else {
                            if (res.reskey != r.reskey) {
                                // if reskeys don't match, we matched on cleaned string.
                                //so we need to overwrite reskey of the translated resource to match
                                r = r.clone();
                                r.reskey = res.reskey;
                            }
                            var storeResource = r.clone();

                            // To keep the extracted source's filename.  If not, xliff file name will be wrote to ts resource file.
                            storeResource.pathName = res.getPath();
                            storeResource.context = res.getPath().replace(/^.*[\\\/]/, '').replace(/\.(qml|js)/, "");

                            file = resFileType.getResourceFile(locale);
                            file.addResource(storeResource);
                            this.logger.trace("Added " + r.reskey + " to " + file.pathName);
                        }
                    }
                }.bind(this));
            }.bind(this));
        }

    resources = this.pseudo.getAll().filter(function(resource) {
        return resource.datatype === this.datatype;
    }.bind(this));

    for (var i = 0; i < resources.length; i++) {
        res = resources[i];
        if (res.getTargetLocale() !== this.project.sourceLocale && res.getSource() !== res.getTarget()) {
            file = resFileType.getResourceFile(res.getTargetLocale());
            file.addResource(res);
            this.logger.trace("Added " + res.reskey + " to " + file.pathName);
        }
    }
};

QMLFileType.prototype.newFile = function(path) {
    return new QMLFile({
        project: this.project,
        pathName: path,
        type: this
    });
};

QMLFileType.prototype.getDataType = function() {
    return this.datatype;
};

QMLFileType.prototype.getResourceTypes = function() {
    return {
        "string": "SourceContextResourceString"
    };
};

/**
 * Return the name of the node module that implements the resource file type, or
 * the path to a QML file that implements the resource filetype.
 * @returns {Function|undefined} node module name or path, or undefined if this file type does not
 * need resource files
 */
QMLFileType.prototype.getResourceFileType = function() {
    return TSResourceFileType;
};

/**
 * Return the translation set containing all of the extracted
 * resources for all instances of this type of file. This includes
 * all new strings and all existing strings. If it was extracted
 * from a source file, it should be returned here.
 *
 * @returns {TranslationSet} the set containing all of the
 * extracted resources
 */
QMLFileType.prototype.getExtracted = function() {
    return this.extracted;
};

/**
 * Ensure that all resources collected so far have a pseudo translation.
 */
QMLFileType.prototype.generatePseudo = function(locale, pb) {
    var resources = this.extracted.getBy({
        sourceLocale: pb.getSourceLocale()
    });
    this.logger.trace("Found " + resources.length + " source resources for " + pb.getSourceLocale());
    var resource;

    resources.forEach(function(resource) {
        this.logger.trace("Generating pseudo for " + resource.getKey());
        var res = resource.generatePseudo(locale, pb);
        if (res && res.getSource() !== res.getTarget()) {
            this.pseudo.add(res);
        }
    }.bind(this));
};

/**
 * Add the contents of the given translation set to the extracted resources
 * for this file type.
 *
 * @param {TranslationSet} set set of resources to add to the current set
 */
QMLFileType.prototype.addSet = function(set) {
    this.extracted.addSet(set);
};

/**
 * Return the translation set containing all of the new
 * resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * new resources
 */
QMLFileType.prototype.getNew = function() {
    return this.newres;
};

/**
 * Return the translation set containing all of the pseudo
 * localized resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * pseudo localized resources
 */
QMLFileType.prototype.getPseudo = function() {
    return this.pseudo;
};

/**
 * Return the list of file name extensions that this plugin can
 * process.
 *
 * @returns {Array.<string>} the list of file name extensions
 */
QMLFileType.prototype.getExtensions = function() {
    return this.extensions;
};

module.exports = QMLFileType;