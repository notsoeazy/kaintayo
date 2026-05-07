# KainTayo — Developer Guide

> Reference document for all developers working on the KainTayo project.  
> Read this before writing any code.

---

## 1. File Naming Conventions

All files must follow these naming rules. No exceptions.

| File Type | Convention | Example |
|---|---|---|
| Screen component | `snake_case_screen.tsx` | `home_screen.tsx` |
| Screen styles | `snake_case_screen.styles.ts` | `home_screen.styles.ts` |
| Zustand store | `snake_case_store.ts` | `auth_store.ts` |
| Service / lib | `snake_case_service.ts` | `firestore_service.ts` |
| Custom hook | `snake_case_hook.ts` | `location_hook.ts` |
| UI component | `PascalCase.tsx` | `FoodCard.tsx` |
| Component styles | Colocated in same `.tsx` file as `StyleSheet` | `FoodCard.tsx` |
| Type definitions | `index.ts` (in `types/`) | `types/index.ts` |
| Constants | `snake_case.ts` (in `constants/`) | `categories.ts` |
| Test file | mirrors the source file + `.test` | `randomizer_service.test.ts` |

> [!NOTE]
> Component styles are **colocated** inside the `.tsx` file as a `StyleSheet.create` at the bottom of the file — not in a separate `.styles.ts` file. Only screen-level styles use a separate `*.styles.ts` file.

---

## 2. Project Structure

```
kaintayo/
├── app/                          # Expo Router — screens only
│   ├── _layout.tsx               # Root layout: font load, auth guard, providers
│   ├── index.tsx                 # Auth redirect entry point
│   ├── (tabs)/
│   │   ├── _layout.tsx           # Tab bar config and styling
│   │   ├── home_screen.tsx
│   │   ├── map_screen.tsx
│   │   ├── randomizer_screen.tsx
│   │   └── profile_screen.tsx
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   └── login_screen.tsx
│   ├── detail/
│   │   └── [id].tsx              # Place detail screen
│   └── add_spot_screen.tsx       # Crowdsourced spot submission
│
├── components/                   # Reusable UI components
│   ├── FoodCard.tsx              # Feed card with distance + price badge
│   ├── FilterBar.tsx             # Category + distance filter chips
│   ├── SuccessFeedbackModal.tsx  # Post-submission success modal
│   ├── form/                     # Form primitives for Add Spot
│   │   ├── FormField.tsx         # Label + slip card wrapper
│   │   ├── AppTextInput.tsx      # Standardized TextInput
│   │   ├── PriceRangeInput.tsx   # Dual min/max price row
│   │   ├── CategoryPicker.tsx    # Multi-select category chip grid
│   │   └── ImagePickerField.tsx  # Dashed-border image upload preview
│   └── ui/                       # Atomic UI primitives
│       ├── KButton.tsx
│       ├── KBadge.tsx
│       ├── CategoryChip.tsx
│       ├── FilterChip.tsx
│       ├── PriceBadge.tsx
│       └── EmptyState.tsx
│
├── store/                        # Zustand global state
│   ├── auth_store.ts             # Signed-in user
│   ├── feed_store.ts             # Places feed + filter state
│   ├── list_store.ts             # Tried list + Wishlist (persisted)
│   └── settings_store.ts         # Language preference (persisted)
│
├── lib/                          # External service clients and pure logic
│   ├── firebase_service.ts       # Firebase app init (Auth + Firestore + Storage)
│   ├── firebase_storage_service.ts # Image upload to Cloud Storage
│   ├── firestore_service.ts      # Firestore query helpers
│   ├── randomizer_service.ts     # Kahit Saan pick logic
│   └── seed_service.ts           # Firestore seed data (dev only)
│
├── hooks/                        # Custom React hooks
│   ├── location_hook.ts          # expo-location wrapper
│   ├── nearby_places_hook.ts     # Distance filter + Show Anywhere toggle
│   └── useTranslation.ts         # i18n hook (reads from settings_store)
│
├── constants/
│   ├── categories.ts             # FOOD_CATEGORIES array
│   ├── price_ranges.ts           # PRICE_TIERS with label + min/max
│   └── strings.ts                # All UI strings — EN and TL translations
│
├── styles/
│   └── theme.ts                  # ALL design tokens: Colors, Spacing, Radius, FontFamily
│
├── types/
│   └── index.ts                  # Shared TypeScript interfaces (Place, FeedFilters, etc.)
│
├── __tests__/                    # Jest unit tests + RNTL component tests
├── assets/                       # Images, fonts, icons
└── docs/
    └── DEV_GUIDE.md              # ← You are here
```

---

## 3. Layer Separation Rules

KainTayo uses a simple 4-layer architecture. Each layer has strict rules about what it can and cannot call.

```
┌─────────────────────────────────┐
│           SCREENS               │  app/**/*_screen.tsx
│  (what the user sees and taps)  │
└──────────────┬──────────────────┘
               │ calls
               ▼
┌─────────────────────────────────┐
│       STORES / HOOKS            │  store/*_store.ts, hooks/*_hook.ts
│  (state management, side effects)│
└──────────────┬──────────────────┘
               │ calls
               ▼
┌─────────────────────────────────┐
│           SERVICES              │  lib/*_service.ts
│  (Firebase, API calls, logic)   │
└──────────────┬──────────────────┘
               │ calls
               ▼
┌─────────────────────────────────┐
│     EXTERNAL / FIREBASE         │  Firebase JS SDK, Nominatim, etc.
└─────────────────────────────────┘
```

| Layer | ✅ CAN call | ❌ CANNOT call |
|---|---|---|
| **Screens** | Stores, Hooks, Components, `styles/theme.ts` | Services directly, Firebase SDK directly |
| **Stores** | Services (`lib/`) | Screens, Components |
| **Hooks** | Services (`lib/`), Expo modules | Stores (avoid circular), Screens |
| **Services** | Firebase JS SDK, external APIs | Stores, Screens, Hooks |
| **Components** | `styles/theme.ts`, `types/` | Stores directly (receive data as props) |

**In plain terms:**
- **Screens** do not import from `lib/` directly. They call a store action or hook.
- **Components** are dumb — they receive data and callbacks as props. They do not read from stores.
- **Services** are pure functions. No React, no hooks, no Expo hooks inside `lib/`.
- **Stores** are the glue — they call services and expose state + actions to screens.

---

## 4. Styling Rules

### Screen styles
Large screen-level style blocks live in a **colocated** `*.styles.ts` file:
```
app/(tabs)/home_screen.tsx
styles/screens/home_screen.styles.ts  ← screen styles go here
```

### Component styles
Component styles are **colocated** in the same `.tsx` file at the bottom, not in a separate file:
```tsx
// FoodCard.tsx
const styles = StyleSheet.create({
  card: { ... },
});
```

### Design token rule
**Never hardcode a color, spacing value, or font name.** Always import from `styles/theme.ts`.

```ts
// ✅ Correct
import { Colors } from '@/styles/theme';
backgroundColor: Colors.primary

// ❌ Wrong
backgroundColor: '#E8A838'
```

### No inline styles
**Never write inline styles in JSX.** Every style must live in a `StyleSheet.create`.

```tsx
// ❌ Wrong
<View style={{ flex: 1, backgroundColor: '#FAF3E8', padding: 16 }} />

// ✅ Correct
<View style={styles.container} />
```

---

## 5. Where to Place New Files

```
Is it a screen navigated to by Expo Router?
  → app/*_screen.tsx  +  styles/screens/*_screen.styles.ts

Is it a reusable UI element used on multiple screens?
  → components/ComponentName.tsx  (styles colocated inside)
  → For atomic primitives (buttons, chips): components/ui/
  → For form primitives: components/form/

Is it global state shared across screens?
  → store/*_store.ts

Is it a call to Firebase, an API, or pure business logic?
  → lib/*_service.ts

Is it a reusable React hook (uses useState/useEffect)?
  → hooks/*_hook.ts

Is it a TypeScript type or interface?
  → types/index.ts

Is it a static list of values (categories, price tiers)?
  → constants/

Is it a UI string or translation?
  → constants/strings.ts  ← never inline in components

Is it a design value (color, spacing, font)?
  → styles/theme.ts  ← never anywhere else
```

---

## 6. Firebase Setup (JS SDK)

KainTayo uses the **Firebase JavaScript SDK** (`firebase` npm package) — not native Firebase modules. This works in both **Expo Go** and **development builds**.

### Why JS SDK?
- Works in Expo Go (pure JavaScript, no native code required for Firestore/Auth)
- Firestore, Auth, and Storage all work the same as web

> [!IMPORTANT]
> **Google Maps** and **Firebase Storage** (blob uploads) require a **development build** to work correctly on Android. Expo Go cannot embed the Google Maps API key, causing a black map. See Section 6b for the dev build setup.

### Auth Setup
- **Email/password:** `signInWithEmailAndPassword` from `firebase/auth`
- **Google Sign-In:** Uses `expo-auth-session` + `expo-web-browser` (web OAuth flow)
  - Launches a browser window for Google login
  - Returns an ID token → exchanged for a Firebase credential

### Persistence
Use `getReactNativePersistence` with `AsyncStorage` when initializing Auth:

```ts
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
```

### Environment Variables
Firebase web config is read from `.env`. Keys must have the `EXPO_PUBLIC_` prefix:

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

---

## 6b. Development Build (Required for Maps + Storage)

A development build is a custom native APK that embeds your Google Maps API key and enables full-native functionality. It does **not** require an EAS account.

### Prerequisites
- Android Studio installed
- Android SDK + JDK 17+ configured
- USB debugging enabled on your Android device

### Setup (one-time)
```bash
# Install the dev client package
npx expo install expo-dev-client

# Generate the native android/ folder
npx expo prebuild --platform android

# Build and install the debug APK on your connected device
npx expo run:android
```

### Daily Development (after first build)
```bash
# Just start the Metro server — no rebuild needed for JS/TS changes
npx expo start
```
Open the installed KainTayo dev app on your phone and scan the QR code.

### When to Rebuild
You only need to run `npx expo run:android` again if you:
- Add or remove packages with native code (e.g., new Expo plugins)
- Change `app.config.ts` plugins or `android/` native config
- Upgrade Expo SDK or React Native

### What the Dev Build Unlocks
| Feature | Expo Go | Dev Build |
|---|---|---|
| Google Maps rendering | ❌ Black screen | ✅ Works |
| Firebase Storage uploads | ❌ Fails on Android | ✅ Works |
| Camera / Gallery | ⚠️ Limited | ✅ Full access |
| Custom native modules | ❌ | ✅ |

---

## 7. Firestore Data Schema

```
places/                         # Global places collection
  └── {placeId}
        name: string
        categories: string[]    # FoodCategory values
        priceMin: number
        priceMax: number
        description: string
        address?: string
        latitude: number
        longitude: number
        googleMapsUrl: string
        photoUrl?: string
        createdBy: string        # uid
        createdAt: Timestamp

users/{uid}/tried/              # User-visited places
users/{uid}/wishlist/           # User-saved places
users/{uid}/likes/              # User-liked places
```

---

## 8. State Management Rules

All global state lives in Zustand stores (`store/`). Local component state (`useState`) is fine for UI-only state (e.g., modal open/close, form field values).

| Use `useState` for | Use Zustand store for |
|---|---|
| Form field values | Logged-in user |
| Modal visibility | Feed listings + filters |
| Local loading indicator | Tried list, Wishlist |
| Animation values | Auth loading state |
| | Language preference |

### `list_store.ts` and `settings_store.ts` must be persisted
These stores use Zustand `persist` middleware with `AsyncStorage` so they survive offline and app restarts.

---

## 9. Internationalization (i18n) & UI Strings

All user-facing text must be defined in `constants/strings.ts` and accessed via the `useTranslation` hook. **Never hardcode UI strings directly into components.**

### How to use translations
```tsx
import { useTranslation } from '@/hooks/useTranslation';

const { t } = useTranslation();

<Text>{t.home.title}</Text>
```

### Language Dictionary (`constants/strings.ts`)
The dictionary supports:
- **`en` (Default):** Taglish for UI headers (e.g., "Saan tayo kakain?") and English for system operations/auth forms.
- **`tl`:** Full Tagalog translation for all keys.

> [!IMPORTANT]
> When adding a new string key to `en`, you **must** add the matching key to `tl` as well. Missing keys will cause a TypeScript error in `useTranslation.ts`.

### Changing the Language
```ts
import { useSettingsStore } from '@/store/settings_store';
const { setLanguage } = useSettingsStore();
setLanguage('tl'); // switches app to full Tagalog
```

### String Naming Convention
Strings are grouped by screen/feature:
```ts
t.addSpot.placeNameLabel
t.home.emptyStateTitle
t.tabs.home
```

---

## 10. Currency & Price Display

- Always prefix with `₱` (Philippine Peso sign — not "PHP" or "P")
- Price ranges displayed as: `₱65 – ₱85`
- Use `JetBrains Mono` font for all price text
- Render inside a `PriceBadge` component

---

## 11. Commenting Guidelines

### Section Headers
- Use uppercase for section headers.
- Do not use decorative characters like `----` or `────`.
- **✅ Correct:** `// PLACES`
- **❌ Wrong:** `// ─── Places ───`

### Explanations
- Keep comments short and concise.
- Use single-line comments (`//`) instead of multiline (`/** ... */`) for simple explanations.
- Avoid special characters like `()`, `--`, etc.

### Function Documentation
- Only add comments to functions if they contain complex logic that is not easily understandable from the code itself.
- Do not add comments for self-explanatory or simple functions.

### Component Usage Comments
Reusable components must have a usage comment at the top of the file, following the format in `EmptyState.tsx`:
```tsx
/* 
Usage: 
<FormField label="Place Name">
  <AppTextInput placeholder="e.g. Jollibee" value={name} onChangeText={setName} />
</FormField>
*/
```

---

## 12. Performance Checklist

Before shipping any screen with a list:

- [ ] Using `FlatList`, not `ScrollView`, for any scrollable list of data
- [ ] `keyExtractor` provided to all `FlatList` instances
- [ ] `FoodCard` wrapped in `React.memo`
- [ ] Images use `expo-image` (not `Image` from `react-native`)

---

## 13. Common Commands

```bash
# Start the dev server
npx expo start

# Run tests
npx jest

# Run tests with coverage
npx jest --coverage

# Full clean rebuild (e.g., after adding native packages)
npx expo prebuild --clean && npx expo run:android

# Build a local development APK (first time or after native changes)
npx expo prebuild --platform android
npx expo run:android

# Check for outdated or incompatible deps
npx expo-doctor
```

---

## 14. AI Agent Workflows

The AI agent (Antigravity) MUST follow these specific workflows when working on the KainTayo project:

### Update Docs Workflow
- When architectural changes, new layers, or major features are implemented, update `docs/DEV_GUIDE.md` to reflect the current state.
- After finishing any task or phase, immediately update `docs/TODO.md` to check off completed items.

### Commit Workflow
- After implementing features, finishing phases, or completing bug fixes, STOP and wait for explicit user approval before executing a `git commit`.
- Never auto-commit without the user's explicit go-ahead.
