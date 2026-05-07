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

  splash: {
    image: "./assets/images/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#FAF3E8"
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: "com.matteazy.kaintayo",
    infoPlist: {
      NSCameraUsageDescription: "We need access to your camera to take a picture of your food spot.",
      NSPhotoLibraryUsageDescription: "We need access to your photo library to select a picture of your food spot.",
      NSLocationWhenInUseUsageDescription: "We need your location to easily pin the food spot on the map."
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#FAF3E8"
    },
    package: "com.matteazy.kaintayo",
    googleServicesFile: "./google-services.json",
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
    [
      "react-native-maps",
      {
        androidGoogleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || ""
      }
    ]
  ],
  experiments: {
    typedRoutes: true
  }
});
