export type TemplateType =
  | 'professional'
  | 'corporate'
  | 'minimal'
  | 'executive'
  | 'creative'
  | 'medical'
  | 'business'
  | 'luxury';

export interface ProfileService {
  id: string;
  name: string;
  description: string;
  image?: string;
  link?: string;
}

export interface CompanyInfo {
  name?: string;
  logo?: string;
  description?: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export interface Profile {
  id: string;
  full_name: string;
  username: string;
  job_title: string;
  company: string;
  bio: string;
  profile_photo: string;
  cover_image: string;
  phone: string;
  whatsapp: string;
  whatsapp_default_message?: string;
  email: string;
  website: string;
  address: string;
  maps_url?: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  twitter?: string; // X
  tiktok?: string;
  youtube?: string;
  telegram?: string;
  services: ProfileService[];
  business_hours?: string;
  cta_text?: string;
  cta_url?: string;
  company_info?: CompanyInfo;
  template: TemplateType;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  views: number;
  contact_saves: number;
  whatsapp_clicks: number;
  phone_clicks: number;
  email_clicks: number;
  website_clicks: number;
  qr_scans: number;
}

export interface AdminStats {
  totalProfiles: number;
  activeProfiles: number;
  inactiveProfiles: number;
  totalViews: number;
  totalContactSaves: number;
  totalWhatsAppClicks: number;
  totalPhoneClicks: number;
}

export type AnalyticsEventType =
  | 'view'
  | 'contact_save'
  | 'whatsapp'
  | 'phone'
  | 'email'
  | 'website'
  | 'qr_scan';
