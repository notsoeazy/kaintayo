# KainTayo

> **"Saan tayo kakain? Discover, share, decide."**
> A community-driven mobile food discovery app for budget-conscious Filipino students.

KainTayo helps students and young workers discover affordable, nearby food spots — especially those local eateries and "hidden gems" that aren't on mainstream maps.

## 🛠 Tech Stack
- **Framework:** React Native + Expo (SDK 55)
- **Routing:** Expo Router (File-based)
- **State:** Zustand + Persistence
- **Backend:** Firebase (Auth, Firestore, Storage)
- **Maps:** React Native Maps + Nominatim

## 🚀 Getting Started for Developers

To run the project locally, follow these steps:

### 1. Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (LTS recommended)
- [Android Studio](https://developer.android.com/studio) (for Android Emulator) or a physical device
- [Expo Go](https://expo.dev/go) (optional, but a Development Build is recommended)

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory and add your Firebase and Map keys (refer to `lib/firebase_service.ts` for required variables).

### 4. Running the App
Since the app uses native modules (like Maps and Dev Client), you need to generate the native folders and run a Development Build.

**For Android:**
```bash
npx expo prebuild --platform android
npx expo run:android
```

**For iOS:**
```bash
npx expo prebuild --platform ios
npx expo run:ios
```

### 5. Seeding Data
If you need mock data for testing, check `lib/seed_service.ts`.

## 🤝 Contribution Guide
For detailed instructions on architecture, styling rules, and coding standards, please refer to the [Developer Guide](docs/DEV_GUIDE.md).

---
*Built with ❤️ for the Filipino student community.*
