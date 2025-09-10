import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppShell } from './components/main.jsx';
import { 
  LoginPage,
  DashboardPage,
  EventsListPage,
  EventDetailPage,
  EventSignupPage,
  NewsletterPage,
  ReportsPage,
  SettingsPage,
  NotFoundPage
} from './components/main.jsx';
import { RequireAuth, RequireRole } from './components/main.jsx';
import './styles/main.css';

// Create QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      retry: 2,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppShell>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={
              <RequireAuth>
                <DashboardPage />
              </RequireAuth>
            } />
            <Route path="/arrangementer" element={<EventsListPage />} />
            <Route path="/arrangementer/:id" element={<EventDetailPage />} />
            <Route path="/arrangementer/:id/pamelding" element={
              <RequireAuth>
                <EventSignupPage />
              </RequireAuth>
            } />
            <Route path="/nyhetsbrev" element={
              <RequireAuth>
                <RequireRole roles={['editor', 'admin']}>
                  <NewsletterPage />
                </RequireRole>
              </RequireAuth>
            } />
            <Route path="/rapportering" element={
              <RequireAuth>
                <RequireRole roles={['editor', 'admin']}>
                  <ReportsPage />
                </RequireRole>
              </RequireAuth>
            } />
            <Route path="/innstillinger" element={
              <RequireAuth>
                <RequireRole roles={['admin']}>
                  <SettingsPage />
                </RequireRole>
              </RequireAuth>
            } />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AppShell>
      </Router>
    </QueryClientProvider>
  );
};

export default App;