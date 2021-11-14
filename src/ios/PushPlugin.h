@import Foundation;
#import <Cordova/CDV.h>
#import <Cordova/CDVPlugin.h>
#import <UserNotifications/UserNotifications.h>
#import <WindowsAzureMessaging/WindowsAzureMessaging.h>

@interface PushPlugin : CDVPlugin


- (void)registerDevice:(CDVInvokedUrlCommand *)command;


- (void)registerDeviceAzure:(NSData *)deviceToken;


- (void)unRegisterDevice:(CDVInvokedUrlCommand *)command;

@end