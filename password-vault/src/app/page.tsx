'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Lock, ArrowRight, Sparkles } from 'lucide-react';

console.log("Page.tsx: Starting page load");

export default function Home() {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsRedirecting(true);
      const token = localStorage.getItem('token');
      if (token) {
        router.push('/vault');
      } else {
        router.push('/login');
      }
    }, 3000); // 3 second delay for branding

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8 animate-fade-in">
        {/* Logo and Brand */}
        <div className="space-y-4">
          <div className="relative mx-auto w-20 h-20 bg-glossy-gradient rounded-2xl flex items-center justify-center shadow-glossy neon-glow">
            <Shield className="h-10 w-10 text-white" />
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-metallic-gradient rounded-full flex items-center justify-center shadow-metallic">
              <Sparkles className="h-3 w-3 text-dark-bg" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-bold metallic-text">
              SecureVault
            </h1>
            <p className="text-lg text-slate-300 font-medium">
              Your Digital Fortress
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-3 text-slate-300">
            <Lock className="h-5 w-5 text-neon-cyan" />
            <span className="text-sm font-medium">End-to-End Encryption</span>
          </div>
          <div className="flex items-center justify-center space-x-3 text-slate-300">
            <Shield className="h-5 w-5 text-neon-purple" />
            <span className="text-sm font-medium">Military-Grade Security</span>
          </div>
        </div>

        {/* Loading Animation */}
        <div className="space-y-4">
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce [animation-delay:-0.3s] shadow-lg"></div>
            <div className="w-2 h-2 bg-neon-purple rounded-full animate-bounce [animation-delay:-0.15s] shadow-lg"></div>
            <div className="w-2 h-2 bg-metallic-gold rounded-full animate-bounce shadow-metallic"></div>
          </div>

          <div className="space-y-2">
            <p className="text-slate-300 font-medium">
              {isRedirecting ? 'Redirecting you securely...' : 'Initializing secure connection...'}
            </p>
            {!isRedirecting && (
              <div className="flex items-center justify-center space-x-2 text-sm text-slate-400">
                <span>Checking authentication</span>
                <ArrowRight className="h-4 w-4 animate-pulse text-neon-cyan" />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-dark-border">
          <p className="text-xs text-slate-500">
            © 2024 SecureVault. Keep your passwords safe.
          </p>
        </div>
      </div>
    </div>
  );
}
