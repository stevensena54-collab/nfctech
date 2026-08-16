import React, { useState } from 'react';
import { Profile } from '../../types';
import {
  X,
  Share2,
  Copy,
  Check,
  MessageCircle,
  Mail,
  Send,
  QrCode,
  Globe,
  Smartphone,
} from 'lucide-react';

interface ShareModalProps {
  profile: Profile;
  isOpen: boolean;
  onClose: () => void;
  onOpenQR: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  profile,
  isOpen,
  onClose,
  onOpenQR,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const publicUrl = `${window.location.origin}/${profile.username}`;
  const shareTitle = `${profile.full_name} | Digital Business Card`;
  const shareText = `Connect with ${profile.full_name}${
    profile.job_title ? ` (${profile.job_title})` : ''
  }. View digital business card and save contact:`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: publicUrl,
        });
      } catch (err) {
        console.log('Share canceled or failed', err);
      }
    } else {
      handleCopy();
    }
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    `${shareText} ${publicUrl}`
  )}`;
  const smsUrl = `sms:?body=${encodeURIComponent(`${shareText} ${publicUrl}`)}`;
  const mailUrl = `mailto:?subject=${encodeURIComponent(
    shareTitle
  )}&body=${encodeURIComponent(
    `Hi,\n\nI wanted to share ${profile.full_name}'s digital business card with you:\n\n${publicUrl}\n\nYou can view their services and easily save their contact information directly to your phone.\n\nBest regards.`
  )}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareText
  )}&url=${encodeURIComponent(publicUrl)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    publicUrl
  )}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    publicUrl
  )}`;

  return (
    <div
      id="share-modal-backdrop"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="share-modal-card"
        className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-base">Share Card</h3>
              <p className="text-xs text-slate-500">{profile.full_name}</p>
            </div>
          </div>
          <button
            id="share-modal-close-btn"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Quick Copy Link Box */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              Profile Link
            </label>
            <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
              <input
                id="share-link-input"
                type="text"
                readOnly
                value={publicUrl}
                className="w-full text-xs font-mono text-slate-700 bg-transparent px-2 py-1 outline-none truncate"
              />
              <button
                id="share-copy-btn"
                onClick={handleCopy}
                className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Native Share button if available */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              id="native-share-btn"
              onClick={handleNativeShare}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-slate-900 hover:bg-black text-white text-sm font-semibold rounded-xl shadow transition"
            >
              <Smartphone className="w-4 h-4" />
              <span>Share via Mobile System Menu</span>
            </button>
          )}

          {/* Social Channels Grid */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2.5">
              Direct Channels
            </label>
            <div className="grid grid-cols-4 gap-3 text-center">
              {/* WhatsApp */}
              <a
                id="share-whatsapp-link"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-3 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition border border-emerald-200"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-1 shadow-sm">
                  <MessageCircle className="w-4 h-4 fill-white" />
                </div>
                <span className="text-[11px] font-medium">WhatsApp</span>
              </a>

              {/* SMS */}
              <a
                id="share-sms-link"
                href={smsUrl}
                className="flex flex-col items-center p-3 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition border border-blue-200"
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center mb-1 shadow-sm">
                  <Send className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-medium">SMS</span>
              </a>

              {/* Email */}
              <a
                id="share-email-link"
                href={mailUrl}
                className="flex flex-col items-center p-3 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 transition border border-amber-200"
              >
                <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center mb-1 shadow-sm">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-medium">Email</span>
              </a>

              {/* QR Code */}
              <button
                id="share-show-qr-btn"
                onClick={() => {
                  onClose();
                  onOpenQR();
                }}
                className="flex flex-col items-center p-3 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition border border-purple-200"
              >
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center mb-1 shadow-sm">
                  <QrCode className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-medium">QR Code</span>
              </button>
            </div>
          </div>

          {/* Social Network Share row */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">Share to social feed:</span>
            <div className="flex space-x-2">
              <a
                id="share-twitter-link"
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md font-medium transition"
              >
                X
              </a>
              <a
                id="share-linkedin-link"
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md font-medium transition"
              >
                LinkedIn
              </a>
              <a
                id="share-facebook-link"
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md font-medium transition"
              >
                Facebook
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
