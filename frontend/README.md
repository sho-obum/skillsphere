# SkillSphere Frontend

A modern React TypeScript frontend for the SkillSphere skill-sharing platform.

## Features

- 🔐 **Authentication System**: Secure login/signup with JWT tokens
- 🎯 **Role-based Access**: Different interfaces for customers, providers, and admins
- 📚 **Skills Marketplace**: Browse, search, and discover skills
- 📅 **Booking System**: Create and manage skill bookings
- 👤 **User Dashboard**: Personalized dashboard with role-specific content
- 📱 **Responsive Design**: Mobile-first design with Tailwind CSS
- 🎨 **Modern UI**: Beautiful interface with consistent design system

## Tech Stack

- **React 19** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API communication
- **Lucide React** for icons
- **date-fns** for date handling

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running on `http://localhost:3000`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Input, etc.)
│   ├── Layout.tsx      # Main layout with navigation
│   └── ProtectedRoute.tsx
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state management
├── pages/              # Page components
│   ├── Home.tsx        # Landing page
│   ├── Login.tsx       # Login page
│   ├── Signup.tsx      # Registration page
│   ├── Skills.tsx      # Skills marketplace
│   ├── SkillDetail.tsx # Individual skill details
│   ├── CreateSkill.tsx # Create new skill
│   ├── Bookings.tsx    # Booking management
│   └── Dashboard.tsx   # User dashboard
├── services/           # API services
│   └── api.ts          # Axios-based API client
├── types/              # TypeScript type definitions
│   └── index.ts        # Shared interfaces
├── App.tsx             # Main app component
└── main.tsx            # App entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## User Roles

### Customer
- Browse and search skills
- Book sessions with providers
- Manage their bookings
- View booking history

### Provider
- Create and manage skills
- Accept/decline booking requests
- Mark sessions as complete
- View earnings and statistics

### Admin
- Full access to all features
- User management capabilities
- Platform oversight

## API Integration

The frontend communicates with the backend via REST API endpoints:

- `/api/auth/*` - Authentication endpoints
- `/api/users/*` - User management
- `/api/skills/*` - Skills CRUD operations
- `/api/bookings/*` - Booking management

## Demo Accounts

For testing purposes, you can use these demo accounts:

- **Customer**: customer@test.com / password123
- **Provider**: provider@test.com / password123
- **Admin**: admin@test.com / password123

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is part of the SkillSphere platform.