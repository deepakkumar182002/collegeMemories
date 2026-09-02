import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Image as ImageIcon,
  BookOpen,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Shield,
  PlusCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const AdminLayout: React.FC = () => {
  const { admin, isLoading, isAuthenticated, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  if (isLoading) {
    return <LoadingSpinner message="Verifying admin credentials..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Memories', href: '/admin/memories', icon: ImageIcon },
    { label: 'Chapters', href: '/admin/chapters', icon: BookOpen },
    { label: 'Friends & ID Cards', href: '/admin/friends', icon: Users },
    { label: 'Memory Wall Notes', href: '/admin/messages', icon: MessageSquare },
    { label: 'Site Settings', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-maroon-700 text-rose-800" />
          <span className="font-bold text-base text-slate-800">AlumniScraps Admin</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transform transition-transform duration-300 md:static md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-rose-900 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                🎓
              </div>
              <div>
                <h1 className="font-bold text-base text-slate-900 leading-tight">AlumniScraps</h1>
                <p className="text-[11px] text-slate-500 font-medium">Memory Management</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Create Buttons */}
          <div className="p-4 border-b border-slate-100">
            <Link
              to="/admin/memories/create"
              onClick={() => setSidebarOpen(false)}
              className="w-full bg-rose-900 hover:bg-rose-950 text-white py-2.5 px-4 rounded-lg font-medium text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              Upload New Memory
            </Link>
          </div>

          {/* Nav List */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const isActive = item.exact
                ? location.pathname === item.href
                : location.pathname.startsWith(item.href);

              return (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-rose-50 text-rose-900 font-semibold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <item.icon
                    className={`w-4 h-4 ${isActive ? 'text-rose-900' : 'text-slate-400'}`}
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Admin Info & Logout */}
        <div className="p-4 border-t border-slate-100 space-y-3 bg-slate-50/50">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between text-xs font-medium text-slate-600 hover:text-rose-900 p-2 rounded hover:bg-slate-100 transition-colors"
          >
            <span>View Public Scrapbook</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-900 flex items-center justify-center font-bold text-xs uppercase">
                {admin?.name?.charAt(0) || 'A'}
              </div>
              <div className="truncate max-w-[110px]">
                <p className="text-xs font-semibold text-slate-800 truncate">{admin?.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{admin?.email}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile drawer */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-xs"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="p-4 md:p-8 max-w-6xl mx-auto w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
