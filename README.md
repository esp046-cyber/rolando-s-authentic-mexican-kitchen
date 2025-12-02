# Rolando's Authentic Mexican Kitchen 🌮

An elite Progressive Web App (PWA) featuring 200 authentic Mexican recipes curated by "Chef Rolando," complete with flavor profiles, nutritional analysis, and an AI-powered kitchen assistant.

## Features

*   **200 Authentic Recipes**: A curated collection starting with Chef Rolando's signature Mole Negro, expanding into 175 unique variations.
*   **PWA Ready**: Installable on mobile devices with offline capabilities via Service Worker.
*   **AI Chef Assistant**: Chat with "Chef Rolando" (powered by Google Gemini) to ask about ingredients, techniques, or history.
*   **Visual Richness**: Dynamic, context-aware food imagery generated via Pollinations AI.
*   **Flavor Profiles**: Radar charts visualizing the taste balance (Spicy, Sweet, Savory, Bitter, Sour) of every dish.
*   **Dietary & Prep Info**: Full nutritional breakdowns, prep times, and difficulty levels.

## Tech Stack

*   **Framework**: React 18
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS
*   **AI Integration**: Google GenAI SDK (Gemini 2.5 Flash)
*   **Charts**: Recharts
*   **Icons**: Lucide React

## Setup & Installation

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Configure Environment**
    Create a `.env.local` file in the root directory and add your Google Gemini API Key:
    ```env
    API_KEY=your_actual_api_key_here
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    ```

4.  **Build for Production**
    ```bash
    npm run build
    ```

## Project Structure

*   `src/components`: UI components (RecipeCard, Modal, Navbar).
*   `src/services`: Logic for recipe generation and AI chat integration.
*   `src/types`: TypeScript definitions for Recipe and Ingredient structures.
*   `public/`: Static assets, manifest.json, and service worker.

## License

© 2024 Rolando's Authentic Mexican Kitchen. All rights reserved.