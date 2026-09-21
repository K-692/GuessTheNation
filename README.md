# 🌍 Guess the Nation

[![React](https://img.shields.io/badge/React-17.0.2-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.1.2-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-1.6.1-764ABC?logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![Google Maps API](https://img.shields.io/badge/Google_Maps_API-Street_View-4285F4?logo=google-maps&logoColor=white)](https://developers.google.com/maps/documentation/javascript)
[![Architecture: 100% Client-Side](https://img.shields.io/badge/Architecture-100%25_Client--Side-brightgreen.svg)](#-architecture--local-storage)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

An interactive, web-based 360° Google Street View geography guessing game. Test your worldly knowledge by exploring authentic streets around the globe, looking for architectural cues, road signs, and landscapes to guess the correct nation within a 2-minute countdown.

---

## ✨ Features

- **🌐 100% Verified Street View Coverage**: Curated dataset of 36 distinct nations with pre-indexed official Google car-mapped roads and avenues.
- **🛡️ Zero Black Screens**: Custom filtering rejects broken, unlinked, or private third-party user photospheres (`links.length > 0` and Google copyright verification).
- **🕹️ 360° Interactive Roaming**: Full mouse pan/tilt, zoom controls, and keyboard navigation (`ArrowUp` / `ArrowDown` / `ArrowLeft` / `ArrowRight`) to roam along streets.
- **⏱️ 2-Minute Speed Run**: Fast-paced countdown timer challenging players to identify as many countries as possible.
- **🏆 System-Specific Leaderboard**: 100% client-side leaderboard that automatically tracks, ranks, and persists personal best scores by username across sessions using reactive browser storage.
- **⚡ 100% Serverless & Offline-Resilient**: Zero external database dependencies; lightning-fast instant startup with no backend cold starts or authentication barriers.
- **🎯 Dynamic Quiz Engine**: Shuffles 4 unique country options per round with duplicate nation prevention during each gameplay cycle.
- **🪵 Rich Themed UI**: Wooden-styled controls, transparent action buttons, centered title HUD, and responsive viewport sizing.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React 17** | Core UI component framework |
| **TypeScript** | Strict type safety and models |
| **Redux Toolkit** | Centralized game state, timer triggers, and score tracking |
| **Google Maps JS API** | Street View Panorama service & 360° WebGL rendering |
| **Dart Sass (`sass`)** | SCSS stylesheet compilation |
| **Web Storage API** | Reactive, system-specific local persistence for player rankings and custom locations |

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your system:
- **Node.js** (v14+ recommended)
- **Yarn** (`npm install -g yarn`)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/K-692/GuessTheNation.git
   cd GuessTheNation
   ```

2. **Install dependencies**:
   ```bash
   yarn install
   ```

### Environment Configuration

The application includes sensible built-in fallback keys, but you can configure your own Google Maps API key for production deployments.

1. Copy the example environment template:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your custom Google Maps JavaScript API key:
   ```env
   REACT_APP_GOOGLE_MAPS_KEY=your_google_maps_api_key_here
   ```

> **Note**: `.env` is ignored by `.gitignore` to protect sensitive keys from being committed.

### Development Server

Start the local development server:
```bash
yarn start
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

Create an optimized production bundle:
```bash
yarn build
```
The compiled output will be generated in the `build/` directory ready for deployment to any static host (GitHub Pages, Vercel, Netlify, Cloudflare Pages, or AWS S3).

---

## 📂 Project Structure

```
GuessTheNation/
├── public/                     # Static HTML template & game assets
│   └── assets/                 # Buttons, backgrounds, textures
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── GameOptions.tsx     # 4-button country guess options
│   │   ├── Leadboad.tsx        # System-specific dynamic leaderboard
│   │   ├── NameRegister.tsx    # Instant player registration & start action
│   │   └── StreetViewer.tsx    # Google Street View WebGL panorama viewer
│   ├── screens/                # Application page views
│   │   ├── Home.tsx            # Main landing screen (Title + Leaderboard)
│   │   ├── Game.tsx            # Gameplay screen (Timer + HUD + Street View)
│   │   └── AddLocations.tsx    # Custom location management interface
│   ├── Constants/
│   │   └── defaultPlaces.ts    # Verified 36-nation Street View dataset
│   ├── gapi/
│   │   └── loadGMap.ts         # Asynchronous Google Maps API loader
│   ├── store/                  # Redux Toolkit slices
│   │   ├── GameReducers.ts     # Current round, score, and nation rotation
│   │   ├── UserReducers.ts     # Player username and high score management
│   │   └── store.ts            # Root Redux store configuration
│   ├── utils/
│   │   ├── customLocations.ts  # Local custom locations manager
│   │   └── leaderboard.ts      # Reactive system-specific leaderboard manager
│   ├── App.tsx                 # Root router & layout
│   └── index.tsx               # Application entry point
├── .env.example                # Documented environment variables template
├── .gitignore                  # Git ignore rules (.env, build/, flow.md)
└── package.json                # Project dependencies and npm scripts
```

---

## 🎮 How to Play

1. **Enter Your Name**: Type your nickname on the home screen and click the **START** button.
2. **Explore the Street View**: Use click-and-drag or keyboard arrow keys (`ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`) to roam around and look for clues (signs, landscape, language, flags, architecture).
3. **Make Your Guess**: Click one of the four country buttons at the bottom of the screen.
4. **Climb the Leaderboard**: Score as many correct guesses as possible before the 2-minute timer runs out. Your personal best is automatically recorded on your system's leaderboard.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
