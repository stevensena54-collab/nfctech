import React, { useEffect, useState } from 'react';
import { Profile } from '../../types';
import { generateQRCodeDataUrl, generateQRCodeSVG, downloadQRCodePNG, downloadQRCodeSVG } from '../../utils/qr';
import { X, Download, Copy, Check, QrCode, ExternalLink, Printer } from 'lucide-react';

interface QRCodeModalProps {
  profile: Profile;
  isOpen: boolean;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ profile, isOpen, onClose }) => {
  const [pngDataUrl, setPngDataUrl] = useState<string>('');
  const [svgString, setSvgString] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const publicUrl = `${window.location.origin}/${profile.username}`;

  useEffect(() => {
    if (isOpen && profile) {
      generateQRCodeDataUrl(publicUrl).then(setPngDataUrl);
      generateQRCodeSVG(publicUrl).then(setSvgString);
    }
  }, [isOpen, profile, publicUrl]);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link', err);
    }
  };

  const handleDownloadPNG = () => {
    if (pngDataUrl) {
      downloadQRCodePNG(pngDataUrl, profile.username);
    }
  };

  const handleDownloadSVG = () => {
    if (svgString) {
      downloadQRCodeSVG(svgString, profile.username);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>${profile.full_name} - QR Code</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; text-align: center; color: #0f172a; }
            .card { border: 2px solid #e2e8f0; border-radius: 24px; padding: 40px; max-width: 360px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
            img.avatar { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; margin-bottom: 12px; }
            h2 { margin: 0 0 4px 0; font-size: 22px; }
            p.title { margin: 0 0 16px 0; color: #64748b; font-size: 14px; }
            .qr { width: 220px; height: 220px; margin: 0 auto 16px auto; }
            .qr img { width: 100%; height: 100%; }
            .url { font-size: 12px; color: #0284c7; word-break: break-all; font-family: monospace; }
            .instruction { font-size: 13px; color: #475569; font-weight: 500; margin-top: 12px; }
          </style>
        </head>
        <body>
          <div class="card">
            ${profile.profile_photo ? `<img src="${profile.profile_photo}" class="avatar" alt="${profile.full_name}" />` : ''}
            <h2>${profile.full_name}</h2>
            <p class="title">${profile.job_title || ''} ${profile.company ? `• ${profile.company}` : ''}</p>
            <div class="qr">
              <img src="${pngDataUrl}" alt="QR Code" />
            </div>
            <p class="instruction">Scan with camera to connect</p>
            <p class="url">${publicUrl}</p>
          </div>
          <script>
            window.onload = () => { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div
      id="qr-code-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="qr-code-modal-card"
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-base">QR Code</h3>
              <p className="text-xs text-slate-500">{profile.full_name}</p>
            </div>
          </div>
          <button
            id="qr-modal-close-btn"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          {/* QR Display */}
          <div className="inline-block p-4 bg-white rounded-2xl border-2 border-slate-200 shadow-inner mb-4">
            {pngDataUrl ? (
              <img
                src={pngDataUrl}
                alt={`${profile.full_name} QR Code`}
                className="w-56 h-56 mx-auto object-contain rounded-lg"
              />
            ) : (
              <div className="w-56 h-56 flex items-center justify-center text-slate-400">
                Generating QR...
              </div>
            )}
          </div>

          <div className="mb-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
              Direct Public Link
            </p>
            <div className="flex items-center justify-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-xs font-mono text-slate-700 truncate max-w-[260px]">
                {publicUrl}
              </span>
              <button
                id="qr-copy-link-btn"
                onClick={handleCopyLink}
                className="flex items-center space-x-1 px-2.5 py-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-white rounded-lg shadow-sm border border-slate-200 hover:bg-indigo-50 transition"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Copied</span>
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

          {/* Download & Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5 pt-2">
            <button
              id="qr-download-png-btn"
              onClick={handleDownloadPNG}
              className="flex items-center justify-center space-x-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-sm transition"
            >
              <Download className="w-4 h-4" />
              <span>Download PNG</span>
            </button>
            <button
              id="qr-download-svg-btn"
              onClick={handleDownloadSVG}
              className="flex items-center justify-center space-x-2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold border border-slate-200 transition"
            >
              <Download className="w-4 h-4" />
              <span>Download SVG</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5 mt-2">
            <button
              id="qr-print-btn"
              onClick={handlePrint}
              className="flex items-center justify-center space-x-1.5 py-2 px-3 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs font-medium border border-slate-200 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Badge</span>
            </button>
            <a
              id="qr-open-live-link"
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-1.5 py-2 px-3 text-indigo-600 hover:text-indigo-700 bg-indigo-50/50 hover:bg-indigo-100/50 rounded-lg text-xs font-medium border border-indigo-100 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Public Page</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
