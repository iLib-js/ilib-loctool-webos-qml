# ilib-loctool-webos-qml
ilib-webos-loctool-qml is a plugin for the loctool allows it to read and localize qml files. This plugins is optimized for webOS platform.

## Release Notes
v1.3.3
* Fix pseudo localization to work properly
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
* Update dependent module version to have the latest one.

v1.1.1
* Updated code to print log with log4js.

v1.1.0
* Implemented to pseudo localization properly.
* Used `SourceContextResourceString` in qml file string to solve an issue regarding duplicated keys are exist in the same file


v1.0.0
* Implemented to parse properly regarding resource bundle usage of qml files.

## License

Copyright (c) 2020-2021, JEDLSoft

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

See the License for the specific language governing permissions and
limitations under the License.
