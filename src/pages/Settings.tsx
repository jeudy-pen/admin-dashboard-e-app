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
import { AlertModal } from '@/components/ui/alert-modal';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Shield, Trash2, Users, Settings as SettingsIcon, Globe, Pencil } from 'lucide-react';
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

type RoleType = 'admin' | 'manager' | 'user';

export default function Settings() {
  const { t, language, setLanguage } = useLanguage();
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<RoleType>('user');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [editUserName, setEditUserName] = useState('');
  const [editUserEmail, setEditUserEmail] = useState('');
  
  // Alert modal state
  const [alertModal, setAlertModal] = useState<{
    open: boolean;
    type: 'success' | 'error';
    message: string;
  }>({ open: false, type: 'success', message: '' });
  
  const queryClient = useQueryClient();

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlertModal({ open: true, type, message });
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
      showAlert('success', t('userCreatedSuccess'));
      setIsUserDialogOpen(false);
      setNewUserEmail('');
      setNewUserPassword('');
      setNewUserName('');
    },
    onError: (error: Error) => showAlert('error', error.message || t('failedToCreateUser')),
  });

  const updateProfileMutation = useMutation({
    mutationFn: async ({ userId, fullName }: { userId: string; fullName: string }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      showAlert('success', t('success'));
      setIsEditUserDialogOpen(false);
    },
    onError: () => showAlert('error', t('error')),
  });

  const assignRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: RoleType }) => {
      await supabase.from('user_roles').delete().eq('user_id', userId);
      const { error } = await supabase.from('user_roles').insert([{ user_id: userId, role }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_roles'] });
      showAlert('success', t('roleAssignedSuccess'));
      setIsRoleDialogOpen(false);
    },
    onError: () => showAlert('error', t('failedToAssignRole')),
  });

  const removeRoleMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase.from('user_roles').delete().eq('user_id', userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_roles'] });
      showAlert('success', t('roleRemovedSuccess'));
      setIsDeleteDialogOpen(false);
    },
    onError: () => showAlert('error', t('failedToRemoveRole')),
  });

  const getUserRole = (userId: string) => {
    return userRoles?.find((r) => r.user_id === userId)?.role;
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    createUserMutation.mutate({ email: newUserEmail, password: newUserPassword, name: newUserName });
  };

  const handleEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUserId) {
      updateProfileMutation.mutate({ userId: selectedUserId, fullName: editUserName });
    }
  };

  const handleAssignRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUserId) {
      assignRoleMutation.mutate({ userId: selectedUserId, role: selectedRole });
    }
  };

  const openEditDialog = (profile: Profile) => {
    setSelectedUserId(profile.id);
    setEditUserName(profile.full_name || '');
    setEditUserEmail(profile.email || '');
    setIsEditUserDialogOpen(true);
  };

  const openRoleDialog = (userId: string) => {
    setSelectedUserId(userId);
    setSelectedRole(getUserRole(userId) || 'user');
    setIsRoleDialogOpen(true);
  };

  const openDeleteRoleDialog = (userId: string) => {
    setSelectedUserId(userId);
    setIsDeleteDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Alert Modal */}
        <AlertModal
          open={alertModal.open}
          onOpenChange={(open) => setAlertModal({ ...alertModal, open })}
          type={alertModal.type}
          message={alertModal.message}
        />

        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('settings')}</h1>
          <p className="text-muted-foreground">{t('manageUsersPermsSettings')}</p>
        </div>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              {t('users')}
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
              <Button onClick={() => setIsUserDialogOpen(true)} className="hover-gradient">
                <UserPlus className="h-4 w-4 mr-2" />
                {t('createUser')}
              </Button>
            </div>

            <div className="bg-card rounded-lg border border-border card-gradient-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('user')}</TableHead>
                    <TableHead>{t('role')}</TableHead>
                    <TableHead>{t('joined')}</TableHead>
                    <TableHead className="w-32">{t('actions')}</TableHead>
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
                        {t('noUsersFound')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    profiles?.map((profile) => (
                      <TableRow key={profile.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{profile.full_name || t('noName')}</div>
                            <div className="text-sm text-muted-foreground">{profile.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getUserRole(profile.id) ? (
                            <Badge variant="secondary" className="capitalize">
                              {t(getUserRole(profile.id) || '')}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">{t('noRole')}</span>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(profile.created_at), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {/* Edit Button */}
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              onClick={() => openEditDialog(profile)} 
                              className="hover-gradient"
                              title={t('edit')}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            {/* Assign Role Button */}
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              onClick={() => openRoleDialog(profile.id)} 
                              className="hover-gradient"
                              title={t('assignRole')}
                            >
                              <Shield className="h-4 w-4" />
                            </Button>
                            {/* Delete Role Button */}
                            {getUserRole(profile.id) && (
                              <Button
                                size="icon"
                                variant="ghost"
                                className="text-destructive hover-gradient"
                                onClick={() => openDeleteRoleDialog(profile.id)}
                                title={t('delete')}
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
            <div className="bg-card rounded-lg border border-border p-6 card-gradient-border">
              <h3 className="text-lg font-semibold mb-4">{t('rolePermissions')}</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4 text-sm font-medium text-muted-foreground border-b border-border pb-2">
                  <div>{t('permission')}</div>
                  <div className="text-center">{t('admin')}</div>
                  <div className="text-center">{t('manager')}</div>
                  <div className="text-center">{t('user')}</div>
                </div>
                {[
                  { name: t('viewDashboard'), admin: true, manager: true, user: false },
                  { name: t('manageProducts'), admin: true, manager: true, user: false },
                  { name: t('manageCategories'), admin: true, manager: true, user: false },
                  { name: t('manageOrders'), admin: true, manager: true, user: false },
                  { name: t('manageCustomers'), admin: true, manager: false, user: false },
                  { name: t('manageUsers'), admin: true, manager: false, user: false },
                  { name: t('manageSettings'), admin: true, manager: false, user: false },
                  { name: t('sendNotifications'), admin: true, manager: true, user: false },
                ].map((perm) => (
                  <div key={perm.name} className="grid grid-cols-4 gap-4 py-2 border-b border-border last:border-0">
                    <div className="text-sm">{perm.name}</div>
                    <div className="text-center">
                      <Badge variant={perm.admin ? 'default' : 'outline'} className="text-xs">
                        {perm.admin ? t('yes') : t('no')}
                      </Badge>
                    </div>
                    <div className="text-center">
                      <Badge variant={perm.manager ? 'default' : 'outline'} className="text-xs">
                        {perm.manager ? t('yes') : t('no')}
                      </Badge>
                    </div>
                    <div className="text-center">
                      <Badge variant={perm.user ? 'default' : 'outline'} className="text-xs">
                        {perm.user ? t('yes') : t('no')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="general" className="space-y-4">
            <div className="bg-card rounded-lg border border-border p-6 card-gradient-border">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Globe className="h-5 w-5" />
                {t('language')}
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Button
                    variant={language === 'en' ? 'default' : 'outline'}
                    onClick={() => setLanguage('en')}
                    className="hover-gradient"
                  >
                    🇺🇸 {t('english')} (Nunito)
                  </Button>
                  <Button
                    variant={language === 'km' ? 'default' : 'outline'}
                    onClick={() => setLanguage('km')}
                    className="hover-gradient"
                  >
                    🇰🇭 {t('khmer')} (Kantumruy Pro)
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t('selectLanguageDesc')}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Create User Modal */}
        <Modal open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>{t('createUser')}</ModalTitle>
              <ModalDescription>{t('addNewUserDesc')}</ModalDescription>
            </ModalHeader>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('fullName')}</Label>
                <Input
                  id="name"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="hover-gradient-input"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t('email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="hover-gradient-input"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t('password')}</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  className="hover-gradient-input"
                  minLength={6}
                  required
                />
              </div>
              <ModalFooter>
                <Button type="button" variant="outline" onClick={() => setIsUserDialogOpen(false)} className="hover-gradient">
                  {t('cancel')}
                </Button>
                <Button type="submit" disabled={createUserMutation.isPending} className="hover-gradient">
                  {createUserMutation.isPending ? t('loading') : t('createUser')}
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>

        {/* Edit User Modal */}
        <Modal open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>{t('edit')} {t('user')}</ModalTitle>
              <ModalDescription>{t('email')}: {editUserEmail}</ModalDescription>
            </ModalHeader>
            <form onSubmit={handleEditUser} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">{t('fullName')}</Label>
                <Input
                  id="edit-name"
                  value={editUserName}
                  onChange={(e) => setEditUserName(e.target.value)}
                  className="hover-gradient-input"
                  required
                />
              </div>
              <ModalFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditUserDialogOpen(false)} className="hover-gradient">
                  {t('cancel')}
                </Button>
                <Button type="submit" disabled={updateProfileMutation.isPending} className="hover-gradient">
                  {updateProfileMutation.isPending ? t('loading') : t('save')}
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
              <ModalDescription>{t('selectRoleDesc')}</ModalDescription>
            </ModalHeader>
            <form onSubmit={handleAssignRole} className="space-y-4">
              <div className="space-y-2">
                <Label>{t('role')}</Label>
                <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as RoleType)}>
                  <SelectTrigger className="hover-gradient-input">
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
                <Button type="button" variant="outline" onClick={() => setIsRoleDialogOpen(false)} className="hover-gradient">
                  {t('cancel')}
                </Button>
                <Button type="submit" className="hover-gradient">
                  {t('assignRole')}
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>

        {/* Delete Role Confirmation Modal */}
        <Modal open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>{t('confirm')} {t('delete')}</ModalTitle>
              <ModalDescription>{t('confirmDeleteRole')}</ModalDescription>
            </ModalHeader>
            <ModalFooter>
              <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="hover-gradient">
                {t('cancel')}
              </Button>
              <Button
                variant="destructive"
                onClick={() => selectedUserId && removeRoleMutation.mutate(selectedUserId)}
                className="hover-gradient"
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