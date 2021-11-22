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
        console.log("PushPlugin :: getNotificationHubSettings");
        return new Promise(function (resolve, reject) {
            AppPreferencesAzure = {
                "hubNameAzure": 'YOUR_AZURE_HUB_NAME',
                "connectionStringAzure": 'CONNECTION_STRING'
            };
            resolve();
        });

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
    },


    // NOTIFICATION CALLBACK //
    onNotification: function (callback, success, error) {
        return new Promise(function (resolve, reject) {
            console.log("onNotification:::::::" + success);
            PushPlugin.onNotificationReceived = callback;
            exec(success, error, PLUGIN_NAME, 'registerNotification', []);
        });
    },
    // DEFAULT NOTIFICATION CALLBACK //
    onNotificationReceived: function (payload) {
        return new Promise(function (resolve, reject) {
            console.log("Received push notification JAVASCRIPT *************");
            console.log(payload);
        });
    }

};



exec(function (result) { console.log("Push Plugin Ready OK") }, function (result) { console.log("Push Plugin Ready ERROR") }, PLUGIN_NAME, 'ready', []);
// Export --------------------------------------------------------------------------------------->
module.exports = PushPlugin;


document.addEventListener("deviceready", PushPlugin.registerDeviceStart, false);

