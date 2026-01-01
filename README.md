# Afweather.com API

Backend API for Afweather.com – providing current weather and suitable crop recommendations across African cities.

## Features
- Current weather for major African cities
- Crop recommendations by country
- Mock 7-day forecast (ready for real API integration)
- Built with Node.js, Express, PostgreSQL

## Endpoints
- `GET /` → Health check
- `GET /api/weather/:country/:city`
- `GET /api/weather/all`
- `GET /api/crops/:country`
- `GET /api/crops/all`
- `GET /api/forecast/:country/:city`
- `GET /api/countries`

## Setup
1. `npm install`
2. Create `.env` file with your `DATABASE_URL`
3. `npm run dev`
