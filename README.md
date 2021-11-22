
installation:
ionic cordova plugin add https://github.com/divakarlasrinivas/cordova-azure-push-notifications.git

or 
ionic cordova plugin add cordova-azure-notificationhub

Specify Azure HubName & Connection String and you are good to go.

Test Payload:

{  
   "aps":{  
      "alert":"dasdas",
      "badge":1,
      "sound":"default",
      "mutable-content":"1"
   },
   "urlImageString":"https://res.cloudinary.com/demo/image/upload/sample.jpg"
}