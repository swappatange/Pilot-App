# Atomik Drone Operator App

## Overview
A mobile app for Atomik brand drone operators to manage bookings for agricultural drone spray activities. Built with Expo React Native and Express.js backend.

## Current State
The frontend is fully implemented with:
- 5-second branded splash screen with Atomik logo
- Language selection screen (7 Indian languages: English, Hindi, Punjabi, Marathi, Kannada, Telugu, Tamil)
- Phone OTP authentication flow
- Tab-based navigation (Dashboard, Bookings, Earnings, Profile)
- Complete booking management screens
- Earnings tracking with charts
- History and profile screens

## Project Structure
```
client/                   # Expo React Native frontend
├── App.tsx              # Root component with ErrorBoundary
├── navigation/          # Navigation configuration
│   ├── RootStackNavigator.tsx
│   └── MainTabNavigator.tsx
├── screens/             # All app screens
├── components/          # Reusable UI components
├── constants/           # Theme, colors, translations
├── context/             # React context providers
└── lib/                 # Utilities and API client

server/                  # Express.js backend
├── index.ts            # Server entry point
├── routes.ts           # API routes
└── storage.ts          # Data storage layer

shared/                  # Shared types and schemas
└── schema.ts           # Drizzle ORM schemas

assets/                  # App assets
├── images/             # App icons and images
└── fonts/              # Custom fonts
```

## Design Guidelines
- Follows Atomik brand theme with teal-to-green gradient (#2B7A8C → #3D8B6E → #4B9B52)
- Geometric hexagonal/diamond pattern overlay on auth screens
- iOS 26 Liquid Glass UI design language
- Mobile-first responsive design
- See design_guidelines.md for complete specifications

## Recent Changes (Dec 2024)
- Updated brand gradient to teal-to-green theme matching www.atomik.in
- Added GradientBackground component with geometric SVG pattern overlay
- Removed "Pilot" references - app name is now simply "Atomik"
- Removed "Advancing Agriculture" tagline from splash screen
- Added outlineLight button variant for white styling on gradient backgrounds

## Key Features
1. **Multi-language Support**: 7 Indian languages with full translations
2. **OTP Authentication**: Phone number based login
3. **Booking Management**: View, accept, reject, complete bookings
4. **Earnings Dashboard**: Track earnings with visual charts
5. **History**: View past completed bookings
6. **Profile Management**: Operator profile settings

## Running the App
- Dev server: `npm run all:dev`
- The Expo dev server runs on port 8081
- The Express API server runs on port 5000
- Scan QR code with Expo Go app to test on physical device

## Tech Stack
- **Frontend**: Expo React Native, TypeScript, React Navigation 7
- **Backend**: Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **State Management**: React Context + TanStack Query
- **Animations**: React Native Reanimated

## User Preferences
- Atomik brand green gradient theme
- No emojis in the app
- Mobile OTP authentication (no Twilio integration)
- Tab-based navigation structure

## Recent Features Added (Dec 18, 2024)
1. **Google Places Location Picker** - Autocomplete address search with GPS coordinates
2. **Automatic Weather Updates** - Dashboard weather syncs when home location changes
3. **Masked Phone Calls** - Secure call option for booking farmer connections
   - Setup: Configure Twilio account in environment variables (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
   - Backend endpoint needed: POST /api/calls/initiate - handles Twilio masked call routing
   - Frontend: Two call options in booking details (masked secure call + direct call)
