'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PasswordGenerator from '@/components/PasswordGenerator';
import { encrypt, decrypt } from '@/lib/crypto';
import {
  Shield,
  Plus,
  Search,
  Edit,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  LogOut,
  User,
  Lock,
  Globe,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface VaultItem {
  _id: string;
  title: string;
  username: string;
  password: string;
  url: string;
  notes: string;
}

export default function VaultPage() {
  const [items, setItems] = useState<VaultItem[]>([]);
  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<VaultItem | null>(null);
  const [form, setForm] = useState({ title: '', username: '', password: '', url: '', notes: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/vault', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        const decryptedItems = data.items.map((item: any) => ({
          ...JSON.parse(decrypt(item.encryptedData)),
          _id: item._id,
        }));
        setItems(decryptedItems);
      } else {
        setError('Failed to load vault items');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const encryptedData = encrypt(JSON.stringify(form));

      const url = isEditing ? `/api/vault/${editingItem?._id}` : '/api/vault';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ encryptedData }),
      });

      if (res.ok) {
        await fetchItems();
        setForm({ title: '', username: '', password: '', url: '', notes: '' });
        setIsEditing(false);
        setEditingItem(null);
        setSuccess(isEditing ? 'Item updated successfully!' : 'Item added successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to save item');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item: VaultItem) => {
    setForm(item);
    setEditingItem(item);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem('token');
    await fetch(`/api/vault/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchItems();
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setSuccess(`${field} copied to clipboard!`);
      setTimeout(() => setSuccess(''), 2000);
      // Auto-clear clipboard after 15 seconds for security
      setTimeout(() => navigator.clipboard.writeText(''), 15000);
    } catch (err) {
      setError('Failed to copy to clipboard');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <header className="glass border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-neon-cyan" />
              <h1 className="text-2xl font-bold metallic-text">SecureVault</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-slate-300">
                <User className="h-4 w-4" />
                <span>Account</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-dark-accent rounded-md transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg flex items-center space-x-3 backdrop-blur-sm">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <p className="text-red-400">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg flex items-center space-x-3 backdrop-blur-sm">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <p className="text-green-400">{success}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Password Generator */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-xl p-6">
              <PasswordGenerator />
            </div>
          </div>

          {/* Right Columns - Form and Items */}
          <div className="lg:col-span-2 space-y-8">
            {/* Add/Edit Form */}
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                {isEditing ? <Edit className="h-6 w-6 text-neon-cyan" /> : <Plus className="h-6 w-6 text-neon-cyan" />}
                <h2 className="text-xl font-semibold text-white">
                  {isEditing ? 'Edit Password Item' : 'Add New Password Item'}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Title *</label>
                    <input
                      type="text"
                      placeholder="e.g., Gmail, Netflix"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full px-3 py-2 border border-dark-border bg-dark-surface text-white placeholder-slate-500 rounded-lg focus:ring-2 focus:ring-neon-cyan focus:border-neon-cyan transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Username</label>
                    <input
                      type="text"
                      placeholder="username or email"
                      value={form.username}
                      onChange={(e) => setForm({ ...form, username: e.target.value })}
                      className="w-full px-3 py-2 border border-dark-border bg-dark-surface text-white placeholder-slate-500 rounded-lg focus:ring-2 focus:ring-neon-cyan focus:border-neon-cyan transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                  <input
                    type="password"
                    placeholder="Enter password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full px-3 py-2 border border-dark-border bg-dark-surface text-white placeholder-slate-500 rounded-lg focus:ring-2 focus:ring-neon-cyan focus:border-neon-cyan transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Website URL</label>
                  <input
                    type="url"
                    placeholder="https://example.com"
                    value={form.url}
                    onChange={(e) => setForm({ ...form, url: e.target.value })}
                    className="w-full px-3 py-2 border border-dark-border bg-dark-surface text-white placeholder-slate-500 rounded-lg focus:ring-2 focus:ring-neon-cyan focus:border-neon-cyan transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Notes</label>
                  <textarea
                    placeholder="Additional notes or security questions"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-dark-border bg-dark-surface text-white placeholder-slate-500 rounded-lg focus:ring-2 focus:ring-neon-cyan focus:border-neon-cyan transition-colors resize-none"
                    rows={3}
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 glossy-btn text-white py-2 px-4 rounded-lg focus:ring-2 focus:ring-neon-cyan focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
                  >
                    {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    <span>{isEditing ? 'Update Item' : 'Add Item'}</span>
                  </button>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setEditingItem(null);
                        setForm({ title: '', username: '', password: '', url: '', notes: '' });
                      }}
                      className="px-4 py-2 text-slate-300 bg-dark-accent rounded-lg hover:bg-dark-border focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Vault Items */}
            <div className="glass-card rounded-xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
                <h2 className="text-xl font-semibold text-white flex items-center space-x-3">
                  <Lock className="h-6 w-6 text-neon-cyan" />
                  <span>Your Password Vault</span>
                </h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search passwords..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-dark-border bg-dark-surface text-white placeholder-slate-500 rounded-lg focus:ring-2 focus:ring-neon-cyan focus:border-neon-cyan transition-colors w-full sm:w-64"
                  />
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-neon-cyan" />
                  <span className="ml-3 text-slate-300">Loading your passwords...</span>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="text-center py-12">
                  <Shield className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">
                    {search ? 'No passwords found' : 'No passwords yet'}
                  </h3>
                  <p className="text-slate-400">
                    {search ? 'Try adjusting your search terms' : 'Add your first password to get started'}
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredItems.map((item) => (
                    <div key={item._id} className="border border-dark-border bg-dark-card rounded-lg p-4 hover:shadow-neon transition-all duration-300">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-white truncate">{item.title}</h3>
                          <div className="mt-2 space-y-2">
                            {item.username && (
                              <div className="flex items-center space-x-2 text-sm text-slate-300">
                                <User className="h-4 w-4" />
                                <span>{item.username}</span>
                                <button
                                  onClick={() => copyToClipboard(item.username, 'Username')}
                                  className="text-neon-cyan hover:text-neon-purple transition-colors"
                                >
                                  <Copy className="h-3 w-3" />
                                </button>
                              </div>
                            )}
                            {item.password && (
                              <div className="flex items-center space-x-2 text-sm text-slate-300">
                                <Lock className="h-4 w-4" />
                                <span className="font-mono">
                                  {showPasswords[item._id] ? item.password : '••••••••'}
                                </span>
                                <button
                                  onClick={() => setShowPasswords(prev => ({ ...prev, [item._id]: !prev[item._id] }))}
                                  className="text-slate-400 hover:text-slate-300 transition-colors"
                                >
                                  {showPasswords[item._id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                </button>
                                <button
                                  onClick={() => copyToClipboard(item.password, 'Password')}
                                  className="text-neon-cyan hover:text-neon-purple transition-colors"
                                >
                                  <Copy className="h-3 w-3" />
                                </button>
                              </div>
                            )}
                            {item.url && (
                              <div className="flex items-center space-x-2 text-sm text-slate-300">
                                <Globe className="h-4 w-4" />
                                <a
                                  href={item.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-neon-cyan hover:text-neon-purple transition-colors truncate"
                                >
                                  {item.url}
                                </a>
                              </div>
                            )}
                            {item.notes && (
                              <div className="flex items-start space-x-2 text-sm text-slate-300">
                                <FileText className="h-4 w-4 mt-0.5" />
                                <span className="flex-1">{item.notes}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-2 text-slate-400 hover:text-neon-cyan hover:bg-dark-accent rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}