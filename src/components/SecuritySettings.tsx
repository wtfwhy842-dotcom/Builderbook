import React, { useState, useEffect } from 'react';
import { Layout, ViewState } from './Layout';
import { Shield, ShieldAlert, History, Download, Users, Lock, Key, Server } from 'lucide-react';
import { getAuditLogs, generateBackup, AuditLog } from '../security';
import { mockExpenses, mockIncome, mockJobs } from '../data';

export function SecuritySettings({ onAddExpense, onNavigate }: { onAddExpense?: () => void; onNavigate?: (view: ViewState) => void }) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [role, setRole] = useState('Admin');
  
  useEffect(() => {
    setLogs(getAuditLogs());
  }, []);

  const handleBackup = () => {
    const backupData = {
      expenses: mockExpenses,
      income: mockIncome,
      jobs: mockJobs,
      timestamp: new Date().toISOString()
    };
    generateBackup(backupData);
    setLogs(getAuditLogs()); // refresh logs after backup
  };

  return (
    <Layout onAddExpense={onAddExpense} onNavigate={onNavigate} currentView="security">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Security & Settings</h1>
        <p className="text-gray-500">Manage encryption, backups, and audit logs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
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
                    <p className="font-medium text-gray-900">Encrypted Storage</p>
                    <p className="text-xs text-gray-500">AES-256 local encryption</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider">Active</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Key size={18} className="text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Session Timeout</p>
                    <p className="text-xs text-gray-500">Locks after 5m inactivity</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider">Active</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <ShieldAlert size={18} className="text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Rate Limiting</p>
                    <p className="text-xs text-gray-500">Brute-force protection</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider">Active</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <Server size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Data Management</h2>
            </div>
            
            <button onClick={handleBackup} className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-2xl hover:border-blue-300 hover:bg-blue-50 transition-colors group">
              <div className="flex items-center gap-3">
                <Download size={20} className="text-gray-400 group-hover:text-blue-600" />
                <div className="text-left">
                  <p className="font-semibold text-gray-900 group-hover:text-blue-700">Download Encrypted Backup</p>
                  <p className="text-xs text-gray-500">Generates a secure snapshot</p>
                </div>
              </div>
            </button>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <Users size={20} className="text-gray-400" />
                <p className="font-medium text-gray-900">Role Permissions</p>
              </div>
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900 focus:outline-none focus:border-blue-600"
              >
                <option value="Admin">Administrator (Full Access)</option>
                <option value="Editor">Editor (Cannot delete data)</option>
                <option value="Viewer">Viewer (Read-only)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Audit Logs */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col h-[600px]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                <History size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Audit Logs</h2>
            </div>
            <span className="text-xs font-medium text-gray-500">{logs.length} entries</span>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {logs.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-500">
                No logs recorded yet.
              </div>
            ) : (
              logs.map(log => (
                <div key={log.id} className="p-4 bg-gray-50 rounded-2xl">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold px-2 py-1 bg-gray-200 text-gray-700 rounded-lg uppercase tracking-wider">
                      {log.action}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-1">{log.details}</p>
                  <p className="text-xs text-gray-500">User: {log.user}</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </Layout>
  );
}
