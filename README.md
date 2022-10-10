# iOS Video Feed Bug

This is an Ionic / Capacitor / Angular Repo to reproduce a specific bug on iOS devices.

## Observed Behavior

On iOS 15.x XCode shows the following log:
```
[ProcessSuspension] 0x1120087c0 - ProcessAssertion::acquireSync Failed to acquire RBS assertion 'WebKit Media Playback' for process with PID=24242, error: Error Domain=RBSServiceErrorDomain Code=1 "(originator doesn't have entitlement com.apple.runningboard.assertions.webkit AND originator doesn't have entitlement com.apple.multitasking.systemappassertions)" UserInfo={NSLocalizedFailureReason=(originator doesn't have entitlement com.apple.runningboard.assertions.webkit AND originator doesn't have entitlement com.apple.multitasking.systemappassertions)}
```
After that playing Videos inside the App (video-tag with inline attribute) becomes completely unreliable: Videos are stopping, not playing at all, showing a blank screen. The app keeps that behavior until it crashes.

Since these are [Apples owns Entitlements](https://developer.apple.com/forums/thread/702207?answerId=707281022#707281022), there is no way you can set them manually. I believe the actual problem is something different then missing entitlements. It might cause that violation in the iOS subsystem, but the cause has to be something different. Or I'm completly wrong, at this moment I really don't know. 

## Expected Behavior

Videos are playing. Ideally looping without showing a blank screen. And the app definitely shouldn't crash by playing videos.

## Steps to reproduce

Build the project

1. Building
```
ionic build 
npx cap sync ios
```

2. Open XCode
```
npx cap open ios
```

3. Run on Device
You'll have to test it on an actual iPhone, the simulators don't throw these errors. Also it seems to happen since iOS 14. Definetly still a problem in iOS 15.

4. Scroll trough the feed. You'll eventually encounter the mentioned error log. After that, videos are not playing, stopping or a showing blank screen.

## Things I've tried to no avail

- [x] Checked if inline playing is allowed in [webkit config](https://github.com/ionic-team/capacitor/blob/main/ios/Capacitor/Capacitor/CAPBridgeViewController.swift#L108)
- [x] Created entries in Info.plist (Microphone & Camera Usage)
- [x] Enabled entitlements: Background Mode > Audio Airplay Picture-in-Picture, Background fetch, Background-Processing
- [x] Allowed arbitrary loads in Info.plist
- [x] Removed all overlaying UI infront of the videos (position absolute elements)
- [x] Removed position absolute/relative on the <video>-element itself
- [x] Removed all transformation on the <video>-element (transform, object-fit, removed even resizing via width/height)
- [x] Tried unedited original recorded iPhone videos, still ending in same bug
