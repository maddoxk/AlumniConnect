
import { AlumniProfile } from '../types';

export const parseAlumniCSV = (csvText: string): AlumniProfile[] => {
  const lines = csvText.split('\n');
  const results: AlumniProfile[] = [];
  
  // Basic CSV parser that handles quotes
  const parseLine = (line: string) => {
    const parts = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') inQuotes = !inQuotes;
      else if (char === ',' && !inQuotes) {
        parts.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    parts.push(current.trim());
    return parts;
  };

  // Skip header and empty lines
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith('"Name"') || line === '""') continue;

    const [name, headline, location, company, industry, lastUpdated] = parseLine(line);
    
    if (!name) continue;

    // Extract grad year if possible from headline, or default to 2024 (common in this set)
    const yearMatch = headline?.match(/20\d{2}/);
    const gradYear = yearMatch ? parseInt(yearMatch[0]) : 2024;

    // Guess major from headline (very rough)
    let major = 'General Studies';
    if (headline?.toLowerCase().includes('computer science')) major = 'Computer Science';
    else if (headline?.toLowerCase().includes('accounting')) major = 'Accounting';
    else if (headline?.toLowerCase().includes('finance')) major = 'Finance';
    else if (headline?.toLowerCase().includes('marketing')) major = 'Marketing';
    else if (headline?.toLowerCase().includes('biology')) major = 'Biology';
    else if (headline?.toLowerCase().includes('real estate')) major = 'Real Estate';

    results.push({
      id: Math.random().toString(36).substr(2, 9),
      name: name.replace(/^"|"$/g, ''),
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      gradYear,
      major,
      currentRole: headline?.replace(/^"|"$/g, '') || 'Alumni',
      company: company?.replace(/^"|"$/g, '') || 'Independent',
      location: location?.replace(/^"|"$/g, '') || 'Unknown',
      industry: industry?.replace(/^"|"$/g, '') || 'Other',
      skills: [], // Skills aren't in the CSV, would need enrichment
      headline: headline?.replace(/^"|"$/g, ''),
      lastUpdated: lastUpdated?.replace(/^"|"$/g, ''),
      bio: headline?.replace(/^"|"$/g, '')
    });
  }

  return results;
};
