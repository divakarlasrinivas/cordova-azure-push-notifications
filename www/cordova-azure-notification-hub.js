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
                "hubNameAzure": 'nhbuksnprdiidevfms6001',
                "connectionStringAzure": 'Endpoint=sb://nhbuksnprdiidevfms6001.servicebus.windows.net/;SharedAccessKeyName=DefaultListenSharedAccessSignature;SharedAccessKey=cUkJ/u+E/oUOy5QZbdKqgx8aw/QY1JXqw6i4pxeoMVs='
            };
            resolve();
        });

    },
    registerDeviceStart: function () {
        console.log("registration started");
        user = "EXL574";
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

