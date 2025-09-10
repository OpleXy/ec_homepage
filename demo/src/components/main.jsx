import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams, Link, Navigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Mail, 
  BarChart3, 
  Settings, 
  User, 
  LogOut, 
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Users,
  TrendingUp,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
  Menu,
  X
} from 'lucide-react';

// Zustand Stores
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export const useUIStore = create((set) => ({
  sidebarOpen: true,
  darkMode: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
}));

// Global data store (simulates database)
const dataStore = {
  events: [
    {
      id: 'evt_1',
      title: 'Sommerseminar 2025',
      description: 'Et fantastisk seminar om teknologi og innovasjon',
      startAt: '2025-06-12T09:00:00Z',
      endAt: '2025-06-12T15:00:00Z',
      location: { venue: 'Kulturhuset', address: 'Youngstorget 3', city: 'Oslo', country: 'NO' },
      status: 'open',
      capacity: 150,
      registrations: 47,
      category: 'Seminar',
      ticketTypes: [
        { id: 'std', name: 'Standard', price: 0, currency: 'NOK', capacity: 150 }
      ],
      speakers: [
        { id: '1', name: 'Dr. Anna Hansen', bio: 'Teknologiekspert og forsker' },
        { id: '2', name: 'Lars Olsen', bio: 'Innovasjonsleder i startup-miljøet' }
      ],
      createdAt: '2025-01-01T10:00:00Z',
      updatedAt: '2025-01-01T10:00:00Z'
    },
    {
      id: 'evt_2',
      title: 'Høstkonferanse',
      description: 'Årlig konferanse for bransjens ledere',
      startAt: '2025-09-15T08:00:00Z',
      endAt: '2025-09-16T17:00:00Z',
      location: { venue: 'Radisson Blu', address: 'Strandkaien 7', city: 'Bergen', country: 'NO' },
      status: 'open',
      capacity: 200,
      registrations: 89,
      category: 'Konferanse',
      ticketTypes: [
        { id: 'std', name: 'Standard', price: 500, currency: 'NOK', capacity: 200 }
      ],
      speakers: [
        { id: '3', name: 'Maria Svendsen', bio: 'Lederskap og strategi ekspert' }
      ],
      createdAt: '2025-01-02T10:00:00Z',
      updatedAt: '2025-01-02T10:00:00Z'
    }
  ]
};

// Mock API functions with admin/public separation
export const api = {
  auth: {
    login: async (credentials) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        user: { id: '1', name: 'Admin User', email: credentials.email, role: 'admin' },
        token: 'mock-jwt-token'
      };
    },
    logout: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  },
  events: {
    // Public/Admin: Get all events
    getAll: async (params = {}) => {
      await new Promise(resolve => setTimeout(resolve, 800));
      let filteredEvents = [...dataStore.events];
      
      // Apply search filter
      if (params.search) {
        const searchLower = params.search.toLowerCase();
        filteredEvents = filteredEvents.filter(event => 
          event.title.toLowerCase().includes(searchLower) ||
          event.description.toLowerCase().includes(searchLower)
        );
      }
      
      // Apply category filter
      if (params.category) {
        filteredEvents = filteredEvents.filter(event => 
          event.category === params.category
        );
      }
      
      // Apply limit
      if (params.limit) {
        filteredEvents = filteredEvents.slice(0, params.limit);
      }
      
      return {
        items: filteredEvents,
        total: filteredEvents.length
      };
    },
    
    // Public/Admin: Get single event
    getById: async (id) => {
      await new Promise(resolve => setTimeout(resolve, 600));
      const event = dataStore.events.find(e => e.id === id);
      if (!event) {
        throw new Error('Event not found');
      }
      return event;
    },
    
    // Admin only: Create event
    create: async (eventData) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newEvent = {
        id: 'evt_' + Math.random().toString(36).substr(2, 9),
        ...eventData,
        registrations: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      dataStore.events.push(newEvent);
      return newEvent;
    },
    
    // Admin only: Update event
    update: async (id, eventData) => {
      await new Promise(resolve => setTimeout(resolve, 900));
      const eventIndex = dataStore.events.findIndex(e => e.id === id);
      if (eventIndex === -1) {
        throw new Error('Event not found');
      }
      
      dataStore.events[eventIndex] = {
        ...dataStore.events[eventIndex],
        ...eventData,
        updatedAt: new Date().toISOString()
      };
      
      return dataStore.events[eventIndex];
    },
    
    // Admin only: Delete event
    delete: async (id) => {
      await new Promise(resolve => setTimeout(resolve, 700));
      const eventIndex = dataStore.events.findIndex(e => e.id === id);
      if (eventIndex === -1) {
        throw new Error('Event not found');
      }
      
      const deletedEvent = dataStore.events[eventIndex];
      dataStore.events.splice(eventIndex, 1);
      return deletedEvent;
    },
    
    // Public: Register for event
    register: async (eventId, data) => {
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Update registration count
      const eventIndex = dataStore.events.findIndex(e => e.id === eventId);
      if (eventIndex !== -1) {
        dataStore.events[eventIndex].registrations++;
        dataStore.events[eventIndex].updatedAt = new Date().toISOString();
      }
      
      return {
        id: 'reg_' + Math.random().toString(36).substr(2, 9),
        eventId,
        ...data,
        status: 'confirmed'
      };
    }
  },
  dashboard: {
    getStats: async () => {
      await new Promise(resolve => setTimeout(resolve, 700));
      return {
        totalContacts: 1247,
        upcomingEvents: 3,
        signupsData: [
          { date: '2025-08-01', signups: 12 },
          { date: '2025-08-02', signups: 19 },
          { date: '2025-08-03', signups: 8 },
          { date: '2025-08-04', signups: 15 },
          { date: '2025-08-05', signups: 22 },
          { date: '2025-08-06', signups: 18 },
          { date: '2025-08-07', signups: 25 }
        ],
        newsletterStats: {
          sent: 5420,
          openRate: 24.5,
          clickRate: 3.2
        }
      };
    }
  },
  newsletter: {
    getCampaigns: async () => {
      await new Promise(resolve => setTimeout(resolve, 600));
      return [
        {
          id: 'camp_1',
          name: 'Månedlig nyhetsbrev - August',
          subject: 'Nyheter og arrangementer denne måneden',
          status: 'sent',
          audienceId: 'aud_1',
          scheduledAt: '2025-08-01T10:00:00Z'
        },
        {
          id: 'camp_2',
          name: 'Invitasjon til sommerseminar',
          subject: 'Bli med på vårt eksklusive sommerseminar',
          status: 'draft',
          audienceId: 'aud_2'
        }
      ];
    }
  }
};

// UI Components
export const Button = ({ children, variant = 'default', size = 'md', className = '', onClick, disabled, type = 'button', ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
  
  const variants = {
    default: 'bg-indigo-600 text-white hover:bg-indigo-700',
    outline: 'border border-gray-300 bg-white text-gray-900 hover:bg-gray-50',
    ghost: 'hover:bg-gray-100 text-gray-900',
    destructive: 'bg-red-600 text-white hover:bg-red-700'
  };
  
  const sizes = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4',
    lg: 'h-11 px-8'
  };
  
  return (
    <button
      type={type}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ children, className = '' }) => (
  <div className={`p-6 pb-4 ${className}`}>{children}</div>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>{children}</h3>
);

export const Input = ({ className = '', ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

export const Label = ({ children, htmlFor, className = '' }) => (
  <label htmlFor={htmlFor} className={`text-sm font-medium text-gray-700 ${className}`}>
    {children}
  </label>
);

export const Select = ({ children, className = '', ...props }) => (
  <select
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${className}`}
    {...props}
  >
    {children}
  </select>
);

export const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    destructive: 'bg-red-100 text-red-800'
  };
  
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg ${
      type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
      type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
      'bg-blue-50 text-blue-800 border border-blue-200'
    }`}>
      {type === 'success' && <CheckCircle className="w-5 h-5 mr-2" />}
      {type === 'error' && <AlertCircle className="w-5 h-5 mr-2" />}
      <span>{message}</span>
      <button onClick={onClose} className="ml-4">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Navigation Component
export const NavLink = ({ to, icon: Icon, label, collapsed }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center p-3 rounded-lg mb-2 transition-colors ${
        isActive
          ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-700'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
      title={collapsed ? label : undefined}
    >
      <Icon className="w-5 h-5" />
      {!collapsed && <span className="ml-3">{label}</span>}
    </Link>
  );
};

// Layout Components
export const AppShell = ({ children }) => {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setToast({ message: 'Du er nå logget ut', type: 'success' });
  };

  if (!isAuthenticated) {
    return children;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CRM</span>
            </div>
            {sidebarOpen && <span className="ml-3 text-lg font-semibold text-gray-900">CRM System</span>}
          </div>
        </div>

        <nav className="flex-1 p-4">
          <NavLink to="/" icon={LayoutDashboard} label="Dashboard" collapsed={!sidebarOpen} />
          <NavLink to="/arrangementer" icon={CalendarDays} label="Arrangementer" collapsed={!sidebarOpen} />
          <NavLink to="/nyhetsbrev" icon={Mail} label="Nyhetsbrev" collapsed={!sidebarOpen} />
          <NavLink to="/rapportering" icon={BarChart3} label="Rapportering" collapsed={!sidebarOpen} />
          {user?.role === 'admin' && (
            <NavLink to="/innstillinger" icon={Settings} label="Innstillinger" collapsed={!sidebarOpen} />
          )}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            {sidebarOpen && (
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="p-1 hover:bg-gray-100 rounded-md"
              title="Logg ut"
            >
              <LogOut className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-gray-100 rounded-md"
            >
              <Menu className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

// Route Guards
export const RequireAuth = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export const RequireRole = ({ children, roles }) => {
  const { user } = useAuthStore();

  if (!roles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Pages
export const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { user, token } = await api.auth.login(credentials);
      login(user, token);
      
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">CRM</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Logg inn på ditt CRM
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">E-postadresse</Label>
              <Input
                id="email"
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                placeholder="din@email.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Passord</Label>
              <Input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                placeholder="Ditt passord"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Logger inn...' : 'Logg inn'}
          </Button>

          <div className="text-center text-sm text-gray-600">
            Demo: Bruk hvilken som helst e-post og passord
          </div>
        </form>
      </div>
    </div>
  );
};

export const DashboardPage = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: api.dashboard.getStats
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent>
                <div className="h-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Totale kontakter</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalContacts?.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Kommende arrangementer</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.upcomingEvents}</p>
              </div>
              <CalendarDays className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Åpningsrate nyhetsbrev</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.newsletterStats?.openRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Nyhetsbrev sendt</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.newsletterStats?.sent?.toLocaleString()}</p>
              </div>
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Påmeldinger siste 7 dager</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats?.signupsData?.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">
                    {new Date(item.date).toLocaleDateString('nb-NO', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full" 
                        style={{ width: `${(item.signups / Math.max(...stats.signupsData.map(d => d.signups))) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8 text-right">{item.signups}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nyhetsbrev statistikk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Sendt</span>
                <span className="text-lg font-semibold">{stats?.newsletterStats?.sent?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Åpningsrate</span>
                <span className="text-lg font-semibold text-green-600">{stats?.newsletterStats?.openRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Klikkrate</span>
                <span className="text-lg font-semibold text-blue-600">{stats?.newsletterStats?.clickRate}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const EventsListPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  
  const queryClient = useQueryClient();
  const { data: eventsData, isLoading } = useQuery({
    queryKey: ['events', searchTerm],
    queryFn: () => api.events.getAll({ search: searchTerm })
  });

  const { user } = useAuthStore();
  const canEdit = user?.role === 'admin' || user?.role === 'editor';

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: api.events.delete,
    onSuccess: () => {
      // Invalidate all event-related queries to update both admin and public views
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['upcoming-events'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    }
  });

  const handleDelete = async (eventId) => {
    if (window.confirm('Er du sikker på at du vil slette dette arrangementet?')) {
      try {
        await deleteMutation.mutateAsync(eventId);
      } catch (error) {
        console.error('Failed to delete event:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Arrangementer</h1>
        </div>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Arrangementer</h1>
        {canEdit && (
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nytt arrangement
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Søk arrangementer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tittel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dato
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Påmeldte
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Handlinger
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {eventsData?.items?.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <Link 
                          to={`/arrangementer/${event.id}`}
                          className="text-sm font-medium text-indigo-600 hover:text-indigo-900"
                        >
                          {event.title}
                        </Link>
                        <p className="text-sm text-gray-500">{event.category}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(event.startAt).toLocaleDateString('nb-NO')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(event.startAt).toLocaleTimeString('nb-NO', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{event.location.venue}</div>
                      <div className="text-sm text-gray-500">{event.location.city}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={event.status === 'open' ? 'success' : 'default'}>
                        {event.status === 'open' ? 'Åpen' : 'Stengt'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {event.registrations}/{event.capacity}
                      </div>
                      <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full" 
                          style={{ width: `${(event.registrations / event.capacity) * 100}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {canEdit && (
                          <>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setEditingEvent(event)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDelete(event.id)}
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Event Modal */}
      {(showCreateModal || editingEvent) && (
        <EventModal
          event={editingEvent}
          isOpen={showCreateModal || !!editingEvent}
          onClose={() => {
            setShowCreateModal(false);
            setEditingEvent(null);
          }}
          onSave={() => {
            // Invalidate queries to refresh both admin and public views
            queryClient.invalidateQueries({ queryKey: ['events'] });
            queryClient.invalidateQueries({ queryKey: ['upcoming-events'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
          }}
        />
      )}
    </div>
  );
};

// Event Create/Edit Modal Component
const EventModal = ({ event, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startAt: '',
    endAt: '',
    location: {
      venue: '',
      address: '',
      city: '',
      country: 'NO'
    },
    capacity: 100,
    category: 'Seminar',
    status: 'open',
    ticketTypes: [
      { name: 'Standard', price: 0, currency: 'NOK' }
    ]
  });

  const createMutation = useMutation({
    mutationFn: api.events.create,
    onSuccess: () => {
      onSave();
      onClose();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }) => api.events.update(id, data),
    onSuccess: () => {
      onSave();
      onClose();
    }
  });

  // Initialize form with event data when editing
  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        startAt: event.startAt ? event.startAt.slice(0, 16) : '',
        endAt: event.endAt ? event.endAt.slice(0, 16) : '',
        location: {
          venue: event.location?.venue || '',
          address: event.location?.address || '',
          city: event.location?.city || '',
          country: event.location?.country || 'NO'
        },
        capacity: event.capacity || 100,
        category: event.category || 'Seminar',
        status: event.status || 'open',
        ticketTypes: event.ticketTypes || [
          { name: 'Standard', price: 0, currency: 'NOK' }
        ]
      });
    }
  }, [event]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const eventData = {
      ...formData,
      startAt: new Date(formData.startAt).toISOString(),
      endAt: new Date(formData.endAt).toISOString(),
      capacity: parseInt(formData.capacity)
    };

    try {
      if (event) {
        await updateMutation.mutateAsync({ id: event.id, ...eventData });
      } else {
        await createMutation.mutateAsync(eventData);
      }
    } catch (error) {
      console.error('Failed to save event:', error);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.startsWith('location.')) {
      const locationField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {event ? 'Rediger arrangement' : 'Nytt arrangement'}
          </h2>
          <Button variant="ghost" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Tittel *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Beskrivelse *</Label>
            <textarea
              id="description"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startAt">Start *</Label>
              <Input
                id="startAt"
                type="datetime-local"
                value={formData.startAt}
                onChange={(e) => handleInputChange('startAt', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="endAt">Slutt *</Label>
              <Input
                id="endAt"
                type="datetime-local"
                value={formData.endAt}
                onChange={(e) => handleInputChange('endAt', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="venue">Sted *</Label>
              <Input
                id="venue"
                value={formData.location.venue}
                onChange={(e) => handleInputChange('location.venue', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="city">By *</Label>
              <Input
                id="city"
                value={formData.location.city}
                onChange={(e) => handleInputChange('location.city', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Adresse</Label>
            <Input
              id="address"
              value={formData.location.address}
              onChange={(e) => handleInputChange('location.address', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="capacity">Kapasitet *</Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                value={formData.capacity}
                onChange={(e) => handleInputChange('capacity', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Kategori *</Label>
              <select
                id="category"
                className="w-full h-10 px-3 border border-gray-300 rounded-md"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
              >
                <option value="Seminar">Seminar</option>
                <option value="Konferanse">Konferanse</option>
                <option value="Workshop">Workshop</option>
                <option value="Nettverksarrangement">Nettverksarrangement</option>
                <option value="Kurs">Kurs</option>
              </select>
            </div>
            <div>
              <Label htmlFor="status">Status *</Label>
              <select
                id="status"
                className="w-full h-10 px-3 border border-gray-300 rounded-md"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
              >
                <option value="open">Åpen</option>
                <option value="closed">Stengt</option>
                <option value="cancelled">Avlyst</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Avbryt
            </Button>
            <Button 
              type="submit" 
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending ? 'Lagrer...' : 'Lagre'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const EventDetailPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  
  const { data: event, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: () => api.events.getById(id)
  });

  const handleSignup = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/arrangementer/${id}/pamelding` } } });
    } else {
      navigate(`/arrangementer/${id}/pamelding`);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{event?.title}</h1>
          <p className="text-lg text-gray-600 mt-2">{event?.category}</p>
        </div>
        {event?.status === 'open' && (
          <Button onClick={handleSignup} size="lg">
            Meld deg på
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Om arrangementet</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{event?.description}</p>
            </CardContent>
          </Card>

          {event?.speakers && event.speakers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Foredragsholdere</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {event.speakers.map((speaker) => (
                    <div key={speaker.id} className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{speaker.name}</h4>
                        <p className="text-sm text-gray-600">{speaker.bio}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detaljer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">
                    {new Date(event?.startAt).toLocaleDateString('nb-NO', { 
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(event?.startAt).toLocaleTimeString('nb-NO', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })} - {new Date(event?.endAt).toLocaleTimeString('nb-NO', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">{event?.location.venue}</p>
                  <p className="text-sm text-gray-600">
                    {event?.location.address}<br />
                    {event?.location.city}, {event?.location.country}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">
                    {event?.registrations} av {event?.capacity} påmeldt
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full" 
                      style={{ width: `${(event?.registrations / event?.capacity) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billettyper</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {event?.ticketTypes?.map((ticket) => (
                  <div key={ticket.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">{ticket.name}</p>
                      <p className="text-sm text-gray-600">{ticket.capacity} plasser</p>
                    </div>
                    <p className="font-bold text-gray-900">
                      {ticket.price === 0 ? 'Gratis' : `${ticket.price} ${ticket.currency}`}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export const EventSignupPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    ticketType: '',
    consentMarketing: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: event } = useQuery({
    queryKey: ['event', id],
    queryFn: () => api.events.getById(id)
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data) => api.events.register(id, data),
    onSuccess: (registration) => {
      // Invalidate queries to update registration counts across admin and public views
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', id] });
      queryClient.invalidateQueries({ queryKey: ['upcoming-events'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      navigate(`/kvittering/${registration.id}`);
    },
    onError: (error) => {
      console.error('Registration failed:', error);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    mutation.mutate(formData);
    setIsSubmitting(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Påmelding til {event?.title}</h1>
        <p className="text-gray-600 mt-2">Fyll ut skjemaet nedenfor for å melde deg på arrangementet.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Fornavn *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Etternavn *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">E-postadresse *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="ticketType">Billettype *</Label>
              <Select
                id="ticketType"
                value={formData.ticketType}
                onChange={(e) => handleInputChange('ticketType', e.target.value)}
                required
              >
                <option value="">Velg billettype</option>
                {event?.ticketTypes?.map((ticket) => (
                  <option key={ticket.id} value={ticket.id}>
                    {ticket.name} - {ticket.price === 0 ? 'Gratis' : `${ticket.price} ${ticket.currency}`}
                  </option>
                ))}
              </Select>
            </div>

            <div className="flex items-start space-x-3">
              <input
                id="consentMarketing"
                type="checkbox"
                className="mt-1"
                checked={formData.consentMarketing}
                onChange={(e) => handleInputChange('consentMarketing', e.target.checked)}
              />
              <Label htmlFor="consentMarketing" className="text-sm">
                Jeg samtykker til å motta markedsføring og informasjon om fremtidige arrangementer
              </Label>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || mutation.isPending}
              >
                {isSubmitting || mutation.isPending ? 'Melder deg på...' : 'Meld deg på'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export const NewsletterPage = () => {
  const { user } = useAuthStore();
  const canEdit = user?.role === 'admin' || user?.role === 'editor';
  
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['newsletter-campaigns'],
    queryFn: api.newsletter.getCampaigns
  });

  if (!canEdit) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900">Ikke tilgang</h1>
        <p className="text-gray-600 mt-2">Du har ikke tilgang til denne siden.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Nyhetsbrev</h1>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Nyhetsbrev</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Ny kampanje
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Kampanjer</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Kampanje
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Planlagt
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Handlinger
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {campaigns?.map((campaign) => (
                      <tr key={campaign.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{campaign.name}</p>
                            <p className="text-sm text-gray-500">{campaign.subject}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={
                            campaign.status === 'sent' ? 'success' :
                            campaign.status === 'draft' ? 'default' :
                            'warning'
                          }>
                            {campaign.status === 'sent' ? 'Sendt' :
                             campaign.status === 'draft' ? 'Utkast' :
                             'Planlagt'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {campaign.scheduledAt ? 
                            new Date(campaign.scheduledAt).toLocaleString('nb-NO') : 
                            '-'
                          }
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            {campaign.status === 'draft' && (
                              <Button variant="outline" size="sm">
                                Send
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Hurtighandlinger</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Administrer lister
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Mail className="w-4 h-4 mr-2" />
                Nye maler
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="w-4 h-4 mr-2" />
                Se statistikk
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export const ReportsPage = () => {
  const { user } = useAuthStore();
  const canView = user?.role === 'admin' || user?.role === 'editor';

  if (!canView) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900">Ikke tilgang</h1>
        <p className="text-gray-600 mt-2">Du har ikke tilgang til denne siden.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Rapportering</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Påmeldinger per arrangement</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Last ned rapport (CSV)
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nyhetsbrev KPI</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Last ned rapport (XLSX)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const SettingsPage = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('users');

  if (user?.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900">Ikke tilgang</h1>
        <p className="text-gray-600 mt-2">Du har ikke tilgang til denne siden.</p>
      </div>
    );
  }

  const tabs = [
    { id: 'users', label: 'Brukere & roller' },
    { id: 'integrations', label: 'Integrasjoner' },
    { id: 'branding', label: 'Branding' },
    { id: 'api', label: 'API-tilkobling' }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Innstillinger</h1>
      
      <Card>
        <CardHeader>
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {activeTab === 'users' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Brukeradministrasjon</h3>
              <p className="text-gray-600">Administrer brukere og deres roller i systemet.</p>
            </div>
          )}
          {activeTab === 'integrations' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Integrasjoner</h3>
              <p className="text-gray-600">Konfigurer integrasjoner med eksterne tjenester.</p>
            </div>
          )}
          {activeTab === 'branding' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Branding</h3>
              <p className="text-gray-600">Tilpass utseende og merkevare for systemet.</p>
            </div>
          )}
          {activeTab === 'api' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">API-tilkobling</h3>
              <p className="text-gray-600">Konfigurer API-innstillinger og nøkler.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export const NotFoundPage = () => (
  <div className="text-center py-12">
    <h1 className="text-4xl font-bold text-gray-900">404</h1>
    <p className="text-lg text-gray-600 mt-2">Siden ble ikke funnet</p>
    <Link to="/" className="mt-4 inline-block text-indigo-600 hover:text-indigo-500">
      Gå til forsiden
    </Link>
  </div>
);