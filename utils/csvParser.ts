
import { AlumniProfile } from '../types';

const inferSkills = (headline: string, industry: string, major: string): string[] => {
  const text = `${headline} ${industry} ${major}`.toLowerCase();
  const skillsSet = new Set<string>();

  if (text.includes('software') || text.includes('developer') || text.includes('engineer') || text.includes('code') || text.includes('computer science')) {
    skillsSet.add('Software Engineering');
    skillsSet.add('System Architecture');
    skillsSet.add('Full-Stack Development');
  }
  if (text.includes('ai') || text.includes('machine learning') || text.includes('data science') || text.includes('analytics') || text.includes('data analyst')) {
    skillsSet.add('Machine Learning');
    skillsSet.add('Data Analytics');
    skillsSet.add('Python / SQL');
  }
  if (text.includes('finance') || text.includes('wealth') || text.includes('banking') || text.includes('analyst') || text.includes('investment')) {
    skillsSet.add('Financial Modeling');
    skillsSet.add('Portfolio Strategy');
    skillsSet.add('Valuation & Risk');
  }
  if (text.includes('accounting') || text.includes('audit') || text.includes('cpa') || text.includes('tax')) {
    skillsSet.add('Financial Audit');
    skillsSet.add('Tax Compliance');
    skillsSet.add('GAAP Reporting');
  }
  if (text.includes('marketing') || text.includes('brand') || text.includes('social media') || text.includes('communications')) {
    skillsSet.add('Digital Strategy');
    skillsSet.add('Brand Management');
    skillsSet.add('Market Research');
  }
  if (text.includes('real estate') || text.includes('construction') || text.includes('broker') || text.includes('property')) {
    skillsSet.add('Asset Management');
    skillsSet.add('Underwriting');
    skillsSet.add('Project Management');
  }
  if (text.includes('health') || text.includes('hospital') || text.includes('biology') || text.includes('medical') || text.includes('clinic')) {
    skillsSet.add('Healthcare Analytics');
    skillsSet.add('Clinical Research');
    skillsSet.add('Patient Relations');
  }
  if (text.includes('hospitality') || text.includes('event') || text.includes('restaurant') || text.includes('hotel')) {
    skillsSet.add('Event Operations');
    skillsSet.add('Client Relations');
    skillsSet.add('Hospitality Management');
  }
  if (text.includes('law') || text.includes('legal') || text.includes('policy') || text.includes('government') || text.includes('public')) {
    skillsSet.add('Policy Analysis');
    skillsSet.add('Legal Research');
    skillsSet.add('Public Advocacy');
  }

  if (skillsSet.size === 0) {
    skillsSet.add('Strategic Communications');
    skillsSet.add('Cross-functional Leadership');
    skillsSet.add('Project Management');
  }

  return Array.from(skillsSet).slice(0, 4);
};

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

    const cleanName = name.replace(/^"|"$/g, '').trim();
    if (!cleanName) continue;

    const cleanHeadline = headline?.replace(/^"|"$/g, '').trim() || '';
    const cleanLocation = location?.replace(/^"|"$/g, '').trim() || 'Denver, CO';
    const cleanCompany = (company?.replace(/^"|"$/g, '').trim() || '-');
    const cleanIndustry = (industry?.replace(/^"|"$/g, '').trim() || '-');
    const cleanLastUpdated = lastUpdated?.replace(/^"|"$/g, '').trim() || '1/26/2026';

    // Extract grad year if possible from headline, or default to 2024
    const yearMatch = cleanHeadline.match(/20\d{2}/);
    const gradYear = yearMatch ? parseInt(yearMatch[0]) : 2024;

    // Guess major from headline
    let major = 'General Studies';
    const hlLower = cleanHeadline.toLowerCase();
    if (hlLower.includes('computer science') || hlLower.includes('software')) major = 'Computer Science';
    else if (hlLower.includes('accounting') || hlLower.includes('accountancy')) major = 'Accounting';
    else if (hlLower.includes('finance')) major = 'Finance';
    else if (hlLower.includes('marketing')) major = 'Marketing';
    else if (hlLower.includes('biology') || hlLower.includes('biochemistry')) major = 'Biological Sciences';
    else if (hlLower.includes('real estate')) major = 'Real Estate';
    else if (hlLower.includes('construction')) major = 'Construction Management';
    else if (hlLower.includes('hospitality')) major = 'Hospitality Management';
    else if (hlLower.includes('psychology')) major = 'Psychology';
    else if (hlLower.includes('political science') || hlLower.includes('policy')) major = 'Public Policy & Political Science';
    else if (hlLower.includes('economics')) major = 'Economics';
    else if (hlLower.includes('mechanical engineer') || hlLower.includes('engineering')) major = 'Mechanical Engineering';
    else if (hlLower.includes('criminology') || hlLower.includes('law')) major = 'Criminology & Socio-Legal Studies';

    const deterministicId = `alum-${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${i}`;
    const skills = inferSkills(cleanHeadline, cleanIndustry, major);

    results.push({
      id: deterministicId,
      name: cleanName,
      email: `${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@alumni.du.edu`,
      gradYear,
      major,
      currentRole: cleanHeadline || 'Alumnus',
      company: cleanCompany !== '-' ? cleanCompany : 'Independent Practice',
      location: cleanLocation !== '-' ? cleanLocation : 'Denver, CO',
      industry: cleanIndustry !== '-' ? cleanIndustry : 'General Industry',
      skills,
      headline: cleanHeadline,
      lastUpdated: cleanLastUpdated,
      bio: `${cleanName} is a University of Denver alumnus (Class of ${gradYear}, ${major}). Currently based in ${cleanLocation}, working as ${cleanHeadline || 'Professional'}.`
    });
  }

  return results;
};
