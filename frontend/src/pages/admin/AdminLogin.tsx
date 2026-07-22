import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Scale, Lock, Mail, Eye, EyeOff, AlertTriangle, ShieldCheck, ChevronRight } from 'lucide-react';

export function AdminLogin() {
  const { login, simulateLogin, isAuthenticated, isFirebaseConfigured, isProduction, error, isLoading } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setLocalError('Please fill in all fields.');
      return;
    }

    try {
      setLocalError(null);
      setLocalLoading(true);
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      console.error(err);
      setLocalError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleSimulate = () => {
    simulateLogin();
    navigate('/admin/dashboard');
  };

  return (
    <div id="admin-login-page" className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-slate-100">
        
        {/* College Brand Header */}
        <div className="text-center">
          <div className="mx-auto h-14 w-14 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4 shadow-sm">
            <Scale className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-serif font-extrabold text-slate-900 tracking-tight">
            CBG Law College
          </h2>
          <p className="mt-1.5 text-xs font-semibold text-slate-500 uppercase tracking-widest">
            CMS Admin Control Panel
          </p>
        </div>

        {/* Configuration Status Notice */}
        {!isFirebaseConfigured ? (
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200/60 space-y-3">
            <div className="flex gap-2.5">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-900">Firebase Not Configured</h4>
                <p className="text-[11px] text-amber-700 font-medium leading-relaxed mt-1">
                  {isProduction 
                    ? "Critical Error: Firebase environment variables are missing in production. Please check your AI Studio Settings."
                    : "The client-side Firebase environment variables are empty. To preview the CMS and fully manage notices, settings, and leaders right now, use our developer simulation mode."
                  }
                </p>
              </div>
            </div>
            {!isProduction && (
              <button
                id="btn-simulate-login"
                type="button"
                onClick={handleSimulate}
                className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Launch Simulator & Admin Panel</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ) : (
          <div className="bg-emerald-50 rounded-xl p-3.5 border border-emerald-200/60 flex gap-2.5 items-center">
            <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
            <span className="text-[11px] text-emerald-800 font-semibold">
              Firebase Auth Ready (Production Secure Node)
            </span>
          </div>
        )}

        {/* Standard Login Form */}
        <form className="mt-6 space-y-5" onSubmit={handleFormSubmit}>
          {(localError || error) && (
            <div className="bg-red-50 text-red-700 text-xs font-semibold p-3.5 rounded-lg border border-red-200/60">
              {localError || error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700" htmlFor="admin-email">
              Admin Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Mail className="h-4 w-4" />
              </span>
              <input
                id="admin-email"
                name="email"
                type="email"
                required
                disabled={!isFirebaseConfigured || localLoading}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 transition-colors"
                placeholder="admin@cbglawcollege.edu.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700" htmlFor="admin-password">
              Admin Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Lock className="h-4 w-4" />
              </span>
              <input
                id="admin-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                disabled={!isFirebaseConfigured || localLoading}
                className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 transition-colors"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword(!showPassword)}
                disabled={!isFirebaseConfigured}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 disabled:opacity-50"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <button
              id="btn-submit-login"
              type="submit"
              disabled={!isFirebaseConfigured || localLoading}
              className="w-full py-2.5 px-4 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {localLoading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <span>Access Admin Control Panel</span>
              )}
            </button>
          </div>
        </form>

        {/* Footer info */}
        <div className="text-center text-slate-400 text-[10px] font-medium pt-2">
          Secure Authorization Node • Restricted Access
        </div>
      </div>
    </div>
  );
}
