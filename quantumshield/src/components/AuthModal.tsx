import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { LogIn, LogOut, UserPlus, X, Mail, Lock, ShieldCheck, AlertCircle } from 'lucide-react';
import { loginWithEmail, signupWithEmail, loginWithGoogle, logoutUser, ensureAnonymousAuth } from '../lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, currentUser }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        await loginWithEmail(email, password);
        setSuccessMsg('Successfully logged in!');
        setTimeout(() => onClose(), 800);
      } else {
        await signupWithEmail(email, password);
        setSuccessMsg('Account created & logged in successfully!');
        setTimeout(() => onClose(), 800);
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      const code = err?.code || '';
      if (code === 'auth/invalid-credential' || code === 'auth/user-not-found' || code === 'auth/wrong-password') {
        setError('Invalid email or password. Please check your credentials.');
      } else if (code === 'auth/email-already-in-use') {
        setError('This email address is already in use. Try logging in.');
      } else if (code === 'auth/weak-password') {
        setError('Password should be at least 6 characters long.');
      } else {
        setError(err?.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      setSuccessMsg('Logged in with Google!');
      setTimeout(() => onClose(), 800);
    } catch (err: any) {
      console.error("Google auth error:", err);
      if (err?.code === 'auth/popup-blocked') {
        setError('Google login popup was blocked by browser. Please allow popups.');
      } else if (err?.code === 'auth/popup-closed-by-user') {
        setError('Google login window was closed.');
      } else {
        setError(err?.message || 'Failed to sign in with Google.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setError(null);
    setLoading(true);
    try {
      await logoutUser();
      setSuccessMsg('Logged out successfully.');
      setTimeout(() => onClose(), 800);
    } catch (err: any) {
      setError(err?.message || 'Logout failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymousSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await ensureAnonymousAuth();
      setSuccessMsg('Signed in as Quantum Guest Auditor!');
      setTimeout(() => onClose(), 800);
    } catch (err: any) {
      setError(err?.message || 'Guest session failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#111111] border-2 border-[#FF003C] w-full max-w-md p-6 sm:p-8 space-y-6 relative shadow-[0_0_30px_rgba(255,0,60,0.3)] text-white font-sans">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white p-1 cursor-pointer transition-colors"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#FF003C] font-mono text-xs font-bold uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" />
            <span>QUANTUMSHIELD AUTHENTICATION</span>
          </div>
          <h3 className="text-2xl font-black uppercase tracking-tight text-white">
            {currentUser && !currentUser.isAnonymous ? 'ACCOUNT SETTINGS' : mode === 'signin' ? 'USER LOG IN' : 'CREATE ACCOUNT'}
          </h3>
        </div>

        {/* Current Auth Status Banner */}
        {currentUser ? (
          <div className="p-4 bg-[#050505] border border-white/20 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-white/50 uppercase tracking-widest text-[10px]">CURRENTLY LOGGED IN</span>
              <span className="px-2 py-0.5 bg-[#00FF41] text-black font-bold uppercase text-[9px]">
                {currentUser.isAnonymous ? 'GUEST AUDITOR' : 'AUTHENTICATED'}
              </span>
            </div>
            <div className="text-white font-bold break-all">
              {currentUser.email || `GUEST ID: ${currentUser.uid.substring(0, 12)}...`}
            </div>
            <button
              onClick={handleLogout}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#FF003C] hover:bg-white hover:text-black text-white font-black uppercase tracking-wider transition-colors cursor-pointer text-xs"
            >
              <LogOut className="w-4 h-4" />
              <span>LOG OUT NOW</span>
            </button>
          </div>
        ) : null}

        {/* Login / Signup Form (Only show if not logged in or if user wants to switch account) */}
        {(!currentUser || currentUser.isAnonymous) && (
          <div className="space-y-4">
            {/* Tab Selector */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#050505] border border-white/10 font-mono text-xs">
              <button
                onClick={() => { setMode('signin'); setError(null); }}
                className={`py-2 font-bold uppercase transition-colors cursor-pointer ${
                  mode === 'signin' ? 'bg-[#FF003C] text-white' : 'text-white/60 hover:text-white'
                }`}
              >
                LOG IN
              </button>
              <button
                onClick={() => { setMode('signup'); setError(null); }}
                className={`py-2 font-bold uppercase transition-colors cursor-pointer ${
                  mode === 'signup' ? 'bg-[#FF003C] text-white' : 'text-white/60 hover:text-white'
                }`}
              >
                SIGN UP
              </button>
            </div>

            {/* Notifications */}
            {error && (
              <div className="p-3 bg-[#FF003C]/20 border border-[#FF003C] text-[#FF003C] text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {successMsg && (
              <div className="p-3 bg-[#00FF41]/20 border border-[#00FF41] text-[#00FF41] text-xs font-mono flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-white/60 uppercase tracking-widest text-[10px] mb-1">
                  EMAIL ADDRESS
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="quantum.auditor@domain.com"
                    className="w-full bg-[#050505] border border-white/20 focus:border-[#FF003C] focus:outline-none pl-9 pr-3 py-2 text-white font-mono placeholder:text-white/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/60 uppercase tracking-widest text-[10px] mb-1">
                  PASSWORD
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#050505] border border-white/20 focus:border-[#FF003C] focus:outline-none pl-9 pr-3 py-2 text-white font-mono placeholder:text-white/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-white hover:bg-[#00FF41] text-black font-black uppercase tracking-widest transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {mode === 'signin' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                <span>{loading ? 'PROCESSING...' : mode === 'signin' ? 'LOG IN TO ACCOUNT' : 'CREATE ACCOUNT'}</span>
              </button>
            </form>

            <div className="relative flex items-center justify-center py-2">
              <div className="border-t border-white/10 w-full"></div>
              <span className="bg-[#111111] px-2 text-[9px] font-mono uppercase text-white/40 tracking-widest absolute">
                OR
              </span>
            </div>

            {/* Quick Auth Options */}
            <div className="space-y-2 font-mono text-xs">
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-2.5 bg-[#050505] border border-white/20 hover:border-white text-white font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>SIGN IN WITH GOOGLE</span>
              </button>

              <button
                onClick={handleAnonymousSignIn}
                disabled={loading}
                className="w-full py-2 bg-[#050505] text-white/60 hover:text-white uppercase tracking-wider text-[10px] transition-colors cursor-pointer text-center"
              >
                CONTINUE AS GUEST AUDITOR
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
