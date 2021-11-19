// Srinivas Divakarla 
#import "AppDelegate+notification.h"
#import "PushPlugin.h"

@implementation AppDelegate (PushPlugin)

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
    
    // Set app badge -->
    [application setApplicationIconBadgeNumber:[[[userInfo objectForKey:@"aps"] objectForKey:@"badge"] intValue]];
    
    completionHandler(UIBackgroundFetchResultNoData);
}

@end