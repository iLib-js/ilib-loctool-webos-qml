import QtQuick 2.6

QtObject {

    property var _emptyString : {
        if(localeModel.currentLanguage !=="")
            return localeModel.locale.emptyString;
        return "";
    }
    property var strings: {
        "invalidFormat": {
            //: --> main comment for the translator
            full: qsTr("Invalid Format") + _emptyString
        },
        "channelBlocked": {
            full: qsTr("Channel Locked") + _emptyString, //i18n Title of screensaver for blocking channel.

            body: ziggoChannelLockBodyStr + "\n" + okButtonForUnlockStr
        },
        "acasPRVContractTime8608": {
            body: qsTr("(8608):PPV(Out of contract time)") + _emptyString //i18n Translate only "JP"
        },
    }
    function getString(key, type) {
        if(key==="ftaBlocked" && type === "sub") {
                var ftaString  = qsTr("Error Code : %1").arg("CAM008") + "\n\n"
                return ftaString;
        }
        if(key==="noSignal" && (type === "sub" || type === "body")) {
            var satelliteGuide = qsTr("Please check if the antenna/satellite cable has been connected properly.") + _emptyString;
            if(globalVars) {
                inputGuide = qsTr("Please check the input connection") + _emptyString
            } else {
                inputGuide = qsTr("(1) Please check the power of the external devices and cable connection status.")
                + "<br>" +   qsTr("(2) Press the %1 on your remote to change to another input.").arg("[\uA5EB]")
            }
        }
    }
}