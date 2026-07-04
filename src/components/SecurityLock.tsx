import React, { useState, useEffect, useCallback } from 'react';
import { Lock, ShieldAlert, KeyRound } from 'lucide-react';
import { addAuditLog } from '../security';

export function SecurityLock({ children }: { children: React.ReactNode }) {
  const [isLocked, setIsLocked] = useState(true);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);

  const CORRECT_PIN = '1234'; // Simulated secure PIN
  const TIMEOUT_MINUTES = 5;

  // Session timeout
  const resetTimer = useCallback(() => {
    if (isLocked) return;
    
    const expiry = Date.now() + TIMEOUT_MINUTES * 60 * 1000;
    localStorage.setItem('session_expiry', expiry.toString());
  }, [isLocked]);

  useEffect(() => {
    const checkSession = setInterval(() => {
      if (isLocked) return;
      const expiry = localStorage.getItem('session_expiry');
      if (expiry && Date.now() > parseInt(expiry)) {
        setIsLocked(true);
        addAuditLog('SESSION_TIMEOUT', 'User session expired due to inactivity');
      }
    }, 10000);

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);
    window.addEventListener('touchstart', resetTimer);
    window.addEventListener('scroll', resetTimer);

    return () => {
      clearInterval(checkSession);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
      window.removeEventListener('touchstart', resetTimer);
      window.removeEventListener('scroll', resetTimer);
    };
  }, [isLocked, resetTimer]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (lockoutUntil && Date.now() < lockoutUntil) {
      setError(`Rate limited. Try again in ${Math.ceil((lockoutUntil - Date.now()) / 1000)}s`);
      return;
    }

    if (pin === CORRECT_PIN) {
      setIsLocked(false);
      setPin('');
      setError('');
      setAttempts(0);
      setLockoutUntil(null);
      resetTimer();
      addAuditLog('AUTH_SUCCESS', 'User logged in successfully');
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setPin('');
      addAuditLog('AUTH_FAILED', `Failed login attempt (${newAttempts})`);
      
      if (newAttempts >= 3) {
        const lockout = Date.now() + 30000; // 30s lockout
        setLockoutUntil(lockout);
        setError('Too many attempts. Locked for 30s.');
        addAuditLog('AUTH_RATE_LIMIT', 'User locked out due to multiple failed attempts');
      } else {
        setError(`Incorrect PIN. ${3 - newAttempts} attempts left.`);
      }
    }
  };

  if (!isLocked) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl w-full max-w-sm shadow-2xl flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
          <Lock size={32} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Secure Login</h1>
        <p className="text-gray-500 mb-8">Enter your PIN to access BuilderBooks.</p>
        
        <form onSubmit={handleUnlock} className="w-full">
          <div className="mb-6 relative">
            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="password" 
              placeholder="Enter PIN (1234)"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-center text-2xl tracking-widest focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 font-mono transition-all text-gray-900"
              maxLength={4}
              pattern="[0-9]*"
              inputMode="numeric"
              autoFocus
            />
          </div>
          
          {error && (
            <div className="flex items-center gap-2 text-rose-600 text-sm mb-6 justify-center bg-rose-50 p-3 rounded-xl">
              <ShieldAlert size={16} />
              <span>{error}</span>
            </div>
          )}
          
          <button 
            type="submit"
            disabled={!!lockoutUntil && Date.now() < lockoutUntil}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100"
          >
            Unlock App
          </button>
        </form>
      </div>
    </div>
  );
}
