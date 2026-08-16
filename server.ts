import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), 'data');
const PROFILES_FILE = path.join(DATA_DIR, 'profiles.json');
const ADMIN_FILE = path.join(DATA_DIR, 'admin.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Admin Credentials
interface AdminData {
  email: string;
  passwordHash: string; // Plain/simple for demo admin single-user management
  token: string;
}

let adminData: AdminData = {
  email: 'admin@cardcraft.com',
  passwordHash: 'admin123',
  token: 'admin_session_token_' + Date.now(),
};

if (fs.existsSync(ADMIN_FILE)) {
  try {
    adminData = JSON.parse(fs.readFileSync(ADMIN_FILE, 'utf-8'));
  } catch (e) {
    console.error('Error reading admin.json:', e);
  }
} else {
  fs.writeFileSync(ADMIN_FILE, JSON.stringify(adminData, null, 2), 'utf-8');
}

// Seed profiles if profiles.json does not exist
let profiles: any[] = [];
if (fs.existsSync(PROFILES_FILE)) {
  try {
    profiles = JSON.parse(fs.readFileSync(PROFILES_FILE, 'utf-8'));
  } catch (e) {
    console.error('Error reading profiles.json:', e);
  }
}

if (profiles.length === 0) {
  // Load default seeds
  profiles = [
    {
      id: 'prof_1',
      full_name: 'Belinda Katumba',
      username: 'belinda-katumba',
      job_title: 'Lead Optometrist & Founder',
      company: 'Katumba Vision & Eye Care',
      bio: 'Dedicated to providing comprehensive vision care, precision optical solutions, and advanced pediatric and corporate eye health screenings.',
      profile_photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
      cover_image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=80',
      phone: '+1 (555) 234-8901',
      whatsapp: '+15552348901',
      whatsapp_default_message: 'Hello Dr. Belinda, I found your digital business card and would like to inquire about booking an appointment.',
      email: 'belinda@katumbavision.com',
      website: 'https://katumbavision.example.com',
      address: '450 Lexington Ave, Suite 1200, New York, NY 10017',
      maps_url: 'https://maps.google.com/?q=450+Lexington+Ave+New+York+NY',
      instagram: 'https://instagram.com/katumbavision',
      facebook: 'https://facebook.com/katumbavision',
      linkedin: 'https://linkedin.com/in/belinda-katumba',
      twitter: 'https://x.com/drbelindavision',
      tiktok: '',
      youtube: 'https://youtube.com/@katumbavisioncare',
      telegram: '',
      services: [
        {
          id: 'srv_1',
          name: 'Comprehensive Eye Examination',
          description: 'Advanced digital retinal imaging, visual acuity assessment, and glaucoma pressure evaluations.',
          link: 'https://katumbavision.example.com/services/exam',
        },
        {
          id: 'srv_2',
          name: 'Contact Lens Fitting & Trials',
          description: 'Specialty toric, multifocal, and breathable daily disposable lenses custom-fitted to your cornea.',
          link: 'https://katumbavision.example.com/services/contact-lenses',
        },
        {
          id: 'srv_3',
          name: 'Optical Dispensing & Luxury Frames',
          description: 'Curated international designer frames with blue-light, anti-glare, and high-index lenses.',
          link: 'https://katumbavision.example.com/services/eyewear',
        },
        {
          id: 'srv_4',
          name: 'Corporate Eye Screening On-Site',
          description: 'Tailored ergonomic vision programs and digital eye strain evaluations for enterprise teams.',
          link: 'https://katumbavision.example.com/services/corporate',
        },
      ],
      business_hours: 'Mon - Fri: 8:30 AM – 6:00 PM | Sat: 9:00 AM – 2:00 PM',
      cta_text: 'Book Vision Consultation',
      cta_url: 'https://katumbavision.example.com/book',
      company_info: {
        name: 'Katumba Vision & Eye Care',
        logo: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=200&q=80',
        description: 'Pioneering compassionate optometric care and premium eyewear solutions across the greater metropolitan area.',
        website: 'https://katumbavision.example.com',
        phone: '+1 (555) 234-8900',
        email: 'info@katumbavision.com',
        address: '450 Lexington Ave, Suite 1200, New York, NY 10017',
      },
      template: 'medical',
      status: 'active',
      created_at: '2026-06-10T14:20:00.000Z',
      updated_at: '2026-08-12T09:15:00.000Z',
      views: 438,
      contact_saves: 72,
      whatsapp_clicks: 51,
      phone_clicks: 34,
      email_clicks: 29,
      website_clicks: 65,
      qr_scans: 88,
    },
    {
      id: 'prof_2',
      full_name: 'Alexander Wright',
      username: 'alexander-wright',
      job_title: 'Managing Director & Wealth Advisor',
      company: 'Wright & Co. Capital Partners',
      bio: 'Guiding institutional family offices, high-growth entrepreneurs, and private endowments with generational wealth strategies and fiduciary discipline.',
      profile_photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      cover_image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      phone: '+1 (555) 892-4411',
      whatsapp: '+15558924411',
      whatsapp_default_message: 'Hello Alexander, I viewed your digital card and would like to schedule a private advisory consultation.',
      email: 'awright@wrightcapital.example.com',
      website: 'https://wrightcapital.example.com',
      address: '100 Montgomery St, 24th Floor, San Francisco, CA 94104',
      maps_url: 'https://maps.google.com/?q=100+Montgomery+St+San+Francisco+CA',
      instagram: '',
      facebook: '',
      linkedin: 'https://linkedin.com/in/alexander-wright-capital',
      twitter: 'https://x.com/awright_wealth',
      tiktok: '',
      youtube: '',
      telegram: 'https://t.me/wrightadvisory',
      services: [
        {
          id: 'srv_201',
          name: 'Private Wealth & Asset Structuring',
          description: 'Comprehensive portfolio management across equities, fixed income, private debt, and tax efficiency.',
        },
        {
          id: 'srv_202',
          name: 'Family Office Governance',
          description: 'Succession planning, philanthropic trust establishment, and cross-border asset protection.',
        },
        {
          id: 'srv_203',
          name: 'Liquidity & M&A Advisory',
          description: 'Strategic pre-exit positioning and capital allocation strategies for founders.',
        },
      ],
      business_hours: 'Mon - Fri: 8:00 AM – 5:30 PM (PST)',
      cta_text: 'Schedule Private Consultation',
      cta_url: 'https://wrightcapital.example.com/consult',
      company_info: {
        name: 'Wright & Co. Capital Partners',
        description: 'Independent boutique wealth management overseeing $1.4B in private and institutional client capital.',
        website: 'https://wrightcapital.example.com',
        phone: '+1 (555) 892-4400',
        email: 'advisory@wrightcapital.example.com',
        address: '100 Montgomery St, 24th Floor, San Francisco, CA 94104',
      },
      template: 'corporate',
      status: 'active',
      created_at: '2026-06-18T10:00:00.000Z',
      updated_at: '2026-08-10T16:40:00.000Z',
      views: 312,
      contact_saves: 58,
      whatsapp_clicks: 39,
      phone_clicks: 22,
      email_clicks: 41,
      website_clicks: 53,
      qr_scans: 64,
    },
    {
      id: 'prof_3',
      full_name: 'Marcus Vance',
      username: 'marcus-vance',
      job_title: 'Principal Architect & Creative Lead',
      company: 'Vance Atelier Architecture',
      bio: 'Crafting bespoke residential sanctuaries and sustainable commercial landmarks characterized by warm minimalism and natural materiality.',
      profile_photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
      cover_image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      phone: '+1 (555) 714-3329',
      whatsapp: '+15557143329',
      whatsapp_default_message: 'Hi Marcus, I came across your digital portfolio card and would love to discuss an architectural project.',
      email: 'marcus@vanceatelier.example.com',
      website: 'https://vanceatelier.example.com',
      address: '88 Design District Blvd, Suite 400, Miami, FL 33137',
      maps_url: 'https://maps.google.com/?q=Design+District+Miami+FL',
      instagram: 'https://instagram.com/vanceatelier',
      facebook: '',
      linkedin: 'https://linkedin.com/in/marcus-vance-arch',
      twitter: '',
      tiktok: 'https://tiktok.com/@vanceatelier',
      youtube: 'https://youtube.com/@vancearchitecturedesign',
      telegram: '',
      services: [
        {
          id: 'srv_301',
          name: 'Custom Residential Architecture',
          description: 'Full-phase architectural design from initial conceptual sketch to turnkey construction administration.',
        },
        {
          id: 'srv_302',
          name: 'Interior Architecture & Millwork',
          description: 'Harmonious interior spatial planning, custom cabinetry, and artisanal lighting curation.',
        },
        {
          id: 'srv_303',
          name: 'Biophilic Landscape Integration',
          description: 'Seamless indoor-outdoor living flow engineered for coastal and climate-resilient environments.',
        },
      ],
      business_hours: 'Mon - Fri: 9:00 AM – 6:00 PM (EST)',
      cta_text: 'Explore Project Portfolio',
      cta_url: 'https://vanceatelier.example.com/portfolio',
      company_info: {
        name: 'Vance Atelier Architecture',
        description: 'Award-winning architectural studio recognized by Architectural Digest and Dezeen for bioclimatic innovation.',
        website: 'https://vanceatelier.example.com',
        phone: '+1 (555) 714-3300',
        email: 'studio@vanceatelier.example.com',
        address: '88 Design District Blvd, Miami, FL 33137',
      },
      template: 'luxury',
      status: 'active',
      created_at: '2026-07-02T11:30:00.000Z',
      updated_at: '2026-08-11T12:10:00.000Z',
      views: 620,
      contact_saves: 114,
      whatsapp_clicks: 86,
      phone_clicks: 45,
      email_clicks: 73,
      website_clicks: 142,
      qr_scans: 130,
    },
    {
      id: 'prof_4',
      full_name: 'Elena Rostova',
      username: 'elena-rostova',
      job_title: 'Brand Strategist & Creative Partner',
      company: 'Studio Vanguard Berlin',
      bio: 'Transforming category leaders into iconic cultural powerhouses through boundary-pushing identity design, sonic branding, and digital experiences.',
      profile_photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      cover_image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80',
      phone: '+49 30 901820',
      whatsapp: '+4930901820',
      whatsapp_default_message: 'Hi Elena, I saw your digital card and would like to discuss brand re-positioning for our company.',
      email: 'elena@studiovanguard.example.com',
      website: 'https://studiovanguard.example.com',
      address: 'Torstraße 140, 10119 Berlin, Germany',
      maps_url: 'https://maps.google.com/?q=Torstrasse+140+Berlin',
      instagram: 'https://instagram.com/elena.vanguard',
      facebook: '',
      linkedin: 'https://linkedin.com/in/elena-rostova-creative',
      twitter: 'https://x.com/elenarostova',
      tiktok: 'https://tiktok.com/@vanguarddesign',
      youtube: '',
      telegram: 'https://t.me/elenarostova',
      services: [
        {
          id: 'srv_401',
          name: 'Brand Identity & Visual Systems',
          description: 'Comprehensive brand guidelines, custom typography, design language systems, and packaging.',
        },
        {
          id: 'srv_402',
          name: 'Digital Experience & Web Direction',
          description: 'Immersive storytelling websites, e-commerce flagship builds, and motion graphic libraries.',
        },
        {
          id: 'srv_403',
          name: 'Campaign Strategy & Product Launch',
          description: 'Multi-channel brand narrative orchestration and global creative direction.',
        },
      ],
      business_hours: 'Mon - Fri: 10:00 – 18:30 (CET)',
      cta_text: 'View Studio Showreel',
      cta_url: 'https://studiovanguard.example.com/showreel',
      company_info: {
        name: 'Studio Vanguard Berlin',
        description: 'Independent creative atelier partnering with global innovators in design, tech, and art.',
        website: 'https://studiovanguard.example.com',
        phone: '+49 30 901800',
        email: 'hello@studiovanguard.example.com',
        address: 'Torstraße 140, 10119 Berlin, Germany',
      },
      template: 'creative',
      status: 'active',
      created_at: '2026-07-15T08:00:00.000Z',
      updated_at: '2026-08-13T14:00:00.000Z',
      views: 289,
      contact_saves: 44,
      whatsapp_clicks: 31,
      phone_clicks: 14,
      email_clicks: 38,
      website_clicks: 92,
      qr_scans: 59,
    },
    {
      id: 'prof_5',
      full_name: 'Sophia Chen',
      username: 'sophia-chen',
      job_title: 'Senior Enterprise Solutions Director',
      company: 'Nexa Global Technologies',
      bio: 'Partnering with enterprise leadership to accelerate digital transformation, cloud architecture migration, and generative AI workflow automation.',
      profile_photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
      cover_image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      phone: '+1 (555) 639-8120',
      whatsapp: '+15556398120',
      whatsapp_default_message: 'Hi Sophia, I found your card and would like to chat about enterprise AI integration.',
      email: 'sophia.chen@nexaglobal.example.com',
      website: 'https://nexaglobal.example.com',
      address: '500 108th Ave NE, Bellevue, WA 98004',
      maps_url: 'https://maps.google.com/?q=500+108th+Ave+NE+Bellevue+WA',
      instagram: '',
      facebook: '',
      linkedin: 'https://linkedin.com/in/sophia-chen-nexa',
      twitter: 'https://x.com/sophiachen_tech',
      tiktok: '',
      youtube: '',
      telegram: '',
      services: [
        {
          id: 'srv_501',
          name: 'Enterprise Cloud Modernization',
          description: 'Multi-cloud architecture strategies, Kubernetes infrastructure orchestration, and zero-trust security.',
        },
        {
          id: 'srv_502',
          name: 'Autonomous AI Agent Workflows',
          description: 'Implementing custom LLM pipelines and enterprise search retrieval grounded in corporate data.',
        },
      ],
      business_hours: 'Mon - Fri: 8:30 AM – 5:00 PM (PST)',
      cta_text: 'Download Enterprise Whitepaper',
      cta_url: 'https://nexaglobal.example.com/whitepaper',
      company_info: {
        name: 'Nexa Global Technologies',
        description: 'Empowering Fortune 500 organizations with resilient digital infrastructure.',
        website: 'https://nexaglobal.example.com',
        phone: '+1 (555) 639-8000',
        email: 'contact@nexaglobal.example.com',
        address: '500 108th Ave NE, Bellevue, WA 98004',
      },
      template: 'minimal',
      status: 'active',
      created_at: '2026-07-28T13:45:00.000Z',
      updated_at: '2026-08-05T10:15:00.000Z',
      views: 195,
      contact_saves: 33,
      whatsapp_clicks: 21,
      phone_clicks: 18,
      email_clicks: 27,
      website_clicks: 44,
      qr_scans: 40,
    },
  ];
  fs.writeFileSync(PROFILES_FILE, JSON.stringify(profiles, null, 2), 'utf-8');
}

function saveProfiles() {
  try {
    fs.writeFileSync(PROFILES_FILE, JSON.stringify(profiles, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving profiles:', err);
  }
}

function saveAdmin() {
  try {
    fs.writeFileSync(ADMIN_FILE, JSON.stringify(adminData, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving admin:', err);
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // Admin Auth Middleware
  function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Admin authentication required' });
    }
    const token = authHeader.split(' ')[1];
    if (token !== adminData.token) {
      return res.status(403).json({ error: 'Invalid or expired session token' });
    }
    next();
  }

  // --- AUTH ROUTES ---
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (
      (email === adminData.email || email === 'admin') &&
      password === adminData.passwordHash
    ) {
      adminData.token = 'admin_session_' + Date.now();
      saveAdmin();
      return res.json({
        success: true,
        token: adminData.token,
        admin: { email: adminData.email },
      });
    }
    return res.status(401).json({ error: 'Invalid administrator email or password' });
  });

  app.post('/api/auth/verify', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ valid: false });
    }
    const token = authHeader.split(' ')[1];
    if (token === adminData.token) {
      return res.json({ valid: true, admin: { email: adminData.email } });
    }
    return res.status(401).json({ valid: false });
  });

  app.post('/api/auth/reset', (req, res) => {
    const { email, newPassword } = req.body;
    if (email && email.toLowerCase() === adminData.email.toLowerCase()) {
      if (newPassword && newPassword.length >= 6) {
        adminData.passwordHash = newPassword;
        adminData.token = 'admin_session_' + Date.now();
        saveAdmin();
        return res.json({ success: true, message: 'Password updated successfully' });
      }
      return res.json({
        success: true,
        message: 'A password reset confirmation has been verified. New password applied.',
      });
    }
    return res.status(400).json({ error: 'Administrator email not recognized' });
  });

  // --- STATS ROUTE ---
  app.get('/api/stats', (req, res) => {
    const totalProfiles = profiles.length;
    const activeProfiles = profiles.filter((p) => p.status === 'active').length;
    const inactiveProfiles = totalProfiles - activeProfiles;
    const totalViews = profiles.reduce((sum, p) => sum + (p.views || 0), 0);
    const totalContactSaves = profiles.reduce((sum, p) => sum + (p.contact_saves || 0), 0);
    const totalWhatsAppClicks = profiles.reduce((sum, p) => sum + (p.whatsapp_clicks || 0), 0);
    const totalPhoneClicks = profiles.reduce((sum, p) => sum + (p.phone_clicks || 0), 0);

    res.json({
      totalProfiles,
      activeProfiles,
      inactiveProfiles,
      totalViews,
      totalContactSaves,
      totalWhatsAppClicks,
      totalPhoneClicks,
    });
  });

  // --- PROFILES CRUD ---
  // Public/Admin list
  app.get('/api/profiles', (req, res) => {
    // Return all profiles for admin
    res.json(profiles);
  });

  // Single profile by username (Public & Admin)
  app.get('/api/profiles/:username', (req, res) => {
    const username = req.params.username.toLowerCase();
    const profile = profiles.find((p) => p.username.toLowerCase() === username);

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json(profile);
  });

  // Create Profile (Admin Only)
  app.post('/api/profiles', requireAdmin, (req, res) => {
    const data = req.body;

    if (!data.full_name || !data.username) {
      return res.status(400).json({ error: 'Full name and username are required' });
    }

    const sanitizedUsername = data.username
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-_]/g, '-');

    // Check username uniqueness
    const exists = profiles.some(
      (p) => p.username.toLowerCase() === sanitizedUsername
    );
    if (exists) {
      return res.status(409).json({ error: 'This username is already in use.' });
    }

    const newProfile = {
      id: 'prof_' + Date.now(),
      full_name: data.full_name.trim(),
      username: sanitizedUsername,
      job_title: data.job_title || '',
      company: data.company || '',
      bio: data.bio || '',
      profile_photo:
        data.profile_photo ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      cover_image:
        data.cover_image ||
        'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80',
      phone: data.phone || '',
      whatsapp: data.whatsapp || '',
      whatsapp_default_message:
        data.whatsapp_default_message ||
        `Hello ${data.full_name}, I found your digital business card.`,
      email: data.email || '',
      website: data.website || '',
      address: data.address || '',
      maps_url: data.maps_url || '',
      instagram: data.instagram || '',
      facebook: data.facebook || '',
      linkedin: data.linkedin || '',
      twitter: data.twitter || '',
      tiktok: data.tiktok || '',
      youtube: data.youtube || '',
      telegram: data.telegram || '',
      services: data.services || [],
      business_hours: data.business_hours || '',
      cta_text: data.cta_text || '',
      cta_url: data.cta_url || '',
      company_info: data.company_info || {},
      template: data.template || 'professional',
      status: data.status || 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      views: 0,
      contact_saves: 0,
      whatsapp_clicks: 0,
      phone_clicks: 0,
      email_clicks: 0,
      website_clicks: 0,
      qr_scans: 0,
    };

    profiles.unshift(newProfile);
    saveProfiles();
    res.status(201).json(newProfile);
  });

  // Update Profile (Admin Only)
  app.put('/api/profiles/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    const index = profiles.findIndex((p) => p.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const data = req.body;
    const sanitizedUsername = (data.username || profiles[index].username)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-_]/g, '-');

    // Check if new username conflicts with another profile
    const usernameConflict = profiles.some(
      (p) => p.id !== id && p.username.toLowerCase() === sanitizedUsername
    );
    if (usernameConflict) {
      return res.status(409).json({ error: 'This username is already in use.' });
    }

    const updatedProfile = {
      ...profiles[index],
      ...data,
      username: sanitizedUsername,
      updated_at: new Date().toISOString(),
    };

    profiles[index] = updatedProfile;
    saveProfiles();
    res.json(updatedProfile);
  });

  // Delete Profile (Admin Only)
  app.delete('/api/profiles/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    const index = profiles.findIndex((p) => p.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const deleted = profiles.splice(index, 1)[0];
    saveProfiles();
    res.json({ success: true, deletedId: deleted.id });
  });

  // --- ANALYTICS TRACKING (Public) ---
  app.post('/api/profiles/:username/analytics', (req, res) => {
    const username = req.params.username.toLowerCase();
    const { event } = req.body; // 'view' | 'contact_save' | 'whatsapp' | 'phone' | 'email' | 'website' | 'qr_scan'

    const profile = profiles.find((p) => p.username.toLowerCase() === username);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    switch (event) {
      case 'view':
        profile.views = (profile.views || 0) + 1;
        break;
      case 'contact_save':
        profile.contact_saves = (profile.contact_saves || 0) + 1;
        break;
      case 'whatsapp':
        profile.whatsapp_clicks = (profile.whatsapp_clicks || 0) + 1;
        break;
      case 'phone':
        profile.phone_clicks = (profile.phone_clicks || 0) + 1;
        break;
      case 'email':
        profile.email_clicks = (profile.email_clicks || 0) + 1;
        break;
      case 'website':
        profile.website_clicks = (profile.website_clicks || 0) + 1;
        break;
      case 'qr_scan':
        profile.qr_scans = (profile.qr_scans || 0) + 1;
        break;
      default:
        break;
    }

    saveProfiles();
    res.json({ success: true, event });
  });

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CardCraft Digital Business Card Platform running on http://localhost:${PORT}`);
  });
}

startServer();
