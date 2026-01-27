
export interface AlumniProfile {
  id: string;
  name: string;
  email: string;
  gradYear: number;
  major: string;
  currentRole: string;
  company: string;
  location: string;
  industry: string;
  skills: string[];
  headline?: string;
  linkedinUrl?: string;
  bio?: string;
  lastUpdated?: string;
  lastContacted?: string;
}

export interface Interaction {
  id: string;
  alumniId: string;
  date: string;
  type: 'Email' | 'Meeting' | 'Call' | 'LinkedIn';
  notes: string;
  staffName: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedAlumniIds?: string[];
}
