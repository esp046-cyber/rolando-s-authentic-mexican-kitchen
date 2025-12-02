# 🌮 Rolando's Authentic Mexican Kitchen

![Version](https://img.shields.io/badge/version-1.0.0-amber)
![License](https://img.shields.io/badge/license-MIT-blue)
![PWA](https://img.shields.io/badge/PWA-Ready-green)

An elite **Progressive Web App (PWA)** featuring 200 authentic Mexican recipes curated by "Chef Rolando." This application combines authentic culinary data with next-generation AI features to create a Michelin-star digital experience.

## ✨ Features

### 👨‍🍳 Culinary Excellence
*   **200 Curated Recipes**: A complete catalog ranging from street food classics (*Tacos Al Pastor*) to complex masterpieces (*Chiles en Nogada*).
*   **Authentic Details**: precise ingredients, cooking times, difficulty levels, and chef's secret tips.
*   **Flavor Radar**: Interactive charts visualizing the flavor profile (Spicy, Sweet, Salty, Umami) of every dish.

### 🤖 Next-Gen AI Integration
*   **Visual Variance Engine**: Dynamically generates photorealistic food imagery using varied camera angles, lighting conditions, and plating styles to ensure no two recipes look alike.
*   **Chef Chat**: A built-in AI assistant powered by **Google Gemini** that can answer questions about ingredients, history, and techniques.
*   **Visual Search**: Snap a photo of ingredients to find matching recipes instantly.
*   **Vibe Coding (Remix)**: Ask the AI to modify any recipe on the fly (e.g., *"Make this vegan"* or *"Make it spicy"*).

### 📱 Elite PWA Performance
*   **Offline First**: Robust Service Worker caching ensures the app works without an internet connection.
*   **Smart Fallbacks**: A 4-stage image recovery system ensures users always see real food photos, never broken icons or text placeholders.
*   **App-Like Feel**: Smooth transitions, touch-optimized navigation, and installable on iOS/Android.

## 🛠️ Tech Stack

*   **Core**: React 18, TypeScript, Vite
*   **Styling**: Tailwind CSS
*   **AI**: Google GenAI SDK (Gemini 2.5), Pollinations.ai (Flux Model)
*   **Data Viz**: Recharts
*   **Icons**: Lucide React

## 🚀 Getting Started

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/rolandos-kitchen.git
    cd rolandos-kitchen
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Setup Environment**
    Create a `.env.local` file in the root directory:
    ```env
    # Get your key from aistudio.google.com
    API_KEY=your_google_gemini_api_key
    ```

4.  **Run Locally**
    ```bash
    npm run dev
    ```

## 📦 Deployment

This project is configured for easy deployment to Vercel, Netlify, or GitHub Pages.

```bash
npm run build
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---
*Created with ❤️ by Chef Rolando's Digital Team.*