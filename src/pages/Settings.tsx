import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalFooter,
  ModalDescription,
} from '@/components/ui/modal';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Shield, Trash2, Users, Settings as SettingsIcon, Globe } from 'lucide-react';
import { format } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  created_at: string;
}

interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'manager' | 'user';
  created_at: string;
}

export default function Settings() {
  const { t, language, setLanguage } = useLanguage();
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  type RoleType = 'admin' | 'manager' | 'user';
  const [selectedRole, setSelectedRole] = useState<RoleType>('user');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const showError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), 3000);
  };

  const { data: profiles, isLoading: profilesLoading } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Profile[];
    },
  });

  const { data: userRoles } = useQuery({
    queryKey: ['user_roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*');
      if (error) throw error;
      return data as UserRole[];
    },
  });

  const createUserMutation = useMutation({
    mutationFn: async ({ email, password, name }: { email: string; password: string; name: string }) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      showSuccess('User created successfully');
      setIsUserDialogOpen(false);
      setNewUserEmail('');
      setNewUserPassword('');
      setNewUserName('');
    },
    onError: (error: Error) => showError(error.message || 'Failed to create user'),
  });

  const assignRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: 'admin' | 'manager' | 'user' }) => {
      await supabase.from('user_roles').delete().eq('user_id', userId);
      const { error } = await supabase.from('user_roles').insert([{ user_id: userId, role }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_roles'] });
      showSuccess('Role assigned successfully');
      setIsRoleDialogOpen(false);
    },
    onError: () => showError('Failed to assign role'),
  });

  const removeRoleMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase.from('user_roles').delete().eq('user_id', userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_roles'] });
      showSuccess('Role removed successfully');
      setIsDeleteDialogOpen(false);
    },
    onError: () => showError('Failed to remove role'),
  });

  const getUserRole = (userId: string) => {
    return userRoles?.find((r) => r.user_id === userId)?.role;
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    createUserMutation.mutate({ email: newUserEmail, password: newUserPassword, name: newUserName });
  };

  const handleAssignRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUserId) {
      assignRoleMutation.mutate({ userId: selectedUserId, role: selectedRole });
    }
  };

  const openRoleDialog = (userId: string) => {
    setSelectedUserId(userId);
    setSelectedRole(getUserRole(userId) || 'user');
    setIsRoleDialogOpen(true);
  };

  const openDeleteDialog = (userId: string) => {
    setSelectedUserId(userId);
    setIsDeleteDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Success/Error Messages */}
        {successMessage && (
          <div className="fixed top-4 right-4 z-50 bg-primary text-primary-foreground px-4 py-3 rounded-lg shadow-lg animate-in fade-in slide-in-from-top-2">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="fixed top-4 right-4 z-50 bg-destructive text-destructive-foreground px-4 py-3 rounded-lg shadow-lg animate-in fade-in slide-in-from-top-2">
            {errorMessage}
          </div>
        )}

        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('settings')}</h1>
          <p className="text-muted-foreground">Manage users, permissions, and preferences</p>
        </div>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="permissions" className="gap-2">
              <Shield className="h-4 w-4" />
              {t('permissions')}
            </TabsTrigger>
            <TabsTrigger value="general" className="gap-2">
              <SettingsIcon className="h-4 w-4" />
              {t('general')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setIsUserDialogOpen(true)} className="hover-loading">
                <UserPlus className="h-4 w-4 mr-2" />
                Create User
              </Button>
            </div>

            <div className="bg-card rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profilesLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        {t('loading')}
                      </TableCell>
                    </TableRow>
                  ) : profiles?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    profiles?.map((profile) => (
                      <TableRow key={profile.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{profile.full_name || 'No name'}</div>
                            <div className="text-sm text-muted-foreground">{profile.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getUserRole(profile.id) ? (
                            <Badge variant="secondary" className="capitalize">
                              {t(getUserRole(profile.id) || '')}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">No role</span>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(profile.created_at), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="icon" variant="ghost" onClick={() => openRoleDialog(profile.id)} className="hover-loading">
                              <Shield className="h-4 w-4" />
                            </Button>
                            {getUserRole(profile.id) && (
                              <Button
                                size="icon"
                                variant="ghost"
                                className="text-destructive hover-loading"
                                onClick={() => openDeleteDialog(profile.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-4">
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold mb-4">Role Permissions</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4 text-sm font-medium text-muted-foreground border-b border-border pb-2">
                  <div>Permission</div>
                  <div className="text-center">{t('admin')}</div>
                  <div className="text-center">{t('manager')}</div>
                  <div className="text-center">{t('user')}</div>
                </div>
                {[
                  { name: 'View Dashboard', admin: true, manager: true, user: false },
                  { name: 'Manage Products', admin: true, manager: true, user: false },
                  { name: 'Manage Categories', admin: true, manager: true, user: false },
                  { name: 'Manage Orders', admin: true, manager: true, user: false },
                  { name: 'Manage Customers', admin: true, manager: false, user: false },
                  { name: 'Manage Users', admin: true, manager: false, user: false },
                  { name: 'Manage Settings', admin: true, manager: false, user: false },
                  { name: 'Send Notifications', admin: true, manager: true, user: false },
                ].map((perm) => (
                  <div key={perm.name} className="grid grid-cols-4 gap-4 py-2 border-b border-border last:border-0">
                    <div className="text-sm">{perm.name}</div>
                    <div className="text-center">
                      <Badge variant={perm.admin ? 'default' : 'outline'} className="text-xs">
                        {perm.admin ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                    <div className="text-center">
                      <Badge variant={perm.manager ? 'default' : 'outline'} className="text-xs">
                        {perm.manager ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                    <div className="text-center">
                      <Badge variant={perm.user ? 'default' : 'outline'} className="text-xs">
                        {perm.user ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="general" className="space-y-4">
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Globe className="h-5 w-5" />
                {t('language')}
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Button
                    variant={language === 'en' ? 'default' : 'outline'}
                    onClick={() => setLanguage('en')}
                    className="hover-loading"
                  >
                    🇺🇸 English (Nunito)
                  </Button>
                  <Button
                    variant={language === 'km' ? 'default' : 'outline'}
                    onClick={() => setLanguage('km')}
                    className="hover-loading"
                  >
                    🇰🇭 ភាសាខ្មែរ (Kantumruy Pro)
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  {language === 'en' 
                    ? 'Select your preferred language. The app will update automatically.'
                    : 'ជ្រើសរើសភាសាដែលអ្នកពេញចិត្ត។ កម្មវិធីនឹងធ្វើបច្ចុប្បន្នភាពដោយស្វ័យប្រវត្តិ។'}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Create User Modal */}
        <Modal open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Create New User</ModalTitle>
              <ModalDescription>Add a new user to the system</ModalDescription>
            </ModalHeader>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="hover-input"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="hover-input"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  className="hover-input"
                  minLength={6}
                  required
                />
              </div>
              <ModalFooter>
                <Button type="button" variant="outline" onClick={() => setIsUserDialogOpen(false)} className="hover-loading">
                  {t('cancel')}
                </Button>
                <Button type="submit" disabled={createUserMutation.isPending} className="hover-loading">
                  {createUserMutation.isPending ? t('loading') : 'Create User'}
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>

        {/* Role Assignment Modal */}
        <Modal open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>{t('assignRole')}</ModalTitle>
              <ModalDescription>Select a role for this user</ModalDescription>
            </ModalHeader>
            <form onSubmit={handleAssignRole} className="space-y-4">
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as RoleType)}>
                  <SelectTrigger className="hover-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">{t('admin')}</SelectItem>
                    <SelectItem value="manager">{t('manager')}</SelectItem>
                    <SelectItem value="user">{t('user')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <ModalFooter>
                <Button type="button" variant="outline" onClick={() => setIsRoleDialogOpen(false)} className="hover-loading">
                  {t('cancel')}
                </Button>
                <Button type="submit" className="hover-loading">
                  {t('assignRole')}
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>{t('confirm')} {t('delete')}</ModalTitle>
              <ModalDescription>Are you sure you want to remove this role? This action cannot be undone.</ModalDescription>
            </ModalHeader>
            <ModalFooter>
              <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="hover-loading">
                {t('cancel')}
              </Button>
              <Button
                variant="destructive"
                onClick={() => selectedUserId && removeRoleMutation.mutate(selectedUserId)}
                className="hover-loading"
              >
                {t('delete')}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </AdminLayout>
  );
}
