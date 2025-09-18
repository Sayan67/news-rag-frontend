# News RAG Frontend

A modern React-based chat interface for an AI-powered news chatbot using Retrieval-Augmented Generation (RAG) technology. This frontend provides users with an intuitive conversational interface to ask questions and receive AI-generated responses about news topics.

## Features

- 🤖 **AI-Powered Chat Interface**: Engage in natural conversations about news topics
- 🔄 **Real-time Streaming Responses**: Experience smooth, real-time AI responses using Server-Sent Events (SSE)
- 💾 **Session Management**: Create, switch between, and manage multiple chat sessions
- 📱 **Responsive Design**: Fully responsive interface that works seamlessly on desktop and mobile devices
- 🎨 **Modern UI**: Clean, intuitive design with smooth animations and transitions
- 🔐 **Persistent Storage**: Chat history is stored locally for easy access to previous conversations

## Tech Stack

- **Frontend Framework**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 7.1.6
- **Styling**: SCSS/Sass with Tailwind CSS
- **HTTP Client**: Native Fetch API for API requests
- **State Management**: React Hooks (useState, useEffect)
- **Code Quality**: ESLint with React-specific configurations

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher recommended)
- npm or yarn package manager
- A running instance of the backend API (see Environment Variables section)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/news-rag-frontend.git
cd news-rag-frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env` file in the root directory and add:
```env
VITE_BACKEND_URL=https://your-backend-url.com
```
Or use your local backend URL:
```env
VITE_BACKEND_URL=http://localhost:4000
```

## Development

Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173` (or the port specified by Vite).

## Available Scripts

- `npm run dev` - Start the development server with hot reload
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality

## Project Structure

```
news-rag-frontend/
├── src/
│   ├── App.tsx           # Main application component
│   ├── App.scss          # Global application styles
│   ├── api/
│   │   └── api.ts        # API client functions for backend communication
│   ├── hooks/
│   │   └── useSession.ts # Custom hook for session management
│   ├── utils/
│   │   └── storage.ts    # LocalStorage utility functions
│   ├── main.tsx          # Application entry point
│   └── index.css         # Tailwind CSS imports
├── public/               # Static assets
├── .env                  # Environment variables
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
├── eslint.config.js      # ESLint configuration
└── package.json          # Dependencies and scripts
```

## API Integration

The frontend communicates with a backend API using the following endpoints:

### Session Management
- `POST /api/session` - Create a new chat session
- `GET /api/history/{sessionId}` - Retrieve chat history for a session
- `DELETE /api/session/{sessionId}` - Delete/reset a session

### Chat Functionality
- `POST /api/chat/stream` - Send a message and receive streaming response

## Key Components

### App Component
The main component that orchestrates the entire application, managing:
- Session state and lifecycle
- Message history
- API communication
- UI state management

### Session Management
- Sessions are stored in localStorage (up to 50 sessions)
- Each session maintains its own message history
- Sessions can be created, switched, and deleted

### Chat Interface
- **Message Display**: Differentiates between user and assistant messages
- **Input Area**: Text input with send button
- **Streaming**: Real-time display of AI responses as they're generated
- **Loading States**: Visual feedback during API calls

## Styling

The application uses a combination of:
- **SCSS/Sass** for component-specific styles
- **Tailwind CSS** for utility classes
- **CSS Variables** for theming and consistent styling

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_BACKEND_URL` | Backend API URL | `http://localhost:4000` |

## Building for Production

1. Build the application:
```bash
npm run build
# or
yarn build
```

2. The build output will be in the `dist` directory

3. Preview the production build:
```bash
npm run preview
# or
yarn preview
```

## Deployment

The built application can be deployed to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Any web server that can serve static files

Make sure to set the appropriate `VITE_BACKEND_URL` environment variable for your production backend.

## Browser Support

The application supports all modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with React and Vite for optimal development experience
- Styled with Tailwind CSS for rapid UI development
- Powered by AI for intelligent news conversations