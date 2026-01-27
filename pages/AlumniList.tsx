
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, Mail, MapPin, Briefcase, FileUp, X, CheckCircle, RotateCcw } from 'lucide-react';
import { getAlumni, bulkAddAlumni, resetToCSV } from '../services/db';
import { parseAlumniCSV } from '../utils/csvParser';

const AlumniList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('All');
  const [showImportModal, setShowImportModal] = useState(false);
  const [csvContent, setCsvContent] = useState('');
  const [importStatus, setImportStatus] = useState<{ count: number } | null>(null);
  
  const [refreshKey, setRefreshKey] = useState(0);
  const alumni = useMemo(() => getAlumni(), [refreshKey]);
  
  const filteredAlumni = useMemo(() => {
    return alumni.filter(a => {
      const searchStr = searchTerm.toLowerCase();
      const matchesSearch = 
        a.name.toLowerCase().includes(searchStr) ||
        a.company.toLowerCase().includes(searchStr) ||
        a.major.toLowerCase().includes(searchStr) ||
        a.industry.toLowerCase().includes(searchStr) ||
        a.currentRole.toLowerCase().includes(searchStr) ||
        a.headline?.toLowerCase().includes(searchStr) ||
        a.location.toLowerCase().includes(searchStr);
      
      const matchesIndustry = industryFilter === 'All' || a.industry === industryFilter;
      
      return matchesSearch && matchesIndustry;
    });
  }, [alumni, searchTerm, industryFilter]);

  const industries = useMemo(() => 
    ['All', ...Array.from(new Set(alumni.map(a => a.industry).filter(ind => ind && ind !== '-')))],
    [alumni]
  );

  const handleImportCSV = () => {
    if (!csvContent.trim()) return;
    const parsed = parseAlumniCSV(csvContent);
    bulkAddAlumni(parsed);
    setImportStatus({ count: parsed.length });
    setCsvContent('');
    setRefreshKey(prev => prev + 1);
    setTimeout(() => {
      setShowImportModal(false);
      setImportStatus(null);
    }, 2000);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset the directory to the default CSV data? All local changes will be lost.')) {
      resetToCSV();
      setRefreshKey(prev => prev + 1);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Alumni Directory</h1>
          <p className="text-slate-500 text-sm mt-1">
            Browse and search through {alumni.length} alumni in your network.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleReset}
            className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg transition-all"
            title="Restore default CSV data"
          >
            <RotateCcw size={18} />
          </button>
          <button 
            onClick={() => setShowImportModal(true)}
            className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors font-medium shadow-sm"
          >
            <FileUp size={18} />
            <span className="hidden sm:inline">Import</span>
          </button>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors font-medium shadow-sm">
            <Plus size={18} />
            <span className="hidden sm:inline">Add Alumnus</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search by name, role, company, location..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select 
              className="pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none min-w-[180px] font-medium text-slate-700"
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
            >
              {industries.map(ind => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAlumni.map((alum) => (
          <div 
            key={alum.id} 
            onClick={() => navigate(`/alumni/${alum.id}`)}
            className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group flex flex-col h-full"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-lg border border-indigo-100/50 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                {alum.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <a 
                  href={`mailto:${alum.email}`} 
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  <Mail size={16} />
                </a>
              </div>
            </div>
            
            <div className="mb-2">
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{alum.name}</h3>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">
                Class of {alum.gradYear} • {alum.major}
              </p>
            </div>

            <p className="text-slate-600 text-sm line-clamp-2 mb-4 h-10 leading-relaxed font-medium">
              {alum.headline || alum.currentRole}
            </p>
            
            <div className="space-y-2 mt-auto pt-4 border-t border-slate-50">
              <div className="flex items-start text-slate-500 text-xs">
                <Briefcase size={12} className="mr-2 mt-0.5 shrink-0 text-slate-300" />
                <span className="truncate">{alum.company && alum.company !== '-' ? alum.company : 'N/A'}</span>
              </div>
              <div className="flex items-center text-slate-500 text-xs">
                <MapPin size={12} className="mr-2 shrink-0 text-slate-300" />
                <span className="truncate">{alum.location}</span>
              </div>
              {alum.industry && alum.industry !== '-' && (
                <div className="mt-2">
                  <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[9px] font-bold rounded uppercase tracking-tighter">
                    {alum.industry}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {filteredAlumni.length === 0 && (
        <div className="text-center py-24 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
            <Search size={24} className="text-slate-300" />
          </div>
          <p className="text-slate-900 font-bold text-lg">No matches found</p>
          <p className="text-slate-500 text-sm max-w-xs mx-auto mt-2">Adjust your filters or try searching for something else to find alumni.</p>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                  <FileUp size={20} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Bulk Data Import</h3>
              </div>
              <button 
                onClick={() => setShowImportModal(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8">
              {importStatus ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <CheckCircle size={32} />
                  </div>
                  <h4 className="text-2xl font-bold text-slate-900">Success!</h4>
                  <p className="text-slate-600">Successfully imported <span className="font-bold text-indigo-600">{importStatus.count}</span> new alumni profiles.</p>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Paste CSV Content
                    </label>
                    <p className="text-xs text-slate-500 mb-3 font-medium">Paste alumni records from a spreadsheet export. Ensure columns match the standard schema.</p>
                    <textarea 
                      className="w-full h-64 p-4 font-mono text-[11px] bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors leading-relaxed"
                      placeholder='"Name","Headline","Location","Company","Company industry","Last updated"...'
                      value={csvContent}
                      onChange={(e) => setCsvContent(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button 
                      onClick={() => setShowImportModal(false)}
                      className="px-6 py-2.5 text-slate-500 font-bold hover:text-slate-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleImportCSV}
                      disabled={!csvContent.trim()}
                      className="bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-100"
                    >
                      Process & Import
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlumniList;
