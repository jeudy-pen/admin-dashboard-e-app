import { NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  FolderOpen, 
  ShoppingCart, 
  Users,
  UserCog,
  Settings,
  LogOut,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  Tag,
  Percent,
  Calendar,
  Bell
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalFooter,
  ModalDescription,
} from '@/components/ui/modal';
import { cn } from '@/lib/utils';

export default function AdminSidebar() {
  const location = useLocation();
  const { signOut, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const [collapsed, setCollapsed] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: t('dashboard') },
    { path: '/products', icon: Package, label: t('products') },
    { path: '/categories', icon: FolderOpen, label: t('categories') },
    { path: '/brands', icon: Tag, label: t('brands') },
    { path: '/orders', icon: ShoppingCart, label: t('orders') },
    { path: '/customers', icon: Users, label: t('customers') },
    { path: '/users', icon: UserCog, label: t('users') },
    { path: '/promotions', icon: Percent, label: t('promotions') },
    { path: '/events', icon: Calendar, label: t('events') },
    { path: '/notifications', icon: Bell, label: t('notifications') },
    { path: '/settings', icon: Settings, label: t('settings') },
  ];

  const handleLogout = () => {
    signOut();
    setShowLogoutModal(false);
  };

  return (
    <>
      <aside className={cn(
        "bg-card border-r border-border h-screen sticky top-0 flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}>
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          {!collapsed && (
            <h1 className="text-lg font-bold text-foreground">Admin</h1>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8 hover-gradient"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                collapsed && "justify-center"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-2 border-t border-border space-y-1">
          <Button
            variant="ghost"
            onClick={toggleTheme}
            className={cn(
              "w-full justify-start gap-3 hover-gradient",
              collapsed && "justify-center px-0"
            )}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            {!collapsed && <span>{theme === 'dark' ? t('lightMode') : t('darkMode')}</span>}
          </Button>

          <Button
            variant="ghost"
            onClick={() => setShowLogoutModal(true)}
            className={cn(
              "w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10 hover-gradient",
              collapsed && "justify-center px-0"
            )}
          >
            <LogOut className="h-5 w-5" />
            {!collapsed && <span>{t('logout')}</span>}
          </Button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      <Modal open={showLogoutModal} onOpenChange={setShowLogoutModal}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>{t('logoutTitle')}</ModalTitle>
            <ModalDescription>{t('logoutConfirm')}</ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <Button variant="outline" onClick={() => setShowLogoutModal(false)} className="hover-gradient">
              {t('no')}
            </Button>
            <Button variant="destructive" onClick={handleLogout} className="hover-gradient">
              {t('yes')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}