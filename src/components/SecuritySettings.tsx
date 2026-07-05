import React, { useState, useEffect } from 'react';
import { Layout, ViewState } from './Layout';
import { Shield, ShieldAlert, History, Download, Users, Lock, Key, Server, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export function SecuritySettings({ onAddExpense, onNavigate }: { onAddExpense?: () => void; onNavigate?: (view: ViewState) => void }) {
  const { jobs, income, expenses } = useData();
  const { user, signOut } = useAuth();
  
  const handleSignOut = async () => {
    if (confirm("Are you sure you want to sign out?")) {
      await signOut();
    }
  };

  return (
    <Layout onAddExpense={onAddExpense} onNavigate={onNavigate} currentView="security">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Security & Settings</h1>
        <p className="text-gray-500">Manage your account and app settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* Account Info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <UserIcon size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Account</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-medium text-gray-900">{user?.displayName || 'User'}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 p-4 mt-2 bg-rose-50 text-rose-600 rounded-2xl font-semibold hover:bg-rose-100 transition-colors"
              >
                <LogOut size={18} /> Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Security Controls */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <Shield size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Security Posture</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Lock size={18} className="text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Cloud Storage</p>
                    <p className="text-xs text-gray-500">Firestore database active</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider">Secure</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}
