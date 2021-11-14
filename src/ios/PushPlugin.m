#import "PushPlugin.h"

@implementation PushPlugin: CDVPlugin

NSString* user             = nil;
NSString* hubName          = nil;
NSString* connectionString = nil;


- (void)registerDevice:(CDVInvokedUrlCommand *)command {
    

    NSUserDefaults *prefs = [NSUserDefaults standardUserDefaults];
    NSString *azureRegister = [prefs stringForKey:@"AzureRegister"];
    
    
    if ([azureRegister  isEqual: @"false"] || azureRegister == nil ) {
        
        NSLog(@"Native registerDevice started");


        user             = command.arguments[0];
        hubName          = command.arguments[1];
        connectionString = command.arguments[2];


        [self registerDeviceApple];


        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Device registered"];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
              
        NSLog(@"Native registerDevice ended");
        
    };
}


- (void)registerDeviceApple {
    NSLog(@"Native registerDeviceApple started");


    UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
    UNAuthorizationOptions options =  UNAuthorizationOptionAlert | UNAuthorizationOptionSound | UNAuthorizationOptionBadge;
    [center requestAuthorizationWithOptions:(options) completionHandler:^(BOOL granted, NSError * _Nullable error) {
        if (error != nil) {
            NSLog(@"Error requesting for authorization: %@", error);
        }
    }];


    [[UIApplication sharedApplication] registerForRemoteNotifications];
        
    NSLog(@"Native registerDeviceApple ended");
}


- (void)registerDeviceAzure:(NSData *)deviceToken {
    NSLog(@"Native registerDeviceAzure started");
    

    NSMutableSet *tags = [[NSMutableSet alloc] init];
    [tags addObject:user];
    

    SBNotificationHub* hub = [[SBNotificationHub alloc] initWithConnectionString:connectionString notificationHubPath:hubName];
    [hub registerNativeWithDeviceToken:deviceToken tags:tags completion:^(NSError* error) {
        if (error != nil) {
            NSLog(@"Error registering for notifications: %@", error);
        }
    }];
    

    NSUserDefaults *prefs = [NSUserDefaults standardUserDefaults];
    [prefs setObject:@"true" forKey:@"AzureRegister"];
    
    NSLog(@"Native registerDeviceAzure ended");
}


- (void)unRegisterDevice:(CDVInvokedUrlCommand *)command {
    NSLog(@"unRegisterDevice started");
    

    hubName          = command.arguments[0];
    connectionString = command.arguments[1];
    

    [self unregisterDeviceAzure];


    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Device unregistered"];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        
    NSLog(@"unRegisterDevice ended");
}

- (void)unregisterDeviceAzure {
    NSLog(@"Native unregisterDeviceAzure started");
    
    SBNotificationHub *hub = [[SBNotificationHub alloc] initWithConnectionString:connectionString notificationHubPath:hubName];
    [hub unregisterNativeWithCompletion:^(NSError* error) {
        if (error != nil) {
            NSLog(@"Error unregistering for push: %@", error);
        }
    }];
    
    NSUserDefaults *prefs = [NSUserDefaults standardUserDefaults];
    [prefs setObject:@"false" forKey:@"AzureRegister"];
    
    NSLog(@"Native unregisterDeviceAzure ended");
}

@end