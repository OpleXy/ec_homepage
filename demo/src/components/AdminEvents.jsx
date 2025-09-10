import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Users,
  Clock,
  X
} from 'lucide-react';
import { 
  api, 
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

const AdminEvents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('');
  
  const queryClient = useQueryClient();
  const { data: eventsData, isLoading } = useQuery({
    queryKey: ['events', searchTerm, categoryFilter],
    queryFn: () => api.events.getAll({ search: searchTerm, category: categoryFilter })
  });

  const { user } = useAuthStore();
  const canEdit = user?.role === 'admin' || user?.role === 'editor';

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: api.events.delete,
    onSuccess: () => {
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

  // Get unique categories for filter
  const categories = [...new Set(eventsData?.items?.map(event => event.category) || [])];

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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Arrangementer</h1>
          <p className="text-gray-600">Administrer og overvåk alle arrangementer</p>
        </div>
        {canEdit && (
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nytt arrangement
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">{eventsData?.total || 0}</p>
                <p className="text-sm text-gray-600">Totale arrangementer</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600 ml-auto" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {eventsData?.items?.filter(e => e.status === 'open').length || 0}
                </p>
                <p className="text-sm text-gray-600">Åpne arrangementer</p>
              </div>
              <Users className="w-8 h-8 text-green-600 ml-auto" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {eventsData?.items?.reduce((sum, e) => sum + e.registrations, 0) || 0}
                </p>
                <p className="text-sm text-gray-600">Totale påmeldinger</p>
              </div>
              <Users className="w-8 h-8 text-purple-600 ml-auto" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
                <p className="text-sm text-gray-600">Kategorier</p>
              </div>
              <Filter className="w-8 h-8 text-orange-600 ml-auto" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Søk arrangementer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
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
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Arrangement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dato & Tid
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Påmeldinger
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
                          to={`/admin/arrangementer/${event.id}`}
                          className="text-sm font-medium text-indigo-600 hover:text-indigo-900"
                        >
                          {event.title}
                        </Link>
                        <p className="text-sm text-gray-500">{event.category}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        <div>
                          <div>{new Date(event.startAt).toLocaleDateString('nb-NO')}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(event.startAt).toLocaleTimeString('nb-NO', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })} - {new Date(event.endAt).toLocaleTimeString('nb-NO', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        <div>
                          <div>{event.location.venue}</div>
                          <div className="text-xs text-gray-500">{event.location.city}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={event.status === 'open' ? 'success' : 'default'}>
                        {event.status === 'open' ? 'Åpen' : event.status === 'closed' ? 'Stengt' : 'Avlyst'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-900">
                            {event.registrations}/{event.capacity}
                          </div>
                          <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className="bg-indigo-600 h-2 rounded-full" 
                              style={{ width: `${Math.min((event.registrations / event.capacity) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link to={`/admin/arrangementer/${event.id}`}>
                          <Button variant="ghost" size="sm">
                            <Clock className="w-4 h-4" />
                          </Button>
                        </Link>
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
          
          {eventsData?.items?.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg text-gray-600">Ingen arrangementer funnet</p>
              <p className="text-gray-500">Opprett ditt første arrangement for å komme i gang</p>
            </div>
          )}
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
    status: 'open'
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
        status: event.status || 'open'
      });
    } else {
      // Reset form for new event
      setFormData({
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
        status: 'open'
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

export default AdminEvents;