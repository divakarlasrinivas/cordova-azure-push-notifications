var exec = require('cordova/exec');
var PLUGIN_NAME = 'PushPlugin';
var AppPreferencesAzure = null;

exports.coolMethod = function (arg0, success, error) {
    exec(success, error, PLUGIN_NAME, 'coolMethod', [arg0]);
};
module.exports.add = function (arg0, success, error) {
    exec(success, error, PLUGIN_NAME, 'add', [arg0]);
};

module.exports.getUserData = function (success, error) {
    exec(success, error, PLUGIN_NAME, 'getUserData', []);
};


var PushPlugin = {
    // Get Azure Notification Hub setting --------------------------------------------------------->
    getNotificationHubSettings: function () {
        return new Promise(function (resolve, reject) {
            AppPreferencesAzure = {
                "hubNameAzure": 'myhubname',
                "connectionStringAzure": 'myhubconnectionstring'
            };
            resolve();
        });
        // return new Promise(function (resolve, reject) {
        //     const aSettings = ["hubNameAzure", "connectionStringAzure"];


        // sap.AppPreferences.getPreferenceValues(aSettings,
        //     function successCallback(oSettings) {
        //         if (oSettings &&
        //             oSettings.hubNameAzure &&
        //             oSettings.connectionStringAzure) {

        //             AppPreferencesAzure = {
        //                 "hubNameAzure": oSettings.hubNameAzure,
        //                 "connectionStringAzure": oSettings.connectionStringAzure
        //             };

        //             resolve();

        //         } else {
        //             reject("An error occurs while retrieving preference values with keys!");
        //         }
        //     }.bind(this), reject);


        //  }.bind(this));
    },

    // Native device registration ----------------------------------------------------------------->
    // 1. Before Registration checks -->
    registerDeviceStart: function () {
        // Get user from Fiori Lautchpad -->
        console.log("registration started");

        //var user = sap.ushell.Container.getService("UserInfo").getId();
        //user = user.toUpperCase();
        user = "EXL574";

        // Start registration with User -->
        if (user) {
            console.log("Request user: " + user);

            // Continue registration with User and Azure Notification Hub settings -->
            PushPlugin.getNotificationHubSettings().then(function (oNotificationHubSettings) {
                //PushPlugin.settings = oNotificationHubSettings;
                return PushPlugin.registerDevice(user);

            }, function (oError) {
                console.log("Register Device: " + oError);
            });
        }

    },

    // 2. Registration -->
    registerDevice: function (user) {
        return new Promise(function (resolve, reject) {
            exec(resolve, reject, PLUGIN_NAME, 'registerDevice', [user, AppPreferencesAzure.hubNameAzure, AppPreferencesAzure.connectionStringAzure]);
        });
    },

    // Native device unregistration --------------------------------------------------------------->
    // 1. Before Unregistration -->
    unRegisterDeviceStart: function () {
        // Continue unregistration with Azure Notification Hub settings -->
        PushPlugin.getNotificationHubSettings().then(function (oNotificationHubSettings) {
            return PushPlugin.unRegisterDevice();

        }, function (oError) {
            console.log("Unregister Device: " + oError);
        });
    },

    // 2. Unregistration -->
    unRegisterDevice: function () {
        return new Promise(function (resolve, reject) {
            exec(resolve, reject, PLUGIN_NAME, 'unRegisterDevice', [AppPreferencesAzure.hubNameAzure, AppPreferencesAzure.connectionStringAzure]);
        });
    }

};

// Export --------------------------------------------------------------------------------------->
module.exports = PushPlugin;

// Raise from Fiori Client on FLP Logon: Call native device registration ------------------------>
// document.addEventListener("onSapLogonSuccess", PushPlugin.registerDeviceStart, false);
document.addEventListener("deviceready", PushPlugin.registerDeviceStart, false);

// if (window["sap"] && sap.logon && sap.logon.Core) {
//     const fn = sap.logon.Core.deleteRegistration;

//     sap.logon.Core.deleteRegistration = function (successCallback, errorCallback) {
//         PushPlugin.unRegisterDeviceStart();
//         fn.call(null, successCallback, errorCallback);
//     }
// }
