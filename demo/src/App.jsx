import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { 
  // Existing admin components
  AppShell,
  LoginPage,
  DashboardPage,
  EventsListPage,
  EventDetailPage as AdminEventDetailPage,
  EventSignupPage,
  NewsletterPage,
  ReportsPage,
  SettingsPage,
  NotFoundPage,
  RequireAuth,
  RequireRole
} from './components/main.jsx';
import { 
  // New public components
  PublicLayout,
  HomePage,
  PublicEventsPage,
  PublicEventDetailPage,
  AboutPage,
  ContactPage
} from './components/public.jsx';
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

// Admin Routes Component
const AdminRoutes = () => {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/arrangementer" element={<EventsListPage />} />
        <Route path="/arrangementer/:id" element={<AdminEventDetailPage />} />
        <Route path="/arrangementer/:id/pamelding" element={<EventSignupPage />} />
        <Route path="/nyhetsbrev" element={
          <RequireRole roles={['editor', 'admin']}>
            <NewsletterPage />
          </RequireRole>
        } />
        <Route path="/rapportering" element={
          <RequireRole roles={['editor', 'admin']}>
            <ReportsPage />
          </RequireRole>
        } />
        <Route path="/innstillinger" element={
          <RequireRole roles={['admin']}>
            <SettingsPage />
          </RequireRole>
        } />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppShell>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Admin/CRM Routes */}
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin/*" element={
            <RequireAuth>
              <AdminRoutes />
            </RequireAuth>
          } />
          
          {/* Legacy login redirect */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="arrangementer" element={<PublicEventsPage />} />
            <Route path="arrangementer/:id" element={<PublicEventDetailPage />} />
            <Route path="arrangementer/:id/pamelding" element={<EventSignupPage />} />
            <Route path="om-oss" element={<AboutPage />} />
            <Route path="kontakt" element={<ContactPage />} />
          </Route>
          
          {/* Catch all */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;