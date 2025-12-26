import { useState, useEffect } from 'react';
import { Bell, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  title: string;
  message: string;
  status: string;
  created_at: string;
}

export default function AdminHeader() {
  const { language, setLanguage, t } = useLanguage();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from('push_notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (!error && data) {
      setNotifications(data);
      setUnreadCount(data.filter((n) => n.status === 'pending').length);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border px-6 py-3">
      <div className="flex items-center justify-end gap-4">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="hover-gradient gap-2">
                <Languages className="h-5 w-5" />
                <span className="hidden sm:inline">{language === 'en' ? 'EN' : 'ខ្មែរ'}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage('en')} className={cn(language === 'en' && 'bg-accent')}>
                <span className="mr-2">🇺🇸</span>
                {t('english')} (Nunito)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('km')} className={cn(language === 'km' && 'bg-accent')}>
                <span className="mr-2">🇰🇭</span>
                {t('khmer')} (Kantumruy Pro)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative hover-gradient">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80">
              <div className="space-y-4">
                <h4 className="font-semibold">{t('notifications')}</h4>
                {notifications.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{t('noNotifications')}</p>
                ) : (
                  <div className="space-y-2">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          'p-3 rounded-lg border border-border',
                          notification.status === 'pending' && 'bg-primary/5'
                        )}
                      >
                        <p className="font-medium text-sm">{notification.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
}
