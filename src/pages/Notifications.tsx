import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Bell, Send } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';

interface Notification {
  id: string;
  title: string;
  message: string;
  target_audience: string;
  scheduled_at: string | null;
  sent_at: string | null;
  status: string;
  created_at: string;
}

const initialFormData = {
  title: '',
  message: '',
  target_audience: 'all',
  scheduled_at: '',
  status: 'draft',
};

export default function Notifications() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null);
  const [formData, setFormData] = useState(initialFormData);
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data, error } = await supabase.from('push_notifications').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data as Notification[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<Notification, 'id' | 'created_at' | 'sent_at'>) => {
      const { error } = await supabase.from('push_notifications').insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success(t('notificationCreatedSuccess'));
      resetForm();
    },
    onError: () => toast.error(t('failedToCreateNotification')),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Notification> & { id: string }) => {
      const { error } = await supabase.from('push_notifications').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success(t('notificationUpdatedSuccess'));
      resetForm();
    },
    onError: () => toast.error(t('failedToUpdateNotification')),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('push_notifications').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success(t('notificationDeletedSuccess'));
    },
    onError: () => toast.error(t('failedToDeleteNotification')),
  });

  const sendMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('push_notifications')
        .update({ status: 'sent', sent_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success(t('notificationSent'));
    },
    onError: () => toast.error(t('failedToSendNotification')),
  });

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingNotification(null);
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      title: formData.title,
      message: formData.message,
      target_audience: formData.target_audience,
      scheduled_at: formData.scheduled_at || null,
      status: formData.status,
    };
    if (editingNotification) {
      updateMutation.mutate({ id: editingNotification.id, ...data });
    } else {
      createMutation.mutate(data as any);
    }
  };

  const handleEdit = (notification: Notification) => {
    setEditingNotification(notification);
    setFormData({
      title: notification.title,
      message: notification.message,
      target_audience: notification.target_audience,
      scheduled_at: notification.scheduled_at?.slice(0, 16) || '',
      status: notification.status,
    });
    setIsOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'default';
      case 'scheduled':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('pushNotifications')}</h1>
            <p className="text-muted-foreground">{t('notificationsSubtitle')}</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="h-4 w-4 mr-2" />
                {t('newNotification')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingNotification ? t('editNotification') : t('newNotification')}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">{t('title')}</Label>
                  <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">{t('message')}</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={3}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('targetAudience')}</Label>
                  <Select value={formData.target_audience} onValueChange={(v) => setFormData({ ...formData, target_audience: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('allUsers')}</SelectItem>
                      <SelectItem value="customers">{t('customersOnly')}</SelectItem>
                      <SelectItem value="admins">{t('adminsOnly')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scheduled_at">{t('scheduleOptional')}</Label>
                  <Input
                    id="scheduled_at"
                    type="datetime-local"
                    value={formData.scheduled_at}
                    onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    {t('cancel')}
                  </Button>
                  <Button type="submit">{editingNotification ? t('update') : t('create')}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-card rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('notification')}</TableHead>
                <TableHead>{t('audience')}</TableHead>
                <TableHead>{t('status')}</TableHead>
                <TableHead>{t('created')}</TableHead>
                <TableHead className="w-32">{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {t('loading')}
                  </TableCell>
                </TableRow>
              ) : notifications?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {t('noNotificationsFound')}
                  </TableCell>
                </TableRow>
              ) : (
                notifications?.map((notif) => (
                  <TableRow key={notif.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Bell className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{notif.title}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">{notif.message}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize text-muted-foreground">{notif.target_audience}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(notif.status)}>{notif.status}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{format(new Date(notif.created_at), 'MMM d, yyyy')}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {notif.status !== 'sent' && (
                          <Button size="icon" variant="ghost" className="text-primary" onClick={() => sendMutation.mutate(notif.id)}>
                            <Send className="h-4 w-4" />
                          </Button>
                        )}
                        <Button size="icon" variant="ghost" onClick={() => handleEdit(notif)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteMutation.mutate(notif.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}
