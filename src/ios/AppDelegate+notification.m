// Srinivas Divakarla 
#import "AppDelegate+notification.h"
#import "PushPlugin.h"

@implementation AppDelegate (PushPlugin)
static NSData *lastPush;
// Apple registration success --------------------------------------------------------------------->
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(nonnull NSData *)deviceToken
{
    NSLog(@"didRegisterForRemoteNotificationsWithDeviceToken started");
    
    // Start Azure device registration -->
    PushPlugin *PushPluginInstance = [[PushPlugin alloc] init];
    [PushPluginInstance registerDeviceAzure: deviceToken];

    NSLog(@"didRegisterForRemoteNotificationsWithDeviceToken ended");
}

// Apple registration error ----------------------------------------------------------------------->
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
    NSLog(@"didFailToRegisterForRemoteNotificationsWithError started");
    NSLog(@"Error for push: %@", error);
    NSLog(@"didFailToRegisterForRemoteNotificationsWithError end");
}

// Silence notification --------------------------------------------------------------------------->
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult result))completionHandler {
    NSLog(@"Received remote (silent) notification");
    
    NSError * err;
    NSData * jsonData = [NSJSONSerialization  dataWithJSONObject:userInfo options:0 error:&err];
    lastPush = jsonData;
    NSString * myString = [[NSString alloc] initWithData:jsonData   encoding:NSUTF8StringEncoding];
    NSString * notifyJS = [NSString stringWithFormat:@"%@(%@);", @"PushPlugin.onNotificationReceived", myString];
    NSDictionary *userInfoMutable = [userInfo mutableCopy];
    [PushPlugin.pushPlugin notifyOfMessage:userInfoMutable];
    [application setApplicationIconBadgeNumber:[[[userInfo objectForKey:@"aps"] objectForKey:@"badge"] intValue]];
    completionHandler(UIBackgroundFetchResultNoData);
}
+(NSData*)getLastPush
{
    NSData* returnValue = lastPush;
    lastPush = nil;
    return returnValue;
}

@end
