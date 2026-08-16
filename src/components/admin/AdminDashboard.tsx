import React, { useState } from 'react';
import { Profile, AdminStats } from '../../types';
import { QRCodeModal } from '../modals/QRCodeModal';
import {
  Plus,
  Search,
  Users,
  Eye,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  QrCode,
  Edit,
  Trash2,
  ExternalLink,
  Power,
  TrendingUp,
  Download,
  MessageCircle,
  LogOut,
  Shield,
  Layers,
  ArrowUpRight,
  Filter,
  Sparkles,
  Smartphone,
  Phone,
} from 'lucide-react';

interface AdminDashboardProps {
  profiles: Profile[];
  stats: AdminStats;
  adminEmail: string;
  authToken: string;
  onCreateNew: () => void;
  onEditProfile: (profile: Profile) => void;
  onDeleteProfile: (id: string) => void;
  onToggleStatus: (profile: Profile) => void;
  onViewPublicCard: (username: string) => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  profiles,
  stats,
  adminEmail,
  authToken,
  onCreateNew,
  onEditProfile,
  onDeleteProfile,
  onToggleStatus,
  onViewPublicCard,
  onLogout,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedQRProfile, setSelectedQRProfile] = useState<Profile | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filter profiles based on search query (name, company, username, phone)
  const filteredProfiles = profiles.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.full_name.toLowerCase().includes(q) ||
      p.company.toLowerCase().includes(q) ||
      p.username.toLowerCase().includes(q) ||
      p.phone.toLowerCase().includes(q) ||
      p.job_title.toLowerCase().includes(q);

    const matchesStatus =
      statusFilter === 'all' || p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleCopyLink = async (username: string, id: string) => {
    const url = `${window.location.origin}/${username}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy link', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-16">
      {/* Top Navbar */}
      <header className="bg-slate-950/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 px-4 sm:px-8 py-3.5 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gradient-to-tr from-indigo-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-base sm:text-lg text-white tracking-tight flex items-center space-x-1.5">
                <span>CardCraft</span>
                <span className="text-[10px] uppercase tracking-wider bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">
                  Admin Platform
                </span>
              </span>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Single-administrator control & public card dispatcher
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Create Digital Card Button */}
            <button
              id="admin-create-profile-btn"
              onClick={onCreateNew}
              className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Create Digital Card</span>
            </button>

            {/* Logout */}
            <button
              id="admin-logout-btn"
              onClick={onLogout}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition"
              title="Log out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Metric Cards Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Profiles */}
          <div className="bg-slate-950/70 border border-slate-800 p-5 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Total Profiles
              </span>
              <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">
                {stats.totalProfiles}
              </span>
              <span className="text-xs text-slate-500">cards created</span>
            </div>
          </div>

          {/* Active Profiles */}
          <div className="bg-slate-950/70 border border-slate-800 p-5 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Active Profiles
              </span>
              <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                {stats.activeProfiles}
              </span>
              <span className="text-xs text-emerald-500/80">live online</span>
            </div>
          </div>

          {/* Inactive Profiles */}
          <div className="bg-slate-950/70 border border-slate-800 p-5 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Inactive Profiles
              </span>
              <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
                <XCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-400">
                {stats.inactiveProfiles}
              </span>
              <span className="text-xs text-slate-500">disabled</span>
            </div>
          </div>

          {/* Total Profile Views & Contact Saves */}
          <div className="bg-slate-950/70 border border-slate-800 p-5 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Total Profile Views
              </span>
              <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-xl">
                <Eye className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-cyan-400">
                {stats.totalViews}
              </span>
              <span className="text-xs text-slate-500">
                ({stats.totalContactSaves} vCard saves)
              </span>
            </div>
          </div>
        </section>

        {/* Profiles Management Table Section */}
        <section className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
          {/* Controls Bar: Search & Status Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="h-4 w-4" />
              </div>
              <input
                id="admin-search-profiles-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, company, username, or phone..."
                className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center space-x-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 shrink-0">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                  statusFilter === 'all'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({profiles.length})
              </button>
              <button
                onClick={() => setStatusFilter('active')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                  statusFilter === 'active'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Active ({stats.activeProfiles})
              </button>
              <button
                onClick={() => setStatusFilter('inactive')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                  statusFilter === 'inactive'
                    ? 'bg-amber-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Inactive ({stats.inactiveProfiles})
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/40">
            <table className="w-full text-left text-xs sm:text-sm text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Profile & Identity</th>
                  <th className="py-3.5 px-4">Company & Title</th>
                  <th className="py-3.5 px-4">Public URL</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-center">Engagement</th>
                  <th className="py-3.5 px-4">Created</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredProfiles.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-500">
                      No customer profiles matched your query.
                    </td>
                  </tr>
                ) : (
                  filteredProfiles.map((p) => {
                    const publicUrl = `${window.location.origin}/${p.username}`;
                    return (
                      <tr
                        key={p.id}
                        className="hover:bg-slate-900/50 transition-colors"
                      >
                        {/* Profile Photo & Name */}
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={p.profile_photo}
                              alt={p.full_name}
                              className="w-10 h-10 rounded-xl object-cover bg-slate-800 border border-slate-700 shrink-0"
                            />
                            <div>
                              <button
                                onClick={() => onViewPublicCard(p.username)}
                                className="font-bold text-white hover:text-indigo-300 text-left transition flex items-center space-x-1"
                              >
                                <span>{p.full_name}</span>
                                <ArrowUpRight className="w-3 h-3 opacity-60" />
                              </button>
                              <span className="text-[11px] text-slate-500 font-mono">
                                @{p.username}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Company & Job Title */}
                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-200">{p.company || '—'}</div>
                          <div className="text-[11px] text-slate-400">{p.job_title || '—'}</div>
                        </td>

                        {/* Username & Link */}
                        <td className="py-3 px-4 font-mono text-xs">
                          <div className="flex items-center space-x-2">
                            <span className="text-indigo-300 truncate max-w-[140px] sm:max-w-[180px]">
                              /{p.username}
                            </span>
                            <button
                              id={`copy-table-link-${p.username}`}
                              onClick={() => handleCopyLink(p.username, p.id)}
                              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition shrink-0"
                              title="Copy Public Link"
                            >
                              {copiedId === p.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>

                        {/* Status Toggle */}
                        <td className="py-3 px-4 text-center">
                          <button
                            id={`status-toggle-${p.username}`}
                            onClick={() => onToggleStatus(p)}
                            className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider transition ${
                              p.status === 'active'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20'
                            }`}
                            title={`Click to ${p.status === 'active' ? 'deactivate' : 'activate'}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                p.status === 'active' ? 'bg-emerald-400' : 'bg-amber-400'
                              }`}
                            ></span>
                            <span>{p.status}</span>
                          </button>
                        </td>

                        {/* Analytics Breakdown */}
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex items-center space-x-3 text-xs">
                            <span title="Total Views" className="text-slate-200 font-semibold">
                              👁 {p.views || 0}
                            </span>
                            <span title="vCard Contact Saves" className="text-emerald-400">
                              💾 {p.contact_saves || 0}
                            </span>
                            <span title="WhatsApp Inquiries" className="text-green-400">
                              💬 {p.whatsapp_clicks || 0}
                            </span>
                          </div>
                        </td>

                        {/* Created Date */}
                        <td className="py-3 px-4 text-xs text-slate-400 whitespace-nowrap">
                          {new Date(p.created_at).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1">
                            {/* View Public Card */}
                            <button
                              id={`action-view-${p.username}`}
                              onClick={() => onViewPublicCard(p.username)}
                              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                              title="View Public Digital Card"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>

                            {/* Edit Profile */}
                            <button
                              id={`action-edit-${p.username}`}
                              onClick={() => onEditProfile(p)}
                              className="p-1.5 text-slate-400 hover:text-indigo-300 hover:bg-slate-800 rounded-lg transition"
                              title="Edit Profile"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            {/* QR Code */}
                            <button
                              id={`action-qr-${p.username}`}
                              onClick={() => setSelectedQRProfile(p)}
                              className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition"
                              title="View & Download QR Code"
                            >
                              <QrCode className="w-4 h-4" />
                            </button>

                            {/* Delete Profile */}
                            {deleteConfirmId === p.id ? (
                              <div className="flex items-center space-x-1 pl-1">
                                <button
                                  onClick={() => {
                                    onDeleteProfile(p.id);
                                    setDeleteConfirmId(null);
                                  }}
                                  className="px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold rounded"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmId(null)}
                                  className="p-1 text-slate-400 hover:text-slate-200 text-xs"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                id={`action-delete-${p.username}`}
                                onClick={() => setDeleteConfirmId(p.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                                title="Delete Profile"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Administrator Workflow Guide Notice */}
        <section className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-5 text-xs text-slate-400 space-y-2">
          <div className="flex items-center space-x-2 font-bold text-slate-200 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Admin Operational Guide</span>
          </div>
          <p>
            When a new customer purchases a digital card, click <strong className="text-white">“Create Digital Card”</strong>, enter their details, select a card template, and publish. Once generated, copy their clean public link (<code className="text-indigo-300">yourdomain.com/username</code>) or download their QR code badge and dispatch it to them via WhatsApp, SMS, or Email.
          </p>
        </section>
      </main>

      {/* QR Code Modal */}
      {selectedQRProfile && (
        <QRCodeModal
          profile={selectedQRProfile}
          isOpen={Boolean(selectedQRProfile)}
          onClose={() => setSelectedQRProfile(null)}
        />
      )}
    </div>
  );
};
