import React, { useState, useEffect } from 'react';
import { Profile, AdminStats } from './types';
import { SEED_PROFILES } from './data/seedProfiles';
import { DigitalCardView } from './components/public/DigitalCardView';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ProfileEditor } from './components/admin/ProfileEditor';
import { Shield, Sparkles, User, ExternalLink, ArrowRight, Layers, ArrowLeft } from 'lucide-react';

export default function App() {
  const [profiles, setProfiles] = useState<Profile[]>(SEED_PROFILES);
  const [stats, setStats] = useState<AdminStats>({
    totalProfiles: SEED_PROFILES.length,
    activeProfiles: SEED_PROFILES.filter((p) => p.status === 'active').length,
    inactiveProfiles: 0,
    totalViews: SEED_PROFILES.reduce((sum, p) => sum + (p.views || 0), 0),
    totalContactSaves: SEED_PROFILES.reduce((sum, p) => sum + (p.contact_saves || 0), 0),
    totalWhatsAppClicks: SEED_PROFILES.reduce((sum, p) => sum + (p.whatsapp_clicks || 0), 0),
    totalPhoneClicks: SEED_PROFILES.reduce((sum, p) => sum + (p.phone_clicks || 0), 0),
  });

  // Navigation & View state
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname);
  const [adminToken, setAdminToken] = useState<string | null>(
    localStorage.getItem('cardcraft_admin_token')
  );
  const [adminEmail, setAdminEmail] = useState<string>('admin@cardcraft.com');
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Sync with browser history
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo(0, 0);
  };

  // Fetch profiles and stats from backend API
  const loadData = async () => {
    try {
      const [profRes, statsRes] = await Promise.all([
        fetch('/api/profiles'),
        fetch('/api/stats'),
      ]);

      if (profRes.ok) {
        const profData = await profRes.json();
        if (Array.isArray(profData) && profData.length > 0) {
          setProfiles(profData);
        }
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (err) {
      console.warn('Using local fallback seed data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Verify Admin Token on mount
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('cardcraft_admin_token');
      if (token) {
        try {
          const res = await fetch('/api/auth/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await res.json();
          if (data.valid) {
            setAdminToken(token);
            if (data.admin?.email) {
              setAdminEmail(data.admin.email);
            }
          } else {
            localStorage.removeItem('cardcraft_admin_token');
            setAdminToken(null);
          }
        } catch (e) {
          // Token verification failed
        }
      }
      loadData();
    };

    verifyToken();
  }, []);

  const handleLoginSuccess = (token: string, email: string) => {
    localStorage.setItem('cardcraft_admin_token', token);
    setAdminToken(token);
    setAdminEmail(email);
    navigateTo('/admin');
  };

  const handleLogout = () => {
    localStorage.removeItem('cardcraft_admin_token');
    setAdminToken(null);
    navigateTo('/admin');
  };

  // Toggle profile active / inactive
  const handleToggleStatus = async (profile: Profile) => {
    const newStatus = profile.status === 'active' ? 'inactive' : 'active';
    try {
      const res = await fetch(`/api/profiles/${profile.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const updated = await res.json();
        setProfiles((prev) =>
          prev.map((p) => (p.id === profile.id ? updated : p))
        );
        loadData();
      }
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  // Delete profile
  const handleDeleteProfile = async (id: string) => {
    try {
      const res = await fetch(`/api/profiles/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      if (res.ok) {
        setProfiles((prev) => prev.filter((p) => p.id !== id));
        loadData();
      }
    } catch (err) {
      console.error('Failed to delete profile:', err);
    }
  };

  // Handle save from editor
  const handleProfileSaved = (savedProfile: Profile) => {
    setProfiles((prev) => {
      const idx = prev.findIndex((p) => p.id === savedProfile.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = savedProfile;
        return next;
      }
      return [savedProfile, ...prev];
    });
    setEditingProfile(null);
    setIsCreatingNew(false);
    loadData();
    navigateTo('/admin');
  };

  // Routing Logic
  const rawSlug = currentPath.replace(/^\//, '').trim();

  // 1. Check if user is on Admin route
  if (currentPath === '/admin' || currentPath === '/admin/') {
    if (!adminToken) {
      return (
        <AdminLogin
          onLoginSuccess={handleLoginSuccess}
          onViewSampleCard={(username) => navigateTo(`/${username}`)}
        />
      );
    }

    if (isCreatingNew || editingProfile) {
      return (
        <ProfileEditor
          initialProfile={editingProfile}
          existingProfiles={profiles}
          authToken={adminToken}
          onSave={handleProfileSaved}
          onCancel={() => {
            setEditingProfile(null);
            setIsCreatingNew(false);
          }}
        />
      );
    }

    return (
      <AdminDashboard
        profiles={profiles}
        stats={stats}
        adminEmail={adminEmail}
        authToken={adminToken}
        onCreateNew={() => {
          setEditingProfile(null);
          setIsCreatingNew(true);
        }}
        onEditProfile={(profile) => {
          setEditingProfile(profile);
          setIsCreatingNew(false);
        }}
        onDeleteProfile={handleDeleteProfile}
        onToggleStatus={handleToggleStatus}
        onViewPublicCard={(username) => navigateTo(`/${username}`)}
        onLogout={handleLogout}
      />
    );
  }

  // 2. Check if slug matches a profile username (e.g. /belinda-katumba)
  if (rawSlug) {
    const matchedProfile = profiles.find(
      (p) => p.username.toLowerCase() === rawSlug.toLowerCase()
    );

    if (matchedProfile) {
      return (
        <DigitalCardView
          profile={matchedProfile}
          onNavigateAdmin={() => navigateTo('/admin')}
        />
      );
    }

    // 404 Not Found Screen
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-slate-100 font-sans">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center shadow-2xl space-y-4">
          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Digital Card Not Found</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            There is no active digital business card at <code className="text-indigo-400">/{rawSlug}</code>.
            Please verify the username or contact the card administrator.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => navigateTo('/belinda-katumba')}
              className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white transition"
            >
              View Sample Card
            </button>
            <button
              onClick={() => navigateTo('/admin')}
              className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-300 transition"
            >
              Admin Portal
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Root route `/`:
  // Show the flagship customer card (Belinda Katumba) or default first profile with quick selector and admin access bar
  const defaultProfile = profiles[0] || SEED_PROFILES[0];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Subtle Top Floating Navigator Bar */}
      <div className="bg-slate-900 border-b border-slate-800 text-slate-300 px-4 py-2.5 text-xs">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-semibold text-white">CardCraft Platform</span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <span className="text-slate-400 hidden sm:inline">Live Public Card Preview</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-slate-400 text-[11px]">Profiles:</span>
            <div className="flex space-x-1 overflow-x-auto py-0.5">
              {profiles.slice(0, 4).map((p) => (
                <button
                  key={p.id}
                  onClick={() => navigateTo(`/${p.username}`)}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium transition ${
                    p.username === defaultProfile.username
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {p.full_name.split(' ')[0]}
                </button>
              ))}
            </div>

            <button
              id="root-admin-portal-link"
              onClick={() => navigateTo('/admin')}
              className="flex items-center space-x-1 px-3 py-1 bg-slate-800 hover:bg-indigo-600 hover:text-white text-indigo-300 rounded-lg text-xs font-semibold border border-slate-700 transition shrink-0 ml-2"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Render Default Digital Card */}
      <div className="flex-1">
        <DigitalCardView
          profile={defaultProfile}
          onNavigateAdmin={() => navigateTo('/admin')}
        />
      </div>
    </div>
  );
}
