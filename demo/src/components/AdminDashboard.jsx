import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Users,
  CalendarDays,
  Mail,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowUpRight
} from 'lucide-react';
import { api, Card, CardHeader, CardContent, CardTitle, Button, Badge } from './main.jsx';

const AdminDashboard = () => {
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: api.dashboard.getStats
  });

  const { data: recentEvents } = useQuery({
    queryKey: ['recent-events'],
    queryFn: () => api.events.getAll({ limit: 5 })
  });

  const kpiCards = [
    {
      title: 'Totale kontakter',
      value: stats?.totalContacts || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Kommende arrangementer',
      value: stats?.upcomingEvents || 0,
      icon: CalendarDays,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Nyhetsbrev sendt',
      value: stats?.newsletterStats?.sent || 0,
      icon: Mail,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Åpningsrate',
      value: `${stats?.newsletterStats?.openRate || 0}%`,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'open':
        return <Badge variant="success">Åpen</Badge>;
      case 'closed':
        return <Badge>Stengt</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Avlyst</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Oversikt over systemets status og aktivitet</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                </div>
                <div className={`w-12 h-12 ${kpi.bgColor} rounded-lg flex items-center justify-center`}>
                  <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Påmeldinger siste 7 dager</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.signupsData?.map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {new Date(day.date).toLocaleDateString('nb-NO', { 
                      weekday: 'short', 
                      day: 'numeric', 
                      month: 'short' 
                    })}
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full" 
                        style={{ width: `${(day.signups / 30) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8 text-right">
                      {day.signups}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Events */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Siste arrangementer</CardTitle>
              <Link to="/admin/arrangementer">
                <Button variant="ghost" size="sm">
                  Se alle
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEvents?.items?.slice(0, 5).map((event) => (
                <div key={event.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <CalendarDays className="w-5 h-5 text-indigo-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link 
                      to={`/admin/arrangementer/${event.id}`}
                      className="text-sm font-medium text-gray-900 hover:text-indigo-600"
                    >
                      {event.title}
                    </Link>
                    <p className="text-xs text-gray-500">
                      {new Date(event.startAt).toLocaleDateString('nb-NO')} • {event.location.city}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    {getStatusBadge(event.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Hurtighandlinger</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/admin/arrangementer">
              <Button className="w-full justify-start" variant="outline">
                <CalendarDays className="w-4 h-4 mr-2" />
                Opprett nytt arrangement
              </Button>
            </Link>
            <Link to="/admin/nyhetsbrev">
              <Button className="w-full justify-start" variant="outline">
                <Mail className="w-4 h-4 mr-2" />
                Send nyhetsbrev
              </Button>
            </Link>
            <Link to="/admin/rapporter">
              <Button className="w-full justify-start" variant="outline">
                <TrendingUp className="w-4 h-4 mr-2" />
                Vis rapporter
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>Systemstatus</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Database</p>
                <p className="text-xs text-gray-500">Operativ</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">E-post tjeneste</p>
                <p className="text-xs text-gray-500">Operativ</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Backup</p>
                <p className="text-xs text-gray-500">Planlagt 03:00</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;