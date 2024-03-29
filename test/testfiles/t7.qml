property var strings: {
    "test1": qsTr("1: Test String for qsTr"),
    "test7": qsTr("1: Test String for qsTr", "7: disambiguation string"), // i18n webos comment
}

property var strings: {
    "invalidFormat": {
        // full: qsTr("Invalid Format") + _emptyString
    },
    "channelBlocked": {
        //full: qsTr("Channel Locked") + _emptyString, //i18n Title of screensaver for blocking channel.
        body: ziggoChannelLockBodyStr + "\n" + okButtonForUnlockStr
    }, /*
    "acasPRVContractTime8608": {
        body: qsTr("Out of contract time") + _emptyString //i18n Translate only "JP"
    },*/
}
//: --> main comment for the translator
qsTr("My Channels") // i18n some comment messages...

//: --> main comment for the translator
qsTr("Channel Locked")

//: --> main comment for the translator
//~ --> Additional comment for the translator
qsTr("Invalid Format")

qsTr("hello \n Nice \n to meet \n you.")

Text {
    id: checkNetworkDescription
    text: qsTr("Network is not connected.\nPlease check the Network Settings and try again.") + Settings.l10n.tr
    }