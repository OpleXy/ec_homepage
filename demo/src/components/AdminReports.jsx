import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  Mail,
  Download,
  Filter,
  RefreshCw,
  PieChart,
  LineChart,
  Activity,
  Target,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { 
  api,
  Card, 
  CardHeader, 
  CardContent, 
  CardTitle, 
  Button, 
  Badge 
} from './main.jsx';

const AdminReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [selectedReport, setSelectedReport] = useState('overview');
  
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: api.dashboard.getStats
  });

  const { data: eventsData } = useQuery({
    queryKey: ['events-report'],
    queryFn: () => api.events.getAll()
  });

  // Mock additional report data
  const reportData = {
    userGrowth: [
      { month: 'Jan', users: 850 },
      { month: 'Feb', users: 920 },
      { month: 'Mar', users: 1050 },
      { month: 'Apr', users: 1180 },
      { month: 'Mai', users: 1247 }
    ],
    eventAttendance: [
      { event: 'Sommerseminar', capacity: 150, registered: 147, attended: 142 },
      { event: 'Høstkonferanse', capacity: 200, registered: 189, attended: 180 },
      { event: 'Workshop AI', capacity: 50, registered: 50, attended: 48 },
      { event: 'Nettverkskveld', capacity: 80, registered: 65, attended: 62 }
    ],
    newsletter: {
      campaigns: 12,
      totalSent: 14964,
      avgOpenRate: 24.5,
      avgClickRate: 3.2,
      unsubscribeRate: 0.8
    }
  };

  const exportReport = (format) => {
    // Mock export function
    console.log(`Eksporterer rapport som ${format}`);
  };

  const renderOverviewReport = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalContacts || 0}</p>
                <p className="text-sm text-gray-600">Totale brukere</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12% denne måneden
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{eventsData?.total || 0}</p>
                <p className="text-sm text-gray-600">Arrangementer</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +2 siden forrige måned
                </p>
              </div>
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{reportData.newsletter.totalSent}</p>
                <p className="text-sm text-gray-600">E-poster sendt</p>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  <Mail className="w-3 h-3 mr-1" />
                  {reportData.newsletter.campaigns} kampanjer
                </p>
              </div>
              <Mail className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{reportData.newsletter.avgOpenRate}%</p>
                <p className="text-sm text-gray-600">Avg. åpningsrate</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Over bransjesnitt
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Brukervekst</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.userGrowth.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{item.month}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(item.users / 1300) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-12 text-right">
                      {item.users}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Event Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Arrangementstatistikk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.eventAttendance.map((event, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">{event.event}</span>
                    <span className="text-sm text-gray-600">
                      {event.attended}/{event.capacity}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${(event.attended / event.capacity) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Oppmøte: {Math.round((event.attended / event.registered) * 100)}%</span>
                    <span>Kapasitet: {Math.round((event.registered / event.capacity) * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle>Siste aktivitet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Nyhetsbrev sendt</p>
                <p className="text-xs text-gray-500">Månedlig oppdatering sendt til 1,247 abonnenter</p>
              </div>
              <span className="text-xs text-gray-500">2 timer siden</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">15 nye påmeldinger</p>
                <p className="text-xs text-gray-500">Sommerseminar 2025</p>
              </div>
              <span className="text-xs text-gray-500">4 timer siden</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Calendar className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Nytt arrangement opprettet</p>
                <p className="text-xs text-gray-500">Workshop: Digitalisering i praksis</p>
              </div>
              <span className="text-xs text-gray-500">1 dag siden</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Lav påmeldingsrate</p>
                <p className="text-xs text-gray-500">Høstkonferanse har kun 45% påmelding</p>
              </div>
              <span className="text-xs text-gray-500">2 dager siden</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderEventsReport = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Arrangementrapport</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Arrangement</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Dato</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Kapasitet</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Påmeldt</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Deltok</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Oppmøte %</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reportData.eventAttendance.map((event, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{event.event}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">15. juni 2025</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{event.capacity}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{event.registered}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{event.attended}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {Math.round((event.attended / event.registered) * 100)}%
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="success">Gjennomført</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderUsersReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">1,247</p>
                <p className="text-sm text-gray-600">Totale brukere</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">1,189</p>
                <p className="text-sm text-gray-600">Aktive brukere</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">58</p>
                <p className="text-sm text-gray-600">Inaktive brukere</p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Brukervekst over tid</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reportData.userGrowth.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{item.month} 2025</span>
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                      style={{ width: `${(item.users / 1300) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-16 text-right">
                    {item.users}
                  </span>
                  {index > 0 && (
                    <span className={`text-xs w-12 text-right ${
                      item.users > reportData.userGrowth[index-1].users ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {item.users > reportData.userGrowth[index-1].users ? '+' : ''}
                      {item.users - reportData.userGrowth[index-1].users}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderNewsletterReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{reportData.newsletter.campaigns}</p>
                <p className="text-sm text-gray-600">Kampanjer</p>
              </div>
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{reportData.newsletter.totalSent.toLocaleString()}</p>
                <p className="text-sm text-gray-600">E-poster sendt</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{reportData.newsletter.avgOpenRate}%</p>
                <p className="text-sm text-gray-600">Åpningsrate</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{reportData.newsletter.avgClickRate}%</p>
                <p className="text-sm text-gray-600">Klikkrate</p>
              </div>
              <Target className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nyhetsbrev ytelse</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Gjennomsnittlig åpningsrate</p>
                <p className="text-sm text-gray-600">Sammenlignet med bransjesnitt (22%)</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">{reportData.newsletter.avgOpenRate}%</p>
                <p className="text-sm text-green-600">+2.5% over snitt</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Gjennomsnittlig klikkrate</p>
                <p className="text-sm text-gray-600">Sammenlignet med bransjesnitt (2.8%)</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">{reportData.newsletter.avgClickRate}%</p>
                <p className="text-sm text-green-600">+0.4% over snitt</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Avmeldingsrate</p>
                <p className="text-sm text-gray-600">Månedlig gjennomsnitt</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">{reportData.newsletter.unsubscribeRate}%</p>
                <p className="text-sm text-green-600">Meget lav</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderReportContent = () => {
    switch (selectedReport) {
      case 'events':
        return renderEventsReport();
      case 'users':
        return renderUsersReport();
      case 'newsletter':
        return renderNewsletterReport();
      default:
        return renderOverviewReport();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rapporter</h1>
          <p className="text-gray-600">Detaljert analyse og statistikk</p>
        </div>
        <div className="flex space-x-2">
          <select
            className="h-10 px-3 border border-gray-300 rounded-md"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="7">Siste 7 dager</option>
            <option value="30">Siste 30 dager</option>
            <option value="90">Siste 3 måneder</option>
            <option value="365">Siste år</option>
          </select>
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Oppdater
          </Button>
          <Button variant="outline" onClick={() => exportReport('pdf')}>
            <Download className="w-4 h-4 mr-2" />
            Eksporter
          </Button>
        </div>
      </div>

      {/* Report Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex space-x-1">
            <Button
              variant={selectedReport === 'overview' ? 'default' : 'ghost'}
              onClick={() => setSelectedReport('overview')}
              size="sm"
            >
              <Activity className="w-4 h-4 mr-2" />
              Oversikt
            </Button>
            <Button
              variant={selectedReport === 'events' ? 'default' : 'ghost'}
              onClick={() => setSelectedReport('events')}
              size="sm"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Arrangementer
            </Button>
            <Button
              variant={selectedReport === 'users' ? 'default' : 'ghost'}
              onClick={() => setSelectedReport('users')}
              size="sm"
            >
              <Users className="w-4 h-4 mr-2" />
              Brukere
            </Button>
            <Button
              variant={selectedReport === 'newsletter' ? 'default' : 'ghost'}
              onClick={() => setSelectedReport('newsletter')}
              size="sm"
            >
              <Mail className="w-4 h-4 mr-2" />
              Nyhetsbrev
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Content */}
      {renderReportContent()}
    </div>
  );
};

export default AdminReports;