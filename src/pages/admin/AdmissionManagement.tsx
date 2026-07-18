import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useData } from '../../context/DataContext';
import { Save, Database, AlertCircle, CheckCircle2 } from 'lucide-react';

export function AdmissionManagement() {
  const { token } = useAdminAuth();
  const { refreshData } = useData();
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState<any>(null);

  useEffect(() => {
    fetchSettings();
    fetchDbStatus();
  }, []);

  const fetchDbStatus = async () => {
    try {
      const res = await fetch('/api/db-status');
      const data = await res.json();
      setDbStatus(data);
    } catch (err) {
      console.error('Failed to fetch DB status:', err);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admission-settings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setSettings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admission-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setSettings(data);
        await refreshData();
        alert('Settings updated successfully!');
      } else {
        alert(data.message || 'Error updating settings');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while updating settings');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !settings) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium italic">Loading Admission Settings...</p>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="p-8 text-center bg-red-50 border border-red-100 rounded-2xl mx-auto max-w-4xl">
        <h3 className="text-red-800 font-bold text-lg mb-2">Connection Error</h3>
        <p className="text-red-600 mb-4 italic">We couldn't retrieve the admission settings from the server. This could be a temporary database issue.</p>
        <button 
          onClick={fetchSettings}
          className="px-6 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all active:scale-95 shadow-lg shadow-red-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 font-sans max-w-4xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admission Management</h2>
          <p className="text-slate-500 mt-1 font-medium italic">Configure online admission status and announcements.</p>
        </div>
        
        {dbStatus && (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border text-xs font-bold shadow-sm transition-all ${
            dbStatus.connected 
              ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
              : 'bg-amber-50 border-amber-100 text-amber-700'
          }`}>
            <Database className="w-3.5 h-3.5" />
            <span>Database: {dbStatus.mode}</span>
            {dbStatus.connected ? (
              <CheckCircle2 className="w-3 h-3" />
            ) : (
              <AlertCircle className="w-3 h-3" />
            )}
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-100 space-y-6 relative overflow-hidden">
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <div>
            <label className="block text-sm font-medium">Admission Status</label>
            <select value={settings.admissionStatus} onChange={e => setSettings({...settings, admissionStatus: e.target.value})} className="w-full p-2 border rounded">
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
            </select>
        </div>
        <div>
            <label className="block text-sm font-medium">Academic Session</label>
            <input type="text" value={settings.academicSession} onChange={e => setSettings({...settings, academicSession: e.target.value})} className="w-full p-2 border rounded" />
        </div>
        <div>
            <label className="block text-sm font-medium">Admission Message</label>
            <input type="text" value={settings.admissionMessage} onChange={e => setSettings({...settings, admissionMessage: e.target.value})} className="w-full p-2 border rounded" />
        </div>
        <div>
            <label className="block text-sm font-medium">Breaking News Status</label>
            <select value={settings.breakingNewsStatus ? "ON" : "OFF"} onChange={e => setSettings({...settings, breakingNewsStatus: e.target.value === "ON"})} className="w-full p-2 border rounded">
                <option value="ON">ON</option>
                <option value="OFF">OFF</option>
            </select>
        </div>
        <div>
            <label className="block text-sm font-medium">Breaking News Text</label>
            <textarea value={settings.breakingNewsText} onChange={e => setSettings({...settings, breakingNewsText: e.target.value})} className="w-full p-2 border rounded" rows={3}></textarea>
        </div>
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button 
            type="submit" 
            disabled={loading}
            className="flex items-center gap-2 bg-[#003366] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#002244] transition-all active:scale-95 shadow-lg shadow-[#003366]/20 disabled:opacity-50"
          >
            <Save className="w-5 h-5"/> 
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
