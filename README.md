# ilib-loctool-webos-qml
ilib-webos-loctool-qml is a plugin for the loctool allows it to read and localize QML files. This plugin is optimized for the webOS platform.

### QML FileType
This plugin expects the strings to be marked by using proper APIs from QT suggested.
 - [qsTr()](https://doc.qt.io/qt-6/qml-qtqml-qt.html#qsTr-method)
 - [qsTranslate()](https://doc.qt.io/qt-6/qml-qtqml-qt.html#qsTranslate-method)
 - [qsTrId](https://doc.qt.io/qt-6/qml-qtqml-qt.html#qsTrId-method)
 - [qsTrIdNoOp](https://doc.qt.io/qt-6/qml-qtqml-qt.html#qsTrIdNoOp-method)
 - [qsTrNoOp](https://doc.qt.io/qt-6/qml-qtqml-qt.html#qsTrNoOp-method)
 - [qsTranslate](https://doc.qt.io/qt-6/qml-qtqml-qt.html#qsTranslate-method)
 - [qsTranslateNoOp](https://doc.qt.io/qt-6/qml-qtqml-qt.html#qsTranslateNoOp-method)

```qml
Text { text: qsTr("hello") }
Text { text: qsTranslate("CustomContext", "hello") }
```

#### Sample
The simple sample is provided in [ilib-loctool-samples](https://github.com/iLib-js/ilib-loctool-samples) repository.
Please check the [webos-qml](https://github.com/iLib-js/ilib-loctool-samples/tree/main/webos-qml) sample to see how the qml file type is localized.

## License

Copyright (c) 2019-2023, JEDLSoft

This plugin is license under Apache2. See the [LICENSE](./LICENSE)
file for more details.

## Release Notes
### v1.7.4
* Converted all the unit tests from `nodeunit` to `jest`.

### v1.7.3
* Removed `npm-shrinkwrap.json`. It takes a bigger memory size than I expected on webOS. so I decided not to maintain the file here.

### v1.7.2
* Added `loctool` package to `peerDependencies` in `package.json`.

### v1.7.1
* Updated dependencies. (loctool: 2.23.1)
* Updated to be included `npm-shrinkwrap.json` in the published files.

### v1.7.0
* Updated dependencies. (loctool: 2.22.0)
* Updated to use first argument of `qsTranslate()` as a context value instead of file name.
* Added ability to disable pseudo-localization in plugin when a project's pseudo-localization is enabled.
    ~~~~
       "settings": {
            "json": {
                "disablePseudo": true
            }
        }
    ~~~~

### v1.6.0
* Updated dependencies. (loctool: 2.21.0)
* Updated not to load common data repeatedly if it's loaded from another plugin in a project.

### v1.5.1
* Fixed issues where didn't handle single quotes and multi-line properly.

### v1.5.0
* Updated dependencies. (loctool: 2.20.2)
* Fixed an issue where common's locale inheritance data values were not checked.

### v1.4.1
* Added guard code to prevent errors when the common data path is incorrect.
* Fixed an issue where localeInherit related data was not created properly.

### v1.4.0
* Updated dependencies. (loctool: 2.20.0)
* Added ability to define custom locale inheritance.
  * e.g. en-AU inherits translations from en-GB
    ~~~~
       "settings": {
            "localeInherit": {
                "en-AU": "en-GB"
            }
        }
    ~~~~
* Added ability to use common locale data.
  * App's xliff data has a higher priority, if there's no matched string there, then loctool checks data in the commonXliff directory.
    ~~~~
       "settings": {
            "webos": {
                "commonXliff": "./common"
            }
        }
    ~~~~

### v1.3.7
* Updated dependencies. (loctool: 2.18.0)

### v1.3.6
* Updated dependencies. (loctool: 2.17.0)

### v1.3.5
* Updated dependencies. (loctool: 2.16.3)
* Added node 16 version testing for circleCI. ( minimum version of node is v10.0.0)
* Added `js` to the list of file extensions that this plugin handles.
* Used the logger provided by the loctool instead of using log4js directly.
* Fixed an issue not to filter newline character for window.

### v1.3.4
* Updated dependent module version to have the latest one. (loctool: 2.16.2)

### v1.3.3
* Fixed pseudo localization to work properly
* Updated dependent module version to have the latest one. (loctool: 2.14.1)

### v1.3.2
* Updated dependent module version to have the latest one. (loctool: 2.13.0)

### v1.3.1
* Updated dependent module version to have the latest one. (loctool: 2.12.0)

### v1.3.0
* Updated code to extract the i18n comment part more appropriately. If webOS style comments exist, The [general comment style](https://doc.qt.io/qt-5/qtquick-internationalization.html) is ignored.
* Updated dependent module version to have the latest one. (loctool: 2.10.3)

### v1.2.0
* Removed commented lines before parsing so that strings in the comments will not be extracted.
* Updated dependent module version to have the latest one.

### v1.1.1
* Updated code to print log with log4js.

### v1.1.0
* Implemented to pseudo localization properly.
* Used `SourceContextResourceString` in qml file string to solve an issue regarding duplicated keys are exist in the same file

### v1.0.0
* Implemented to parse properly regarding resource bundle usage of qml files.