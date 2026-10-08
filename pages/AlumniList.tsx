import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Filter, Plus, Mail, MapPin, Briefcase, FileUp, 
  X, CheckCircle, RotateCcw, LayoutGrid, Table, Download, 
  ChevronRight, SlidersHorizontal, ArrowUpDown
} from 'lucide-react';
import { getAlumni, bulkAddAlumni, resetToCSV, exportAlumniToCSV } from '../services/db';
import { parseAlumniCSV } from '../utils/csvParser';
import { AlumniProfile } from '../types';

const AlumniList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('All');
  const [cohortFilter, setCohortFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [showImportModal, setShowImportModal] = useState(false);
  const [csvContent, setCsvContent] = useState('');
  const [importStatus, setImportStatus] = useState<{ count: number } | null>(null);
  
  const [refreshKey, setRefreshKey] = useState(0);
  const alumni = useMemo(() => getAlumni(), [refreshKey]);
  
  const filteredAlumni = useMemo(() => {
    return alumni.filter(a => {
      const searchStr = searchTerm.toLowerCase();
      const matchesSearch = 
        !searchTerm ||
        a.name.toLowerCase().includes(searchStr) ||
        a.company.toLowerCase().includes(searchStr) ||
        a.major.toLowerCase().includes(searchStr) ||
        a.industry.toLowerCase().includes(searchStr) ||
        a.currentRole.toLowerCase().includes(searchStr) ||
        a.headline?.toLowerCase().includes(searchStr) ||
        a.location.toLowerCase().includes(searchStr);
      
      const matchesIndustry = industryFilter === 'All' || a.industry === industryFilter;
      
      let matchesCohort = true;
      if (cohortFilter === '2026-2027') matchesCohort = a.gradYear >= 2026;
      else if (cohortFilter === '2024-2025') matchesCohort = a.gradYear === 2024 || a.gradYear === 2025;
      else if (cohortFilter === '2020-2023') matchesCohort = a.gradYear >= 2020 && a.gradYear <= 2023;
      else if (cohortFilter === 'pre-2020') matchesCohort = a.gradYear < 2020;

      let matchesLocation = true;
      if (locationFilter === 'denver') matchesLocation = a.location.toLowerCase().includes('denver') || a.location.toLowerCase().includes('co');
      else if (locationFilter === 'california') matchesLocation = a.location.toLowerCase().includes('ca') || a.location.toLowerCase().includes('california') || a.location.toLowerCase().includes('angeles');
      else if (locationFilter === 'new-york') matchesLocation = a.location.toLowerCase().includes('ny') || a.location.toLowerCase().includes('new york');
      else if (locationFilter === 'other') matchesLocation = !a.location.toLowerCase().includes('co') && !a.location.toLowerCase().includes('ca') && !a.location.toLowerCase().includes('ny');

      return matchesSearch && matchesIndustry && matchesCohort && matchesLocation;
    });
  }, [alumni, searchTerm, industryFilter, cohortFilter, locationFilter]);

  const industries = useMemo(() => 
    ['All', ...Array.from(new Set(alumni.map(a => a.industry).filter(ind => ind && ind !== '-'))).sort()],
    [alumni]
  );

  const activeFiltersCount = (industryFilter !== 'All' ? 1 : 0) + (cohortFilter !== 'All' ? 1 : 0) + (locationFilter !== 'All' ? 1 : 0) + (searchTerm ? 1 : 0);

  const handleClearFilters = () => {
    setSearchTerm('');
    setIndustryFilter('All');
    setCohortFilter('All');
    setLocationFilter('All');
  };

  const handleExportFiltered = () => {
    const csvData = exportAlumniToCSV(filteredAlumni);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `alumni_filtered_${filteredAlumni.length}_records.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
    }, 1500);
  };

  const handleReset = () => {
    if (confirm('Restore default University of Denver alumni records? All custom additions will be cleared.')) {
      resetToCSV();
      setRefreshKey(prev => prev + 1);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Directory Operations Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <span>Advancement Operations</span>
            <span>•</span>
            <span>Master Roster</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Alumni Directory & Records</h1>
          <p className="text-slate-500 text-sm mt-1">
            Verified roster of {alumni.length} University of Denver degree holders and active professional profiles.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 shrink-0">
          <button 
            onClick={handleExportFiltered}
            className="btn-secondary"
            title="Export filtered alumni to CSV"
          >
            <Download size={14} className="mr-1.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <button 
            onClick={() => setShowImportModal(true)}
            className="btn-secondary"
          >
            <FileUp size={14} className="mr-1.5 text-slate-500" />
            <span>Import CSV</span>
          </button>
          <button 
            onClick={handleReset}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200/80 transition-colors"
            title="Restore default Pioneer dataset"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="card-institutional p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Main Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text"
              placeholder="Search by name, company, role, major, or city..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 focus:bg-white text-slate-900 transition-all placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Industry Filter Dropdown */}
          <div className="w-full md:w-56 shrink-0">
            <select 
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 focus:bg-white text-slate-700 font-medium cursor-pointer"
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
            >
              <option value="All">All Industries ({industries.length - 1})</option>
              {industries.filter(i => i !== 'All').map(ind => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>

          {/* Cohort Grad Year Filter */}
          <div className="w-full md:w-44 shrink-0">
            <select 
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 focus:bg-white text-slate-700 font-medium cursor-pointer"
              value={cohortFilter}
              onChange={(e) => setCohortFilter(e.target.value)}
            >
              <option value="All">All Cohorts</option>
              <option value="2026-2027">Classes 2026–2027</option>
              <option value="2024-2025">Classes 2024–2025</option>
              <option value="2020-2023">Classes 2020–2023</option>
              <option value="pre-2020">Pre-2020 Alumni</option>
            </select>
          </div>

          {/* Location Metro Filter */}
          <div className="w-full md:w-44 shrink-0">
            <select 
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 focus:bg-white text-slate-700 font-medium cursor-pointer"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              <option value="All">All Regions</option>
              <option value="denver">Denver Metro (CO)</option>
              <option value="california">California (West)</option>
              <option value="new-york">New York / Tri-State</option>
              <option value="other">Other Geographic Hubs</option>
            </select>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 shrink-0 self-end md:self-auto">
            <button 
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded text-xs transition-colors ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Table View (Data Dense)"
            >
              <Table size={15} />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded text-xs transition-colors ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid size={15} />
            </button>
          </div>
        </div>

        {/* Filter Summary & Active Badges */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center space-x-2 text-slate-500">
            <span>Showing <span className="font-semibold text-slate-900 tabular-nums">{filteredAlumni.length}</span> of <span className="tabular-nums">{alumni.length}</span> profiles</span>
            {activeFiltersCount > 0 && (
              <span className="badge-crimson text-[10px]">
                {activeFiltersCount} active filter{activeFiltersCount > 1 ? 's' : ''}
              </span>
            )}
          </div>

          {activeFiltersCount > 0 && (
            <button 
              onClick={handleClearFilters}
              className="text-xs text-rose-700 hover:underline font-medium"
            >
              Reset all filters
            </button>
          )}
        </div>
      </div>

      {/* Main Records Display: Table View OR Grid View */}
      {viewMode === 'table' ? (
        /* Dense Data Table View */
        <div className="card-institutional overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Alumnus Name & Degree</th>
                  <th className="py-3 px-3">Class</th>
                  <th className="py-3 px-4">Current Organization & Role</th>
                  <th className="py-3 px-3">Industry Vertical</th>
                  <th className="py-3 px-3">Metro Location</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-normal">
                {filteredAlumni.map((alum) => (
                  <tr 
                    key={alum.id}
                    onClick={() => navigate(`/alumni/${alum.id}`)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                  >
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 group-hover:text-[#BA0C2F] transition-colors">
                        {alum.name}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-xs">
                        {alum.major}
                      </div>
                    </td>
                    <td className="py-3 px-3 tabular-nums font-medium text-slate-600">
                      '{String(alum.gradYear).slice(2)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800 line-clamp-1">
                        {alum.company}
                      </div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">
                        {alum.headline}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="badge-neutral text-[10px]">
                        {alum.industry}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500 text-[11px] truncate max-w-[140px]">
                      {alum.location}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-[#BA0C2F] font-semibold text-[11px] group-hover:underline inline-flex items-center">
                        Dossier <ChevronRight size={12} className="ml-0.5" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Card Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAlumni.map((alum) => (
            <div 
              key={alum.id} 
              onClick={() => navigate(`/alumni/${alum.id}`)}
              className="card-interactive p-5 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="badge-neutral text-[10px]">
                      Class of {alum.gradYear}
                    </span>
                    <span className="badge-crimson text-[10px]">
                      Verified DU
                    </span>
                  </div>
                  <a 
                    href={`mailto:${alum.email}`} 
                    onClick={(e) => e.stopPropagation()}
                    className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100 transition-colors"
                    title={`Send email to ${alum.name}`}
                  >
                    <Mail size={15} />
                  </a>
                </div>
                
                <h3 className="text-base font-bold text-slate-900 group-hover:text-[#BA0C2F] transition-colors">
                  {alum.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  {alum.major}
                </p>

                <p className="text-xs text-slate-600 line-clamp-2 mt-3 leading-relaxed font-normal">
                  {alum.headline}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center text-slate-600 text-xs">
                  <Briefcase size={12} className="mr-1.5 text-slate-400 shrink-0" />
                  <span className="truncate font-medium">{alum.company}</span>
                </div>
                <div className="flex items-center text-slate-500 text-xs">
                  <MapPin size={12} className="mr-1.5 text-slate-400 shrink-0" />
                  <span className="truncate">{alum.location}</span>
                </div>
                {alum.skills && alum.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {alum.skills.slice(0, 2).map(skill => (
                      <span key={skill} className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Empty State */}
      {filteredAlumni.length === 0 && (
        <div className="card-institutional py-16 text-center space-y-3">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <Search size={20} />
          </div>
          <h3 className="text-base font-bold text-slate-900">No matching alumni records</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            No alumni match the active filters or query. Try refining your keyword, selecting "All Industries", or clearing filters.
          </p>
          <div className="pt-2">
            <button onClick={handleClearFilters} className="btn-secondary">
              Clear All Filters
            </button>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-elevated w-full max-w-xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                  <FileUp size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Import Alumni Spreadsheet (CSV)</h3>
                  <p className="text-[11px] text-slate-500">Append new graduates or verified records to the local directory</p>
                </div>
              </div>
              <button 
                onClick={() => setShowImportModal(false)}
                className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6">
              {importStatus ? (
                <div className="text-center py-8 space-y-3">
                  <CheckCircle size={32} className="text-emerald-600 mx-auto" />
                  <h4 className="text-base font-bold text-slate-900">Import Complete</h4>
                  <p className="text-xs text-slate-600">
                    Successfully parsed and added <span className="font-semibold text-slate-900">{importStatus.count}</span> new profiles to the directory.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Raw CSV Data
                    </label>
                    <p className="text-[11px] text-slate-500 mb-2">
                      Columns should include: Name, Headline, Location, Company, Company industry, Last updated.
                    </p>
                    <textarea 
                      className="w-full h-48 p-3 font-mono text-[11px] bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 focus:bg-white text-slate-800 leading-relaxed"
                      placeholder='"Name","Headline","Location","Company","Company industry","Last updated"&#10;"Alex Morgan","Director of Strategy","Denver, CO","Vanguard","Financial Services","1/26/2026"'
                      value={csvContent}
                      onChange={(e) => setCsvContent(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="flex justify-end space-x-2.5 pt-2">
                    <button 
                      onClick={() => setShowImportModal(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleImportCSV}
                      disabled={!csvContent.trim()}
                      className="btn-primary"
                    >
                      Parse & Ingest Records
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlumniList;
