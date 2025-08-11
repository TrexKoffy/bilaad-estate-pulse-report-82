import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { 
  LayoutDashboard, 
  Plus, 
  Settings, 
  LogOut, 
  Building2,
  Menu,
  X
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import bilaadLogo from '@/assets/bilaad-realty-logo.png';

interface AdminSidebarProps {
  className?: string;
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { signOut, user } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    }
  };

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      href: '/admin',
      active: location.pathname === '/admin'
    },
    {
      title: 'Add Project',
      icon: Plus,
      href: '/admin/add-project',
      active: location.pathname === '/admin/add-project'
    },
    {
      title: 'Manage Projects',
      icon: Building2,
      href: '/admin/projects',
      active: location.pathname === '/admin/projects'
    },
    {
      title: 'Settings',
      icon: Settings,
      href: '/admin/settings',
      active: location.pathname === '/admin/settings'
    }
  ];

  return (
    <div className={`${className} ${isCollapsed ? 'w-16' : 'w-64'} transition-all duration-300`}>
      <div className="h-full bg-sidebar border-r border-sidebar-border flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                <img 
                  src={bilaadLogo} 
                  alt="BILAAD" 
                  className="h-8 w-8"
                />
                <div>
                  <h2 className="text-lg font-semibold text-sidebar-foreground">BILAAD</h2>
                  <p className="text-xs text-sidebar-foreground/70">Admin Panel</p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-sidebar-foreground hover:bg-sidebar-accent"
            >
              {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link key={item.href} to={item.href}>
              <Button
                variant={item.active ? "default" : "ghost"}
                className={`w-full justify-start ${
                  isCollapsed ? 'px-2' : 'px-4'
                } ${
                  item.active 
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
                    : 'text-sidebar-foreground hover:bg-sidebar-accent'
                }`}
              >
                <item.icon className={`h-4 w-4 ${isCollapsed ? '' : 'mr-3'}`} />
                {!isCollapsed && item.title}
              </Button>
            </Link>
          ))}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-sidebar-border">
          {!isCollapsed && (
            <div className="mb-3 p-2 bg-sidebar-accent rounded-lg">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user?.email}
              </p>
              <p className="text-xs text-sidebar-foreground/70">Administrator</p>
            </div>
          )}
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className={`w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent ${
              isCollapsed ? 'px-2' : 'px-4'
            }`}
          >
            <LogOut className={`h-4 w-4 ${isCollapsed ? '' : 'mr-3'}`} />
            {!isCollapsed && 'Sign Out'}
          </Button>
        </div>
      </div>
    </div>
  );
}