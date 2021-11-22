#import "PushPlugin.h"
#import "AppDelegate+notification.h"

@implementation PushPlugin: CDVPlugin

NSString* user             = nil;
NSString* hubName          = nil;
NSString* connectionString = nil;
static BOOL notificatorReceptorReady = NO;
static BOOL appInForeground = YES;
static NSString *notificationCallback = @"PushPlugin.onNotificationReceived";
static PushPlugin *pushPluginInstance;

+ (PushPlugin *) pushPlugin {
    
    return pushPluginInstance;
}
- (void) ready:(CDVInvokedUrlCommand *)command
{
    NSLog(@"Cordova view ready");
    pushPluginInstance = self;
    [self.commandDelegate runInBackground:^{
        
        CDVPluginResult* pluginResult = nil;
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
    
}

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
- (void)notifyOfMessage:(NSDictionary *)userInfoMutable {
    
    NSError * err;
    NSData * jsonData = [NSJSONSerialization  dataWithJSONObject:userInfoMutable options:0 error:&err];
    NSString * jsonString = [[NSString alloc] initWithData:jsonData   encoding:NSUTF8StringEncoding];
    NSString * notifyJS = [NSString stringWithFormat:@"%@(%@);", notificationCallback, jsonString];
  
    [self.webViewEngine evaluateJavaScript:notifyJS completionHandler:nil];
        
}
- (void) registerNotification:(CDVInvokedUrlCommand *)command
{
    NSLog(@"view registered for notifications");
    
    notificatorReceptorReady = YES;
    NSData* lastPush = [AppDelegate getLastPush];
    if (lastPush != nil) {
        [PushPlugin.pushPlugin notifyOfMessage:lastPush];
    }
    
    CDVPluginResult* pluginResult = nil;
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}
@end
