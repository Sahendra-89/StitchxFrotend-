import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Logo } from '../components/common/Logo';
import { Lock, User, ArrowRight, AlertCircle, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { adminApi, authStorage } from '../lib/api';

export function AdminLogin() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const isExpired = queryParams.get('expired') === '1';

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Please provide both username and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await adminApi.login(username, password);
      if (res?.success && res.token) {
        authStorage.setToken(res.token);
        if (res.user) authStorage.setUser(res.user);
        navigate('/admin');
      } else {
        setError(res?.error || 'Invalid username or password.');
      }
    } catch (err) {
      setError('Unable to authenticate with server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col justify-center items-center p-4 sm:p-6 text-left selection:bg-[#1677FF] selection:text-white relative overflow-hidden font-sans">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#1677FF]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex justify-center mb-3">
            <img
              src="/stitchx-logo.png"
              alt="StitchX Global Technology"
              className="h-16 sm:h-20 w-auto object-contain drop-shadow-md"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/logo.png';
              }}
            />
          </div>
          <p className="text-xs font-mono font-bold tracking-widest text-[#1677FF] uppercase mt-1">
            MANAGEMENT SYSTEM PORTAL
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-7 sm:p-9 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
          
          <div className="flex items-center gap-3.5 pb-6 mb-6 border-b border-[#F1F5F9]">
            <div className="w-11 h-11 rounded-xl bg-[#EEF3FF] border border-[#C9D7F5] text-[#1677FF] flex items-center justify-center shrink-0 shadow-2xs">
              <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h1 className="text-lg font-black text-[#0B1220] tracking-tight">Administrative Sign In</h1>
              <p className="text-xs font-medium text-[#64748B] mt-0.5">Secure authentication for authorized staff</p>
            </div>
          </div>

          {isExpired && (
            <div className="mb-5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>Your session has expired. Please sign in again.</span>
            </div>
          )}

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4.5">
            <div>
              <label className="block text-[11px] font-mono font-bold text-[#475569] uppercase tracking-wider mb-1.5">
                Admin Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter admin username"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-[#0B1220] text-xs font-sans placeholder-[#94A3B8] focus:outline-none focus:border-[#1677FF] focus:bg-white focus:ring-3 focus:ring-[#1677FF]/15 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold text-[#475569] uppercase tracking-wider mb-1.5">
                Secure Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-[#0B1220] text-xs font-sans placeholder-[#94A3B8] focus:outline-none focus:border-[#1677FF] focus:bg-white focus:ring-3 focus:ring-[#1677FF]/15 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569] p-1 cursor-pointer transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-[#1677FF] hover:bg-[#005AD8] text-white text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-md shadow-[#1677FF]/25 hover:shadow-lg transition-all duration-200 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Enter Management Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Enterprise Security Footnote */}
          <div className="mt-6 pt-5 border-t border-[#F1F5F9] text-center">
            <p className="text-[11px] font-mono font-medium text-[#94A3B8] flex items-center justify-center gap-1.5">
              <span>🔒</span>
              <span>Protected by 256-bit TLS encryption</span>
            </p>
          </div>

        </div>

        {/* Back to Public Website Link */}
        <div className="mt-5 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#64748B] hover:text-[#1677FF] transition-colors duration-200"
          >
            <span>← Return to Public Website</span>
          </Link>
        </div>

      </div>
    </div>
  );
}

export default AdminLogin;
