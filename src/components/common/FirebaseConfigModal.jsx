import React, { useState } from 'react';
import { X, ShieldCheck, Database, Key, CheckCircle, Info, ExternalLink } from 'lucide-react';
import { checkFirebaseStatus, saveCustomFirebaseConfig, clearCustomFirebaseConfig, FIRESTORE_SECURITY_RULES } from '../../services/firebase';

export function FirebaseConfigModal({ isOpen, onClose }) {
  const [status, setStatus] = useState(checkFirebaseStatus());
  const [apiKey, setApiKey] = useState('');
  const [projectId, setProjectId] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // overview | rules | setup

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (apiKey && projectId) {
      saveCustomFirebaseConfig({ apiKey, projectId });
      setStatus(checkFirebaseStatus());
      alert('Custom Firebase configuration saved! The application will connect using these parameters.');
    }
  };

  const handleReset = () => {
    clearCustomFirebaseConfig();
    setStatus(checkFirebaseStatus());
    setApiKey('');
    setProjectId('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                FixMyCampus Backend Architecture & Status
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Firebase Firestore • Storage • Authentication Architecture
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 px-5 gap-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 text-xs font-semibold border-b-2 transition-colors ${activeTab === 'overview' ? 'border-brand-600 text-brand-600 dark:text-brand-400' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
          >
            Mode & Status
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`py-3 text-xs font-semibold border-b-2 transition-colors ${activeTab === 'rules' ? 'border-brand-600 text-brand-600 dark:text-brand-400' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
          >
            Firestore Security Rules
          </button>
          <button
            onClick={() => setActiveTab('setup')}
            className={`py-3 text-xs font-semibold border-b-2 transition-colors ${activeTab === 'setup' ? 'border-brand-600 text-brand-600 dark:text-brand-400' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
          >
            Custom Firebase Config
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/40 bg-blue-50/70 dark:bg-blue-950/30 flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div className="text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
                  <span className="font-bold">Transparent Environment Disclosure: </span>
                  {status.isConfigured ? (
                    <>Connected to live Firebase project: <span className="font-mono font-semibold">{status.projectId}</span>.</>
                  ) : (
                    <>
                      Running in <strong>Interactive Demo Mode (LocalStorage Engine)</strong>. 
                      Every feature—submitting complaints, photographic evidence, admin assignments, technician completion uploads, SLA breach escalations, student ratings, and QR generation—is 100% functional, reactive, and persists across browser reloads.
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-slate-500 dark:text-slate-400 block mb-1">Active Backend Mode</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    {status.isConfigured ? 'Live Firebase Cloud' : 'Persistent Local Engine'}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-slate-500 dark:text-slate-400 block mb-1">Role-Based Access Control</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
                    Enforced (Student / Faculty / Staff / Admin)
                  </span>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-slate-500 dark:text-slate-400 block mb-1">Image Storage Handling</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    DataURL Preview & Storage Sync
                  </span>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-slate-500 dark:text-slate-400 block mb-1">SLA Engine</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    Active (12h / 24h / 48h / 72h)
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                FixMyCampus defines strict Firestore security rules to protect student privacy and prevent unauthorized role escalation:
              </p>
              <pre className="p-4 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-xl overflow-x-auto max-h-60 leading-relaxed border border-slate-800">
                {FIRESTORE_SECURITY_RULES}
              </pre>
            </div>
          )}

          {activeTab === 'setup' && (
            <form onSubmit={handleSave} className="space-y-4">
              <p className="text-xs text-slate-500">
                To connect FixMyCampus to your own live Google Firebase instance, enter your credentials below:
              </p>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Firebase API Key</label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Firebase Project ID</label>
                <input
                  type="text"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  placeholder="fixmycampus-production"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold"
                >
                  Save & Apply
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium"
                >
                  Reset to Demo
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
}
