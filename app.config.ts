import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "KainTayo",
  slug: "kaintayo",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "kaintayo",
  userInterfaceStyle: "light",
  backgroundColor: "#FAF3E8",

  splash: {
    image: "./assets/images/transparent.png",
    resizeMode: "contain",
    backgroundColor: "#FAF3E8"
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: "com.matteazy.kaintayo",
    googleServicesFile: process.env.GOOGLE_SERVICES_INFO_PLIST || "./GoogleService-Info.plist",
    infoPlist: {
      NSCameraUsageDescription: "We need access to your camera to take a picture of your food spot.",
      NSPhotoLibraryUsageDescription: "We need access to your photo library to select a picture of your food spot.",
      NSLocationWhenInUseUsageDescription: "We need your location to easily pin the food spot on the map."
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon/foreground.png",
      backgroundColor: "#FFFFFF"
    },
    package: "com.matteazy.kaintayo",
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON || "./google-services.json",
    config: {
      googleMaps: {
        apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || ""
      }
    }
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png"
  },
  plugins: [
    "expo-router",
    "@react-native-google-signin/google-signin",
    "expo-image",
    "expo-web-browser",
    [
      "react-native-maps",
      {
        androidGoogleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || ""
      }
    ],
    [
      "expo-splash-screen",
      {
        // This is just blank because we are using our own custom splash screen and di ko na alam papano ilagay dito 😭
        backgroundColor: "#FAF3E8",
        image: "./assets/images/transparent.png",
        imageWidth: 200
      }
    ]
  ],
  experiments: {
    typedRoutes: true
  },
  extra: {
    eas: {
      projectId: "48141b21-4d1d-4c1f-b8cb-2fd579fa38f9"
    }
  }
});
