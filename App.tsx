import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Sparkles, Settings as SettingsIcon, 
  LogOut, GraduationCap, Search, Bell, Shield, 
  CheckCircle2, ChevronRight, FileText, ExternalLink
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import AlumniList from './pages/AlumniList';
import AIChat from './pages/AIChat';
import AlumniDetail from './pages/AlumniDetail';
import Settings from './pages/Settings';
import { getAlumni } from './services/db';

const SidebarLink = ({ 
  to, 
  icon: Icon, 
  label, 
  active, 
  badge 
}: { 
  to: string; 
  icon: any; 
  label: string; 
  active: boolean; 
  badge?: string | number;
}) => (
  <Link 
    to={to} 
    className={`group flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
      active 
        ? 'bg-slate-900 text-white shadow-sm' 
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
    }`}
  >
    <div className="flex items-center space-x-2.5 min-w-0">
      <Icon 
        size={16} 
        className={`shrink-0 transition-colors ${
          active ? 'text-white' : 'text-slate-500 group-hover:text-slate-900'
        }`} 
      />
      <span className="truncate">{label}</span>
    </div>
    {badge !== undefined && (
      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded tabular-nums ${
        active 
          ? 'bg-slate-800 text-slate-300' 
          : 'bg-slate-200/70 text-slate-600 group-hover:bg-slate-200'
      }`}>
        {badge}
      </span>
    )}
  </Link>
);

const AppLayout = ({ children }: { children?: React.ReactNode }) => {
  const location = useLocation();
  const [alumniCount, setAlumniCount] = useState(0);

  useEffect(() => {
    const list = getAlumni();
    setAlumniCount(list.length);
  }, [location.pathname]);

  const getBreadcrumbs = () => {
    if (location.pathname === '/') {
      return [{ label: 'Advancement Operations', href: '/' }, { label: 'Executive Briefing' }];
    }
    if (location.pathname.startsWith('/alumni/')) {
      return [{ label: 'Advancement Operations', href: '/' }, { label: 'Directory', href: '/alumni' }, { label: 'Alumnus Dossier' }];
    }
    if (location.pathname.startsWith('/alumni')) {
      return [{ label: 'Advancement Operations', href: '/' }, { label: 'Alumni Directory' }];
    }
    if (location.pathname === '/chat') {
      return [{ label: 'Discovery & Intelligence', href: '/chat' }, { label: 'Advancement Copilot' }];
    }
    if (location.pathname === '/settings') {
      return [{ label: 'Administration', href: '/settings' }, { label: 'System & Database' }];
    }
    return [{ label: 'AlumniConnect' }];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 overflow-hidden font-sans antialiased">
      {/* Institutional Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200/90 flex flex-col h-full shrink-0 z-20">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-[#BA0C2F] flex items-center justify-center text-white shadow-xs shrink-0">
              <GraduationCap size={20} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900">University of Denver</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium truncate">Advancement & Relations</p>
            </div>
          </div>
        </div>
        
        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          <div>
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Operations & Records
            </div>
            <nav className="space-y-1">
              <SidebarLink 
                to="/" 
                icon={LayoutDashboard} 
                label="Executive Briefing" 
                active={location.pathname === '/'} 
              />
              <SidebarLink 
                to="/alumni" 
                icon={Users} 
                label="Alumni Directory" 
                active={location.pathname.startsWith('/alumni')} 
                badge={alumniCount > 0 ? alumniCount : undefined}
              />
              <SidebarLink 
                to="/chat" 
                icon={Sparkles} 
                label="Discovery Copilot" 
                active={location.pathname === '/chat'} 
              />
            </nav>
          </div>

          <div>
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Administration
            </div>
            <nav className="space-y-1">
              <SidebarLink 
                to="/settings" 
                icon={SettingsIcon} 
                label="System & Database" 
                active={location.pathname === '/settings'} 
              />
            </nav>
          </div>

          {/* Institutional Status Badge in Sidebar */}
          <div className="px-3">
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-700">Database Status</span>
                <span className="inline-flex items-center text-[10px] text-emerald-700 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                  Active
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                {alumniCount} records synced • Fall 2026 reporting cohort
              </p>
            </div>
          </div>
        </div>
        
        {/* User Identity Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 transition-all">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-semibold shrink-0">
                DU
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-900 truncate">Advancement Officer</p>
                <p className="text-[10px] text-slate-500 truncate">Office of Alumni Relations</p>
              </div>
            </div>
            <Link 
              to="/settings" 
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded hover:bg-slate-100 transition-colors"
              title="System Settings"
            >
              <SettingsIcon size={14} />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main View Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Executive Header Bar */}
        <header className="h-14 bg-white border-b border-slate-200/90 flex items-center justify-between px-6 shrink-0 z-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-1.5 text-xs">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb.label}>
                {idx > 0 && <ChevronRight size={12} className="text-slate-400 shrink-0" />}
                {crumb.href ? (
                  <Link 
                    to={crumb.href} 
                    className="text-slate-500 hover:text-slate-900 font-medium transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-slate-900 font-semibold">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>

          {/* Header Action Tools */}
          <div className="flex items-center space-x-3">
            <Link 
              to="/alumni"
              className="hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-1 text-xs text-slate-500 bg-slate-100 hover:bg-slate-200/80 border border-slate-200/60 rounded-md transition-colors"
            >
              <Search size={13} className="text-slate-400" />
              <span>Search Directory</span>
              <kbd className="ml-1 px-1 py-0.2 bg-white rounded border border-slate-200 text-[10px] font-mono text-slate-400">⌘K</kbd>
            </Link>

            <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>

            <div className="flex items-center space-x-2">
              <span className="badge-neutral text-[10px] font-medium hidden md:inline-flex">
                DU Campus • Main
              </span>
              <span className="badge-crimson text-[10px] font-semibold">
                FY 2025–26
              </span>
            </div>
          </div>
        </header>
        
        {/* Content Container */}
        <div className="flex-1 overflow-y-auto px-6 py-6 md:px-8 md:py-8">
          {children}
        </div>
      </main>
    </div>
  );
};

const App = () => {
  useEffect(() => {
    getAlumni();
  }, []);

  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/alumni" element={<AlumniList />} />
          <Route path="/alumni/:id" element={<AlumniDetail />} />
          <Route path="/chat" element={<AIChat />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </AppLayout>
    </Router>
  );
};

export default App;
