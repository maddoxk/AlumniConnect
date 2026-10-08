import React, { useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Mail, MapPin, Briefcase, Calendar, 
  Linkedin, Shield, Plus, MessageSquare, Phone, 
  Users, CheckCircle2, Copy, Check, ExternalLink,
  GraduationCap, Clock, Building, Award
} from 'lucide-react';
import { getAlumni, getInteractions, addInteraction } from '../services/db';
import { Interaction } from '../types';

const AlumniDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showInteractionForm, setShowInteractionForm] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [type, setType] = useState<Interaction['type']>('Email');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [interactionList, setInteractionList] = useState<Interaction[]>([]);

  const alumni = useMemo(() => getAlumni().find(a => a.id === id), [id]);

  // Load interactions into state so we don't need window.location.reload()
  React.useEffect(() => {
    if (id) {
      setInteractionList(getInteractions(id));
    }
  }, [id]);

  if (!alumni) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Alumnus Record Not Found</h2>
        <p className="text-xs text-slate-500">The profile ID requested does not exist in the active Pioneer directory.</p>
        <Link to="/alumni" className="btn-secondary">
          Return to Directory
        </Link>
      </div>
    );
  }

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(alumni.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleAddInteraction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const interaction: Interaction = {
      id: Date.now().toString(),
      alumniId: alumni.id,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      type,
      notes: newNote,
      staffName: 'Advancement Officer'
    };
    addInteraction(interaction);
    setInteractionList(prev => [...prev, interaction]);
    setNewNote('');
    setShowInteractionForm(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Back Link */}
      <div>
        <button 
          onClick={() => navigate('/alumni')}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Alumni Directory</span>
        </button>
      </div>

      {/* Alumnus Executive Dossier Header Card */}
      <div className="card-institutional p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start space-x-5">
            <div className="w-16 h-16 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xl font-bold shrink-0 border border-slate-700">
              {alumni.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="badge-crimson text-[10px]">
                  Class of {alumni.gradYear}
                </span>
                <span className="badge-neutral text-[10px]">
                  University of Denver Alum
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {alumni.name}
              </h1>
              <p className="text-sm font-medium text-slate-700 mt-0.5">
                {alumni.headline || alumni.currentRole}
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-2">
                <span className="flex items-center">
                  <Briefcase size={12} className="mr-1 text-slate-400" />
                  {alumni.company}
                </span>
                <span className="flex items-center">
                  <MapPin size={12} className="mr-1 text-slate-400" />
                  {alumni.location}
                </span>
                <span className="flex items-center">
                  <GraduationCap size={12} className="mr-1 text-slate-400" />
                  {alumni.major}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons Toolbar */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto shrink-0">
            <button 
              onClick={handleCopyEmail}
              className="btn-secondary"
              title="Copy official email address"
            >
              {copiedEmail ? <Check size={14} className="mr-1.5 text-emerald-600" /> : <Copy size={14} className="mr-1.5 text-slate-400" />}
              <span>{copiedEmail ? 'Copied' : 'Copy Email'}</span>
            </button>
            <a 
              href={`mailto:${alumni.email}`}
              className="btn-secondary"
            >
              <Mail size={14} className="mr-1.5 text-slate-400" />
              <span>Send Email</span>
            </a>
            <button 
              onClick={() => setShowInteractionForm(true)}
              className="btn-primary"
            >
              <Plus size={14} className="mr-1.5 text-slate-300" />
              <span>Log Touchpoint</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Academic & Professional Credentials */}
        <div className="space-y-6 lg:col-span-1">
          {/* Record Metadata Card */}
          <div className="card-institutional p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Institutional Record
            </h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Primary Email</span>
                <span className="font-mono text-slate-800 break-all">{alumni.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Degree / Major</span>
                <span className="font-semibold text-slate-800">{alumni.major}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Graduation Year</span>
                <span className="font-semibold text-slate-800 tabular-nums">Class of {alumni.gradYear}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Industry Vertical</span>
                <span className="font-semibold text-slate-800">{alumni.industry}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Record Last Updated</span>
                <span className="text-slate-600">{alumni.lastUpdated || 'Current FY26 Cycle'}</span>
              </div>
            </div>
          </div>

          {/* Core Competencies Card */}
          <div className="card-institutional p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Core Competencies & Skills
            </h3>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {alumni.skills && alumni.skills.length > 0 ? (
                alumni.skills.map(skill => (
                  <span key={skill} className="badge-neutral text-[11px]">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">No specific skills indexed</span>
              )}
            </div>
          </div>

          {/* Mentorship & University Engagement Readiness */}
          <div className="card-institutional p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Campus Engagement Availability
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-slate-700">
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                <span>Student Career Mentorship</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-700">
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                <span>Department Guest Panels</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-700">
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                <span>Regional Pioneer Chapter Events</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Bio Summary & Advancement Timeline */}
        <div className="space-y-6 lg:col-span-2">
          {/* Biography & Overview */}
          <div className="card-institutional p-6">
            <h2 className="text-sm font-bold text-slate-900 mb-2">
              Background Summary
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              {alumni.bio || `${alumni.name} is a University of Denver alumnus who graduated in ${alumni.gradYear} with a degree in ${alumni.major}. Currently serving as ${alumni.headline || 'Professional'} based in ${alumni.location}.`}
            </p>
          </div>

          {/* Engagement History Module */}
          <div className="card-institutional p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Advancement Engagement Log</h2>
                <p className="text-xs text-slate-500 mt-0.5">Staff notes, meeting summaries, and communications history</p>
              </div>
              <button 
                onClick={() => setShowInteractionForm(!showInteractionForm)}
                className="btn-secondary"
              >
                <Plus size={14} className="mr-1.5 text-slate-500" />
                <span>Log New Touchpoint</span>
              </button>
            </div>

            {/* Inline Log Interaction Form */}
            {showInteractionForm && (
              <form onSubmit={handleAddInteraction} className="p-4 bg-slate-50 border border-slate-200/80 rounded-lg space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Document Touchpoint</h3>
                  <button 
                    type="button" 
                    onClick={() => setShowInteractionForm(false)}
                    className="text-slate-400 hover:text-slate-600 text-xs"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Interaction Medium</label>
                    <select 
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 text-slate-800"
                      value={type}
                      onChange={(e) => setType(e.target.value as any)}
                    >
                      <option value="Email">Email Outreach</option>
                      <option value="Call">Phone Call</option>
                      <option value="Meeting">In-Person Meeting</option>
                      <option value="LinkedIn">LinkedIn Message</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Staff Member</label>
                    <input 
                      type="text" 
                      disabled 
                      value="Advancement Officer"
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-lg text-slate-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Engagement Notes</label>
                  <textarea 
                    className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 text-slate-800 h-20"
                    placeholder="Summary of conversation, mentorship interest, career updates, or next steps..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    required
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-2 pt-1">
                  <button 
                    type="button" 
                    onClick={() => setShowInteractionForm(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary"
                  >
                    Save to Record
                  </button>
                </div>
              </form>
            )}

            {/* Interaction List */}
            <div className="space-y-4">
              {interactionList.length > 0 ? (
                interactionList.slice().reverse().map((interaction) => (
                  <div key={interaction.id} className="p-4 bg-slate-50/60 border border-slate-200/60 rounded-lg space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="badge-neutral font-semibold">
                          {interaction.type}
                        </span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-500 font-medium">Logged by {interaction.staffName}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 tabular-nums">{interaction.date}</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-normal pt-1">
                      {interaction.notes}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 bg-slate-50/50 rounded-lg border border-dashed border-slate-200 text-xs text-slate-500 space-y-2">
                  <MessageSquare size={20} className="mx-auto text-slate-300 mb-1" />
                  <p className="font-medium text-slate-700">No engagement notes recorded for this alumnus</p>
                  <p className="text-slate-400 max-w-xs mx-auto">
                    Click "Log New Touchpoint" to document phone calls, coffee chats, or email follow-ups.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniDetail;
