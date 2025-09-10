import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Settings,
  User,
  Bell,
  Shield,
  Globe,
  Mail,
  Database,
  Palette,
  Save,
  RefreshCw,
  Lock,
  Key,
  Users,
  CheckCircle,
  AlertTriangle,
  Info,
  Upload,
  Download
} from 'lucide-react';
import { 
  useAuthStore,
  Card, 
  CardHeader, 
  CardContent, 
  CardTitle, 
  Button, 
  Input, 
  Label, 
  Badge 
} from './main.jsx';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      siteName: 'EventHub',
      siteDescription: 'Profesjonelle arrangementer og events',
      contactEmail: 'kontakt@eventhub.no',
      supportEmail: 'support@eventhub.no',
      timezone: 'Europe/Oslo',
      language: 'nb-NO'
    },
    notifications: {
      emailNotifications: true,
      eventReminders: true,
      newsletterUpdates: true,
      systemAlerts: true,
      marketingEmails: false
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordMinLength: 8,
      requireSpecialChars: true,
      accountLockoutAttempts: 5
    },
    integrations: {
      googleAnalytics: '',
      facebookPixel: '',
      mailchimpApiKey: '',
      slackWebhook: ''
    },
    appearance: {
      primaryColor: '#3b82f6',
      secondaryColor: '#6b7280',
      darkMode: false,
      compactMode: false
    }
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const saveSettings = async (category, data) => {
    setIsSaving(true);
    // Mock save function
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSettings(prev => ({
      ...prev,
      [category]: { ...prev[category], ...data }
    }));
    setIsSaving(false);
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Grunnleggende innstillinger</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="siteName">Nettstedsnavn</Label>
            <Input
              id="siteName"
              value={settings.general.siteName}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                general: { ...prev.general, siteName: e.target.value }
              }))}
            />
          </div>
          
          <div>
            <Label htmlFor="siteDescription">Beskrivelse</Label>
            <Input
              id="siteDescription"
              value={settings.general.siteDescription}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                general: { ...prev.general, siteDescription: e.target.value }
              }))}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contactEmail">Kontakt e-post</Label>
              <Input
                id="contactEmail"
                type="email"
                value={settings.general.contactEmail}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  general: { ...prev.general, contactEmail: e.target.value }
                }))}
              />
            </div>
            <div>
              <Label htmlFor="supportEmail">Support e-post</Label>
              <Input
                id="supportEmail"
                type="email"
                value={settings.general.supportEmail}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  general: { ...prev.general, supportEmail: e.target.value }
                }))}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="timezone">Tidssone</Label>
              <select
                id="timezone"
                className="w-full h-10 px-3 border border-gray-300 rounded-md"
                value={settings.general.timezone}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  general: { ...prev.general, timezone: e.target.value }
                }))}
              >
                <option value="Europe/Oslo">Europa/Oslo</option>
                <option value="Europe/Stockholm">Europa/Stockholm</option>
                <option value="Europe/Copenhagen">Europa/København</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
            <div>
              <Label htmlFor="language">Språk</Label>
              <select
                id="language"
                className="w-full h-10 px-3 border border-gray-300 rounded-md"
                value={settings.general.language}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  general: { ...prev.general, language: e.target.value }
                }))}
              >
                <option value="nb-NO">Norsk (Bokmål)</option>
                <option value="nn-NO">Norsk (Nynorsk)</option>
                <option value="en-US">English</option>
                <option value="sv-SE">Svenska</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={() => saveSettings('general', settings.general)} disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Lagrer...' : 'Lagre innstillinger'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Varslingsinnstillinger</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>E-postvarsler</Label>
                <p className="text-sm text-gray-600">Motta varsler på e-post</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.emailNotifications}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, emailNotifications: e.target.checked }
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Arrangementpåminnelser</Label>
                <p className="text-sm text-gray-600">Automatiske påminnelser før arrangementer</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.eventReminders}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, eventReminders: e.target.checked }
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Nyhetsbrevoppdateringer</Label>
                <p className="text-sm text-gray-600">Varsler om nyhetsbrevstatistikk</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.newsletterUpdates}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, newsletterUpdates: e.target.checked }
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Systemvarsler</Label>
                <p className="text-sm text-gray-600">Kritiske systemoppdateringer</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.systemAlerts}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, systemAlerts: e.target.checked }
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={() => saveSettings('notifications', settings.notifications)} disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Lagrer...' : 'Lagre innstillinger'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sikkerhetsinnstillinger</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
              <div>
                <p className="font-medium text-yellow-800">To-faktor autentisering</p>
                <p className="text-sm text-yellow-700">Anbefalt for økt sikkerhet</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Shield className="w-4 h-4 mr-2" />
              Aktiver
            </Button>
          </div>
          
          <div>
            <Label htmlFor="sessionTimeout">Sesjon timeout (minutter)</Label>
            <Input
              id="sessionTimeout"
              type="number"
              min="5"
              max="480"
              value={settings.security.sessionTimeout}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                security: { ...prev.security, sessionTimeout: parseInt(e.target.value) }
              }))}
            />
          </div>
          
          <div>
            <Label htmlFor="passwordMinLength">Minimum passordlengde</Label>
            <Input
              id="passwordMinLength"
              type="number"
              min="6"
              max="32"
              value={settings.security.passwordMinLength}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                security: { ...prev.security, passwordMinLength: parseInt(e.target.value) }
              }))}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Krev spesialtegn i passord</Label>
              <p className="text-sm text-gray-600">Øker passordsikkerhet</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.security.requireSpecialChars}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  security: { ...prev.security, requireSpecialChars: e.target.checked }
                }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div>
            <Label htmlFor="lockoutAttempts">Låsing etter feilede innloggingsforsøk</Label>
            <Input
              id="lockoutAttempts"
              type="number"
              min="3"
              max="10"
              value={settings.security.accountLockoutAttempts}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                security: { ...prev.security, accountLockoutAttempts: parseInt(e.target.value) }
              }))}
            />
          </div>
          
          <div className="flex justify-end">
            <Button onClick={() => saveSettings('security', settings.security)} disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Lagrer...' : 'Lagre innstillinger'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderIntegrationSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Integrasjoner</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="googleAnalytics">Google Analytics ID</Label>
            <Input
              id="googleAnalytics"
              placeholder="GA-XXXXXXXXX-X"
              value={settings.integrations.googleAnalytics}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                integrations: { ...prev.integrations, googleAnalytics: e.target.value }
              }))}
            />
          </div>
          
          <div>
            <Label htmlFor="facebookPixel">Facebook Pixel ID</Label>
            <Input
              id="facebookPixel"
              placeholder="123456789012345"
              value={settings.integrations.facebookPixel}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                integrations: { ...prev.integrations, facebookPixel: e.target.value }
              }))}
            />
          </div>
          
          <div>
            <Label htmlFor="mailchimpApiKey">Mailchimp API-nøkkel</Label>
            <Input
              id="mailchimpApiKey"
              placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-us1"
              type="password"
              value={settings.integrations.mailchimpApiKey}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                integrations: { ...prev.integrations, mailchimpApiKey: e.target.value }
              }))}
            />
          </div>
          
          <div>
            <Label htmlFor="slackWebhook">Slack Webhook URL</Label>
            <Input
              id="slackWebhook"
              placeholder="https://hooks.slack.com/services/..."
              value={settings.integrations.slackWebhook}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                integrations: { ...prev.integrations, slackWebhook: e.target.value }
              }))}
            />
          </div>
          
          <div className="flex justify-end">
            <Button onClick={() => saveSettings('integrations', settings.integrations)} disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Lagrer...' : 'Lagre innstillinger'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Utseende og tema</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="primaryColor">Primærfarge</Label>
              <div className="flex items-center space-x-3">
                <Input
                  id="primaryColor"
                  type="color"
                  value={settings.appearance.primaryColor}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    appearance: { ...prev.appearance, primaryColor: e.target.value }
                  }))}
                  className="w-16 h-10"
                />
                <Input
                  value={settings.appearance.primaryColor}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    appearance: { ...prev.appearance, primaryColor: e.target.value }
                  }))}
                  className="flex-1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="secondaryColor">Sekundærfarge</Label>
              <div className="flex items-center space-x-3">
                <Input
                  id="secondaryColor"
                  type="color"
                  value={settings.appearance.secondaryColor}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    appearance: { ...prev.appearance, secondaryColor: e.target.value }
                  }))}
                  className="w-16 h-10"
                />
                <Input
                  value={settings.appearance.secondaryColor}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    appearance: { ...prev.appearance, secondaryColor: e.target.value }
                  }))}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Mørk modus</Label>
              <p className="text-sm text-gray-600">Bruk mørkt tema</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.appearance.darkMode}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  appearance: { ...prev.appearance, darkMode: e.target.checked }
                }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Kompakt modus</Label>
              <p className="text-sm text-gray-600">Redusert avstand mellom elementer</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.appearance.compactMode}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  appearance: { ...prev.appearance, compactMode: e.target.checked }
                }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={() => saveSettings('appearance', settings.appearance)} disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Lagrer...' : 'Lagre innstillinger'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderBackupSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Backup og gjenoppretting</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center">
              <Info className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <p className="font-medium text-blue-800">Automatisk backup</p>
                <p className="text-sm text-blue-700">Daglig backup kjøres kl. 03:00</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Last ned backup
            </Button>
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Last opp backup
            </Button>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Siste backups</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">backup_2025_01_10.zip</p>
                  <p className="text-xs text-gray-600">10. januar 2025, 03:00</p>
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">backup_2025_01_09.zip</p>
                  <p className="text-xs text-gray-600">9. januar 2025, 03:00</p>
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const tabs = [
    { id: 'general', label: 'Generelt', icon: Settings },
    { id: 'notifications', label: 'Varsler', icon: Bell },
    { id: 'security', label: 'Sikkerhet', icon: Shield },
    { id: 'integrations', label: 'Integrasjoner', icon: Globe },
    { id: 'appearance', label: 'Utseende', icon: Palette },
    { id: 'backup', label: 'Backup', icon: Database }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'notifications':
        return renderNotificationSettings();
      case 'security':
        return renderSecuritySettings();
      case 'integrations':
        return renderIntegrationSettings();
      case 'appearance':
        return renderAppearanceSettings();
      case 'backup':
        return renderBackupSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Innstillinger</h1>
          <p className="text-gray-600">Administrer systemkonfigurasjon og preferanser</p>
        </div>
        <Badge variant="success">
          <CheckCircle className="w-3 h-3 mr-1" />
          System operativt
        </Badge>
      </div>

      <div className="flex space-x-6">
        {/* Sidebar */}
        <div className="w-64 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-3" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;