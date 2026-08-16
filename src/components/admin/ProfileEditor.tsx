import React, { useState, useEffect } from 'react';
import { Profile, TemplateType, ProfileService } from '../../types';
import { TEMPLATE_THEMES } from '../../utils/theme';
import { DigitalCardView } from '../public/DigitalCardView';
import {
  ArrowLeft,
  Save,
  Check,
  Eye,
  Copy,
  Plus,
  Trash2,
  Sparkles,
  Smartphone,
  Globe,
  Upload,
  Image as ImageIcon,
  AlertCircle,
  HelpCircle,
  Clock,
  Layers,
  Share2,
  CheckCircle2,
} from 'lucide-react';

interface ProfileEditorProps {
  initialProfile?: Profile | null;
  existingProfiles: Profile[];
  authToken: string;
  onSave: (savedProfile: Profile) => void;
  onCancel: () => void;
}

const TEMPLATE_OPTIONS: { id: TemplateType; label: string; desc: string; color: string }[] = [
  { id: 'professional', label: 'Professional', desc: 'Indigo & slate modern clean', color: 'bg-indigo-600' },
  { id: 'corporate', label: 'Corporate', desc: 'Royal blue & steel boardroom', color: 'bg-blue-600' },
  { id: 'minimal', label: 'Minimal', desc: 'Stark monochrome Swiss design', color: 'bg-zinc-800' },
  { id: 'executive', label: 'Executive', desc: 'Forest emerald & dark slate', color: 'bg-emerald-700' },
  { id: 'creative', label: 'Creative', desc: 'Violet & fuchsia glowing vibe', color: 'bg-fuchsia-600' },
  { id: 'medical', label: 'Medical', desc: 'Oceanic teal & clinical trust', color: 'bg-teal-600' },
  { id: 'business', label: 'Business', desc: 'Warm amber & sandstone advisory', color: 'bg-amber-600' },
  { id: 'luxury', label: 'Luxury', desc: 'Obsidian black & brushed gold foil', color: 'bg-amber-400' },
];

const PHOTO_PRESETS = [
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
];

const COVER_PRESETS = [
  'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80',
];

export const ProfileEditor: React.FC<ProfileEditorProps> = ({
  initialProfile,
  existingProfiles,
  authToken,
  onSave,
  onCancel,
}) => {
  const isEditing = Boolean(initialProfile);

  // Form states
  const [fullName, setFullName] = useState(initialProfile?.full_name || '');
  const [username, setUsername] = useState(initialProfile?.username || '');
  const [jobTitle, setJobTitle] = useState(initialProfile?.job_title || '');
  const [company, setCompany] = useState(initialProfile?.company || '');
  const [bio, setBio] = useState(initialProfile?.bio || '');
  const [profilePhoto, setProfilePhoto] = useState(
    initialProfile?.profile_photo || PHOTO_PRESETS[0]
  );
  const [coverImage, setCoverImage] = useState(
    initialProfile?.cover_image || COVER_PRESETS[0]
  );
  const [phone, setPhone] = useState(initialProfile?.phone || '');
  const [whatsapp, setWhatsapp] = useState(initialProfile?.whatsapp || '');
  const [whatsappDefaultMessage, setWhatsappDefaultMessage] = useState(
    initialProfile?.whatsapp_default_message || ''
  );
  const [email, setEmail] = useState(initialProfile?.email || '');
  const [website, setWebsite] = useState(initialProfile?.website || '');
  const [address, setAddress] = useState(initialProfile?.address || '');
  const [mapsUrl, setMapsUrl] = useState(initialProfile?.maps_url || '');

  // Socials
  const [instagram, setInstagram] = useState(initialProfile?.instagram || '');
  const [facebook, setFacebook] = useState(initialProfile?.facebook || '');
  const [linkedin, setLinkedin] = useState(initialProfile?.linkedin || '');
  const [twitter, setTwitter] = useState(initialProfile?.twitter || '');
  const [tiktok, setTiktok] = useState(initialProfile?.tiktok || '');
  const [youtube, setYoutube] = useState(initialProfile?.youtube || '');
  const [telegram, setTelegram] = useState(initialProfile?.telegram || '');

  // Services
  const [services, setServices] = useState<ProfileService[]>(
    initialProfile?.services || []
  );

  // Additional / Company Info
  const [businessHours, setBusinessHours] = useState(
    initialProfile?.business_hours || ''
  );
  const [ctaText, setCtaText] = useState(initialProfile?.cta_text || '');
  const [ctaUrl, setCtaUrl] = useState(initialProfile?.cta_url || '');
  const [companyDescription, setCompanyDescription] = useState(
    initialProfile?.company_info?.description || ''
  );

  // Design & Status
  const [template, setTemplate] = useState<TemplateType>(
    initialProfile?.template || 'professional'
  );
  const [status, setStatus] = useState<'active' | 'inactive'>(
    initialProfile?.status || 'active'
  );

  // UI state
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [activeSection, setActiveSection] = useState<'personal' | 'contact' | 'social' | 'services' | 'company' | 'design'>('personal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [usernameConflict, setUsernameConflict] = useState(false);

  // Auto-generate username from full name if creating new
  const handleFullNameChange = (name: string) => {
    setFullName(name);
    if (!isEditing && (!username || username === slugify(fullName))) {
      const newSlug = slugify(name);
      setUsername(newSlug);
    }
  };

  function slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // Check username uniqueness
  useEffect(() => {
    const cleanUsername = username.toLowerCase().trim();
    if (!cleanUsername) {
      setUsernameConflict(false);
      return;
    }
    const conflict = existingProfiles.some(
      (p) =>
        p.username.toLowerCase() === cleanUsername &&
        p.id !== initialProfile?.id
    );
    setUsernameConflict(conflict);
  }, [username, existingProfiles, initialProfile]);

  // Handle Photo File Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setProfilePhoto(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Cover File Upload
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setCoverImage(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Add / Edit / Remove Service
  const handleAddService = () => {
    const newService: ProfileService = {
      id: 'srv_' + Date.now(),
      name: '',
      description: '',
      link: '',
    };
    setServices([...services, newService]);
  };

  const handleUpdateService = (index: number, field: keyof ProfileService, value: string) => {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };
    setServices(updated);
  };

  const handleRemoveService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  // Build live profile object for real-time preview
  const previewProfile: Profile = {
    id: initialProfile?.id || 'temp_preview_id',
    full_name: fullName || 'Customer Name',
    username: username || 'customer-name',
    job_title: jobTitle || 'Professional Title',
    company: company || 'Company Name',
    bio: bio || 'Welcome to my digital business card. Save my contact details or connect with me via WhatsApp and social channels.',
    profile_photo: profilePhoto,
    cover_image: coverImage,
    phone: phone || '+1 (555) 000-0000',
    whatsapp: whatsapp || phone || '+15550000000',
    whatsapp_default_message:
      whatsappDefaultMessage ||
      `Hello ${fullName || 'there'}, I found your digital business card.`,
    email: email || 'contact@example.com',
    website: website || 'https://example.com',
    address: address || '',
    maps_url: mapsUrl || '',
    instagram,
    facebook,
    linkedin,
    twitter,
    tiktok,
    youtube,
    telegram,
    services,
    business_hours: businessHours,
    cta_text: ctaText,
    cta_url: ctaUrl,
    company_info: {
      name: company,
      description: companyDescription,
      website,
      phone,
      email,
      address,
    },
    template,
    status,
    created_at: initialProfile?.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
    views: initialProfile?.views || 0,
    contact_saves: initialProfile?.contact_saves || 0,
    whatsapp_clicks: initialProfile?.whatsapp_clicks || 0,
    phone_clicks: initialProfile?.phone_clicks || 0,
    email_clicks: initialProfile?.email_clicks || 0,
    website_clicks: initialProfile?.website_clicks || 0,
    qr_scans: initialProfile?.qr_scans || 0,
  };

  const handleCopyPublicLink = async () => {
    const url = `${window.location.origin}/${username || 'username'}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim()) {
      setErrorMsg('Full name is required.');
      return;
    }

    if (!username.trim()) {
      setErrorMsg('Username is required for generating the public link.');
      return;
    }

    if (usernameConflict) {
      setErrorMsg('This username is already in use. Please choose another username.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        full_name: fullName.trim(),
        username: username.trim().toLowerCase(),
        job_title: jobTitle.trim(),
        company: company.trim(),
        bio: bio.trim(),
        profile_photo: profilePhoto,
        cover_image: coverImage,
        phone: phone.trim(),
        whatsapp: whatsapp.trim() || phone.trim(),
        whatsapp_default_message: whatsappDefaultMessage.trim(),
        email: email.trim(),
        website: website.trim(),
        address: address.trim(),
        maps_url: mapsUrl.trim(),
        instagram: instagram.trim(),
        facebook: facebook.trim(),
        linkedin: linkedin.trim(),
        twitter: twitter.trim(),
        tiktok: tiktok.trim(),
        youtube: youtube.trim(),
        telegram: telegram.trim(),
        services: services.filter((s) => s.name.trim() !== ''),
        business_hours: businessHours.trim(),
        cta_text: ctaText.trim(),
        cta_url: ctaUrl.trim(),
        company_info: {
          name: company.trim(),
          description: companyDescription.trim(),
          website: website.trim(),
          phone: phone.trim(),
          email: email.trim(),
          address: address.trim(),
        },
        template,
        status,
      };

      const url = isEditing
        ? `/api/profiles/${initialProfile?.id}`
        : '/api/profiles';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save digital card');
      }

      onSave(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while saving profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-16">
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-3">
          <button
            id="editor-back-btn"
            type="button"
            onClick={onCancel}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <span>{isEditing ? `Edit: ${initialProfile?.full_name}` : 'Create Digital Card'}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status === 'active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                {status.toUpperCase()}
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-mono truncate max-w-xs sm:max-w-md">
              {window.location.origin}/{username || 'username'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2.5">
          {/* Mobile Preview/Edit Switcher */}
          <div className="lg:hidden flex bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              type="button"
              onClick={() => setActiveTab('edit')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${activeTab === 'edit' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Form
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${activeTab === 'preview' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Preview
            </button>
          </div>

          <button
            id="editor-copy-link-btn"
            type="button"
            onClick={handleCopyPublicLink}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl border border-slate-700 transition"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Link</span>
              </>
            )}
          </button>

          <button
            id="editor-submit-btn"
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center space-x-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'Publishing...' : isEditing ? 'Save Changes' : 'Publish Card'}</span>
          </button>
        </div>
      </header>

      {/* Main Workspace: 2-Column Split Screen (Form on Left, Live Simulator on Right) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-3 animate-shake">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Form Section (Col 7) */}
          <div className={`lg:col-span-7 space-y-6 ${activeTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
            {/* Section Navigation Tabs */}
            <div className="flex space-x-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
              {[
                { id: 'personal', label: '1. Personal' },
                { id: 'contact', label: '2. Contact' },
                { id: 'design', label: '3. Design' },
                { id: 'services', label: '4. Services' },
                { id: 'social', label: '5. Social' },
                { id: 'company', label: '6. Company' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveSection(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    activeSection === tab.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 1. PERSONAL INFORMATION */}
              {activeSection === 'personal' && (
                <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 animate-fadeIn">
                  <div className="border-b border-slate-800 pb-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                      Personal Information
                    </h3>
                    <p className="text-xs text-slate-400">
                      Customer full name, professional title, and profile bio.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Full Name *
                      </label>
                      <input
                        id="input-full-name"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => handleFullNameChange(e.target.value)}
                        placeholder="e.g. Belinda Katumba"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Professional Title
                      </label>
                      <input
                        id="input-job-title"
                        type="text"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder="e.g. Lead Optometrist & Founder"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Company / Organization Name
                    </label>
                    <input
                      id="input-company"
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Katumba Vision & Eye Care"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  {/* Public Username Box */}
                  <div className="p-4 bg-indigo-950/40 border border-indigo-500/30 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wide">
                        Public Username / Custom URL Slug *
                      </label>
                      <span className="text-[11px] text-indigo-400">Unique shareable link</span>
                    </div>
                    <div className="flex items-center space-x-1.5 bg-slate-950 px-3 py-2 rounded-xl border border-slate-700">
                      <span className="text-xs text-slate-500 font-mono shrink-0">
                        {window.location.host}/
                      </span>
                      <input
                        id="input-username"
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(slugify(e.target.value))}
                        placeholder="belinda-katumba"
                        className="w-full bg-transparent text-sm text-indigo-300 font-mono focus:outline-none"
                      />
                    </div>
                    {usernameConflict && (
                      <p className="text-xs text-rose-400 flex items-center space-x-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>“This username is already in use.”</span>
                      </p>
                    )}
                  </div>

                  {/* Profile Photo */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Profile Photo (Avatar)
                    </label>
                    <div className="flex items-start space-x-4">
                      <img
                        src={profilePhoto}
                        alt="Avatar preview"
                        className="w-20 h-20 rounded-2xl object-cover bg-slate-800 border-2 border-indigo-500/50 shadow-md shrink-0"
                      />
                      <div className="space-y-2 flex-1">
                        <input
                          id="input-profile-photo-url"
                          type="text"
                          value={profilePhoto}
                          onChange={(e) => setProfilePhoto(e.target.value)}
                          placeholder="Image URL https://..."
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200"
                        />
                        <div className="flex items-center space-x-2">
                          <label className="cursor-pointer inline-flex items-center space-x-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-medium text-slate-300 border border-slate-700 transition">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Image</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handlePhotoUpload}
                              className="hidden"
                            />
                          </label>
                          <span className="text-[11px] text-slate-500">or pick preset:</span>
                          <div className="flex space-x-1">
                            {PHOTO_PRESETS.slice(0, 3).map((url, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => setProfilePhoto(url)}
                                className="w-6 h-6 rounded-full overflow-hidden border border-slate-600 hover:scale-110 transition"
                              >
                                <img src={url} className="w-full h-full object-cover" alt="" />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cover Background */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Cover / Background Banner Image
                    </label>
                    <div className="space-y-2">
                      <div className="h-24 w-full rounded-xl overflow-hidden bg-slate-800 border border-slate-700 relative">
                        <img
                          src={coverImage}
                          alt="Cover preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          id="input-cover-image-url"
                          type="text"
                          value={coverImage}
                          onChange={(e) => setCoverImage(e.target.value)}
                          placeholder="Cover URL https://..."
                          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200"
                        />
                        <label className="cursor-pointer inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-medium text-slate-300 border border-slate-700 transition shrink-0">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleCoverUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[11px] text-slate-500">Presets:</span>
                        {COVER_PRESETS.slice(0, 4).map((url, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setCoverImage(url)}
                            className="h-5 w-10 rounded overflow-hidden border border-slate-700 hover:scale-105 transition"
                          >
                            <img src={url} className="w-full h-full object-cover" alt="" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Short Biography */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Short Biography / Introduction
                    </label>
                    <textarea
                      id="input-bio"
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Enter a brief summary of experience, expertise, or personal brand greeting..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent leading-relaxed"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveSection('contact')}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition"
                    >
                      Next: Contact Information →
                    </button>
                  </div>
                </div>
              )}

              {/* 2. CONTACT INFORMATION */}
              {activeSection === 'contact' && (
                <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 animate-fadeIn">
                  <div className="border-b border-slate-800 pb-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                      Contact Information
                    </h3>
                    <p className="text-xs text-slate-400">
                      Powers the large tactile Call, WhatsApp, Email, Website & Directions action buttons.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Phone Number
                      </label>
                      <input
                        id="input-phone"
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 234-8901"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        WhatsApp Number (with country code)
                      </label>
                      <input
                        id="input-whatsapp"
                        type="text"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="+15552348901"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Default WhatsApp Message */}
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      Default WhatsApp Message (Auto-filled for visitors)
                    </label>
                    <input
                      id="input-whatsapp-message"
                      type="text"
                      value={whatsappDefaultMessage}
                      onChange={(e) => setWhatsappDefaultMessage(e.target.value)}
                      placeholder={`Hello ${fullName || 'Belinda'}, I found your digital business card.`}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200"
                    />
                    <p className="text-[11px] text-slate-500">
                      When someone taps WHATSAPP, this message is automatically typed in their chat window.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Email Address
                      </label>
                      <input
                        id="input-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="belinda@katumbavision.com"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Website URL
                      </label>
                      <input
                        id="input-website"
                        type="text"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://katumbavision.com"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Physical Address
                    </label>
                    <input
                      id="input-address"
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="450 Lexington Ave, Suite 1200, New York, NY 10017"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Custom Google Maps URL (Optional)
                    </label>
                    <input
                      id="input-maps-url"
                      type="text"
                      value={mapsUrl}
                      onChange={(e) => setMapsUrl(e.target.value)}
                      placeholder="https://maps.google.com/?q=..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveSection('personal')}
                      className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSection('design')}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
                    >
                      Next: Design Template →
                    </button>
                  </div>
                </div>
              )}

              {/* 3. CARD DESIGN & TEMPLATE */}
              {activeSection === 'design' && (
                <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 animate-fadeIn">
                  <div className="border-b border-slate-800 pb-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                      Card Design & Templates
                    </h3>
                    <p className="text-xs text-slate-400">
                      Choose from 8 professionally styled luxury aesthetics.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {TEMPLATE_OPTIONS.map((tmpl) => (
                      <button
                        key={tmpl.id}
                        type="button"
                        onClick={() => setTemplate(tmpl.id)}
                        className={`p-3.5 rounded-xl border text-left transition relative ${
                          template === tmpl.id
                            ? 'bg-slate-800 border-indigo-500 ring-2 ring-indigo-500/40 shadow-lg'
                            : 'bg-slate-900 border-slate-800 hover:bg-slate-800/60'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-lg ${tmpl.color} mb-2 flex items-center justify-center text-white shadow-sm`}>
                          {template === tmpl.id && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <h4 className="text-xs font-bold text-white">{tmpl.label}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-tight">
                          {tmpl.desc}
                        </p>
                      </button>
                    ))}
                  </div>

                  {/* Profile Status Switcher */}
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Profile Availability Status
                      </h4>
                      <p className="text-xs text-slate-400">
                        {status === 'active'
                          ? 'Public URL is active and accessible worldwide.'
                          : 'Public URL shows "This digital card is currently unavailable."'}
                      </p>
                    </div>
                    <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                      <button
                        type="button"
                        onClick={() => setStatus('active')}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                          status === 'active'
                            ? 'bg-emerald-600 text-white shadow'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        ACTIVE
                      </button>
                      <button
                        type="button"
                        onClick={() => setStatus('inactive')}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                          status === 'inactive'
                            ? 'bg-amber-600 text-white shadow'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        INACTIVE
                      </button>
                    </div>
                  </div>

                  {/* Call to Action Button Options */}
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Featured Call-To-Action Button (Optional)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">
                          Button Text (e.g. "Book Vision Exam", "View Portfolio")
                        </label>
                        <input
                          id="input-cta-text"
                          type="text"
                          value={ctaText}
                          onChange={(e) => setCtaText(e.target.value)}
                          placeholder="e.g. Schedule Consultation"
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">
                          Destination URL
                        </label>
                        <input
                          id="input-cta-url"
                          type="text"
                          value={ctaUrl}
                          onChange={(e) => setCtaUrl(e.target.value)}
                          placeholder="https://..."
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveSection('contact')}
                      className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSection('services')}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
                    >
                      Next: Customer Services →
                    </button>
                  </div>
                </div>
              )}

              {/* 4. SERVICES */}
              {activeSection === 'services' && (
                <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                        Customer Services
                      </h3>
                      <p className="text-xs text-slate-400">
                        Add key offerings, examination types, or specialties.
                      </p>
                    </div>
                    <button
                      id="add-service-btn"
                      type="button"
                      onClick={handleAddService}
                      className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Service</span>
                    </button>
                  </div>

                  {services.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-slate-800 rounded-xl p-4">
                      <Layers className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                      <p className="text-xs text-slate-400 mb-3">No services added yet.</p>
                      <button
                        type="button"
                        onClick={handleAddService}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-lg text-xs font-medium"
                      >
                        + Add First Service
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {services.map((service, index) => (
                        <div
                          key={service.id}
                          className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2 relative"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-indigo-300">
                              Service #{index + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveService(index)}
                              className="text-slate-400 hover:text-rose-400 p-1"
                              title="Remove Service"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input
                              type="text"
                              placeholder="Service Name (e.g. Eye Examination)"
                              value={service.name}
                              onChange={(e) =>
                                handleUpdateService(index, 'name', e.target.value)
                              }
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                            />
                            <input
                              type="text"
                              placeholder="Optional Direct Link (https://...)"
                              value={service.link || ''}
                              onChange={(e) =>
                                handleUpdateService(index, 'link', e.target.value)
                              }
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                            />
                          </div>
                          <textarea
                            rows={2}
                            placeholder="Brief description of service..."
                            value={service.description}
                            onChange={(e) =>
                              handleUpdateService(index, 'description', e.target.value)
                            }
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveSection('design')}
                      className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSection('social')}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
                    >
                      Next: Social Media Links →
                    </button>
                  </div>
                </div>
              )}

              {/* 5. SOCIAL MEDIA */}
              {activeSection === 'social' && (
                <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 animate-fadeIn">
                  <div className="border-b border-slate-800 pb-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                      Social Media Channels
                    </h3>
                    <p className="text-xs text-slate-400">
                      Only platforms with entered URLs will be displayed on the digital business card.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Instagram URL
                      </label>
                      <input
                        id="input-instagram"
                        type="text"
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value)}
                        placeholder="https://instagram.com/..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        LinkedIn Profile URL
                      </label>
                      <input
                        id="input-linkedin"
                        type="text"
                        value={linkedin}
                        onChange={(e) => setLinkedin(e.target.value)}
                        placeholder="https://linkedin.com/in/..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Facebook Page URL
                      </label>
                      <input
                        id="input-facebook"
                        type="text"
                        value={facebook}
                        onChange={(e) => setFacebook(e.target.value)}
                        placeholder="https://facebook.com/..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        X / Twitter URL
                      </label>
                      <input
                        id="input-twitter"
                        type="text"
                        value={twitter}
                        onChange={(e) => setTwitter(e.target.value)}
                        placeholder="https://x.com/..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        TikTok URL
                      </label>
                      <input
                        id="input-tiktok"
                        type="text"
                        value={tiktok}
                        onChange={(e) => setTiktok(e.target.value)}
                        placeholder="https://tiktok.com/@..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        YouTube Channel URL
                      </label>
                      <input
                        id="input-youtube"
                        type="text"
                        value={youtube}
                        onChange={(e) => setYoutube(e.target.value)}
                        placeholder="https://youtube.com/@..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Telegram Channel / Username URL
                      </label>
                      <input
                        id="input-telegram"
                        type="text"
                        value={telegram}
                        onChange={(e) => setTelegram(e.target.value)}
                        placeholder="https://t.me/..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveSection('services')}
                      className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSection('company')}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
                    >
                      Next: Company & Hours →
                    </button>
                  </div>
                </div>
              )}

              {/* 6. COMPANY INFORMATION & HOURS */}
              {activeSection === 'company' && (
                <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 animate-fadeIn">
                  <div className="border-b border-slate-800 pb-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                      Company Information & Business Hours
                    </h3>
                    <p className="text-xs text-slate-400">
                      Organizational background, operating hours, and location highlights.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Business Hours / Availability
                    </label>
                    <input
                      id="input-business-hours"
                      type="text"
                      value={businessHours}
                      onChange={(e) => setBusinessHours(e.target.value)}
                      placeholder="Mon - Fri: 8:30 AM – 6:00 PM | Sat: 9:00 AM – 2:00 PM"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Company Description / Overview
                    </label>
                    <textarea
                      id="input-company-desc"
                      rows={3}
                      value={companyDescription}
                      onChange={(e) => setCompanyDescription(e.target.value)}
                      placeholder="Pioneering compassionate optometric care and premium eyewear solutions across the greater metropolitan area."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="flex justify-between pt-4 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setActiveSection('social')}
                      className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/30 transition"
                    >
                      {isSubmitting ? 'Publishing...' : isEditing ? 'Save & Update Card' : 'Publish Digital Card'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* RIGHT: Live Mobile Phone Simulator (Col 5) */}
          <div className={`lg:col-span-5 ${activeTab === 'edit' ? 'hidden lg:block' : 'block'}`}>
            <div className="sticky top-24">
              {/* Phone Device Frame */}
              <div className="text-center mb-3">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-xs font-semibold">
                  <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Live Mobile Card Simulator</span>
                </div>
              </div>

              {/* iPhone style Mockup Container */}
              <div className="mx-auto max-w-[390px] bg-slate-950 p-2.5 sm:p-3.5 rounded-[44px] shadow-2xl border-4 border-slate-800 ring-1 ring-slate-700/50">
                {/* Speaker notch / dynamic island */}
                <div className="w-28 h-4 bg-slate-900 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-950 mr-2"></div>
                  <div className="w-8 h-1.5 rounded-full bg-slate-950"></div>
                </div>

                {/* Inner Screen */}
                <div className="rounded-[32px] overflow-hidden max-h-[640px] overflow-y-auto scrollbar-none bg-white">
                  <DigitalCardView profile={previewProfile} isPreview={true} />
                </div>

                {/* Home Indicator Bar */}
                <div className="w-32 h-1 bg-slate-800 rounded-full mx-auto mt-3"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
