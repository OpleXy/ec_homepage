import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Activity,
  Clock,
  MapPin,
  User,
  X,
  Save
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

const AdminActivities = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  
  const queryClient = useQueryClient();
  const { data: activitiesData, isLoading } = useQuery({
    queryKey: ['activities', searchTerm, categoryFilter, statusFilter],
    queryFn: () => api.activities.getAll({ 
      search: searchTerm, 
      category: categoryFilter,
      status: statusFilter || 'active'
    })
  });

  const { user } = useAuthStore();
  const canEdit = user?.role === 'admin' || user?.role === 'editor';

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: api.activities.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    }
  });

  const handleDelete = (activityId) => {
    if (window.confirm('Er du sikker på at du vil slette denne aktiviteten?')) {
      deleteMutation.mutate(activityId);
    }
  };

  const handleEdit = (activity) => {
    setEditingActivity(activity);
    setShowCreateModal(true);
  };

  const handleCreate = () => {
    setEditingActivity(null);
    setShowCreateModal(true);
  };

  const categories = ['Helse & Velvære', 'Kultur', 'Teknologi', 'Sport', 'Utdanning', 'Sosialt'];
  const statuses = [
    { value: 'active', label: 'Aktiv', color: 'bg-green-100 text-green-800' },
    { value: 'inactive', label: 'Inaktiv', color: 'bg-gray-100 text-gray-800' },
    { value: 'archived', label: 'Arkivert', color: 'bg-red-100 text-red-800' }
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Aktiviteter</h1>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent>
                <div className="h-24 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Aktiviteter</h1>
          <p className="text-gray-600">Administrer foreningen sine aktiviteter og tilbud</p>
        </div>
        {canEdit && (
          <Button onClick={handleCreate} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Ny aktivitet
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Søk aktiviteter..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Alle kategorier</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Alle statuser</option>
                {statuses.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Totale aktiviteter</p>
                <p className="text-2xl font-bold text-gray-900">{activitiesData?.total || 0}</p>
              </div>
              <Activity className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Aktive aktiviteter</p>
                <p className="text-2xl font-bold text-gray-900">
                  {activitiesData?.items?.filter(a => a.status === 'active').length || 0}
                </p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Kategorier</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(activitiesData?.items?.map(a => a.category)).size || 0}
                </p>
              </div>
              <Filter className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activities List */}
      <div className="grid gap-6">
        {activitiesData?.items?.map((activity) => (
          <Card key={activity.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-48 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Activity className="w-8 h-8 text-gray-400" />
                </div>
                
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{activity.title}</h3>
                      <p className="text-gray-600">{activity.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={statuses.find(s => s.value === activity.status)?.color}>
                        {statuses.find(s => s.value === activity.status)?.label}
                      </Badge>
                      <Badge variant="outline">{activity.category}</Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{activity.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{activity.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{activity.instructor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      <span>{activity.level}</span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <strong>Tidspunkt:</strong> {activity.schedule}
                  </div>
                  
                  {canEdit && (
                    <div className="flex items-center gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEdit(activity)}
                        className="flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Rediger
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDelete(activity.id)}
                        className="flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Slett
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {activitiesData?.items?.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Ingen aktiviteter funnet</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || categoryFilter || statusFilter 
                ? 'Prøv å justere søkekriteriene dine.'
                : 'Kom i gang ved å opprette din første aktivitet.'
              }
            </p>
            {canEdit && !searchTerm && !categoryFilter && !statusFilter && (
              <Button onClick={handleCreate} className="flex items-center gap-2 mx-auto">
                <Plus className="w-4 h-4" />
                Opprett aktivitet
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <ActivityModal
          activity={editingActivity}
          onClose={() => {
            setShowCreateModal(false);
            setEditingActivity(null);
          }}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['activities'] });
            setShowCreateModal(false);
            setEditingActivity(null);
          }}
        />
      )}
    </div>
  );
};

// Activity Modal Component
const ActivityModal = ({ activity, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: activity?.title || '',
    description: activity?.description || '',
    category: activity?.category || 'Helse & Velvære',
    duration: activity?.duration || '',
    level: activity?.level || '',
    instructor: activity?.instructor || '',
    schedule: activity?.schedule || '',
    location: activity?.location || '',
    status: activity?.status || 'active'
  });

  const createMutation = useMutation({
    mutationFn: api.activities.create,
    onSuccess: onSuccess
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.activities.update(id, data),
    onSuccess: onSuccess
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activity) {
      updateMutation.mutate({ id: activity.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const categories = ['Helse & Velvære', 'Kultur', 'Teknologi', 'Sport', 'Utdanning', 'Sosialt'];
  const levels = ['Nybegynner', 'Lett', 'Middels', 'Avansert', 'Alle nivåer'];
  const statuses = ['active', 'inactive'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">
            {activity ? 'Rediger aktivitet' : 'Ny aktivitet'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Label htmlFor="title">Tittel *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Beskrivelse *</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows="3"
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Kategori *</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="duration">Varighet</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                placeholder="f.eks. 60 minutter"
              />
            </div>

            <div>
              <Label htmlFor="level">Nivå</Label>
              <select
                id="level"
                value={formData.level}
                onChange={(e) => setFormData({...formData, level: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Velg nivå</option>
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="instructor">Instruktør/Ansvarlig</Label>
              <Input
                id="instructor"
                value={formData.instructor}
                onChange={(e) => setFormData({...formData, instructor: e.target.value})}
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="schedule">Tidspunkt</Label>
              <Input
                id="schedule"
                value={formData.schedule}
                onChange={(e) => setFormData({...formData, schedule: e.target.value})}
                placeholder="f.eks. Mandag, Onsdag, Fredag 07:00-08:00"
              />
            </div>

            <div>
              <Label htmlFor="location">Sted</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="active">Aktiv</option>
                <option value="inactive">Inaktiv</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Avbryt
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {createMutation.isPending || updateMutation.isPending ? 'Lagrer...' : 'Lagre'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminActivities;