
import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, MessageSquare, Database, Settings, LogOut } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import AlumniList from './pages/AlumniList';
import AIChat from './pages/AIChat';
import AlumniDetail from './pages/AlumniDetail';
import { getAlumni } from './services/db';

const SidebarLink = ({ to, icon: Icon, label, active }: { to: string, icon: any, label: string, active: boolean }) => (
  <Link 
    to={to} 
    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
      active ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </Link>
);

const AppLayout = ({ children }: { children?: React.ReactNode }) => {
  const location = useLocation();
  
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 flex flex-col h-full border-r border-slate-800">
        <div className="p-6">
          <div className="flex items-center space-x-3 text-indigo-400 mb-8">
            <div className="bg-indigo-600/20 p-2 rounded-lg">
              <Database size={24} className="text-indigo-500" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">AlumniConnect</h1>
          </div>
          
          <nav className="space-y-1">
            <SidebarLink to="/" icon={LayoutDashboard} label="Dashboard" active={location.pathname === '/'} />
            <SidebarLink to="/alumni" icon={Users} label="Directory" active={location.pathname.startsWith('/alumni')} />
            <SidebarLink to="/chat" icon={MessageSquare} label="AI Matcher" active={location.pathname === '/chat'} />
            <SidebarLink to="/settings" icon={Settings} label="System" active={location.pathname === '/settings'} />
          </nav>
        </div>
        
        <div className="mt-auto p-6 border-t border-slate-800">
          <button className="flex items-center space-x-3 px-4 py-3 w-full text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center space-x-4">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              {location.pathname === '/' ? 'Overview' : 
               location.pathname.startsWith('/alumni') ? 'Alumni Information' : 
               location.pathname === '/chat' ? 'AI Conversations' : 'System Settings'}
            </h2>
          </div>
          <div className="flex items-center space-x-4">
             <div className="text-right">
                <p className="text-sm font-semibold text-slate-900">Admin Staff</p>
                <p className="text-xs text-slate-500">University Relations</p>
             </div>
             <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
               AD
             </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

const App = () => {
  // Initialize data on load
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
          <Route path="/settings" element={<div className="p-8 text-center text-slate-500">System settings coming soon.</div>} />
        </Routes>
      </AppLayout>
    </Router>
  );
};

export default App;
