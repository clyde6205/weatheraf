# Afweather – Weather for Rural African Farmers

**Afweather** is a lightweight, offline-first mobile app built specifically for rural farmers across all of Africa.

This app works on low-end Android phones, uses very little data, and functions fully offline after the first sync.

## Key Features
- **GPS-based location**: Automatically detects your exact farm location (no need for city or address names)
- **Real hyper-local weather**: Current conditions + 7-day forecast for any rural area in Africa (powered by Open-Meteo – free, accurate, no API key)
- **Full offline support**: Once weather is loaded, it stays saved – works with no signal or data
- **Crop recommendations**: Best crops and planting advice based on your country and current weather
- **Simple & farmer-friendly**: Big text, easy buttons, low battery and data usage
- **No internet required after first use**: Perfect for remote areas with only occasional cell tower access

## Target Users
- Rural farmers in all 54 African countries
- Users with cheap/low-end Android phones (Android 6.0 and above)
- Areas with weak or no WiFi – only SIM card mobile data when available

## Tech Stack
- **React Native** – True native Android app (lightweight, fast)
- **Open-Meteo** – Free global weather API with excellent rural coverage
- **AsyncStorage** – Local offline caching
- No heavy libraries – keeps app size small (<30MB)

## Current Status
🚧 **In Development** – Building core features step by step  
Current progress:
- Basic app structure complete
- Welcome screen ready
- GPS, weather fetch, and offline caching coming next

## How to Run (Developers)
1. Clone the repo:
   ```bash
   git clone https://github.com/your-username/weatheraf.git
