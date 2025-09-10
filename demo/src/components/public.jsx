import React, { useState } from 'react';
import { Link, Outlet, useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  CalendarDays, 
  MapPin, 
  Users, 
  Clock, 
  Mail, 
  Phone, 
  User,
  Menu,
  X,
  ArrowRight,
  Star,
  CheckCircle,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Activity,
  Search
} from 'lucide-react';
import { 
  api, 
  useAuthStore,
  Button, 
  Card, 
  CardHeader, 
  CardContent, 
  CardTitle, 
  Badge,
  Input,
  Label
} from './main.jsx';

// Public Header Component
export const PublicHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuthStore();

  // Toggle body class when mobile menu state changes
  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('mob-nav-active');
    } else {
      document.body.classList.remove('mob-nav-active');
    }

    // Cleanup on component unmount
    return () => {
      document.body.classList.remove('mob-nav-active');
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <img 
                  src="/EC-hovedlogo.png" 
                  alt="EventHub logo" 
                  className="h-10 w-auto"
                />
              </Link>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Skriv søkeord her"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mobile menu button - always visible */}
            <div>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="mob-nav-link p-2"
                aria-label="Åpne navigasjon"
              >
                <div className="w-6 h-5 flex flex-col justify-between">
                  <span className={`stripe h-0.5 bg-gray-700 transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                  <span className={`stripe h-0.5 bg-gray-700 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`stripe h-0.5 bg-gray-700 transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu - Below Header */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-16 bottom-0 z-50 bg-white animate-fade-in">
          <div>

              {/* Search Bar - Mobile */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 overflow-y-auto">
                <div className="px-2 py-4 space-y-1">
                  <Link 
                    to="/" 
                    className="block px-4 py-3 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md font-medium transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Hjem
                  </Link>
                  
                  <Link 
                    to="/arrangementer" 
                    className="block px-4 py-3 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md font-medium transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Arrangementer
                  </Link>

                  <div className="space-y-1">
                    <div className="px-4 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                      Medlemskap
                    </div>
                    <Link 
                      to="/medlem/bli-medlem" 
                      className="block px-4 py-2 ml-4 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Bli medlem
                    </Link>
                    <Link 
                      to="/medlem/medlemmer" 
                      className="block px-4 py-2 ml-4 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Våre medlemmer
                    </Link>
                    <Link 
                      to="/medlem/medlemstilbud" 
                      className="block px-4 py-2 ml-4 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Medlem til medlem
                    </Link>
                  </div>

                  <Link 
                    to="/om-oss" 
                    className="block px-4 py-3 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md font-medium transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Om oss
                  </Link>
                  
                  <Link 
                    to="/kontakt" 
                    className="block px-4 py-3 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md font-medium transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Kontakt
                  </Link>

                  <div className="space-y-1">
                    <div className="px-4 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                      Nyheter
                    </div>
                    <Link 
                      to="/nyheter" 
                      className="block px-4 py-2 ml-4 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Alle nyheter
                    </Link>
                    <Link 
                      to="/nyhetsbrev/registrering" 
                      className="block px-4 py-2 ml-4 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Nyhetsbrev
                    </Link>
                  </div>
                </div>
              </nav>

              {/* Footer */}
              <div className="border-t border-gray-200 p-4">
                {isAuthenticated ? (
                  <Link 
                    to="/admin" 
                    className="block w-full bg-indigo-600 text-white text-center px-4 py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors mb-4"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Panel ({user?.name})
                  </Link>
                ) : (
                  <Link 
                    to="/admin/login" 
                    className="block w-full bg-indigo-600 text-white text-center px-4 py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors mb-4"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Logg inn
                  </Link>
                )}

                {/* Social Media Links */}
                <div className="flex justify-center space-x-4">
                  <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-600">
                    <Facebook className="w-6 h-6" />
                  </a>
                  <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-600">
                    <Instagram className="w-6 h-6" />
                  </a>
                  <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-600">
                    <Linkedin className="w-6 h-6" />
                  </a>
                  <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-600">
                    <Twitter className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>

      )}
    </>
  );
};

// Public Footer Component
export const PublicFooter = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <img 
                src="/EC-hovedlogo.png" 
                alt="EventHub logo" 
                className="h-10 w-auto filter brightness-0 invert"
              />
            </div>
            <p className="text-gray-300 mb-4">
              Din partner for profesjonelle arrangementer og events. Vi skaper minneverdige opplevelser som engasjerer og inspirerer.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer" />
              <Twitter className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer" />
              <Instagram className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer" />
              <Linkedin className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer" />
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Navigasjon</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white">Hjem</Link></li>
              <li><Link to="/arrangementer" className="text-gray-300 hover:text-white">Arrangementer</Link></li>
              <li><Link to="/om-oss" className="text-gray-300 hover:text-white">Om oss</Link></li>
              <li><Link to="/kontakt" className="text-gray-300 hover:text-white">Kontakt</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Kontakt</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                post@eventhub.no
              </li>
              <li className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                +47 123 45 678
              </li>
              <li className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Oslo, Norge
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 EventHub. Alle rettigheter reservert.</p>
        </div>
      </div>
    </footer>
  );
};

// Public Layout
export const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PublicHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
};

// Homepage
export const HomePage = () => {
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: api.dashboard.getStats
  });

  const { data: upcomingEvents } = useQuery({
    queryKey: ['upcoming-events'],
    queryFn: () => api.events.getAll({ limit: 6 })
  });

  const { data: activitiesData } = useQuery({
    queryKey: ['activities'],
    queryFn: () => api.activities.getAll({ limit: 6, status: 'active' })
  });

  const { data: newsData } = useQuery({
    queryKey: ['latest-news'],
    queryFn: () => api.events.getAll({ limit: 4 }) // Mock news data
  });

  return (
    <div className="bg-gray-50 w-full">
      {/* Quick Navigation */}
      <section className="bg-white border-b w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/medlem/bli-medlem" className="block p-4 text-center hover:bg-gray-50 rounded-lg transition-colors">
              <h3 className="font-semibold text-gray-900">Bli medlem</h3>
            </Link>
            <Link to="/medlem/medlemmer" className="block p-4 text-center hover:bg-gray-50 rounded-lg transition-colors">
              <h3 className="font-semibold text-gray-900">Våre medlemmer</h3>
            </Link>
            <Link to="/kontakt" className="block p-4 text-center hover:bg-gray-50 rounded-lg transition-colors">
              <h3 className="font-semibold text-gray-900">Kontakt oss</h3>
            </Link>
          </div>
        </div>
      </section>

      {/* Hero Banner */}
      {upcomingEvents?.items && upcomingEvents.items.length > 0 && (
        <section className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="relative bg-white rounded-lg shadow-sm overflow-hidden w-full">
            <Link to={`/arrangementer/${upcomingEvents.items[0].id}`} className="block">
              <div className="aspect-w-16 aspect-h-9 bg-gradient-to-r from-indigo-600 to-purple-600">
                <div className="flex items-center justify-center text-white p-8">
                  <div className="text-center">
                    <h2 className="text-2xl md:text-4xl font-bold mb-4">
                      {upcomingEvents.items[0].title}
                    </h2>
                    <p className="text-lg mb-4 opacity-90">
                      {new Date(upcomingEvents.items[0].startAt).toLocaleDateString('nb-NO', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <Badge className="bg-white text-indigo-600">
                      {upcomingEvents.items[0].category}
                    </Badge>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Main Content Grid */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Aktiviteter Column */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900 pb-2 border-b-2 border-indigo-600 inline-block">
                Aktiviteter
              </h1>
            </div>
            
            <div className="p-6">
              {activitiesData?.items && activitiesData.items.length > 0 ? (
                <div className="space-y-4">
                  {activitiesData.items.map((activity) => (
                    <div key={activity.id} className="flex space-x-4 py-3 border-b border-gray-100 last:border-b-0">
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                        <Activity className="w-6 h-6 text-indigo-600" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 hover:text-indigo-600 transition-colors">
                          {activity.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {activity.description}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {activity.category}
                          </span>
                          <span className="flex items-center text-xs text-gray-500">
                            <Clock className="w-3 h-3 mr-1" />
                            {activity.duration}
                          </span>
                          <span className="flex items-center text-xs text-gray-500">
                            <MapPin className="w-3 h-3 mr-1" />
                            {activity.location}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {activity.schedule}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Ingen aktiviteter tilgjengelig for øyeblikket.</p>
                </div>
              )}
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <Link to="/aktiviteter">
                  <Button variant="outline" className="w-full">
                    Se alle aktiviteter
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Siste nytt Column */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900 pb-2 border-b-2 border-indigo-600 inline-block">
                Siste nytt
              </h1>
            </div>
            
            <div className="p-6">
              {/* Featured news item */}
              {newsData?.items && newsData.items.length > 0 && (
                <article className="mb-6 pb-6 border-b border-gray-200">
                  <figure className="mb-4">
                    <Link to={`/nyheter/${newsData.items[0].id}`} className="block">
                      <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden">
                        <div className="flex items-center justify-center text-gray-400">
                          <span className="text-sm">Nyhetsbilde</span>
                        </div>
                      </div>
                    </Link>
                  </figure>
                  
                  <header className="mb-3">
                    <p className="text-sm text-gray-500 mb-2">
                      <Link to="/nyheter" className="hover:text-indigo-600">Nyheter</Link> - {new Date().toLocaleDateString('nb-NO')}
                    </p>
                    <h2 className="text-xl font-bold text-gray-900">
                      {newsData.items[0].title}
                    </h2>
                  </header>
                  
                  <div className="text-gray-600 mb-4">
                    <p className="line-clamp-3">{newsData.items[0].description}</p>
                  </div>
                  
                  <Link 
                    to={`/nyheter/${newsData.items[0].id}`} 
                    className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    <span className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center mr-2">
                      <ArrowRight className="w-3 h-3 text-white" />
                    </span>
                    Les mer
                  </Link>
                </article>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Additional News Grid */}
      {newsData?.items && newsData.items.length > 1 && (
        <section className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsData.items.slice(1, 4).map((news) => (
              <article key={news.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <figure>
                  <Link to={`/nyheter/${news.id}`}>
                    <div className="aspect-w-16 aspect-h-10 bg-gray-200">
                      <div className="flex items-center justify-center text-gray-400">
                        <span className="text-sm">Nyhetsbilde</span>
                      </div>
                    </div>
                  </Link>
                </figure>
                
                <div className="p-4">
                  <header className="mb-3">
                    <p className="text-sm text-gray-500 mb-1">
                      <Link to="/nyheter" className="hover:text-indigo-600">Nyheter</Link> - {new Date().toLocaleDateString('nb-NO')}
                    </p>
                    <h2 className="font-bold text-gray-900 line-clamp-2">
                      {news.title}
                    </h2>
                  </header>
                  
                  <div className="text-sm text-gray-600 mb-4">
                    <p className="line-clamp-3">{news.description}</p>
                  </div>
                  
                  <Link 
                    to={`/nyheter/${news.id}`} 
                    className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                  >
                    <span className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center mr-2">
                      <ArrowRight className="w-3 h-3 text-white" />
                    </span>
                    Les mer
                  </Link>
                </div>
              </article>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link to="/nyheter">
              <Button variant="outline" size="lg">
                Flere nyheter
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* Mission Statement & Social */}
      <section className="bg-white border-t w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-12 text-center max-w-4xl mx-auto">
          <h2 className="text-xl md:text-2xl font-medium text-gray-900 mb-8 max-w-3xl mx-auto border-b-2 border-indigo-600 pb-4 inline-block">
            EventHub er den viktigste møteplassen i regionen. Vi jobber til det beste for næringslivet og skaper arrangementer som engasjerer.
          </h2>
          
          <div className="flex justify-center space-x-4 mb-8">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-600">
              <Facebook className="w-8 h-8" />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-600">
              <Instagram className="w-8 h-8" />
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-600">
              <Linkedin className="w-8 h-8" />
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-600">
              <Twitter className="w-8 h-8" />
            </a>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="bg-gray-100 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-12 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Hold deg oppdatert på nyheter og aktiviteter
          </h2>
          <Link to="/nyhetsbrev/registrering">
            <Button size="lg" className="font-bold">
              Meld deg på vårt nyhetsbrev
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

// Public Activities Page
export const PublicActivitiesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const { data: activitiesData, isLoading } = useQuery({
    queryKey: ['activities', searchTerm, categoryFilter],
    queryFn: () => api.activities.getAll({ 
      search: searchTerm, 
      category: categoryFilter,
      status: 'active'
    })
  });

  const categories = ['Helse & Velvære', 'Kultur', 'Teknologi', 'Sport', 'Utdanning', 'Sosialt'];

  if (isLoading) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="h-10 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
        </div>
        <div className="grid gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Våre aktiviteter
        </h1>
        <p className="text-lg text-gray-600">
          Oppdag spennende aktiviteter og bli en del av fellesskapet
        </p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Søk aktiviteter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="sm:w-48">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Alle kategorier</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Activities Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {activitiesData?.items?.map((activity) => (
          <div key={activity.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-48 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
              <Activity className="w-16 h-16 text-indigo-600" />
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <Badge className="bg-indigo-100 text-indigo-800">
                  {activity.category}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {activity.level}
                </Badge>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {activity.title}
              </h3>
              
              <p className="text-gray-600 mb-4 line-clamp-2">
                {activity.description}
              </p>
              
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{activity.duration}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{activity.location}</span>
                </div>
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  <span>{activity.instructor}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-2">Tidspunkt:</p>
                <p className="text-sm text-gray-600">{activity.schedule}</p>
              </div>
              
              <div className="mt-6">
                <Button className="w-full">
                  Få mer informasjon
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {activitiesData?.items?.length === 0 && (
        <div className="text-center py-12">
          <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Ingen aktiviteter funnet</h3>
          <p className="text-gray-600">
            {searchTerm || categoryFilter 
              ? 'Prøv å justere søkekriteriene dine.'
              : 'Det er ingen aktiviteter tilgjengelig for øyeblikket.'
            }
          </p>
        </div>
      )}
    </div>
  );
};

// Public Events Page
export const PublicEventsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const { data: eventsData, isLoading } = useQuery({
    queryKey: ['public-events', searchTerm, categoryFilter],
    queryFn: () => api.events.getAll({ 
      search: searchTerm,
      category: categoryFilter 
    })
  });

  if (isLoading) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const categories = [...new Set(eventsData?.items?.map(event => event.category) || [])];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Våre arrangementer
        </h1>
        <p className="text-lg text-gray-600">
          Oppdag spennende arrangementer og meld deg på i dag
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Søk arrangementer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="sm:w-48">
            <select
              className="w-full h-10 px-3 border border-gray-300 rounded-md"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">Alle kategorier</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {eventsData?.items?.map((event) => (
          <Card key={event.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Badge>{event.category}</Badge>
                <Badge variant={event.status === 'open' ? 'success' : 'default'}>
                  {event.status === 'open' ? 'Åpen' : 'Stengt'}
                </Badge>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {event.title}
              </h3>
              
              <p className="text-gray-600 mb-4 line-clamp-3">
                {event.description}
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-2" />
                  {new Date(event.startAt).toLocaleDateString('nb-NO', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-2" />
                  {event.location.venue}, {event.location.city}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="w-4 h-4 mr-2" />
                  {event.registrations}/{event.capacity} påmeldt
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full" 
                    style={{ width: `${(event.registrations / event.capacity) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {Math.round((event.registrations / event.capacity) * 100)}% fullt
                </div>
              </div>

              <Link to={`/arrangementer/${event.id}`}>
                <Button className="w-full">
                  {event.status === 'open' ? 'Meld deg på' : 'Les mer'}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {eventsData?.items?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">
            Ingen arrangementer funnet som matcher søket ditt.
          </p>
        </div>
      )}
    </div>
  );
};

// Public Event Detail Page
export const PublicEventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  
  const { data: event, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: () => api.events.getById(id)
  });

  const handleSignup = () => {
    navigate(`/arrangementer/${id}/pamelding`);
  };

  if (isLoading) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-8 max-w-4xl mx-auto">
          <div className="h-8 bg-gray-200 rounded w-2/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Badge className="mb-2">{event?.category}</Badge>
            <Badge variant={event?.status === 'open' ? 'success' : 'default'}>
              {event?.status === 'open' ? 'Åpen for påmelding' : 'Stengt'}
            </Badge>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {event?.title}
          </h1>
          
          {event?.status === 'open' && (
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleSignup} size="lg">
                Meld deg på nå
              </Button>
              <Button variant="outline" size="lg">
                Del arrangement
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Om arrangementet</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {event?.description}
                </p>
              </CardContent>
            </Card>

            {event?.speakers && event.speakers.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Foredragsholdere</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {event.speakers.map((speaker) => (
                      <div key={speaker.id} className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                          <User className="w-8 h-8 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-lg">
                            {speaker.name}
                          </h4>
                          <p className="text-gray-600 mt-1">
                            {speaker.bio}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Call to action */}
            {event?.status === 'open' && (
              <Card className="bg-indigo-50 border-indigo-200">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold text-indigo-900 mb-4">
                    Klar for å delta?
                  </h3>
                  <p className="text-indigo-700 mb-6">
                    Ikke gå glipp av denne fantastiske muligheten. Meld deg på i dag!
                  </p>
                  <Button onClick={handleSignup} size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                    Meld deg på nå
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            {/* Event Details */}
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
                      {event?.location.address && `${event.location.address}, `}
                      {event?.location.city}, {event?.location.country}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {event?.registrations} av {event?.capacity} påmeldt
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full" 
                        style={{ width: `${(event?.registrations / event?.capacity) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {Math.round((event?.registrations / event?.capacity) * 100)}% fullt
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ticket Types */}
            {event?.ticketTypes && event.ticketTypes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Billettyper</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {event.ticketTypes.map((ticket) => (
                      <div key={ticket.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900">{ticket.name}</h4>
                          <p className="font-bold text-gray-900">
                            {ticket.price === 0 ? 'Gratis' : `${ticket.price} ${ticket.currency}`}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600">
                          {ticket.capacity} plasser tilgjengelig
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Share */}
            <Card>
              <CardHeader>
                <CardTitle>Del arrangement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-3">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Facebook className="w-4 h-4 mr-2" />
                    Facebook
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Twitter className="w-4 h-4 mr-2" />
                    Twitter
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

// About Page
export const AboutPage = () => {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Om EventHub
          </h1>
          <p className="text-xl text-gray-600">
            Din partner for minneverdige arrangementer siden 2020
          </p>
        </div>

        <div className="space-y-16">
          {/* Mission */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Vår misjon
            </h2>
            <Card>
              <CardContent className="p-8">
                <p className="text-lg text-gray-700 leading-relaxed text-center">
                  Vi brenner for å skape arrangementer som bringer mennesker sammen, 
                  inspirerer til læring og bygger sterke nettverk. Vårt mål er å levere 
                  profesjonelle og minneverdige opplevelser som overgår forventningene.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Values */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Våre verdier
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Kvalitet
                  </h3>
                  <p className="text-gray-600">
                    Vi setter høye standarder for alle våre arrangementer og 
                    går aldri på kompromiss med kvaliteten.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Samarbeid
                  </h3>
                  <p className="text-gray-600">
                    Vi tror på kraften i samarbeid og skaper arrangementer 
                    som fremmer læring og nettverksbygging.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Pålitelighet
                  </h3>
                  <p className="text-gray-600">
                    Du kan stole på oss for å levere det vi lover, 
                    hver eneste gang.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Team */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Vårt team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { name: 'Anna Hansen', role: 'Gründer & CEO', bio: 'Med 15 års erfaring innen eventbransjen.' },
                { name: 'Lars Olsen', role: 'Event Manager', bio: 'Ekspert på store konferanser og seminarer.' },
                { name: 'Kari Nordahl', role: 'Marketing Manager', bio: 'Ansvarlig for markedsføring og kommunikasjon.' }
              ].map((member, index) => (
                <Card key={index}>
                  <CardContent className="p-6 text-center">
                    <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="w-12 h-12 text-gray-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {member.name}
                    </h3>
                    <p className="text-indigo-600 font-medium mb-3">
                      {member.role}
                    </p>
                    <p className="text-gray-600">
                      {member.bio}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Stats */}
          <section className="bg-indigo-50 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              EventHub i tall
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-indigo-600 mb-2">500+</div>
                <div className="text-gray-600">Arrangementer gjennomført</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-indigo-600 mb-2">10,000+</div>
                <div className="text-gray-600">Fornøyde deltakere</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-indigo-600 mb-2">98%</div>
                <div className="text-gray-600">Tilfredshetsgrad</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-indigo-600 mb-2">5</div>
                <div className="text-gray-600">År med erfaring</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

// Contact Page
export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isSubmitted) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="max-w-2xl mx-auto">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Takk for din henvendelse!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Vi har mottatt din melding og vil kontakte deg innen 24 timer.
          </p>
          <Button onClick={() => setIsSubmitted(false)}>
            Send ny melding
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Kontakt oss
          </h1>
          <p className="text-lg text-gray-600">
            Vi hører gjerne fra deg! Ta kontakt for spørsmål eller samarbeid.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send oss en melding</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Navn *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
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
                  <Label htmlFor="subject">Emne *</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message">Melding *</Label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sender...' : 'Send melding'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Kontaktinformasjon</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="font-medium text-gray-900">E-post</p>
                    <p className="text-gray-600">post@eventhub.no</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="font-medium text-gray-900">Telefon</p>
                    <p className="text-gray-600">+47 123 45 678</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-indigo-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Adresse</p>
                    <p className="text-gray-600">
                      Youngstorget 3<br />
                      0181 Oslo<br />
                      Norge
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Åpningstider</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mandag - Fredag</span>
                  <span className="font-medium">09:00 - 17:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lørdag</span>
                  <span className="font-medium">10:00 - 14:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Søndag</span>
                  <span className="font-medium">Stengt</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Følg oss</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <Facebook className="w-6 h-6 text-gray-400 hover:text-indigo-600 cursor-pointer" />
                  <Twitter className="w-6 h-6 text-gray-400 hover:text-indigo-600 cursor-pointer" />
                  <Instagram className="w-6 h-6 text-gray-400 hover:text-indigo-600 cursor-pointer" />
                  <Linkedin className="w-6 h-6 text-gray-400 hover:text-indigo-600 cursor-pointer" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};