import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Sparkles,
  LayoutDashboard,
  Layers,
  MessageSquare,
  BarChart3,
  Code2,
  LogOut,
  User as UserIcon,
  Menu,
  X,
  ExternalLink
} from 'lucide-react';
import { cn } from '../utils/cn';
import { Avatar } from '../components/ui/Avatar';

export const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      addToast('Logged out successfully', 'info');
      navigate('/login');
    } catch (err) {
      addToast('Logout failed', 'error');
    }
  };

  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Spaces', path: '/dashboard/spaces', icon: Layers },
    { label: 'Testimonials', path: '/dashboard/reviews', icon: MessageSquare },
    { label: 'Analytics', path: '/dashboard/analytics', icon: BarChart3 },
    { label: 'Embed Generator', path: '/dashboard/embed', icon: Code2 },
  ];

  return (
    <div className="min-h-screen flex bg-slate-100/70">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 border-r border-slate-200 bg-white z-30">
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <Link to="/dashboard" className="flex items-center gap-2.5 font-bold text-lg text-slate-900">
            <div className="p-1.5 bg-brand-600 text-white rounded-lg shadow-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            <span>SocialProof</span>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          <div className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Owner Dashboard
          </div>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-brand-50 text-brand-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                )
              }
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>

        {/* User Profile & Logout Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar alt={user?.name || 'User'} size="sm" />
              <div className="truncate">
                <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <h1 className="text-lg font-semibold text-slate-800 hidden sm:block">
              Owner Control Center
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/wall/acme-corp"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <span>Demo Wall of Love</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            <div className="fixed inset-0 bg-slate-900/50" onClick={() => setMobileMenuOpen(false)} />
            <div className="relative w-64 bg-white flex flex-col h-full z-50 p-4 space-y-4">
              <div className="flex items-center justify-between pb-4 border-b">
                <span className="font-bold text-slate-900">Navigation</span>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X className="h-5 w-5 text-slate-500" />
                </button>
              </div>
              <div className="space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    end={item.path === '/dashboard'}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-brand-50 text-brand-700 font-semibold'
                          : 'text-slate-600 hover:bg-slate-50'
                      )
                    }
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </div>
              <div className="pt-auto mt-auto border-t pt-4">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
