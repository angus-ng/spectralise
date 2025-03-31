# Spectralise

Spectralise is a web app that generates unique colours based on a user's top 5 Spotify tracks. The project uses a **Vue 3 + Tailwind CSS** frontend and a **NestJS** backend to interact with the Spotify API.

## 🚀 Features

- **Spotify Login & Authentication**
- **Fetch Top 5 Songs** from a user's Spotify account
- **Generate Colours** based on track data (currently using hashing)
- **Dynamic UI** with Tailwind CSS & Vue.js
- **Auto-Refreshing Tokens** to maintain seamless user experience
- **Customizable Colour Palettes & Themes**

## 🔮 Future Enhancements

- 🎵 **Search for Songs** and generate Colours from any track
- 📊 **Analyze Song Characteristics** like tempo, key, and mood
- 🎨 **More Advanced Colour Generation Algorithms** based on song properties
- 📤 **Upload Songs** for analysis
- 🎨 **Personalized Colour Themes** based on user preferences
- 🌈 **Export and Share Custom Palettes**

---

## 🛠️ Tech Stack

### **Frontend:**

- Vue 3 + Vite
- Tailwind CSS
- Axios (for API requests)

### **Backend:**

- NestJS (Node.js framework)
- Spotify API Integration
- Cookie-based authentication

---

## Setup & Installation

### **1️⃣ Clone the Repository**

```sh
git clone https://github.com/yourusername/spectralise.git
cd spectralise
```

### **2️⃣ Backend Setup (NestJS)**

```sh
cd backend
npm install
cp .env.example .env  # Fill in your Spotify API credentials
npm run start
```

### **3️⃣ Frontend Setup (Vue 3 + Vite)**

```sh
cd ../frontend
npm install
npm run dev
```

### **4️⃣ Open in Browser**

The app will run on `http://localhost:5173/` (or as specified by Vite).

---

## 🔑 Environment Variables

Create a `.env` file in the backend directory and add your Spotify API credentials:

```
SPOTIFY_CLIENT_ID=your-client-id
SPOTIFY_CLIENT_SECRET=your-client-secret
SPOTIFY_REDIRECT_URI="http://localhost:3000/spotify/callback"
NODE_ENV='development'
frontend=http://localhost:5173/
```

---

## 🏁 Usage

1. Click **Login with Spotify**
2. Grant permissions to fetch top tracks
3. View generated Colours based on your **Top 5 Songs** 🎨
4. Click on song cards to copy the colour hex code!
5. Customize your **colour palette & themes** based on your musical taste
6. Share your generated colours with friends or save them for later
