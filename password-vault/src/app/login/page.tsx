'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('token', data.token);
      router.push('/vault');
    } else {
      setError(data.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg p-4">
      <div className="max-w-md w-full space-y-8 animate-slide-up">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-glossy-gradient rounded-full flex items-center justify-center shadow-glossy">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-white">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-300">Sign in to access your secure password vault</p>
        </div>
        <div className="glass-card py-8 px-6 shadow-glossy rounded-xl border border-dark-border animate-fade-in">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-dark-border placeholder-slate-500 text-white bg-dark-surface rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-neon-cyan transition-colors"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-dark-border placeholder-slate-500 text-white bg-dark-surface rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-neon-cyan transition-colors"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg backdrop-blur-sm">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white glossy-btn focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neon-cyan transition-all"
            >
              Sign in to SecureVault
            </button>
            <div className="text-center">
              <span className="text-sm text-slate-400">Don't have an account? </span>
              <a href="/register" className="text-sm font-medium text-neon-cyan hover:text-neon-purple transition-colors">
                Create one now
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}