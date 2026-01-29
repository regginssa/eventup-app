# EventUp — File Structure Analysis & Senior Expo Developer Recommendations

## 1. Current Structure Summary

### What You Have (High Level)

```
app/
├── app/                    # Expo Router (file-based routes)
├── api/                    # HTTP client + endpoints + "scripts" (API modules)
├── assets/                 # animations, data, images
├── components/             # common, molecules, organisms, providers, routes
├── constants/              # env, events, themes, values
├── hooks/                  # useAuth, useInit, useRedirect
├── redux/                  # store + slices (auth, booking, event)
├── types/                  # domain + API types
├── utils/                  # format, map, paymentUri, rankEvents
├── app.json, eas.json, babel, metro, tailwind, tsconfig, etc.
```

### Strengths

- **Expo Router** — File-based routing with `app/`, nested layouts (`auth`, `event`, `onboarding`), and dynamic `[id].tsx` is used correctly.
- **Atomic-style UI** — `common` → `molecules` → `organisms` gives clear layering and reuse.
- **Barrel exports** — `components/common`, `molecules`, `organisms` use `index.ts` for clean imports.
- **Path alias** — `@/*` in `tsconfig` keeps imports consistent.
- **Separation of API, redux, types, utils** — Clear boundaries; no business logic in UI.
- **Constants** — Env, themes, and app constants are centralized.

---

## 2. Issues & Gaps

| Area                    | Issue                                                                                                                                                                                 |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **api/**                | `api/scripts/` is misleading — those are **API services**, not scripts.                                                                                                               |
| **components/routes**   | `InitRouter.tsx` is empty; either remove or fold into InitContainer.                                                                                                                  |
| **Organisms index**     | Exports `AuthScreenContainer` from `./AuthScreenContainer` but file lives in `auth/AuthScreenContainer.tsx`. `BookingContainer` is not exported from index (imports use direct path). |
| **Types**               | `useRedirect` imports `@/types/data` — no `data` module; likely `user` or types index.                                                                                                |
| **Testing**             | No `__tests__`, `*.test.*`, or `*.spec.*` structure.                                                                                                                                  |
| **Config vs constants** | Env/secrets vs app constants mixed in `constants/`. Some teams split **config** (env, build) vs **constants** (app values).                                                           |
| **Root clutter**        | `transferPayload.json` at root looks like dev/fixture data; should live in `tools/`, `fixtures/`, or be gitignored.                                                                   |
| **Navigation**          | Root `_layout` declares many `Stack.Screen` manually; Expo Router derives from file system. Consider route groups `(auth)`, `(app)` for clearer separation.                           |

---

## 3. Recommended Senior-Level File Structure

Below is a **target structure** that keeps your app’s behavior, improves naming, and aligns with common Expo/React Native conventions.

```
app/
├── app/                          # Expo Router (unchanged conceptually)
│   ├── _layout.tsx               # Root layout (fonts, providers, Stack)
│   ├── index.tsx                 # Entry redirect (e.g. → start)
│   ├── start.tsx
│   ├── auth/
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── onboarding/
│   │   ├── _layout.tsx
│   │   └── step1..step5.tsx
│   ├── (app)/                    # Optional: route group for main app
│   │   ├── _layout.tsx           # Tabs or shared layout
│   │   ├── home.tsx
│   │   ├── map.tsx
│   │   ├── my-events.tsx
│   │   ├── my-bookings.tsx
│   │   └── profile.tsx
│   ├── event/
│   │   ├── _layout.tsx
│   │   ├── [id].tsx
│   │   └── create/
│   │       ├── _layout.tsx
│   │       └── step1..step4.tsx
│   ├── booking.tsx
│   ├── checkout.tsx
│   ├── booked.tsx
│   ├── didit.tsx
│   └── ...
│
├── src/                          # Optional: colocate all app source under src/
│   ├── api/
│   │   ├── client.ts             # Axios instance (rename from AxiosInstance)
│   │   ├── endpoints.ts          # Endpoint constants (rename from apis)
│   │   └── services/             # Rename from api/scripts
│   │       ├── auth.ts
│   │       ├── user.ts
│   │       ├── event.ts
│   │       ├── booking.ts
│   │       ├── didit.ts
│   │       ├── stripe.ts
│   │       └── upload.ts
│   │
│   ├── components/
│   │   ├── ui/                   # Rename from common — primitives only
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── index.ts
│   │   ├── molecules/
│   │   │   └── ...
│   │   ├── organisms/
│   │   │   ├── auth/
│   │   │   ├── booked/
│   │   │   ├── booking/
│   │   │   ├── event/
│   │   │   ├── layout/           # Footer, etc.
│   │   │   └── index.ts
│   │   └── providers/
│   │       ├── ThemeProvider.tsx
│   │       └── index.ts
│   │
│   ├── config/                   # Build-time / env (split from app constants)
│   │   ├── env.ts
│   │   └── env.example.ts
│   │
│   ├── constants/                # App-level constants only
│   │   ├── events.ts
│   │   ├── themes.ts
│   │   └── values.ts
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useInit.ts
│   │   └── useRedirect.ts
│   │
│   ├── store/                    # Redux (alternative name to redux/)
│   │   ├── index.ts              # configureStore, useAppSelector, etc.
│   │   └── slices/
│   │       ├── auth.slice.ts
│   │       ├── booking.slice.ts
│   │       └── event.slice.ts
│   │
│   ├── types/
│   │   ├── api.ts
│   │   ├── amadeus.ts
│   │   ├── booking.ts
│   │   ├── event.ts
│   │   ├── location.types.ts
│   │   ├── stripe.ts
│   │   ├── user.ts
│   │   └── index.ts
│   │
│   ├── utils/
│   │   ├── format.ts
│   │   ├── map.ts
│   │   ├── paymentUri.ts
│   │   └── rankEvents.ts
│   │
│   └── lib/                      # Optional: shared infra (axios, etc.)
│       └── ...                   # If you want api/* to live under lib vs api
│
├── assets/
│   ├── animations/
│   ├── data/
│   └── images/
│
├── __tests__/                    # Or tests/ at root
│   ├── utils/
│   ├── hooks/
│   └── components/
│
├── fixtures/                     # Dev/test payloads (e.g. transferPayload.json)
│   └── transferPayload.json
│
├── app.json
├── eas.json
├── babel.config.js
├── metro.config.js
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── global.css
├── nativewind-env.d.ts
└── package.json
```

**Notes on recommendations:**

- **`api/scripts` → `api/services`**  
  Reflects that these modules encapsulate API calls, not CLI or build scripts.

- **`api/apis.ts` → `api/endpoints.ts`**  
  Clearer that it holds endpoint paths, not “APIs” in the abstract.

- **`AxiosInstance` → `client`**  
  Simple, standard name for the HTTP client.

- **`common` → `ui`**  
  Optional; many codebases use `ui/` for primitives. You can keep `common` if you prefer.

- **`config/` vs `constants/`**  
  `config/`: env, API keys, build-specific values. `constants/`: app logic (events, themes, values).

- **`src/`**  
  Optional. Puts all app code under `src/` and keeps `app/`, `assets/`, config files at root. Use only if you want that separation.

- **`store/` vs `redux/`**  
  Both fine. `store/` is framework-agnostic; `redux/` is explicit.

- **`__tests__/` or `tests/`**  
  Add top-level test layout plus `utils/`, `hooks/`, `components/` (or feature-based) as you add tests.

- **`fixtures/`**  
  Move `transferPayload.json` here (or to `tools/`) and keep root clean.

- **Route groups `(app)`**  
  Use if you have a clear “main app” shell (tabs, etc.). Not required for your current setup.

---

## 4. Minimal-Change Improvement List

If you prefer **small, low-risk changes** only:

1. **Rename** `api/scripts/` → `api/services/` and update imports.
2. **Rename** `api/apis.ts` → `api/endpoints.ts` (or keep `apis.ts` and add a comment that it’s endpoints).
3. **Fix** `components/organisms/index.ts`:
   - Export `AuthScreenContainer` from `./auth/AuthScreenContainer`.
   - Export `BookingContainer` from `./booking/BookingContainer` and use index in screens.
4. **Fix** `useRedirect`:
   - Import user type from `@/types/user` or `@/types` (remove `@/types/data` if it doesn’t exist).
5. **Remove** `components/routes/InitRouter.tsx` if unused, or implement and use it; avoid empty modules.
6. **Move** `transferPayload.json` to `fixtures/` or `tools/` and update any references.
7. **Add** `__tests__/` (or `tests/`) with placeholder structure for `utils`, `hooks`, and key `components`.

---

## 5. Optional `tsconfig` Paths for `src/`

If you introduce `src/`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@api/*": ["./src/api/*"],
      "@components/*": ["./src/components/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@store/*": ["./src/store/*"],
      "@types/*": ["./src/types/*"],
      "@utils/*": ["./src/utils/*"]
    }
  }
}
```

You can keep `@/*` → `./*` and add `@/api`, `@/components`, etc. only if you find them useful.

---

## 6. Checklist Summary

| Action                                                     | Priority       |
| ---------------------------------------------------------- | -------------- |
| Rename `api/scripts` → `api/services`                      | High           |
| Fix organisms index exports (Auth, Booking)                | High           |
| Fix `useRedirect` types import (`data` → `user` / `types`) | High           |
| Remove or implement `InitRouter`                           | Medium         |
| Move `transferPayload.json` to `fixtures/` or `tools/`     | Medium         |
| Add `__tests__/` layout                                    | Medium         |
| Split `config/` vs `constants/`                            | Low            |
| Rename `apis.ts` → `endpoints.ts`                          | Low            |
| Introduce `src/` and/or route groups                       | Low (optional) |

---

Your current structure is already solid. The suggestions above tighten naming, fix inconsistencies, and add room for tests and config separation. Implementing the **minimal-change list** first will give you the biggest benefit with the least churn.
