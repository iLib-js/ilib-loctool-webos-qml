import QtQuick 2.6

QtObject {
    property string _countryGroup: globalVars.systemValue.countryGroup
    property var _emptyString : {
        if(localeModel.currentLanguage !=="")
            return localeModel.locale.emptyString;
        return "";
    }
    property string ziggoChannelLockBodyStr: qsTr("The programme has been locked because of a programme locking defined by you. This can be changed via the TV menu.") + _emptyString
    property string okButtonForUnlockStr: qsTr("Press OK button for unlocking the screen.") + _emptyString //i18n guide message of screensaver for blocking channel.
    property string airtelCallNumber : {
        if(_localeModel.isRTL)
            return qsTr("North : %1").arg("\u200E"+"0124-4448080") + "\n" + qsTr("East : %1").arg("\u200E"+"033-44448080") + "\n"+ qsTr("West : %1").arg("\u200E"+"020-44448080") + "\n" + qsTr("South : %1").arg("\u200E"+"080-44448080") + _emptyString
        else
            return qsTr("North : %1").arg("0124-4448080") + "\n" + qsTr("East : %1").arg("033-44448080") + "\n"+ qsTr("West : %1").arg("020-44448080") + "\n" + qsTr("South : %1").arg("080-44448080") + _emptyString
    }
    property string acasErrorCode : ""
    property var strings: {
        "notSupported": {
            full: qsTr("Not Supported Service") + _emptyString
        },
        "notSupportedFreesat": {
            full: "",
            sub : qsTr("This is a UHD channel. To find out more about UHD, please visit the Freesat website.") + _emptyString
        },
       "dmostDisconnect": {
            full: "",
            sub: qsTr("Network is disconnected.") + " " + qsTr("Check the network status.") + _emptyString
        },
        "noSignal": {
            full: qsTr("No Signal") + _emptyString,
            body: qsTr("Currently signal is being searched for, or no signal has been found. Please check if the antenna cable has been connected properly.") + _emptyString
        },
        "invalidFormat": {
            full: qsTr("Invalid Format") + _emptyString
        },
        "channelBlocked": {
            full: qsTr("Channel Locked") + _emptyString, //i18n Title of screensaver for blocking channel.
            sub: okButtonForUnlockStr,
            header: qsTr("Programme Locked") + _emptyString,
            body: ziggoChannelLockBodyStr + "\n" + okButtonForUnlockStr
        },
       "noCIModule": {
            full: qsTr("No CI Module") + _emptyString,
            header: qsTr("Programme is coded.") + _emptyString,
            body: qsTr("Please check if the CI+ module and the smart card have been inserted correctly.") + _emptyString
        },
        "acasPRVContractTime8608": {
            body: qsTr("(8608):PPV(Out of contract time)") + _emptyString //i18n Translate only "JP"
        },
        "notSupported8K": {
            full: qsTr("8K channel is not supported.") + _emptyString
        },
        "ftaBlocked": {
            full: qsTr("FTA Locked") + _emptyString,
            sub: ""
        },
        "unknown": {}
    }

    function isValidKey(key) {
        return (key && strings[key]);
    }
    function getString(key, type) {
        if(!isValidKey(key)) {
            return "";
        }
        if(isAirtelString) {
            var tempString = "";
            if(key==="noSignal" && (type === "sub" || type === "body" )) {
                tempString  = qsTr("Error Code : %1").arg("B001") + "\n\n"
                            + qsTr("This could be due to an unstable connection or bad weather conditions in your region or an issue at broadcast centre.") + "\n"
                            + qsTr("1. Check the cable connections and remove obstruction around the dish.") + "\n"
                            + qsTr("2. Try changing channels.") + "\n"
                            + qsTr("3. Restart the TV by switching power off and back on.") + "\n\n"
                            + qsTr("If the issue persists, airtel subscribers can dial %1 (toll-free).").arg("12150") + "\n"
                            + qsTr("For other customers, please call local customer care representatives at") + "\n\n"
                            + airtelCallNumber + _emptyString;
                return tempString;
            } else {
                    return qsTr("Unable to start the service") + _emptyString;
                }
            }
        }
        if(key==="ftaBlocked" && type === "sub") {
                var ftaString  = qsTr("Error Code : %1").arg("CAM008") + "\n\n"
                            + qsTr("This FTA Service is locked due to security reasons.") + "\n"
                            + qsTr("For other customers, please call local customer care representatives at") + "\n\n"
                            + airtelCallNumber + _emptyString;
                return ftaString;
        }
        if(key==="noSignal" && (type === "sub" || type === "body")) {
            var satelliteGuide = qsTr("Currently signal is being searched for, or no signal has been found. Please check if the antenna/satellite cable has been connected properly.") + _emptyString;
            var antennaGuide = qsTr("Currently signal is being searched for, or no signal has been found. Please check if the antenna cable has been connected properly.") + _emptyString;
            //20170516 will be translated
            var inputGuide = "" ;
            if(globalVars.systemValue.isBNOTV) {
                inputGuide = qsTr("Please check the input connection") + _emptyString
            } else {
                inputGuide = qsTr("(1) Please check the power of the external devices and cable connection status.")
                + "<br>" +   qsTr("(2) Press the %1 on your remote to change to another input.").arg("[\uA5EB]")
                + "<br>" +   qsTr("(3) For external audio devices, please go to 'Settings > Sound > Sound Out' and change settings to 'HDMI ARC'.")+_emptyString
            }
            if(globalVars.inputType === "TV") {
                if(globalVars.systemValue.dvb && modelManager.getModel("channelModel").channelMode === "Satellite") {
                    return satelliteGuide;
                }
                return antennaGuide;
            } else {
                return inputGuide;
            }
        }
        var invalidServiceGuide = qsTr("No image is being displayed because of a signal problem or invalid channel information from broadcasting provider.");// i18n Additional information displayed in Screensaver for invalid service in JA, IL.
        if(key==="invalidService" && type === "sub" && (_countryGroup == "JA" || _countryGroup == "IL")) {
             return invalidServiceGuide + _emptyString;
        }

        return strings[key][type] || "";
    }
}
