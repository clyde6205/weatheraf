# weatheraf

Offline-first mobile app for rural Africa farmers.

Built with React Native + Expo for low-end Android phones (Android 6+).

**Key Features:**
- 100% offline — works with no SIM data or signal
- Uses only mobile data from rural towers (no Wi-Fi ever)
- Local database (expo-sqlite) for all data
- Fully editable notes, weather, crop info offline
- Auto-syncs weather when SIM data available (Open-Meteo API — free, no key)
- Coarse location for farm position (low battery)
- Minimal UI — fast on 1GB RAM phones
- Common African crops advice (maize, sorghum, cassava, etc.) — coming next

**Target Users:**
Rural farmers across Africa using cheap Android phones (Tecno, Itel, Infinix, etc.)

**Status:**
Active development — core offline screen working.

**Run it:**
```bash
npx expo start
