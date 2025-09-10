# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based CRM and public website for EC (Entrepreneurs Club) built with Vite. The application has two main sections:
- **Admin/CRM Interface** (`/admin/*`) - Protected admin dashboard for managing events, members, newsletters, and reports
- **Public Website** (`/*`) - Public-facing pages including homepage, events listing, about, and contact

## Development Commands

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting (ESLint)
npm run lint
```

## Architecture

### Application Structure
- **Entry Point**: `src/App.jsx` - Defines routing for both admin and public sections
- **Admin Components**: `src/components/main.jsx` - All CRM/admin functionality
- **Public Components**: `src/components/public.jsx` - Public website components
- **Styling**: `src/styles/main.css` - Main stylesheet using Tailwind CSS

### Key Technologies
- **Frontend**: React 18 with React Router for routing
- **State Management**: 
  - Zustand for global state (auth, UI state)
  - TanStack React Query for server state and API calls
- **Styling**: Tailwind CSS with custom color scheme
- **Icons**: Lucide React
- **Build Tool**: Vite

### Routing Architecture
```
/admin/login          → Admin login page
/admin/*              → Protected admin routes (RequireAuth wrapper)
  /admin/             → Dashboard
  /admin/arrangementer → Events management
  /admin/nyhetsbrev    → Newsletter (editor/admin roles)
  /admin/rapportering  → Reports (editor/admin roles)
  /admin/innstillinger → Settings (admin role only)

/*                    → Public routes (PublicLayout wrapper)
  /                   → Homepage
  /arrangementer      → Public events listing
  /arrangementer/:id  → Event details
  /om-oss             → About page
  /kontakt            → Contact page
```

### State Management
- **useAuthStore**: Persisted authentication state with user data and JWT token
- **useUIStore**: UI state for sidebar toggle and dark mode
- **React Query**: API calls with 30-second stale time and retry logic

### Component Structure
Admin components include authentication guards (`RequireAuth`, `RequireRole`) and a consistent `AppShell` layout. Public components use a separate `PublicLayout` with different styling and navigation.

## Development Notes

- The project uses TypeScript types in package.json but JavaScript files (.jsx)
- ESLint configuration allows unused variables starting with capital letters or underscores
- Tailwind config includes custom primary color palette (blue theme)
- Authentication is JWT-based with Zustand persistence
- Role-based access control implemented for admin features