import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Mail,
  Send,
  Edit,
  Trash2,
  Eye,
  Copy,
  Users,
  Calendar,
  Clock,
  BarChart3,
  Plus,
  Search,
  Filter,
  X,
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
  Input, 
  Label, 
  Badge 
} from './main.jsx';

const AdminNewsletter = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [previewCampaign, setPreviewCampaign] = useState(null);
  
  const queryClient = useQueryClient();
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['newsletter-campaigns'],
    queryFn: api.newsletter.getCampaigns
  });

  const { data: stats } = useQuery({
    queryKey: ['newsletter-stats'],
    queryFn: api.dashboard.getStats
  });

  const sendMutation = useMutation({
    mutationFn: (campaignId) => {
      // Mock send function
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({ success: true, sent: 1250 });
        }, 2000);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsletter-campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['newsletter-stats'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (campaignId) => {
      // Mock delete function
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({ success: true });
        }, 500);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsletter-campaigns'] });
    }
  });

  const handleSend = async (campaignId) => {
    if (window.confirm('Er du sikker på at du vil sende dette nyhetsbrevet?')) {
      try {
        await sendMutation.mutateAsync(campaignId);
      } catch (error) {
        console.error('Failed to send campaign:', error);
      }
    }
  };

  const handleDelete = async (campaignId) => {
    if (window.confirm('Er du sikker på at du vil slette denne kampanjen?')) {
      try {
        await deleteMutation.mutateAsync(campaignId);
      } catch (error) {
        console.error('Failed to delete campaign:', error);
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'sent':
        return <Badge variant="success">Sendt</Badge>;
      case 'draft':
        return <Badge>Utkast</Badge>;
      case 'scheduled':
        return <Badge variant="warning">Planlagt</Badge>;
      case 'sending':
        return <Badge variant="warning">Sender...</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Nyhetsbrev</h1>
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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nyhetsbrev</h1>
          <p className="text-gray-600">Administrer nyhetsbrevkampanjer og statistikk</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Ny kampanje
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats?.newsletterStats?.sent || 0}</p>
                <p className="text-sm text-gray-600">Sendte e-poster</p>
              </div>
              <Mail className="w-8 h-8 text-blue-600 ml-auto" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats?.newsletterStats?.openRate || 0}%</p>
                <p className="text-sm text-gray-600">Åpningsrate</p>
              </div>
              <Eye className="w-8 h-8 text-green-600 ml-auto" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats?.newsletterStats?.clickRate || 0}%</p>
                <p className="text-sm text-gray-600">Klikkrate</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-600 ml-auto" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">1,247</p>
                <p className="text-sm text-gray-600">Abonnenter</p>
              </div>
              <Users className="w-8 h-8 text-orange-600 ml-auto" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Kampanjer</CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kampanje
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Målgruppe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Planlagt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statistikk
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Handlinger
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {campaigns?.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                        <div className="text-sm text-gray-500">{campaign.subject}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(campaign.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900">
                        <Users className="w-4 h-4 mr-2 text-gray-400" />
                        <span>Alle medlemmer</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {campaign.scheduledAt ? (
                          <>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                              {new Date(campaign.scheduledAt).toLocaleDateString('nb-NO')}
                            </div>
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock className="w-3 h-3 mr-1" />
                              {new Date(campaign.scheduledAt).toLocaleTimeString('nb-NO', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </div>
                          </>
                        ) : (
                          <span className="text-gray-500">Ikke planlagt</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {campaign.status === 'sent' ? (
                        <div className="text-sm">
                          <div className="text-gray-900">1,247 sendt</div>
                          <div className="text-xs text-gray-500">
                            {stats?.newsletterStats?.openRate}% åpnet • {stats?.newsletterStats?.clickRate}% klikket
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setPreviewCampaign(campaign)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setEditingCampaign(campaign)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        {campaign.status === 'draft' && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleSend(campaign.id)}
                            disabled={sendMutation.isPending}
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(campaign.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {campaigns?.length === 0 && (
            <div className="text-center py-12">
              <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg text-gray-600">Ingen kampanjer opprettet ennå</p>
              <p className="text-gray-500">Opprett din første nyhetsbrevkampanje for å komme i gang</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      {(showCreateModal || editingCampaign) && (
        <CampaignModal
          campaign={editingCampaign}
          isOpen={showCreateModal || !!editingCampaign}
          onClose={() => {
            setShowCreateModal(false);
            setEditingCampaign(null);
          }}
          onSave={() => {
            queryClient.invalidateQueries({ queryKey: ['newsletter-campaigns'] });
          }}
        />
      )}

      {previewCampaign && (
        <PreviewModal
          campaign={previewCampaign}
          isOpen={!!previewCampaign}
          onClose={() => setPreviewCampaign(null)}
        />
      )}
    </div>
  );
};

// Campaign Create/Edit Modal
const CampaignModal = ({ campaign, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    content: '',
    scheduledAt: '',
    audienceId: 'all'
  });

  React.useEffect(() => {
    if (campaign) {
      setFormData({
        name: campaign.name || '',
        subject: campaign.subject || '',
        content: campaign.content || '',
        scheduledAt: campaign.scheduledAt ? campaign.scheduledAt.slice(0, 16) : '',
        audienceId: campaign.audienceId || 'all'
      });
    } else {
      setFormData({
        name: '',
        subject: '',
        content: '',
        scheduledAt: '',
        audienceId: 'all'
      });
    }
  }, [campaign]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mock save function
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSave();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {campaign ? 'Rediger kampanje' : 'Ny kampanje'}
          </h2>
          <Button variant="ghost" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Kampanjenavn *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Månedlig nyhetsbrev - Januar"
              required
            />
          </div>

          <div>
            <Label htmlFor="subject">Emne *</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="Nyheter og arrangementer denne måneden"
              required
            />
          </div>

          <div>
            <Label htmlFor="content">Innhold *</Label>
            <textarea
              id="content"
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Skriv innholdet i nyhetsbrevet her..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="scheduledAt">Planlagt sending</Label>
              <Input
                id="scheduledAt"
                type="datetime-local"
                value={formData.scheduledAt}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduledAt: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="audienceId">Målgruppe *</Label>
              <select
                id="audienceId"
                className="w-full h-10 px-3 border border-gray-300 rounded-md"
                value={formData.audienceId}
                onChange={(e) => setFormData(prev => ({ ...prev, audienceId: e.target.value }))}
              >
                <option value="all">Alle medlemmer</option>
                <option value="active">Aktive medlemmer</option>
                <option value="premium">Premium medlemmer</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Avbryt
            </Button>
            <Button type="submit">
              {campaign ? 'Oppdater' : 'Opprett'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Preview Modal
const PreviewModal = ({ campaign, isOpen, onClose }) => {
  if (!isOpen || !campaign) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Forhåndsvisning</h2>
          <Button variant="ghost" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="text-sm text-gray-600 mb-2">Fra: EventHub &lt;noreply@eventhub.no&gt;</div>
            <div className="text-sm text-gray-600 mb-2">Til: Alle medlemmer</div>
            <div className="text-lg font-semibold text-gray-900">{campaign.subject}</div>
          </div>

          <div className="border rounded-lg p-6 bg-white">
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap">{campaign.content || 'Ingen innhold lagt til ennå.'}</div>
            </div>
          </div>

          <div className="text-xs text-gray-500 p-4 bg-gray-50 rounded-lg">
            <p>Dette er en forhåndsvisning av hvordan nyhetsbrevet vil se ut for mottakerne.</p>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>Lukk</Button>
        </div>
      </div>
    </div>
  );
};

export default AdminNewsletter;