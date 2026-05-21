<div align="center">
  <img src="assets/images/splash-icon.png" alt="KainTayo Logo" width="120" />
  
  # KainTayo
  > **"Saan tayo kakain? Discover, share, decide."**  
  
</div>

A community-driven mobile food discovery app for budget-conscious Filipino students.

---

> **Note:** CI/CD and release are only available on GitHub. Had problems with authentication with Gitlab. Visit the [repo](https://github.com/notsoeazy/kaintayo/releases) to check out the latest release.


## Table of Contents

- [Screenshots](#screenshots)
- [Core Features](#core-features)
- [Filipino Taste Implementation Report](#-filipino-taste-implementation-report)
- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Setup & Run Instructions](#setup--run-instructions)
- [Testing](#testing)
- [API keys](#api-keys--envexample)
- [Known Limitations & Future Work](#known-limitations--future-work)
- [Build Distribution](#build-distribution)
- [Appendix](#appendix)
  - [Appendix A: Project Template](#appendix-a-project-template)
  - [Appendix B: Filipino Taste Implementation Checklist](#appendix-b-filipino-taste-implementation-checklist)
  - [Appendix C: Sample User Personas](#appendix-c-sample-user-personas-filipino-context)
- [Credits](#credits)

---

## Demo

Follow the link to watch the demo video.

[![KainTayo Demo](https://img.youtube.com/vi/k8nY4s5T0gY/maxresdefault.jpg)](https://youtu.be/k8nY4s5T0gY?si=UmJhgWFbDez5rneF)

---

## Core Features

- **Home Feed** — Browse nearby food spots sorted by distance, filterable by category and price tier
- **Map View** — Visual pin-based map of nearby spots with a callout preview
- **Randomizer (Kahit Saan)** — Can't decide? Let the app pick a random spot based on your filters
- **Add a Spot** — Crowdsource new carinderia, turo-turo, or canteen listings with photos and location pin
- **Detail Screen** — Full spot info with a photo gallery, community price voting, and directions
- **Tried & Wishlist** — Track spots you've visited or want to visit, saved offline
- **Social / Invite** — Add friends and invite them to check out specific food spots
- **Profile** — User account with a custom username and avatar

---

## Filipino Taste Implementation Report

KainTayo satisfies **5 of the 6** Filipino Taste checklist items:

| Requirement | Status | Implementation |
|---|---|---|
| Language: Tagalog/Taglish UI or full i18n | ✅ | Taglish headers (e.g. *"Saan tayo kakain?"*) + full Tagalog (`tl`) mode via `constants/strings.ts` and `useTranslation` hook |
| Payments: PHP currency formatting | ✅ | All prices shown in `₱` with community-defined tiers: Very Budget (₱50–100), Affordable (₱100–200), Moderate (₱200–350) |
| Content: Filipino-centric features | ✅ | Built around carinderia, turo-turo, and canteen discovery; community price voting mirrors local *"magkano doon?"* culture |
| Connectivity: Offline mode / low-bandwidth support | ✅ | Tried list and Wishlist persisted locally via `AsyncStorage`; offline fallback on detail map view |
| Social: Bayanihan / community features | ✅ | Fully crowdsourced listings, friends system, place invites, and community price voting |

---

## Architecture Overview

KainTayo uses a strict 4-layer architecture:

```
Screens (app/)
    ↓ calls
Stores & Hooks (store/, hooks/)
    ↓ calls
Services (lib/)
    ↓ calls
External (Firebase, Nominatim, OpenStreetMap)
```

- **Screens** only interact with stores and hooks — never Firebase directly
- **Components** are stateless and receive all data as props
- **Stores** (Zustand) are the single source of truth for global state
- **Services** are pure functions: no React, no hooks

For detailed architecture rules, file naming conventions, and coding standards, see the [Developer Guide](docs/DEV_GUIDE.md).

---

## Tech Stack

| Category | Libraries |
|----------|-----------|
| **Framework** | React Native 0.83.6, Expo SDK 55, Expo Router, TypeScript |
| **Backend & Auth** | Firebase (Auth, Firestore, Storage), Google Sign-In, expo-auth-session |
| **State & Storage** | Zustand, AsyncStorage |
| **Maps & Location** | react-native-maps, expo-location, Nominatim (OpenStreetMap) |
| **UI & Icons** | @expo/vector-icons, lucide-react-native, react-native-reanimated, react-native-svg, expo-image, expo-image-picker |
| **Fonts** | Expo Google Fonts (Bebas Neue, DM Sans, Pacifico, JetBrains Mono) |
| **Testing** | Jest, jest-expo, @testing-library/react-native, ts-jest |

---

## Setup & Run Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (LTS)
- [Android Studio](https://developer.android.com/studio) with Android SDK + JDK 17+
- A physical Android device or emulator

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env` and fill in your Firebase credentials:
```bash
cp .env.example .env
```

Required environment variables:
```env
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=
```

### 3. Run the App (Development Build)
The app uses native modules (Google Maps, camera, Firebase Storage) and requires a development build — not Expo Go.

```bash
# First time or after native package changes
npx expo prebuild --platform android
npx expo run:android

# Daily development (after first build)
npx expo start
```

Open the installed KainTayo dev app on your device and scan the QR code.


---

## Testing

The project ships with **76 tests** across 9 test files — well above the minimum required by the rubric (≥5 unit + ≥2 component).

```bash
# Run all tests
npx jest

# Run with coverage
npx jest --coverage
```

**Test coverage includes:**
- Pure utility functions (distance math, price consensus, randomizer logic)
- Firebase service layer (Firestore queries, profile and social operations)
- Zustand stores (profile and social state management)
- Custom hooks (feed filtering and place proximity logic)
- UI components (FoodCard rendering and interactions)

For the full test suite index and mock setup details, see the [Testing Guide](docs/TESTING_GUIDE.md).

---

## API Keys & `.env.example`

An `.env.example` file is included in the repository root.

---

## Known Limitations & Future Work

- **iOS not tested:** The development workflow has only been validated on Android. iOS builds may require additional configuration.
- **Map API quota:** The app uses the Google Maps SDK on Android. Heavy usage may hit API quota limits on a free-tier key.
- **No moderation layer:** Crowdsourced spots are published immediately without review. A reporting or flagging system can be implemented.
- **Spot editing:** Users currently cannot edit a spot after it has been submitted.
- **Improved offline availability:** Only the Tried list and Wishlist are persisted locally.

---

## Build Distribution

An Expo EAS preview build (`.apk`) for internal distribution is included with the submission.

To build locally:
```bash
npx eas-cli@latest build -p android --profile preview
```

---

## Appendix

### Appendix A: Project Template

**1. App Name & Tagline:**
KainTayo — *"Saan tayo kakain? Discover, share, decide."*

**2. Problem Statement & Target Audience:**
Filipino students and young commuters struggle to find affordable, nearby food spots — especially local carinderias and turo-turos that don't appear on mainstream platforms. KainTayo solves this through a crowdsourced, community-driven discovery app built for budget-conscious users in Metro Manila and beyond.

**3. Core Features:**
See [Core Features](#core-features) above.

**4. Tech Stack & Libraries:**
See [Tech Stack](#tech-stack) above. Fonts used: Bebas Neue, DM Sans, Pacifico, and JetBrains Mono via Expo Google Fonts.

**5. Data Flow & Architecture Diagram:**
See [Architecture Overview](#architecture-overview) above. *(Diagram attached separately.)*

**6. Team Roles:**

| Name | GitHub | Role |
|------|--------|------|
| Ezekiel Gonzales | [@notsoeazy](https://github.com/notsoeazy) | Full Stack Developer |
| Matt | [@MaTT-R4Yn0](https://github.com/MaTT-R4Yn0) | Full Stack Developer |

---

### Appendix B: Filipino Taste Implementation Checklist

- [x] **Language:** Tagalog/Taglish UI strings or full i18n support
- [x] **Payments:** GCash/Maya UI patterns or PHP currency formatting
- [x] **Content:** Features relevant to PH users (OFW, barangay, carinderia, fiesta, etc.)
- [x] **Design:** Colors, icons, or motifs inspired by PH culture (e.g., sun, stars, parol, banig)
- [x] **Connectivity:** Offline mode or low-bandwidth optimization for PH networks
- [x] **Social:** Bayanihan/community features (group actions, sharing, referrals)
- [x] **Compliance:** Data privacy considerations aligned with PH Data Privacy Act

---

### Appendix C: Sample User Personas (Filipino Context)

Each persona represents a real segment of KainTayo's target audience — budget-conscious students and young workers navigating daily food decisions in the Philippines.

---

**Chrizraine, 21 — College Student, Quezon City**

Chrizraine commutes daily from home to campus and survives on a tight budget. He relies on word-of-mouth from classmates to find affordable food nearby. He switches between Tagalog and English naturally, uses GCash for most transactions, and often searches for meals under ₱100. He wants a fast, community-sourced guide to eating well without breaking the bank.

*Uses KainTayo for:* discovering cheap carinderias near school, saving spots to his Wishlist before his commute, and sharing finds with his barkada.

---

**Bea, 19 — Freshman, Living in a Dormitory, Manila**

Bea just moved to Manila from the province and doesn't know the area yet. She's overwhelmed by unfamiliar streets and can't always afford delivery apps. She needs a way to explore nearby spots on her own without spending too much.

*Uses KainTayo for:* the Map View to explore food spots near her dorm, the Randomizer when she can't decide, and marking spots as Tried to build her own personal food map.

---

**Kuya Renz, 24 — BPO Night Shift Worker, Pasig**

Renz works a graveyard shift and eats late at night when most restaurants are closed. He relies on 24-hour carinderias and small eateries that don't show up on Google Maps. He needs something that actually reflects what's open and affordable near his call center.

*Uses KainTayo for:* finding late-night budget spots, checking community price votes before committing, and adding hidden gems his coworkers haven't listed yet.

---

## Credits

Built with ❤️ for the Filipino community.

<table align>
  <tr>
    <td align="center">
      <a href="https://github.com/notsoeazy">
        <img src="https://avatars.githubusercontent.com/u/141341590?v=4" width="80" alt="Ezekiel Gonzales" style="border-radius:50%" /><br/>
        <strong>Ezekiel Gonzales</strong><br/>
        <sub>@notsoeazy</sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/MaTT-R4Yn0">
        <img src="https://avatars.githubusercontent.com/u/141733863?v=4" width="80" alt="Matt" style="border-radius:50%" /><br/>
        <strong>Matt</strong><br/>
        <sub>@MaTT-R4Yn0</sub>
      </a>
    </td>
  </tr>
</table>
