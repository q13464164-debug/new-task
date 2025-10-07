'use client';

import { useState } from 'react';
import { Key, Copy, CheckCircle, AlertCircle } from 'lucide-react';

const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

const LOOK_ALIKES = ['0', 'O', 'I', 'l', '1'];

export default function PasswordGenerator() {
  const [length, setLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeLookAlikes, setExcludeLookAlikes] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let charset = '';
    if (includeLowercase) charset += LOWERCASE;
    if (includeUppercase) charset += UPPERCASE;
    if (includeNumbers) charset += NUMBERS;
    if (includeSymbols) charset += SYMBOLS;

    if (excludeLookAlikes) {
      charset = charset.split('').filter(char => !LOOK_ALIKES.includes(char)).join('');
    }

    if (charset.length === 0) {
      setGeneratedPassword('Please select at least one character type');
      return;
    }

    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }
    setGeneratedPassword(password);
  };

  const copyToClipboard = async () => {
    if (generatedPassword && generatedPassword !== 'Please select at least one character type') {
      try {
        await navigator.clipboard.writeText(generatedPassword);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        // Auto-clear clipboard after 15 seconds for security
        setTimeout(() => navigator.clipboard.writeText(''), 15000);
      } catch (err) {
        console.error('Failed to copy password');
      }
    }
  };

  return (
    <div>
      <div className="flex items-center space-x-3 mb-6">
        <Key className="h-6 w-6 text-neon-cyan" />
        <h2 className="text-xl font-semibold text-white">Password Generator</h2>
      </div>

      <div className="space-y-6">
        {/* Length Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-slate-300">Password Length</label>
            <span className="text-sm font-semibold text-neon-cyan bg-dark-accent px-2 py-1 rounded">
              {length} characters
            </span>
          </div>
          <input
            type="range"
            min="8"
            max="32"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full h-2 bg-dark-border rounded-lg appearance-none cursor-pointer accent-neon-cyan"
          />
        </div>

        {/* Character Options */}
        <div>
          <label className="text-sm font-medium text-slate-300 mb-3 block">Include Characters</label>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center space-x-3 p-3 border border-dark-border bg-dark-surface rounded-lg hover:bg-dark-accent cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={includeUppercase}
                onChange={(e) => setIncludeUppercase(e.target.checked)}
                className="h-4 w-4 text-neon-cyan focus:ring-neon-cyan border-dark-border rounded"
              />
              <span className="text-sm text-slate-300">Uppercase (A-Z)</span>
            </label>
            <label className="flex items-center space-x-3 p-3 border border-dark-border bg-dark-surface rounded-lg hover:bg-dark-accent cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={includeLowercase}
                onChange={(e) => setIncludeLowercase(e.target.checked)}
                className="h-4 w-4 text-neon-cyan focus:ring-neon-cyan border-dark-border rounded"
              />
              <span className="text-sm text-slate-300">Lowercase (a-z)</span>
            </label>
            <label className="flex items-center space-x-3 p-3 border border-dark-border bg-dark-surface rounded-lg hover:bg-dark-accent cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
                className="h-4 w-4 text-neon-cyan focus:ring-neon-cyan border-dark-border rounded"
              />
              <span className="text-sm text-slate-300">Numbers (0-9)</span>
            </label>
            <label className="flex items-center space-x-3 p-3 border border-dark-border bg-dark-surface rounded-lg hover:bg-dark-accent cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
                className="h-4 w-4 text-neon-cyan focus:ring-neon-cyan border-dark-border rounded"
              />
              <span className="text-sm text-slate-300">Symbols (!@#$%)</span>
            </label>
          </div>
        </div>

        {/* Exclude Look-alikes */}
        <label className="flex items-center space-x-3 p-3 border border-dark-border bg-dark-surface rounded-lg hover:bg-dark-accent cursor-pointer transition-colors">
          <input
            type="checkbox"
            checked={excludeLookAlikes}
            onChange={(e) => setExcludeLookAlikes(e.target.checked)}
            className="h-4 w-4 text-neon-cyan focus:ring-neon-cyan border-dark-border rounded"
          />
          <span className="text-sm text-slate-300">Exclude confusing characters (0, O, I, l, 1)</span>
        </label>

        {/* Generate Button */}
        <button
          onClick={generatePassword}
          className="w-full glossy-btn text-white py-3 px-4 rounded-lg focus:ring-2 focus:ring-neon-cyan focus:ring-offset-2 transition-all font-medium"
        >
          Generate Secure Password
        </button>

        {/* Generated Password */}
        {generatedPassword && (
          <div className="space-y-3">
            <div className="p-4 bg-dark-surface border border-dark-border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-300">Generated Password</span>
                {generatedPassword === 'Please select at least one character type' && (
                  <AlertCircle className="h-4 w-4 text-red-400" />
                )}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={generatedPassword}
                  readOnly
                  className="flex-1 px-3 py-2 bg-dark-card border border-dark-border text-white rounded-lg font-mono text-sm focus:ring-2 focus:ring-neon-cyan focus:border-neon-cyan"
                />
                <button
                  onClick={copyToClipboard}
                  disabled={generatedPassword === 'Please select at least one character type'}
                  className="flex items-center space-x-2 px-4 py-2 bg-dark-accent text-slate-300 rounded-lg hover:bg-dark-border hover:text-white focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}