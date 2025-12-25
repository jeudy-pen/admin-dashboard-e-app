import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  FolderOpen, 
  ShoppingCart, 
  Users,
  Settings,
  LogOut,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/products', icon: Package, label: 'Products' },
  { path: '/categories', icon: FolderOpen, label: 'Categories' },
  { path: '/orders', icon: ShoppingCart, label: 'Orders' },
  { path: '/customers', icon: Users, label: 'Customers' },
];

export default function AdminSidebar() {
  const location = useLocation();
  const { signOut, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);

  return (
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
          className="h-8 w-8"
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
            "w-full justify-start gap-3",
            collapsed && "justify-center px-0"
          )}
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
          {!collapsed && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
        </Button>

        <Button
          variant="ghost"
          onClick={signOut}
          className={cn(
            "w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10",
            collapsed && "justify-center px-0"
          )}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Sign Out</span>}
        </Button>
      </div>
    </aside>
  );
}
