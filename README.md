# ilib-loctool-webos-qml
ilib-webos-loctool-qml is a plugin for the loctool allows it to read and localize qml files. This plugins is optimized for webOS platform.

## Release Notes
v1.5.0
* Updated dependencies. (loctool: 2.20.2)
* Fixed an issue where common's locale inheritance data values were not checked.

v1.4.1
* Added guard code to prevent errors when the common data path is incorrect.
* Fixed an issue where localeInherit related data was not created properly.

v1.4.0
* Updated dependencies. (loctool: 2.20.0)
* Added ability to define custom locale inheritance.
  * i.e) en-AU inherits translations from en-GB
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

v1.3.7
* Updated dependencies. (loctool: 2.18.0)

v1.3.6
* Updated dependencies. (loctool: 2.17.0)

v1.3.5
* Updated dependencies. (loctool: 2.16.3)
* Added node 16 version testing for circleCI. ( minimum version of node is v10.0.0)
* Added `js` to the list of file extensions that this plugin handles.
* Used the logger provided by the loctool instead of using log4js directly.
* Fixed an issue not to filter newline character for window.

v1.3.4
* Updated dependent module version to have the latest one. (loctool: 2.16.2)

v1.3.3
* Fixed pseudo localization to work properly
* Updated dependent module version to have the latest one. (loctool: 2.14.1)

v1.3.2
* Updated dependent module version to have the latest one. (loctool: 2.13.0)

v1.3.1
* Updated dependent module version to have the latest one. (loctool: 2.12.0)

v1.3.0
* Updated code to extract the i18n comment part more appropriately. If webOS style comments exist, The [general comment style](https://doc.qt.io/qt-5/qtquick-internationalization.html) is ignored.
* Updated dependent module version to have the latest one. (loctool: 2.10.3)

v1.2.0
* Removed commented lines before parsing so that strings in the comments will not be extracted.
* Updated dependent module version to have the latest one.

v1.1.1
* Updated code to print log with log4js.

v1.1.0
* Implemented to pseudo localization properly.
* Used `SourceContextResourceString` in qml file string to solve an issue regarding duplicated keys are exist in the same file

v1.0.0
* Implemented to parse properly regarding resource bundle usage of qml files.

## License

Copyright (c) 2020-2023, JEDLSoft

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

See the License for the specific language governing permissions and
limitations under the License.
