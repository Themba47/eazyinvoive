# eazyinvoive

For React Native 0.60 and above, auto-linking should handle this step.

Android Setup:
Make sure that your AndroidManifest.xml file has the correct permissions to access the camera or gallery. For example:
xml
Copy code
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
If you're targeting Android 10 (API level 29) or higher, you might need to handle scoped storage permissions.
iOS Setup: For iOS, you also need to configure permissions. You can add the following keys in your Info.plist file (located in ios/your_project/Info.plist):
xml
Copy code
<key>NSPhotoLibraryUsageDescription</key>
<string>Your custom message about why you need access to the photo library</string>
<key>NSCameraUsageDescription</key>
<string>Your custom message about why you need access to the camera</string>
Rebuild your project: After installing the package and making the necessary changes, rebuild your project to apply the changes.
bash
Copy code
npx react-native run-android
# or
npx react-native run-ios


ios parameter will take care of adding queries (LSApplicationQueriesSchemes) to the Info.plist.

<key>LSApplicationQueriesSchemes</key>
<array>
  <string>fb</string>
  <string>instagram</string>
  <string>twitter</string>
  <string>tiktoksharesdk</string>
</array>

android parameter will take care of adding queries to the AndroidManifest.xml.

<queries>
  <package android:name="com.facebook.katana" />
  <package android:name="com.instagram.android" />
  <package android:name="com.twitter.android" />
  <package android:name="com.zhiliaoapp.musically" />
</queries>

And prebuild the project with expo prebuild.
