
import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Mail, MapPin, Briefcase, Calendar, 
  Linkedin, Shield, Plus, MessageSquare, Phone, Users
} from 'lucide-react';
import { getAlumni, getInteractions, addInteraction } from '../services/db';
import { Interaction } from '../types';

const AlumniDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showInteractionForm, setShowInteractionForm] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [type, setType] = useState<Interaction['type']>('Email');

  const alumni = useMemo(() => getAlumni().find(a => a.id === id), [id]);
  const interactions = useMemo(() => getInteractions(id), [id]);

  if (!alumni) return <div className="p-8 text-center text-slate-500">Alumnus not found.</div>;

  const handleAddInteraction = (e: React.FormEvent) => {
    e.preventDefault();
    const interaction: Interaction = {
      id: Date.now().toString(),
      alumniId: alumni.id,
      date: new Date().toLocaleDateString(),
      type,
      notes: newNote,
      staffName: 'Admin Staff'
    };
    addInteraction(interaction);
    setNewNote('');
    setShowInteractionForm(false);
    // In a real app we'd refresh state here
    window.location.reload();
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={() => navigate('/alumni')}
        className="flex items-center space-x-2 text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft size={18} />
        <span className="font-medium">Back to Directory</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center">
            <div className="w-24 h-24 mx-auto mb-4 rounded-3xl bg-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-indigo-200">
              {alumni.name.split(' ').map(n => n[0]).join('')}
            </div>
            <h1 className="text-2xl font-bold text-slate-900">{alumni.name}</h1>
            <p className="text-slate-500 font-medium">{alumni.currentRole} at {alumni.company}</p>
            
            <div className="mt-8 pt-8 border-t border-slate-100 space-y-4">
              <div className="flex items-center justify-center space-x-3 text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer">
                <Mail size={18} />
                <span className="text-sm font-medium">{alumni.email}</span>
              </div>
              <div className="flex items-center justify-center space-x-3 text-slate-600">
                <MapPin size={18} />
                <span className="text-sm font-medium">{alumni.location}</span>
              </div>
              <div className="flex items-center justify-center space-x-3 text-slate-600">
                <Shield size={18} />
                <span className="text-sm font-medium">{alumni.industry}</span>
              </div>
            </div>

            <div className="mt-8 flex justify-center space-x-4">
               {alumni.linkedinUrl && (
                 <a href={alumni.linkedinUrl} target="_blank" rel="noreferrer" className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                    <Linkedin size={20} />
                 </a>
               )}
               <button className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                  <Mail size={20} />
               </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">Skills & Expertise</h3>
            <div className="flex flex-wrap gap-2">
              {alumni.skills.map(skill => (
                <span key={skill} className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-lg">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Info & History */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Career Overview</h2>
              <div className="flex items-center space-x-2 text-indigo-600 text-sm font-semibold">
                <Calendar size={16} />
                <span>Class of {alumni.gradYear}</span>
              </div>
            </div>
            <div className="space-y-4">
               <div className="flex items-start space-x-4">
                  <div className="p-2 bg-indigo-50 rounded-lg shrink-0">
                    <Briefcase size={20} className="text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Education</h4>
                    <p className="text-slate-600 leading-relaxed">
                      Graduated in {alumni.gradYear} with a degree in {alumni.major}. 
                    </p>
                  </div>
               </div>
               <div className="flex items-start space-x-4">
                  <div className="p-2 bg-indigo-50 rounded-lg shrink-0">
                    <Users size={20} className="text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">About</h4>
                    <p className="text-slate-600 leading-relaxed">
                      {alumni.bio || "No detailed bio available yet."}
                    </p>
                  </div>
               </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-slate-900">Engagement History</h2>
              <button 
                onClick={() => setShowInteractionForm(!showInteractionForm)}
                className="bg-slate-900 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-slate-800 transition-colors"
              >
                <Plus size={18} />
                <span>Log Activity</span>
              </button>
            </div>

            {showInteractionForm && (
              <form onSubmit={handleAddInteraction} className="mb-8 p-6 bg-slate-50 rounded-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Interaction Type</label>
                    <select 
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      value={type}
                      onChange={(e) => setType(e.target.value as any)}
                    >
                      <option>Email</option>
                      <option>Call</option>
                      <option>Meeting</option>
                      <option>LinkedIn</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Notes</label>
                  <textarea 
                    className="w-full p-3 bg-white border border-slate-200 rounded-lg h-24 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="Describe the interaction..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="mt-4 flex justify-end space-x-3">
                  <button 
                    type="button" 
                    onClick={() => setShowInteractionForm(false)}
                    className="px-4 py-2 text-slate-600 font-semibold hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    Save Activity
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-6">
              {interactions.length > 0 ? (
                interactions.slice().reverse().map((interaction, i) => (
                  <div key={interaction.id} className="relative flex space-x-4">
                    {i !== interactions.length - 1 && (
                      <div className="absolute left-5 top-10 bottom-0 w-px bg-slate-100"></div>
                    )}
                    <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${
                      interaction.type === 'Email' ? 'bg-blue-50 text-blue-600' :
                      interaction.type === 'Call' ? 'bg-green-50 text-green-600' :
                      'bg-purple-50 text-purple-600'
                    }`}>
                      {interaction.type === 'Email' ? <Mail size={18} /> : 
                       interaction.type === 'Call' ? <Phone size={18} /> : 
                       <MessageSquare size={18} />}
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-slate-900">{interaction.type} with {alumni.name}</h4>
                        <span className="text-sm text-slate-400 font-medium">{interaction.date}</span>
                      </div>
                      <p className="text-slate-600 text-sm mb-2">{interaction.notes}</p>
                      <p className="text-xs text-slate-400 font-medium italic">Logged by {interaction.staffName}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <p className="text-slate-500">No interaction history found for this alumni.</p>
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
