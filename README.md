# Tareekh-ky-Jhonky

A premium, minimalist digital repository for exploring and preserving historical heritage.

## Features

- **Heritage Recognition**: Use your camera to identify historical monuments and artifacts instantly with AI.
- **Digital Archive**: Save your discoveries to a personal archive that syncs across devices.
- **Collection Stamps**: Earn digital stamps for every historical site you visit.
- **Acoustic Reconstruction**: Experience historical sites through AI-generated soundscapes.
- **Multilingual Stories**: Listen to the history and folk legends of each site in multiple languages.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Motion
- **Backend**: Express (Vite Middleware)
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth (Google Sign-In)
- **AI**: Gemini Pro Vision for identification and storytelling

## Setup

1. **Environment Variables**:
   Copy `.env.example` to `.env` and provide your:
   - `GEMINI_API_KEY`: Google AI SDK key.
   - Firebase configuration in `firebase-applet-config.json`.

2. **Installation**:
   ```bash
   npm install
   ```

3. **Development**:
   ```bash
   npm run dev
   ```

## Design

The app follows a high-contrast, premium aesthetic:
- **Primary Colors**: Pure Black (`#000000`) and Heritage Gold (`#C5A059`).
- **Typography**: Bold, uppercase sans-serif headers with minimalist tracking.
- **Interaction**: Micro-animations powered by Framer Motion for a fluid, archival feel.
