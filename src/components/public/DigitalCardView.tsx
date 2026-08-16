import React, { useState, useEffect } from 'react';
import { Profile, AnalyticsEventType } from '../../types';
import { TEMPLATE_THEMES } from '../../utils/theme';
import { downloadVCard } from '../../utils/vcard';
import { QRCodeModal } from '../modals/QRCodeModal';
import { ShareModal } from '../modals/ShareModal';
import {
  UserPlus,
  Phone,
  MessageCircle,
  Mail,
  Globe,
  MapPin,
  Clock,
  Building,
  Share2,
  QrCode,
  Check,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Layers,
  Calendar,
} from 'lucide-react';

interface DigitalCardViewProps {
  profile: Profile;
  isPreview?: boolean;
  onNavigateAdmin?: () => void;
}

export const DigitalCardView: React.FC<DigitalCardViewProps> = ({
  profile,
  isPreview = false,
  onNavigateAdmin,
}) => {
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const theme = TEMPLATE_THEMES[profile.template] || TEMPLATE_THEMES.professional;

  // Track analytics
  const trackEvent = async (eventType: AnalyticsEventType) => {
    if (isPreview) return; // don't track preview interactions
    try {
      await fetch(`/api/profiles/${encodeURIComponent(profile.username)}/analytics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: eventType }),
      });
    } catch (err) {
      console.warn('Analytics tracking error:', err);
    }
  };

  useEffect(() => {
    if (!isPreview && profile.status === 'active') {
      trackEvent('view');
    }
    // Update document title for SEO & preview
    if (!isPreview) {
      document.title = `${profile.full_name} | Digital Business Card`;
    }
  }, [profile.username, profile.full_name, isPreview, profile.status]);

  const handleSaveContact = () => {
    downloadVCard(profile);
    setSavedSuccess(true);
    trackEvent('contact_save');
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handlePhoneClick = () => {
    trackEvent('phone');
  };

  const handleWhatsAppClick = () => {
    trackEvent('whatsapp');
  };

  const handleEmailClick = () => {
    trackEvent('email');
  };

  const handleWebsiteClick = () => {
    trackEvent('website');
  };

  const handleOpenQR = () => {
    setShowQRModal(true);
    trackEvent('qr_scan');
  };

  // If card is inactive and not previewing inside admin
  if (profile.status === 'inactive' && !isPreview) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800 border border-slate-700 text-center p-8 rounded-3xl shadow-2xl text-slate-200">
          <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-amber-400">
            <Clock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Card Currently Unavailable</h2>
          <p className="text-sm text-slate-400 mb-6">
            This digital business card is currently inactive. Please check back later or contact the card owner.
          </p>
          {onNavigateAdmin && (
            <button
              onClick={onNavigateAdmin}
              className="text-xs text-slate-400 hover:text-white underline"
            >
              Administrator Portal
            </button>
          )}
        </div>
      </div>
    );
  }

  // Clean numbers for links
  const rawPhone = profile.phone.replace(/[^\d+]/g, '');
  const rawWhatsapp = (profile.whatsapp || profile.phone).replace(/[^\d]/g, '');
  const whatsappMsg = encodeURIComponent(
    profile.whatsapp_default_message ||
      `Hello ${profile.full_name}, I found your digital business card.`
  );
  const whatsappUrl = `https://wa.me/${rawWhatsapp}?text=${whatsappMsg}`;
  const mapsSearchUrl =
    profile.maps_url ||
    (profile.address ? `https://maps.google.com/?q=${encodeURIComponent(profile.address)}` : '');

  // Active social links
  const socialLinks = [
    { name: 'Instagram', url: profile.instagram, icon: '📸', color: 'hover:text-pink-500' },
    { name: 'LinkedIn', url: profile.linkedin, icon: '💼', color: 'hover:text-blue-600' },
    { name: 'Facebook', url: profile.facebook, icon: '👥', color: 'hover:text-blue-500' },
    { name: 'X / Twitter', url: profile.twitter, icon: '𝕏', color: 'hover:text-slate-900' },
    { name: 'TikTok', url: profile.tiktok, icon: '🎵', color: 'hover:text-black' },
    { name: 'YouTube', url: profile.youtube, icon: '▶️', color: 'hover:text-red-600' },
    { name: 'Telegram', url: profile.telegram, icon: '✈️', color: 'hover:text-sky-500' },
  ].filter((s) => Boolean(s.url && s.url.trim()));

  return (
    <div
      id={`digital-card-${profile.username}`}
      className={`min-h-screen ${
        theme.id === 'luxury'
          ? 'bg-neutral-950 text-slate-100'
          : 'bg-slate-100/90 text-slate-800'
      } flex flex-col items-center justify-start ${isPreview ? 'p-0' : 'sm:py-8 sm:px-4'} font-sans antialiased selection:bg-indigo-500 selection:text-white`}
    >
      {/* Top Floating Utility Bar on Live View */}
      {!isPreview && (
        <header className="w-full max-w-md flex items-center justify-between px-4 py-2 text-xs text-slate-500 mb-2">
          <div className="flex items-center space-x-1.5 font-medium text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Digital Business Card</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              id="top-qr-toggle-btn"
              onClick={handleOpenQR}
              className="flex items-center space-x-1 px-2.5 py-1 bg-white/90 shadow-sm border border-slate-200/80 rounded-full hover:bg-white text-slate-700 transition"
              title="Show QR Code"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>QR Code</span>
            </button>
            <button
              id="top-share-toggle-btn"
              onClick={() => setShowShareModal(true)}
              className="flex items-center space-x-1 px-2.5 py-1 bg-white/90 shadow-sm border border-slate-200/80 rounded-full hover:bg-white text-slate-700 transition"
              title="Share Card"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>
        </header>
      )}

      {/* Main Digital Card Body Container */}
      <main
        className={`w-full max-w-md ${
          theme.cardBg
        } rounded-none sm:rounded-3xl shadow-xl border sm:${
          theme.cardBorder
        } overflow-hidden transition-all duration-300 relative`}
      >
        {/* Cover Image Banner */}
        <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-800">
          <img
            src={
              profile.cover_image ||
              'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80'
            }
            alt="Cover background"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {/* Quick Share & QR Floating overlay buttons on banner */}
          <div className="absolute top-3.5 right-3.5 flex items-center space-x-2">
            <button
              id="banner-qr-btn"
              onClick={handleOpenQR}
              className="p-2 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white rounded-full transition shadow"
              title="Scan QR"
              aria-label="Scan QR Code"
            >
              <QrCode className="w-4 h-4" />
            </button>
            <button
              id="banner-share-btn"
              onClick={() => setShowShareModal(true)}
              className="p-2 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white rounded-full transition shadow"
              title="Share Profile"
              aria-label="Share Profile"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Profile Info Section */}
        <div className="px-6 pt-0 pb-6 relative">
          {/* Avatar Profile Photo (Overlap Cover) */}
          <div className="relative -mt-16 sm:-mt-20 mb-4 flex items-end justify-between">
            <div className="relative">
              <img
                src={
                  profile.profile_photo ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
                }
                alt={profile.full_name}
                className={`w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover bg-white ${theme.avatarRing}`}
              />
              <div
                className="absolute -bottom-1.5 -right-1.5 p-1 bg-emerald-500 text-white rounded-full ring-4 ring-white shadow-md"
                title="Verified Digital Card"
              >
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            {/* Template Badge Indicator */}
            <div
              className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase ${theme.badgeBg} ${theme.badgeText}`}
            >
              {profile.template}
            </div>
          </div>

          {/* Identity Info */}
          <div className="space-y-1">
            <h1
              className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                theme.id === 'luxury' ? 'text-white' : 'text-slate-900'
              }`}
            >
              {profile.full_name}
            </h1>
            {profile.job_title && (
              <p className={`text-sm sm:text-base font-semibold ${theme.accentText}`}>
                {profile.job_title}
              </p>
            )}
            {profile.company && (
              <p
                className={`text-xs sm:text-sm font-medium ${
                  theme.id === 'luxury' ? 'text-zinc-400' : 'text-slate-600'
                } flex items-center space-x-1.5`}
              >
                <Building className="w-3.5 h-3.5 opacity-70 shrink-0" />
                <span>{profile.company}</span>
              </p>
            )}
          </div>

          {/* Biography */}
          {profile.bio && (
            <p
              className={`mt-3.5 text-xs sm:text-sm leading-relaxed ${
                theme.id === 'luxury' ? 'text-zinc-300' : 'text-slate-600'
              }`}
            >
              {profile.bio}
            </p>
          )}

          {/* Primary SAVE CONTACT Button */}
          <div className="mt-5">
            <button
              id="save-contact-main-btn"
              onClick={handleSaveContact}
              className={`w-full flex items-center justify-center space-x-2.5 py-3.5 px-6 rounded-2xl font-bold text-sm sm:text-base tracking-wide transition-all transform active:scale-[0.98] ${theme.saveContactBtn}`}
            >
              {savedSuccess ? (
                <>
                  <Check className="w-5 h-5 animate-bounce" />
                  <span>Contact Downloaded (.vcf)</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>SAVE CONTACT</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-center text-slate-600 mt-1.5">
              Instantly adds full contact details to iPhone, Android & Mac
            </p>
          </div>

          {/* Large Action Buttons Grid */}
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            {/* Call */}
            {profile.phone && (
              <a
                id="action-call-btn"
                href={`tel:${rawPhone}`}
                onClick={handlePhoneClick}
                className={`flex items-center justify-center space-x-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition shadow-sm ${theme.actionBtnPrimary}`}
              >
                <Phone className={`w-4 h-4 ${theme.actionBtnIcon}`} />
                <span>CALL</span>
              </a>
            )}

            {/* WhatsApp */}
            {(profile.whatsapp || profile.phone) && (
              <a
                id="action-whatsapp-btn"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsAppClick}
                className="flex items-center justify-center space-x-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition shadow-sm"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                <span>WHATSAPP</span>
              </a>
            )}

            {/* Email */}
            {profile.email && (
              <a
                id="action-email-btn"
                href={`mailto:${profile.email}`}
                onClick={handleEmailClick}
                className={`flex items-center justify-center space-x-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition shadow-sm ${theme.actionBtnSecondary}`}
              >
                <Mail className={`w-4 h-4 ${theme.actionBtnIcon}`} />
                <span>EMAIL</span>
              </a>
            )}

            {/* Website */}
            {profile.website && (
              <a
                id="action-website-btn"
                href={
                  profile.website.startsWith('http')
                    ? profile.website
                    : `https://${profile.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWebsiteClick}
                className={`flex items-center justify-center space-x-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition shadow-sm ${theme.actionBtnSecondary}`}
              >
                <Globe className={`w-4 h-4 ${theme.actionBtnIcon}`} />
                <span>WEBSITE</span>
              </a>
            )}

            {/* Directions / Location */}
            {mapsSearchUrl && (
              <a
                id="action-directions-btn"
                href={mapsSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`col-span-2 flex items-center justify-center space-x-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition shadow-sm ${theme.actionBtnSecondary}`}
              >
                <MapPin className={`w-4 h-4 ${theme.actionBtnIcon}`} />
                <span>DIRECTIONS & LOCATION</span>
              </a>
            )}
          </div>

          {/* Custom CTA Action Button (e.g., Book Consultation, Portfolio) */}
          {profile.cta_text && profile.cta_url && (
            <div className="mt-4">
              <a
                id="action-custom-cta-btn"
                href={
                  profile.cta_url.startsWith('http')
                    ? profile.cta_url
                    : `https://${profile.cta_url}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold shadow-md transition ${theme.ctaBtn}`}
              >
                <Sparkles className="w-4 h-4" />
                <span>{profile.cta_text}</span>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </a>
            </div>
          )}

          {/* Social Media Grid */}
          {socialLinks.length > 0 && (
            <div className="mt-6 pt-5 border-t border-slate-200/80">
              <h3
                className={`text-xs font-bold uppercase tracking-wider mb-3 ${theme.sectionTitle}`}
              >
                Connect on Social Media
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    id={`social-link-${social.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`}
                    href={
                      social.url.startsWith('http')
                        ? social.url
                        : `https://${social.url}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition ${
                      theme.id === 'luxury'
                        ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-300'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200/80 text-slate-700'
                    }`}
                  >
                    <span className="text-lg mb-1">{social.icon}</span>
                    <span className="text-[10px] font-semibold truncate w-full text-center">
                      {social.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Services Section */}
          {profile.services && profile.services.length > 0 && (
            <div className="mt-6 pt-5 border-t border-slate-200/80">
              <div className="flex items-center space-x-2 mb-3">
                <Layers className={`w-4 h-4 ${theme.accentText}`} />
                <h3
                  className={`text-xs font-bold uppercase tracking-wider ${theme.sectionTitle}`}
                >
                  Our Services
                </h3>
              </div>
              <div className="space-y-2.5">
                {profile.services.map((service) => (
                  <div
                    key={service.id}
                    className={`p-3.5 rounded-xl border transition ${
                      theme.id === 'luxury'
                        ? 'bg-zinc-900/90 border-zinc-800'
                        : 'bg-slate-50/80 border-slate-200/80'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="pr-2">
                        <h4
                          className={`text-xs sm:text-sm font-bold ${
                            theme.id === 'luxury' ? 'text-zinc-100' : 'text-slate-900'
                          }`}
                        >
                          {service.name}
                        </h4>
                        {service.description && (
                          <p
                            className={`text-xs mt-1 leading-relaxed ${
                              theme.id === 'luxury' ? 'text-zinc-400' : 'text-slate-600'
                            }`}
                          >
                            {service.description}
                          </p>
                        )}
                      </div>
                      {service.link && (
                        <a
                          href={
                            service.link.startsWith('http')
                              ? service.link
                              : `https://${service.link}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`p-1.5 rounded-lg ${theme.accentBg} ${theme.accentText} hover:opacity-80 transition shrink-0`}
                          title="View Service"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Company Information & Business Hours */}
          {(profile.company_info?.description ||
            profile.business_hours ||
            profile.address) && (
            <div className="mt-6 pt-5 border-t border-slate-200/80">
              <h3
                className={`text-xs font-bold uppercase tracking-wider mb-3 ${theme.sectionTitle}`}
              >
                About & Location
              </h3>
              <div
                className={`p-3.5 rounded-xl border space-y-3 ${
                  theme.id === 'luxury'
                    ? 'bg-zinc-900/90 border-zinc-800 text-zinc-300'
                    : 'bg-slate-50/80 border-slate-200/80 text-slate-700'
                }`}
              >
                {profile.company_info?.description && (
                  <p className="text-xs leading-relaxed">
                    {profile.company_info.description}
                  </p>
                )}

                {profile.business_hours && (
                  <div className="flex items-start space-x-2 text-xs">
                    <Clock className="w-3.5 h-3.5 mt-0.5 opacity-70 shrink-0" />
                    <div>
                      <span className="font-semibold block text-[11px] uppercase tracking-wider text-slate-600">
                        Hours of Operation
                      </span>
                      <span>{profile.business_hours}</span>
                    </div>
                  </div>
                )}

                {profile.address && (
                  <div className="flex items-start space-x-2 text-xs">
                    <MapPin className="w-3.5 h-3.5 mt-0.5 opacity-70 shrink-0" />
                    <div>
                      <span className="font-semibold block text-[11px] uppercase tracking-wider text-slate-600">
                        Address
                      </span>
                      <span>{profile.address}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Share Profile Card Button at bottom */}
          <div className="mt-6 pt-4 text-center">
            <button
              id="footer-share-card-btn"
              onClick={() => setShowShareModal(true)}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-slate-900 hover:bg-black text-white shadow transition"
            >
              <Share2 className="w-4 h-4" />
              <span>SHARE DIGITAL CARD</span>
            </button>
          </div>

          {/* Verified Footer */}
          <div className="mt-8 text-center text-[10px] text-slate-600 space-y-1">
            <p>Powered by CardCraft Digital Identity</p>
            {onNavigateAdmin && (
              <p>
                <button
                  onClick={onNavigateAdmin}
                  className="hover:underline text-slate-600 hover:text-slate-800"
                >
                  Admin Portal Access
                </button>
              </p>
            )}
          </div>
        </div>
      </main>

      {/* QR Code Modal */}
      <QRCodeModal
        profile={profile}
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
      />

      {/* Share Modal */}
      <ShareModal
        profile={profile}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        onOpenQR={() => setShowQRModal(true)}
      />
    </div>
  );
};
