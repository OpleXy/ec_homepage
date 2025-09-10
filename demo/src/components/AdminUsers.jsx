import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Users,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  Shield,
  UserCheck,
  X,
  Eye,
  Download
} from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardTitle, 
  Button, 
  Input, 
  Label, 
  Badge 
} from './main.jsx';

// Mock user data and API
const mockUsers = [
  {
    id: 'user_1',
    firstName: 'Anna',
    lastName: 'Hansen',
    email: 'anna.hansen@example.com',
    phone: '+47 123 45 678',
    role: 'admin',
    status: 'active',
    joinedAt: '2024-01-15T10:00:00Z',
    lastLoginAt: '2025-01-10T14:30:00Z',
    eventsAttended: 12,
    avatar: null
  },
  {
    id: 'user_2',
    firstName: 'Lars',
    lastName: 'Olsen',
    email: 'lars.olsen@example.com',
    phone: '+47 987 65 432',
    role: 'member',
    status: 'active',
    joinedAt: '2024-03-20T09:15:00Z',
    lastLoginAt: '2025-01-09T11:20:00Z',
    eventsAttended: 8,
    avatar: null
  },
  {
    id: 'user_3',
    firstName: 'Kari',
    lastName: 'Nordahl',
    email: 'kari.nordahl@example.com',
    phone: '+47 555 12 345',
    role: 'editor',
    status: 'active',
    joinedAt: '2024-02-10T16:45:00Z',
    lastLoginAt: '2025-01-08T09:10:00Z',
    eventsAttended: 15,
    avatar: null
  },
  {
    id: 'user_4',
    firstName: 'Erik',
    lastName: 'Svendsen',
    email: 'erik.svendsen@example.com',
    phone: '+47 777 88 999',
    role: 'member',
    status: 'inactive',
    joinedAt: '2023-11-05T12:30:00Z',
    lastLoginAt: '2024-12-20T15:45:00Z',
    eventsAttended: 3,
    avatar: null
  }
];

const usersApi = {
  getAll: async (params = {}) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    let filteredUsers = [...mockUsers];
    
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.firstName.toLowerCase().includes(searchLower) ||
        user.lastName.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    }
    
    if (params.role) {
      filteredUsers = filteredUsers.filter(user => user.role === params.role);
    }
    
    if (params.status) {
      filteredUsers = filteredUsers.filter(user => user.status === params.status);
    }
    
    return {
      items: filteredUsers,
      total: filteredUsers.length
    };
  },
  
  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockUsers.find(user => user.id === id);
  },
  
  create: async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const newUser = {
      id: 'user_' + Math.random().toString(36).substr(2, 9),
      ...userData,
      joinedAt: new Date().toISOString(),
      lastLoginAt: null,
      eventsAttended: 0
    };
    mockUsers.push(newUser);
    return newUser;
  },
  
  update: async (id, userData) => {
    await new Promise(resolve => setTimeout(resolve, 700));
    const userIndex = mockUsers.findIndex(user => user.id === id);
    if (userIndex === -1) throw new Error('User not found');
    
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...userData };
    return mockUsers[userIndex];
  },
  
  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const userIndex = mockUsers.findIndex(user => user.id === id);
    if (userIndex === -1) throw new Error('User not found');
    
    const deletedUser = mockUsers[userIndex];
    mockUsers.splice(userIndex, 1);
    return deletedUser;
  }
};

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  
  const queryClient = useQueryClient();
  const { data: usersData, isLoading } = useQuery({
    queryKey: ['users', searchTerm, roleFilter, statusFilter],
    queryFn: () => usersApi.getAll({ search: searchTerm, role: roleFilter, status: statusFilter })
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: usersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });

  const handleDelete = async (userId) => {
    if (window.confirm('Er du sikker på at du vil slette denne brukeren?')) {
      try {
        await deleteMutation.mutateAsync(userId);
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return <Badge variant="destructive">Admin</Badge>;
      case 'editor':
        return <Badge>Editor</Badge>;
      case 'member':
        return <Badge variant="success">Medlem</Badge>;
      default:
        return <Badge>{role}</Badge>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Aktiv</Badge>;
      case 'inactive':
        return <Badge>Inaktiv</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspendert</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Brukere</h1>
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
          <h1 className="text-2xl font-bold text-gray-900">Brukere</h1>
          <p className="text-gray-600">Administrer brukere og tilganger</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Eksporter
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Ny bruker
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">{usersData?.total || 0}</p>
                <p className="text-sm text-gray-600">Totale brukere</p>
              </div>
              <Users className="w-8 h-8 text-blue-600 ml-auto" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {usersData?.items?.filter(u => u.status === 'active').length || 0}
                </p>
                <p className="text-sm text-gray-600">Aktive brukere</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-600 ml-auto" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {usersData?.items?.filter(u => u.role === 'admin').length || 0}
                </p>
                <p className="text-sm text-gray-600">Administratorer</p>
              </div>
              <Shield className="w-8 h-8 text-purple-600 ml-auto" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {usersData?.items?.filter(u => u.role === 'member').length || 0}
                </p>
                <p className="text-sm text-gray-600">Medlemmer</p>
              </div>
              <Users className="w-8 h-8 text-orange-600 ml-auto" />
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
                placeholder="Søk brukere..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="sm:w-40">
              <select
                className="w-full h-10 px-3 border border-gray-300 rounded-md"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="">Alle roller</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="member">Medlem</option>
              </select>
            </div>
            <div className="sm:w-40">
              <select
                className="w-full h-10 px-3 border border-gray-300 rounded-md"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Alle statuser</option>
                <option value="active">Aktiv</option>
                <option value="inactive">Inaktiv</option>
                <option value="suspended">Suspendert</option>
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
                    Bruker
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kontakt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rolle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aktivitet
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Handlinger
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {usersData?.items?.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center mb-1">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          {user.email}
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          {user.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center mb-1">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          {user.eventsAttended} arrangementer
                        </div>
                        <div className="text-xs text-gray-500">
                          Sist pålogget: {user.lastLoginAt ? 
                            new Date(user.lastLoginAt).toLocaleDateString('nb-NO') : 
                            'Aldri'
                          }
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setViewingUser(user)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setEditingUser(user)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(user.id)}
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
          
          {usersData?.items?.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg text-gray-600">Ingen brukere funnet</p>
              <p className="text-gray-500">Opprett din første bruker for å komme i gang</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      {(showCreateModal || editingUser) && (
        <UserModal
          user={editingUser}
          isOpen={showCreateModal || !!editingUser}
          onClose={() => {
            setShowCreateModal(false);
            setEditingUser(null);
          }}
          onSave={() => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
          }}
        />
      )}

      {viewingUser && (
        <UserDetailModal
          user={viewingUser}
          isOpen={!!viewingUser}
          onClose={() => setViewingUser(null)}
        />
      )}
    </div>
  );
};

// User Create/Edit Modal
const UserModal = ({ user, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'member',
    status: 'active'
  });

  const createMutation = useMutation({
    mutationFn: usersApi.create,
    onSuccess: () => {
      onSave();
      onClose();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }) => usersApi.update(id, data),
    onSuccess: () => {
      onSave();
      onClose();
    }
  });

  React.useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'member',
        status: user.status || 'active'
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'member',
        status: 'active'
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (user) {
        await updateMutation.mutateAsync({ id: user.id, ...formData });
      } else {
        await createMutation.mutateAsync(formData);
      }
    } catch (error) {
      console.error('Failed to save user:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {user ? 'Rediger bruker' : 'Ny bruker'}
          </h2>
          <Button variant="ghost" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Fornavn *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Etternavn *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">E-post *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Telefon</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="role">Rolle *</Label>
              <select
                id="role"
                className="w-full h-10 px-3 border border-gray-300 rounded-md"
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              >
                <option value="member">Medlem</option>
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <Label htmlFor="status">Status *</Label>
              <select
                id="status"
                className="w-full h-10 px-3 border border-gray-300 rounded-md"
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="active">Aktiv</option>
                <option value="inactive">Inaktiv</option>
                <option value="suspended">Suspendert</option>
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

// User Detail Modal
const UserDetailModal = ({ user, isOpen, onClose }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Brukerdetaljer</h2>
          <Button variant="ghost" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-gray-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{user.firstName} {user.lastName}</h3>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Rolle</Label>
              <p className="text-sm text-gray-900">{user.role}</p>
            </div>
            <div>
              <Label>Status</Label>
              <p className="text-sm text-gray-900">{user.status}</p>
            </div>
            <div>
              <Label>Telefon</Label>
              <p className="text-sm text-gray-900">{user.phone || 'Ikke oppgitt'}</p>
            </div>
            <div>
              <Label>Arrangementer deltatt</Label>
              <p className="text-sm text-gray-900">{user.eventsAttended}</p>
            </div>
            <div>
              <Label>Medlem siden</Label>
              <p className="text-sm text-gray-900">
                {new Date(user.joinedAt).toLocaleDateString('nb-NO')}
              </p>
            </div>
            <div>
              <Label>Sist pålogget</Label>
              <p className="text-sm text-gray-900">
                {user.lastLoginAt ? 
                  new Date(user.lastLoginAt).toLocaleDateString('nb-NO') : 
                  'Aldri'
                }
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>Lukk</Button>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;