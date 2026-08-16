import React, { useState } from 'react';
import { Shield, KeyRound, Mail, ArrowRight, Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (token: string, email: string) => void;
  onViewSampleCard: (username: string) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onViewSampleCard }) => {
  const [email, setEmail] = useState('admin@cardcraft.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('admin@cardcraft.com');
  const [newPassword, setNewPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to authenticate');
      }

      onLoginSuccess(data.token, data.admin.email);
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch('/api/auth/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, newPassword: newPassword || 'admin123' }),
      });
      const data = await res.json();
      if (res.ok) {
        setResetSuccess('Administrator credentials verified and password updated.');
        setPassword(newPassword || 'admin123');
        setTimeout(() => {
          setShowForgotModal(false);
          setResetSuccess(null);
        }, 2000);
      } else {
        setError(data.error || 'Failed to reset password');
      }
    } catch (err: any) {
      setError(err.message || 'Error resetting password');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-indigo-500/20 mb-4 ring-4 ring-indigo-500/20">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          CardCraft Administrator
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-sm mx-auto">
          Single-administrator control center for creating, publishing, and managing all customer digital business cards.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-slate-900/90 backdrop-blur-md py-8 px-6 sm:px-10 shadow-2xl rounded-2xl border border-slate-800 relative">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start space-x-2.5 text-rose-300 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Admin Email / Username
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="admin-email-input"
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition placeholder-slate-500"
                  placeholder="admin@cardcraft.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Admin Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="admin-password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              id="admin-login-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In as Administrator</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Autofill Banner */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-400">
              <div>
                <span className="font-semibold text-slate-300 block">Default Admin Login:</span>
                <span className="font-mono text-[11px]">admin@cardcraft.com / admin123</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@cardcraft.com');
                  setPassword('admin123');
                }}
                className="px-2.5 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-lg border border-slate-700 font-medium transition"
              >
                Auto Fill
              </button>
            </div>
          </div>
        </div>

        {/* Quick Sample Public Card Links */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-400 mb-2">
            Explore live customer public cards without logging in:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => onViewSampleCard('belinda-katumba')}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-indigo-300 hover:text-indigo-200 rounded-lg text-xs font-medium border border-slate-800 transition"
            >
              Dr. Belinda Katumba
            </button>
            <button
              onClick={() => onViewSampleCard('alexander-wright')}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-indigo-300 hover:text-indigo-200 rounded-lg text-xs font-medium border border-slate-800 transition"
            >
              Alexander Wright
            </button>
            <button
              onClick={() => onViewSampleCard('marcus-vance')}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-indigo-300 hover:text-indigo-200 rounded-lg text-xs font-medium border border-slate-800 transition"
            >
              Marcus Vance
            </button>
          </div>
        </div>
      </div>

      {/* Forgot / Reset Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 text-slate-100 shadow-2xl">
            <h3 className="text-lg font-bold mb-1 flex items-center space-x-2 text-white">
              <KeyRound className="w-5 h-5 text-indigo-400" />
              <span>Reset Administrator Password</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter your admin email and your new secure master password.
            </p>

            {resetSuccess && (
              <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{resetSuccess}</span>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Admin Email</label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="Enter at least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                  required
                />
              </div>
              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-semibold text-white"
                >
                  Save New Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
