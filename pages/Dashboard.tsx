
import React, { useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area
} from 'recharts';
// Added MessageSquare to imports
import { 
  Users, Briefcase, GraduationCap, MapPin, TrendingUp, 
  Search, Sparkles, ArrowRight, Bookmark, Zap, CheckCircle2, UserPlus, MessageSquare
} from 'lucide-react';
import { getAlumni, getInteractions } from '../services/db';

const PersonalStat = ({ label, value, icon: Icon, color, progress }: any) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
    <div className="flex items-center justify-between mb-3">
      <div className={`p-2 rounded-xl ${color}`}>
        <Icon size={18} />
      </div>
      {progress !== undefined && (
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          {progress}% Complete
        </span>
      )}
    </div>
    <p className="text-slate-500 text-xs font-bold uppercase tracking-tight">{label}</p>
    <h3 className="text-xl font-bold text-slate-900 mt-1">{value}</h3>
    {progress !== undefined && (
      <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
        <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${progress}%` }}></div>
      </div>
    )}
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const alumni = useMemo(() => getAlumni(), []);
  const interactions = useMemo(() => getInteractions(), []);

  // Frame: Discovering where people are
  const industryData = useMemo(() => {
    const counts: Record<string, number> = {};
    alumni.forEach(a => {
      const ind = a.industry && a.industry !== '-' ? a.industry : 'Other';
      counts[ind] = (counts[ind] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [alumni]);

  // Frame: People you might know (random sample for demo)
  const recommendations = useMemo(() => {
    return [...alumni].sort(() => 0.5 - Math.random()).slice(0, 3);
  }, [alumni]);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#ef4444'];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Hero Welcome */}
      <div className="relative overflow-hidden bg-slate-900 rounded-3xl p-8 text-white">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <GraduationCap size={160} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/20 px-3 py-1 rounded-full text-indigo-300 text-xs font-bold mb-4 border border-indigo-500/30">
            <Sparkles size={14} />
            <span>AI MATCHING ENGINE READY</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome back, Pioneer.</h1>
          <p className="text-slate-400 text-lg mb-6 leading-relaxed">
            Your network has grown by <span className="text-white font-bold">12 connections</span> this week. Who will you reach out to today?
          </p>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => navigate('/chat')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold flex items-center space-x-2 transition-all shadow-lg shadow-indigo-900/20"
            >
              <Search size={18} />
              <span>Find a Mentor</span>
            </button>
            <button 
              onClick={() => navigate('/alumni')}
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold border border-white/10 transition-all backdrop-blur-md"
            >
              Explore Directory
            </button>
          </div>
        </div>
      </div>

      {/* Personal Pulse */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <PersonalStat 
          label="Profile Strength" 
          value="Advanced" 
          icon={CheckCircle2} 
          color="bg-emerald-50 text-emerald-600" 
          progress={75}
        />
        <PersonalStat 
          label="Network Size" 
          value={alumni.length} 
          icon={Users} 
          color="bg-indigo-50 text-indigo-600" 
        />
        <PersonalStat 
          label="Recent Matches" 
          value="8 New" 
          icon={Zap} 
          color="bg-amber-50 text-amber-600" 
        />
        <PersonalStat 
          label="Interactions" 
          value={interactions.length} 
          icon={MessageSquare} 
          color="bg-blue-50 text-blue-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recommended Connections */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center">
              <Sparkles className="text-indigo-600 mr-2" size={20} />
              Recommended for You
            </h2>
            <Link to="/chat" className="text-indigo-600 text-sm font-bold hover:underline flex items-center">
              View all suggestions <ArrowRight size={14} className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((alum) => (
              <div key={alum.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-indigo-600 font-bold border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    {alum.name[0]}
                  </div>
                  <button className="text-slate-300 hover:text-indigo-600 transition-colors">
                    <Bookmark size={20} />
                  </button>
                </div>
                <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{alum.name}</h3>
                <p className="text-xs text-slate-500 font-medium mb-3 line-clamp-1">{alum.headline}</p>
                <div className="flex items-center text-[10px] text-slate-400 space-x-3 mb-4">
                  <span className="flex items-center"><Briefcase size={10} className="mr-1" /> {alum.company}</span>
                  <span className="flex items-center"><MapPin size={10} className="mr-1" /> {alum.location}</span>
                </div>
                <button 
                  onClick={() => navigate(`/alumni/${alum.id}`)}
                  className="w-full py-2 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-lg text-xs font-bold transition-all border border-slate-100 hover:border-indigo-200 flex items-center justify-center space-x-2"
                >
                  <UserPlus size={14} />
                  <span>Connect</span>
                </button>
              </div>
            ))}
          </div>

          {/* Activity Timeline (Your Activity) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Your Recent Activity</h3>
              <button className="text-xs font-bold text-slate-400 uppercase tracking-widest">View All</button>
            </div>
            <div className="p-6">
              {interactions.length > 0 ? (
                <div className="space-y-6">
                  {interactions.slice(-3).reverse().map((item, idx) => {
                    const alum = alumni.find(a => a.id === item.alumniId);
                    return (
                      <div key={item.id} className="flex space-x-4 relative">
                        {idx !== 2 && <div className="absolute left-4 top-10 bottom-0 w-px bg-slate-100"></div>}
                        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 border border-indigo-100">
                          <CheckCircle2 size={16} />
                        </div>
                        <div>
                          <p className="text-sm text-slate-600">
                            You logged a <span className="font-bold text-slate-900">{item.type}</span> with <span className="text-indigo-600 font-bold">{alum?.name}</span>
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">{item.date}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-slate-400 text-sm">Start networking to see your progress here!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Career Trajectory & Insights */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Career Heatmap</h3>
            <p className="text-xs text-slate-500 mb-6">Top industries current alumni are working in.</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={industryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {industryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 space-y-3">
              {industryData.map((item, i) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                    <span className="text-sm font-medium text-slate-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{Math.round((item.value / alumni.length) * 100)}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 p-6 rounded-2xl text-white shadow-xl shadow-indigo-200">
            <div className="p-3 bg-white/20 w-fit rounded-xl mb-4 backdrop-blur-md">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Pioneer Mentorship</h3>
            <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
              Found a role you like? 84% of alumni are open to career coffee chats.
            </p>
            <button className="w-full py-3 bg-white text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors shadow-lg">
              Unlock Career Paths
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
