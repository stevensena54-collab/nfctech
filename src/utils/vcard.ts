import { Profile } from '../types';

export function generateVCardString(profile: Profile): string {
  const nameParts = profile.full_name.trim().split(/\s+/);
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  const cleanPhone = profile.phone.replace(/[^\d+]/g, '');
  const cleanWhatsapp = profile.whatsapp.replace(/[^\d+]/g, '');

  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${profile.full_name}`,
    `N:${lastName};${firstName};;;`,
  ];

  if (profile.company) {
    lines.push(`ORG:${profile.company}`);
  }

  if (profile.job_title) {
    lines.push(`TITLE:${profile.job_title}`);
  }

  if (profile.phone) {
    lines.push(`TEL;TYPE=CELL,VOICE;VALUE=uri:tel:${cleanPhone}`);
  }

  if (profile.whatsapp) {
    lines.push(`TEL;TYPE=MSG,WHATSAPP;VALUE=uri:tel:${cleanWhatsapp}`);
  }

  if (profile.email) {
    lines.push(`EMAIL;TYPE=WORK,INTERNET:${profile.email}`);
  }

  if (profile.website) {
    lines.push(`URL:${profile.website}`);
  }

  if (profile.address) {
    const escapedAddr = profile.address.replace(/,/g, '\\,');
    lines.push(`ADR;TYPE=WORK:;;${escapedAddr};;;;`);
  }

  if (profile.bio) {
    const escapedBio = profile.bio.replace(/\n/g, '\\n');
    lines.push(`NOTE:${escapedBio}`);
  }

  if (profile.profile_photo) {
    lines.push(`PHOTO;VALUE=URI:${profile.profile_photo}`);
  }

  lines.push('END:VCARD');
  return lines.join('\r\n');
}

export function downloadVCard(profile: Profile): void {
  const vcardText = generateVCardString(profile);
  const blob = new Blob([vcardText], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  
  const sanitizedFilename = (profile.full_name || profile.username || 'contact')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_');
    
  a.download = `${sanitizedFilename}.vcf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
