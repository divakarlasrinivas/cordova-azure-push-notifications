var exec = require('cordova/exec');
var PLUGIN_NAME = 'PushPlugin';
var AppPreferencesAzure = null;
var PushPlugin = {
    // Get Azure Notification Hub setting --------------------------------------------------------->
    getNotificationHubSettings: function () {
        console.log("PushPlugin :: getNotificationHubSettings");
        return new Promise(function (resolve, reject) {
            AppPreferencesAzure = {
                "hubNameAzure": 'YOUR_HUB_NAME',
                "connectionStringAzure": 'CONNECTION_STRING_END_POINT'
            };
            resolve();
        });

    },
    registerDeviceStart: function () {
        console.log("registration started");
        user = "EXL574"; // can be used as a tag during the registration process
        if (user) {
            console.log("Request user: " + user);
            PushPlugin.getNotificationHubSettings().then(function (oNotificationHubSettings) {
                return PushPlugin.registerDevice(user);
            }, function (oError) {
                console.log("Register Device: " + oError);
            });
        }

    },
    registerDevice: function (user) {
        return new Promise(function (resolve, reject) {
            exec(resolve, reject, PLUGIN_NAME, 'registerDevice', [user, AppPreferencesAzure.hubNameAzure, AppPreferencesAzure.connectionStringAzure]);
        });
    },
    unRegisterDeviceStart: function () {
        PushPlugin.getNotificationHubSettings().then(function (oNotificationHubSettings) {
            return PushPlugin.unRegisterDevice();

        }, function (oError) {
            console.log("Unregister Device: " + oError);
        });
    },
    unRegisterDevice: function () {
        return new Promise(function (resolve, reject) {
            exec(resolve, reject, PLUGIN_NAME, 'unRegisterDevice', [AppPreferencesAzure.hubNameAzure, AppPreferencesAzure.connectionStringAzure]);
        });
    },
    onNotification: function (callback, success, error) {
        return new Promise(function (resolve, reject) {
            console.log("onNotification:::::::" + success);
            PushPlugin.onNotificationReceived = callback;
            exec(success, error, PLUGIN_NAME, 'registerNotification', []);
        });
    },
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

