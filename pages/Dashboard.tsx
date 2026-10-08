import React, { useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell
} from 'recharts';
import { 
  Users, Briefcase, GraduationCap, MapPin, 
  Search, ArrowRight, MessageSquare, 
  ExternalLink, Sparkles, Download, Phone, Mail, Calendar,
  Building, CheckCircle2, ChevronRight
} from 'lucide-react';
import { getAlumni, getInteractions, exportAlumniToCSV } from '../services/db';

const MetricCard = ({ 
  label, 
  value, 
  subtext, 
  icon: Icon,
  badgeText
}: { 
  label: string; 
  value: string | number; 
  subtext: string; 
  icon: any;
  badgeText?: string;
}) => (
  <div className="card-institutional p-5 flex flex-col justify-between">
    <div className="flex items-center justify-between mb-3">
      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
        <Icon size={16} />
      </div>
    </div>
    <div>
      <div className="text-2xl font-bold text-slate-900 tracking-tight tabular-nums">
        {value}
      </div>
      <div className="flex items-center justify-between mt-1.5">
        <p className="text-xs text-slate-500">{subtext}</p>
        {badgeText && (
          <span className="badge-neutral text-[10px]">{badgeText}</span>
        )}
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const alumni = useMemo(() => getAlumni(), []);
  const interactions = useMemo(() => getInteractions(), []);

  // Industry breakdown
  const industryData = useMemo(() => {
    const counts: Record<string, number> = {};
    alumni.forEach(a => {
      const ind = a.industry && a.industry !== '-' ? a.industry : 'Other Services';
      counts[ind] = (counts[ind] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ 
        name, 
        count,
        percentage: Math.round((count / alumni.length) * 100)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [alumni]);

  // Graduation cohort breakdown
  const cohortData = useMemo(() => {
    const counts: Record<number, number> = {};
    alumni.forEach(a => {
      counts[a.gradYear] = (counts[a.gradYear] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([year, count]) => ({ year: `Class of '${year.slice(2)}`, count }))
      .sort((a, b) => a.year.localeCompare(b.year))
      .slice(-5);
  }, [alumni]);

  // Curated sample for high-value advancement outreach
  const highValueAlumni = useMemo(() => {
    return alumni.slice(0, 4);
  }, [alumni]);

  const handleExportCSV = () => {
    const csv = exportAlumniToCSV(alumni);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `alumni_briefing_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Executive Briefing Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <span>University of Denver</span>
            <span>•</span>
            <span>Advancement Operations</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Alumni Relations Command Center
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Directory intelligence, engagement tracking, and career outcome monitoring for the Pioneer alumni network.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button onClick={handleExportCSV} className="btn-secondary">
            <Download size={14} className="mr-1.5 text-slate-500" />
            <span>Export Roster</span>
          </button>
          <button 
            onClick={() => navigate('/chat')}
            className="btn-primary"
          >
            <Sparkles size={14} className="mr-1.5 text-slate-300" />
            <span>Discovery Copilot</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          label="Active Alumni" 
          value={alumni.length} 
          subtext="Verified profiles indexed" 
          icon={Users} 
          badgeText="Fall 2026 Cohort"
        />
        <MetricCard 
          label="Tracked Employers" 
          value="180+" 
          subtext="Disney, L3Harris, EY, DaVita" 
          icon={Briefcase} 
          badgeText="Active Hubs"
        />
        <MetricCard 
          label="Staff Touchpoints" 
          value={interactions.length} 
          subtext="Documented interactions" 
          icon={MessageSquare} 
          badgeText="Local Audit Log"
        />
        <MetricCard 
          label="Metro Concentration" 
          value="68%" 
          subtext="Denver Metropolitan Area" 
          icon={MapPin} 
          badgeText="Regional Primary"
        />
      </div>

      {/* Analytical Section: Industry & Class Year */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Industry Distribution Breakdown */}
        <div className="card-institutional p-6 lg:col-span-2">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Industry Distribution & Employment Sectors</h2>
              <p className="text-xs text-slate-500 mt-0.5">Concentration of alumni across dominant economic verticals</p>
            </div>
            <Link to="/alumni" className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center">
              <span>View Directory</span>
              <ChevronRight size={14} className="ml-0.5" />
            </Link>
          </div>

          <div className="mt-5 space-y-3.5">
            {industryData.map((item, idx) => (
              <div key={item.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-800">{item.name}</span>
                  <div className="flex items-center space-x-2 text-slate-500">
                    <span className="tabular-nums font-semibold text-slate-700">{item.count} alumni</span>
                    <span className="text-[11px] text-slate-400">({item.percentage}%)</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${item.percentage}%`,
                      backgroundColor: idx === 0 ? '#BA0C2F' : idx === 1 ? '#0F172A' : '#475569' 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strategic Advancement Summary Card */}
        <div className="card-institutional p-6 flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-lg bg-rose-50 flex items-center justify-center text-[#BA0C2F] mb-4">
              <GraduationCap size={20} />
            </div>
            <h2 className="text-sm font-bold text-slate-900">Pioneer Advancement Strategy</h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Alumni records in this cohort represent undergraduate and graduate degree recipients from Daniels College of Business, Ritchie School of Engineering, and Sturm College of Law.
            </p>

            <div className="mt-5 pt-4 border-t border-slate-100 space-y-3 text-xs">
              <div className="flex items-start space-x-2.5">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-slate-600">Cross-industry coverage for university career panels and student mentorship.</span>
              </div>
              <div className="flex items-start space-x-2.5">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-slate-600">Direct query assistance via Gemini AI matching engine for student outreach.</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <button 
              onClick={() => navigate('/alumni')}
              className="w-full btn-secondary text-center"
            >
              Browse Complete Directory
            </button>
          </div>
        </div>
      </div>

      {/* Operational Modules: Curated Profiles & Activity History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Curated Profiles for Outreach */}
        <div className="card-institutional p-6 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">High-Value Contacts for Department Outreach</h2>
              <p className="text-xs text-slate-500 mt-0.5">Verified alumni in key regional and industry leadership roles</p>
            </div>
            <Link to="/alumni" className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center">
              <span>All Alumni</span>
              <ArrowRight size={14} className="ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
            {highValueAlumni.map((alum) => (
              <div 
                key={alum.id}
                onClick={() => navigate(`/alumni/${alum.id}`)}
                className="p-4 rounded-lg border border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/60 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <span className="badge-neutral text-[10px]">
                      Class of {alum.gradYear}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{alum.location}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#BA0C2F] transition-colors">
                    {alum.name}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-1 mt-0.5 font-medium">
                    {alum.company}
                  </p>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                    {alum.headline}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="text-[11px] font-medium text-slate-600">{alum.major}</span>
                  <span className="text-[#BA0C2F] font-semibold text-[11px] group-hover:underline inline-flex items-center">
                    View Record <ChevronRight size={12} className="ml-0.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Advancement Log Activity */}
        <div className="card-institutional p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Recent Engagement</h2>
                <p className="text-xs text-slate-500 mt-0.5">Staff interaction logs</p>
              </div>
              <span className="badge-neutral">{interactions.length} Total</span>
            </div>

            {interactions.length > 0 ? (
              <div className="space-y-4">
                {interactions.slice(-4).reverse().map((item) => {
                  const alum = alumni.find(a => a.id === item.alumniId);
                  return (
                    <div key={item.id} className="text-xs border-l-2 border-slate-300 pl-3 py-0.5 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900">
                          {item.type} • {alum?.name || 'Alumnus'}
                        </span>
                        <span className="text-[10px] text-slate-400">{item.date}</span>
                      </div>
                      <p className="text-slate-600 line-clamp-2 leading-relaxed">{item.notes}</p>
                      <p className="text-[10px] text-slate-400">By {item.staffName}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-500 space-y-2">
                <MessageSquare size={24} className="mx-auto text-slate-300 mb-2" />
                <p className="font-medium text-slate-700">No interaction records yet</p>
                <p className="text-slate-400 max-w-[200px] mx-auto">
                  Log phone calls, meetings, or emails directly on any alumnus dossier.
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <button 
              onClick={() => navigate('/alumni')}
              className="w-full btn-secondary text-center text-xs"
            >
              Open Directory to Log Activity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
