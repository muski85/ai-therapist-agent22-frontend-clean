# Lumina

AI-powered mental wellness companion providing 24/7 therapy support, mood tracking, and personalized guidance.

## Features

- AI Therapy Chat - Conversational support powered by Google Gemini
- Mood Tracking - Monitor emotional well-being with daily mood logs
- Activity Logger - Track wellness activities and completion rates
- Wellness Games - Mindfulness exercises and relaxation tools
- Dashboard - Real-time mental health statistics and insights

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Google Gemini AI
- localStorage for data persistence

## Getting Started

Install dependencies:
```bash
npm install
```

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env.local` file in the root directory:
```
# Server configuration
PORT=3001
NODE_ENV=development

# API URLs
BACKEND_API_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000

# Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# JWT secret for authentication
JWT_SECRET=your_jwt_secret_here

# MongoDB connection string
MONGODB_URI=your_mongodb_connection_string
```

## Backend

Backend repository: [ai-therapist-agent22-backend-clean](https://github.com/muski85/ai-therapist-agent22-backend-clean)

Run backend separately on port 5000.

## Project Structure

```
app/
├── components/     # React components
├── api/           # API routes
├── dashboard/     # Dashboard page
├── therapy/       # Therapy chat page
└── features/      # Features page

lib/
├── utils/         # Utility functions (activity, mood, therapy storage)
└── contexts/      # React contexts

backend/           # Separate backend repository
```

## License

MIT
