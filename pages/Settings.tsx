import React, { useState, useMemo } from 'react';
import { 
  Database, ShieldCheck, Download, RotateCcw, Trash2, 
  Sparkles, CheckCircle2, Server, Building, Layers, 
  HardDrive, AlertTriangle, ArrowRight, ExternalLink
} from 'lucide-react';
import { getAlumni, getInteractions, resetToCSV, clearInteractions, exportAlumniToCSV, exportDatabaseToJSON, getDatabaseStats } from '../services/db';

const Settings = () => {
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [clearNotesModalOpen, setClearNotesModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const stats = useMemo(() => getDatabaseStats(), []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDownloadCSV = () => {
    const csvData = exportAlumniToCSV();
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `alumni_directory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Alumni directory exported as CSV.');
  };

  const handleDownloadJSON = () => {
    const jsonData = exportDatabaseToJSON();
    const blob = new Blob([jsonData], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `alumniconnect_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Full system backup exported as JSON.');
  };

  const handleConfirmReset = () => {
    resetToCSV();
    setResetModalOpen(false);
    showToast('Database reset to official University of Denver alumni records.');
    setTimeout(() => window.location.reload(), 1000);
  };

  const handleConfirmClearNotes = () => {
    clearInteractions();
    setClearNotesModalOpen(false);
    showToast('Engagement logs cleared.');
    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-elevated flex items-center space-x-2 text-xs font-medium border border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <span>Administration</span>
            <span>•</span>
            <span>System Operations</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">System & Database Settings</h1>
          <p className="text-slate-500 text-sm mt-1">
            Configure institutional parameters, manage local persistent data, and audit Gemini AI connectivity.
          </p>
        </div>
        <div className="flex items-center space-x-2.5">
          <button onClick={handleDownloadCSV} className="btn-secondary">
            <Download size={14} className="mr-1.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <button onClick={handleDownloadJSON} className="btn-primary">
            <HardDrive size={14} className="mr-1.5 text-slate-300" />
            <span>JSON Backup</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* System Summary Card */}
        <div className="card-institutional p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Directory Capacity</span>
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          </div>
          <div className="text-3xl font-bold text-slate-900 tracking-tight tabular-nums">
            {stats.totalAlumni}
          </div>
          <p className="text-xs text-slate-500 mt-1">Verified alumni records indexed</p>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Industries tracked</span>
            <span className="font-semibold text-slate-900">{stats.distinctIndustries}</span>
          </div>
        </div>

        {/* Engagement Records Card */}
        <div className="card-institutional p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Advancement Touchpoints</span>
            <span className="badge-neutral">Local Store</span>
          </div>
          <div className="text-3xl font-bold text-slate-900 tracking-tight tabular-nums">
            {stats.totalInteractions}
          </div>
          <p className="text-xs text-slate-500 mt-1">Logged calls, meetings & emails</p>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Storage footprint</span>
            <span className="font-semibold text-slate-900 tabular-nums">~{Math.round(stats.approxStorageBytes / 1024)} KB</span>
          </div>
        </div>

        {/* Intelligence Status Card */}
        <div className="card-institutional p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Discovery Model</span>
            <span className="badge-crimson">Active</span>
          </div>
          <div className="text-lg font-bold text-slate-900 tracking-tight">
            Gemini 3 Flash
          </div>
          <p className="text-xs text-slate-500 mt-1">Structured semantic match engine</p>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Inference format</span>
            <span className="font-mono text-[11px] text-slate-700">application/json</span>
          </div>
        </div>
      </div>

      {/* Institutional Metadata Section */}
      <div className="card-institutional p-6">
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
          <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
            <Building size={18} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">Institution & Division Credentials</h2>
            <p className="text-xs text-slate-500">Identity details associated with this advancement deployment</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-5 text-sm">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">Institution</label>
            <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-800 font-medium">
              University of Denver
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">Division / Department</label>
            <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-800 font-medium">
              Office of Advancement & University Relations
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">Primary Campus</label>
            <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-800 font-medium">
              University Park, Denver, CO 80208
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">Reporting Cohort & Fiscal Period</label>
            <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-800 font-medium">
              Fiscal Year 2026 (FY26) • Active Directory
            </div>
          </div>
        </div>
      </div>

      {/* Intelligence Engine Settings */}
      <div className="card-institutional p-6">
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
          <div className="w-9 h-9 rounded-lg bg-rose-50 flex items-center justify-center text-[#BA0C2F]">
            <Server size={18} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">Intelligence Engine (Google GenAI)</h2>
            <p className="text-xs text-slate-500">Semantic retrieval parameters for alumni discovery and matching</p>
          </div>
        </div>

        <div className="space-y-4 pt-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 border border-slate-200/80 rounded-lg gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">Gemini 3 Flash Preview</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Low-latency, high-precision model for natural language alumni query parsing and structured ID matching.
              </p>
            </div>
            <span className="badge-emerald shrink-0">System Ready</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 border border-slate-200/80 rounded-lg gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">API Key Authentication</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Loaded via environment variable <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-700 text-[11px]">GEMINI_API_KEY</code>
              </p>
            </div>
            <span className="badge-neutral shrink-0">Environment Configured</span>
          </div>
        </div>
      </div>

      {/* Data Maintenance & Danger Zone */}
      <div className="card-institutional p-6 border-slate-200">
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
          <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
            <Layers size={18} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">Data Management & Maintenance</h2>
            <p className="text-xs text-slate-500">Backup, restore, and reset directory data tables</p>
          </div>
        </div>

        <div className="divide-y divide-slate-100 pt-1">
          <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-900">Export Complete Alumni Directory</p>
              <p className="text-xs text-slate-500">Download formatted CSV file with all 349 profiles and enriched skill tags.</p>
            </div>
            <button onClick={handleDownloadCSV} className="btn-secondary shrink-0">
              <Download size={14} className="mr-1.5" />
              <span>Download CSV</span>
            </button>
          </div>

          <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-900">Clear Engagement Touchpoint Logs</p>
              <p className="text-xs text-slate-500">Removes staff activity history without affecting alumni profile records.</p>
            </div>
            <button onClick={() => setClearNotesModalOpen(true)} className="btn-secondary text-amber-700 hover:text-amber-800 shrink-0">
              <Trash2 size={14} className="mr-1.5" />
              <span>Clear Activity</span>
            </button>
          </div>

          <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-rose-900">Reset to Default Pioneer Records</p>
              <p className="text-xs text-slate-500">Restores all original 349 profiles from the institutional dataset and clears manual changes.</p>
            </div>
            <button onClick={() => setResetModalOpen(true)} className="btn-secondary text-rose-700 hover:text-rose-800 border-rose-200 hover:bg-rose-50 shrink-0">
              <RotateCcw size={14} className="mr-1.5" />
              <span>Restore Factory Dataset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal: Reset Dataset */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-elevated w-full max-w-md p-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 text-rose-700 mb-3">
              <AlertTriangle size={22} />
              <h3 className="text-base font-bold text-slate-900">Confirm Database Reset</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-5">
              This action will reset all alumni profiles back to the standard University of Denver source dataset. Any locally created or imported profiles will be removed.
            </p>
            <div className="flex justify-end space-x-2.5">
              <button onClick={() => setResetModalOpen(false)} className="btn-secondary">
                Cancel
              </button>
              <button onClick={handleConfirmReset} className="btn-crimson">
                Reset to Standard Dataset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Clear Notes */}
      {clearNotesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-elevated w-full max-w-md p-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 text-amber-700 mb-3">
              <AlertTriangle size={22} />
              <h3 className="text-base font-bold text-slate-900">Clear Engagement Activity</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-5">
              Are you sure you want to clear all logged touchpoints, calls, and email notes? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2.5">
              <button onClick={() => setClearNotesModalOpen(false)} className="btn-secondary">
                Cancel
              </button>
              <button onClick={handleConfirmClearNotes} className="btn-primary">
                Clear All Logs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
