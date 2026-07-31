import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';
import {
  Scale,
  LogOut,
  Settings as SettingsIcon,
  Bell,
  Users,
  Layers,
  Image,
  Phone,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Pin,
  Search,
  Filter,
  Info,
  ExternalLink,
  Save,
  Check,
  AlertCircle,
  HelpCircle,
  Loader2
} from 'lucide-react';
import { AdmissionManagement } from './AdmissionManagement';
import { GalleryManagement } from './GalleryManagement';
import { LeadershipManagement } from './LeadershipManagement';
import { FacultyManagementTab } from './FacultyManagementTab';
import { DocumentManagementTab } from './DocumentManagementTab';
import { BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiUrl } from '../../utils/api';
import { formatAdminTimestamp, formatIndianNumber } from '../../utils/formatters';
import { apiFetch, safeJson } from '../../utils/http';

export function AdminDashboard() {
  const { user, token, logout, isSimulated } = useAdminAuth();
  const { settings, founder, manager, notices, isLoading: isDataContextLoading, refreshData } = useData();
  const navigate = useNavigate();

  // Navigation tabs: 'overview' | 'notices' | 'leadership' | 'leaders' | 'gallery' | 'settings' | 'contact' | 'admission' | 'enquiries' | 'faculties' | 'documents'
  const [activeTab, setActiveTab] = useState<'overview' | 'notices' | 'leadership' | 'leaders' | 'gallery' | 'settings' | 'contact' | 'admission' | 'enquiries' | 'faculties' | 'documents'>('overview');

  // Loading States
  const [actionLoading, setActionLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // NOTICE MODAL STATE
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<any | null>(null); // null means adding a new notice
  const [noticeForm, setNoticeForm] = useState({
    title: '',
    description: '',
    category: 'Admission',
    publishDate: '',
    expiryDate: '',
    googleDriveUrl: '',
    pinned: false,
    published: true
  });

  // CMS FORMS STATES
  const [founderForm, setFounderForm] = useState({ name: '', designation: '', message: '', googleDrivePhotoUrl: '' });
  const [managerForm, setManagerForm] = useState({ name: '', designation: '', message: '', googleDrivePhotoUrl: '' });
  const [settingsForm, setSettingsForm] = useState({
    collegeName: '',
    tagline: '',
    address: '',
    primaryPhone: '',
    secondaryPhone: '',
    officeEmail: '',
    website: '',
    googleMapEmbedLink: '',
    googleMapUrl: '',
    logoUrl: '',
    brochureUrl: '',
    footerText: '',
    admissionStatus: 'Open'
  });
  const [contactForm, setContactForm] = useState({
    officeHours: '',
    emergencyContact: '',
    whatsAppNumber: '',
    facebook: '',
    instagram: '',
    linkedin: '',
    youtube: ''
  });

  // Search & Filters for Notice Management
  const [noticeSearch, setNoticeSearch] = useState('');
  const [noticeFilterCategory, setNoticeFilterCategory] = useState('');
  const [noticeFilterStatus, setNoticeFilterStatus] = useState('');
  const [visitorStats, setVisitorStats] = useState<{
    totalVisitors: number;
    todayVisitors: number;
    thisWeekVisitors: number;
    thisMonthVisitors: number;
    lastUpdated: string | null;
  } | null>(null);
  const [visitorStatsLoading, setVisitorStatsLoading] = useState(false);

  // Sync state with DataContext values when loaded
  useEffect(() => {
    if (founder) {
      setFounderForm({
        name: founder.name || '',
        designation: founder.designation || '',
        message: founder.message || '',
        googleDrivePhotoUrl: founder.googleDrivePhotoUrl || ''
      });
    }
    if (manager) {
      setManagerForm({
        name: manager.name || '',
        designation: manager.designation || '',
        message: manager.message || '',
        googleDrivePhotoUrl: manager.googleDrivePhotoUrl || ''
      });
    }
    if (settings) {
      setSettingsForm({
        collegeName: settings.collegeName || '',
        tagline: settings.tagline || '',
        address: settings.address || '',
        primaryPhone: settings.primaryPhone || (settings as any).phone || '',
        secondaryPhone: settings.secondaryPhone || settings.secondaryPhone || '',
        officeEmail: settings.officeEmail || (settings as any).email || '',
        website: settings.website || '',
        googleMapEmbedLink: settings.googleMapEmbedLink || '',
        googleMapUrl: settings.googleMapUrl || '',
        logoUrl: settings.logoUrl || '',
        brochureUrl: settings.brochureUrl || '',
        footerText: settings.footerText || '',
        admissionStatus: settings.admissionStatus || 'Open'
      });
      setContactForm({
        officeHours: settings.officeHours || '',
        emergencyContact: settings.emergencyContact || '',
        whatsAppNumber: settings.whatsAppNumber || '',
        facebook: settings.facebook || '',
        instagram: settings.instagram || '',
        linkedin: settings.linkedin || '',
        youtube: settings.youtube || ''
      });
    }
  }, [settings, founder, manager]);

  useEffect(() => {
    let isMounted = true;

    const loadVisitorStats = async () => {
      setVisitorStatsLoading(true);
      try {
        const res = await apiFetch(apiUrl('/api/visitor-stats'), { cache: 'no-store' }, 'AdminDashboard');
        if (!res.ok) return;

        const data = await safeJson<any>(res, 'AdminDashboard visitor stats');
        if (isMounted) {
          setVisitorStats({
            totalVisitors: typeof data.totalVisitors === 'number' ? data.totalVisitors : 10000,
            todayVisitors: typeof data.todayVisitors === 'number' ? data.todayVisitors : 0,
            thisWeekVisitors: typeof data.thisWeekVisitors === 'number' ? data.thisWeekVisitors : 0,
            thisMonthVisitors: typeof data.thisMonthVisitors === 'number' ? data.thisMonthVisitors : 0,
            lastUpdated: data.lastUpdated || null,
          });
        }
      } catch (error) {
        console.warn('Unable to load visitor statistics.', error);
      } finally {
        if (isMounted) {
          setVisitorStatsLoading(false);
        }
      }
    };

    void loadVisitorStats();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const showNotification = (msg: string, isError = false) => {
    if (isError) {
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(null), 5000);
    } else {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(null), 5000);
    }
  };

  // HEADER UTILS FOR API CALLS
  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });

  // --- SAVE LEADERSHIP MESSAGES ---
  const saveFounder = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await apiFetch(apiUrl('/api/founder'), {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(founderForm)
      }, 'AdminDashboard');
      if (res.ok) {
        showNotification('Founder message updated successfully!');
        refreshData();
      } else {
        const err = await safeJson<any>(res, 'AdminDashboard saveFounder');
        showNotification(err.error || 'Failed to update founder details', true);
      }
    } catch (err: any) {
      showNotification(err.message || 'Error updating details', true);
    } finally {
      setActionLoading(false);
    }
  };

  const saveManager = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await apiFetch(apiUrl('/api/manager'), {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(managerForm)
      }, 'AdminDashboard');
      if (res.ok) {
        showNotification('Manager message updated successfully!');
        refreshData();
      } else {
        const err = await safeJson<any>(res, 'AdminDashboard saveManager');
        showNotification(err.error || 'Failed to update manager details', true);
      }
    } catch (err: any) {
      showNotification(err.message || 'Error updating details', true);
    } finally {
      setActionLoading(false);
    }
  };

  // --- SAVE WEBSITE SETTINGS ---
  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      // Merge Settings and Contact form parameters to POST/PUT in one go
      const mergedPayload = {
        ...settingsForm,
        ...contactForm
      };

      const res = await apiFetch(apiUrl('/api/settings'), {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(mergedPayload)
      }, 'AdminDashboard');
      if (res.ok) {
        showNotification('College Settings & Contact details saved successfully!');
        refreshData();
      } else {
        const err = await safeJson<any>(res, 'AdminDashboard saveSettings');
        showNotification(err.error || 'Failed to save settings', true);
      }
    } catch (err: any) {
      showNotification(err.message || 'Error saving settings', true);
    } finally {
      setActionLoading(false);
    }
  };

  // --- NOTICE OPERATION ACTIONS ---
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const deleteNotice = async (id: string) => {
    setDeletingId(id);
    setActionLoading(true);
    setConfirmDeleteId(null);
    
    try {
      console.log(`Attempting to delete notice with ID: ${id}`);
      const res = await apiFetch(apiUrl(`/api/notices/${id}`), {
        method: 'DELETE',
        headers: getAuthHeaders()
      }, 'AdminDashboard');
      
      const data = await safeJson<any>(res, 'AdminDashboard deleteNotice');

      if (res.ok) {
        showNotification('Notice deleted successfully.');
        await refreshData();
      } else {
        console.error('Delete failed:', data);
        showNotification(data.error || 'Failed to delete notice. Please try again.', true);
      }
    } catch (err: any) {
      console.error('Delete error:', err);
      showNotification(err.message || 'Network error while deleting notice', true);
    } finally {
      setActionLoading(false);
      setDeletingId(null);
    }
  };

  const toggleNoticePublish = async (id: string, currentPublished: boolean) => {
    try {
      const res = await apiFetch(apiUrl(`/api/notices/${id}/publish`), {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ published: !currentPublished })
      }, 'AdminDashboard');
      if (res.ok) {
        showNotification(`Notice ${!currentPublished ? 'Published' : 'Unpublished'} successfully.`);
        refreshData();
      }
    } catch (err: any) {
      showNotification(err.message || 'Error updating notice', true);
    }
  };

  const toggleNoticePin = async (id: string, currentPinned: boolean) => {
    try {
      const res = await apiFetch(apiUrl(`/api/notices/${id}/pin`), {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ pinned: !currentPinned })
      }, 'AdminDashboard');
      if (res.ok) {
        showNotification(`Notice ${!currentPinned ? 'pinned to top' : 'unpinned'} successfully.`);
        refreshData();
      }
    } catch (err: any) {
      showNotification(err.message || 'Error pinning notice', true);
    }
  };

  const openNoticeModal = (notice: any = null) => {
    if (notice) {
      setEditingNotice(notice);
      setNoticeForm({
        title: notice.title || '',
        description: notice.description || '',
        category: notice.category || 'Admission',
        publishDate: notice.publishDate ? new Date(notice.publishDate).toISOString().substring(0, 10) : '',
        expiryDate: notice.expiryDate ? new Date(notice.expiryDate).toISOString().substring(0, 10) : '',
        googleDriveUrl: notice.googleDriveUrl || '',
        pinned: notice.pinned || false,
        published: notice.published !== false
      });
    } else {
      setEditingNotice(null);
      setNoticeForm({
        title: '',
        description: '',
        category: 'Admission',
        publishDate: new Date().toISOString().substring(0, 10),
        expiryDate: '',
        googleDriveUrl: '',
        pinned: false,
        published: true
      });
    }
    setIsNoticeModalOpen(true);
  };

  const handleNoticeFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeForm.title || !noticeForm.description || !noticeForm.category) {
      showNotification('Title, Description and Category are strictly required.', true);
      return;
    }

    setActionLoading(true);
    try {
      const method = editingNotice ? 'PUT' : 'POST';
      const endpoint = editingNotice ? apiUrl(`/api/notices/${editingNotice._id}`) : apiUrl('/api/notices');

      const res = await apiFetch(endpoint, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(noticeForm)
      }, 'AdminDashboard');

      if (res.ok) {
        showNotification(editingNotice ? 'Notice updated successfully!' : 'New notice created successfully!');
        setIsNoticeModalOpen(false);
        refreshData();
      } else {
        const err = await safeJson<any>(res, 'AdminDashboard handleNoticeFormSubmit');
        showNotification(err.error || 'Failed to save notice', true);
      }
    } catch (err: any) {
      showNotification(err.message || 'Error processing notice', true);
    } finally {
      setActionLoading(false);
    }
  };

  // FILTERED NOTICES LIST
  const filteredNotices = notices.filter((n: any) => {
    const matchesSearch =
      n.title.toLowerCase().includes(noticeSearch.toLowerCase()) ||
      n.description.toLowerCase().includes(noticeSearch.toLowerCase());
    const matchesCategory = noticeFilterCategory === '' || n.category === noticeFilterCategory;
    const matchesStatus =
      noticeFilterStatus === '' ||
      (noticeFilterStatus === 'published' && n.published) ||
      (noticeFilterStatus === 'draft' && !n.published) ||
      (noticeFilterStatus === 'pinned' && n.pinned);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // STATS COUNTERS FOR OVERVIEW
  const totalCount = notices.length;
  const publishedCount = notices.filter((n: any) => n.published).length;
  const draftCount = notices.filter((n: any) => !n.published).length;
  const pinnedCount = notices.filter((n: any) => n.pinned).length;

  return (
    <div id="admin-dashboard-page" className="min-h-screen bg-slate-50 font-sans flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-white shrink-0 shadow-lg flex flex-col">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-lg text-gold">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-sm tracking-wide">CBG Law College</h1>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">CMS Control Tower</p>
          </div>
        </div>

        {/* User profile capsule */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold uppercase text-slate-300">
              {user?.email?.charAt(0) || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-200 truncate">{user?.email}</p>
              <span className="inline-block text-[9px] font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded mt-0.5">
                {isSimulated ? 'DEVELOPMENT MODE' : 'PRODUCTION ADM'}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: Layers },
            { id: 'notices', label: 'Notices Board (CRUD)', icon: Bell },
            { id: 'leadership', label: 'Founder & Manager Message', icon: Users },
            { id: 'leaders', label: 'Team Leadership Records', icon: Users },
            { id: 'faculties', label: 'Faculty Management', icon: Users },
            { id: 'documents', label: 'Document Center', icon: BookOpen },
            { id: 'gallery', label: 'Gallery CMS', icon: Image },
            { id: 'settings', label: 'Website Settings', icon: SettingsIcon },
            { id: 'contact', label: 'Contact Helpdesk Details', icon: Phone },
            { id: 'admission', label: 'Admission Management', icon: Layers },
            { id: 'enquiries', label: 'Admission Enquiries', icon: Search }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                    if (item.id === 'settings') {
                        navigate('/admin/settings');
                    } else if (item.id === 'enquiries') {
                        navigate('/admin/enquiries');
                    } else {
                        setActiveTab(item.id as any);
                    }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                  activeTab === item.id
                    ? 'bg-primary text-white shadow-md'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Log out */}
        <div className="p-4 border-t border-slate-800">
          <button
            id="btn-admin-logout"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-red-900/60 text-slate-300 hover:text-white rounded-lg text-xs font-bold transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-100 h-16 flex items-center justify-between px-6 md:px-8 shrink-0 shadow-sm">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              {activeTab === 'overview' && 'Administrative Overview'}
              {activeTab === 'notices' && 'Bulletin & Notices Board'}
              {activeTab === 'leadership' && 'Leaders Editorial Messages'}
              {activeTab === 'leaders' && 'Team Leadership Records'}
              {activeTab === 'faculties' && 'Faculty Management'}
              {activeTab === 'documents' && 'Document Center Management'}
              {activeTab === 'gallery' && 'Gallery Content Management'}
              {activeTab === 'settings' && 'Core Institutional Profile'}
              {activeTab === 'contact' && 'Support Desk & Social Outlets'}
              {activeTab === 'admission' && 'Admission Management'}
              {activeTab === 'enquiries' && 'Admission Enquiries'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-slate-500">
              UTC Node Time: <span className="font-mono text-[11px] font-bold text-slate-700">2026-07-17</span>
            </span>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-lg"
            >
              <span>View Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </header>

        {/* Notifications Bar */}
        {(successMsg || errorMsg) && (
          <div className="px-6 md:px-8 pt-4">
            {successMsg && (
              <div className="bg-emerald-50 text-emerald-800 text-xs font-bold p-3.5 rounded-xl border border-emerald-200/60 flex items-center gap-2 shadow-sm">
                <CheckCircle className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}
            {errorMsg && (
              <div className="bg-red-50 text-red-800 text-xs font-bold p-3.5 rounded-xl border border-red-200/60 flex items-center gap-2 shadow-sm">
                <AlertCircle className="w-4.5 h-4.5 text-red-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {confirmDeleteId && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-sm w-full p-8"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="p-4 bg-red-50 rounded-2xl mb-5">
                    <AlertCircle className="w-10 h-10 text-red-600" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 mb-2">Delete Notice?</h3>
                  <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                    This will permanently remove this notice from the bulletin board. This action cannot be reversed.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setConfirmDeleteId(null)}
                    className="px-4 py-3 text-sm font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-slate-100 transition-all active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => deleteNotice(confirmDeleteId)}
                    className="px-4 py-3 text-sm font-bold text-white bg-red-600 rounded-2xl hover:bg-red-700 shadow-lg shadow-red-200 transition-all active:scale-95"
                  >
                    Delete Now
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">

          {/* ==================================== OVERVIEW TAB ==================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              
              {/* Info panel */}
              {isSimulated && (
                <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200/50 flex gap-4">
                  <Info className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider">Development Sandbox Active</h3>
                    <p className="text-xs text-amber-700 leading-relaxed font-medium">
                      You are operating in simulated bypass auth. Once MongoDB and Firebase credentials are configured, the server switches to the production data sources automatically.
                    </p>
                  </div>
                </div>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {[
                  { label: 'Total Notices', value: totalCount, color: 'text-slate-800 bg-white border border-slate-100' },
                  { label: 'Published Board', value: publishedCount, color: 'text-emerald-700 bg-emerald-50/50 border border-emerald-100' },
                  { label: 'Draft Binaries', value: draftCount, color: 'text-amber-700 bg-amber-50/50 border border-amber-100' },
                  { label: 'Pinned Notices', value: pinnedCount, color: 'text-indigo-700 bg-indigo-50/50 border border-indigo-100' }
                ].map((stat, i) => (
                  <div key={i} className={`p-5 rounded-2xl shadow-sm space-y-1.5 ${stat.color}`}>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                    <p className="text-3xl font-extrabold tracking-tight">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Visitor Analytics</h3>
                    <p className="text-[11px] text-slate-500 mt-1">Read-only production metrics powered by MongoDB.</p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    {visitorStatsLoading ? 'Refreshing' : 'Live Summary'}
                  </span>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { label: 'Total Visitors', value: visitorStats?.totalVisitors ?? 10000 },
                    { label: 'Today', value: visitorStats?.todayVisitors ?? 0 },
                    { label: 'This Week', value: visitorStats?.thisWeekVisitors ?? 0 },
                    { label: 'This Month', value: visitorStats?.thisMonthVisitors ?? 0 },
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">{item.label}</p>
                      <p className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
                        {formatIndianNumber(item.value)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[11px] text-slate-500">
                  <span>Total visitor count starts at 10,000 and increments only for unique visitors.</span>
                  <span>Last Updated: <strong className="font-semibold text-slate-700">{formatAdminTimestamp(visitorStats?.lastUpdated)}</strong></span>
                </div>
              </div>

              {/* Quick actions & Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Quick Actions */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Quick Actions Portal</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      id="action-add-notice"
                      onClick={() => { setActiveTab('notices'); openNoticeModal(); }}
                      className="p-4 bg-primary text-white hover:bg-primary-dark rounded-xl text-xs font-bold transition-all text-left flex items-center justify-between group shadow-sm"
                    >
                      <span>Draft New Notice</span>
                      <Plus className="w-4 h-4 transition-transform group-hover:scale-125" />
                    </button>
                    <button
                      onClick={() => setActiveTab('settings')}
                      className="p-4 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all text-left flex items-center justify-between group border border-slate-100"
                    >
                      <span>Edit College Settings</span>
                      <SettingsIcon className="w-4 h-4 transition-transform group-hover:rotate-45" />
                    </button>
                    <button
                      onClick={() => setActiveTab('leadership')}
                      className="p-4 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all text-left flex items-center justify-between group border border-slate-100"
                    >
                      <span>Update Founder / Manager</span>
                      <Users className="w-4 h-4 transition-transform group-hover:scale-110" />
                    </button>
                    <button
                      onClick={() => setActiveTab('leaders')}
                      className="p-4 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all text-left flex items-center justify-between group border border-slate-100"
                    >
                      <span>Manage Leader Records</span>
                      <Users className="w-4 h-4 transition-transform group-hover:scale-110" />
                    </button>
                    <button
                      onClick={() => setActiveTab('gallery')}
                      className="p-4 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all text-left flex items-center justify-between group border border-slate-100"
                    >
                      <span>Manage Gallery</span>
                      <Image className="w-4 h-4 transition-transform group-hover:scale-110" />
                    </button>
                    <button
                      onClick={() => setActiveTab('contact')}
                      className="p-4 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all text-left flex items-center justify-between group border border-slate-100"
                    >
                      <span>Configure Helpdesk</span>
                      <Phone className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                    <button
                      onClick={() => navigate('/admin/enquiries')}
                      className="p-4 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all text-left flex items-center justify-between group border border-slate-100"
                    >
                      <span>View Enquiry Sheet</span>
                      <Search className="w-4 h-4 transition-transform group-hover:scale-125" />
                    </button>
                  </div>
                </div>

                {/* Status Box */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Institutional Overview</h3>
                  <div className="space-y-3.5">
                    <div className="flex justify-between items-center text-xs font-semibold pb-2 border-b border-slate-50">
                      <span className="text-slate-500">Institution Name:</span>
                      <span className="text-slate-800 text-right">{settings?.collegeName}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-semibold pb-2 border-b border-slate-50">
                      <span className="text-slate-500">Admissions Status:</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${settings?.admissionStatus === 'Open' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                        {settings?.admissionStatus}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-semibold pb-2 border-b border-slate-50">
                      <span className="text-slate-500">Liaison Contact:</span>
                      <span className="text-slate-800 font-mono">{settings?.primaryPhone}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-slate-500">Official Portal:</span>
                      <span className="text-slate-800 font-mono">{settings?.website}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ==================================== NOTICES BOARD TAB ==================================== */}
          {activeTab === 'notices' && (
            <div className="space-y-6">
              
              {/* Header and Add button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Notices Catalog Registry</h3>
                <button
                  id="btn-add-notice-tab"
                  onClick={() => openNoticeModal()}
                  className="bg-primary hover:bg-primary-dark text-white font-bold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-md shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Draft New Notice</span>
                </button>
              </div>

              {/* Filters Box */}
              <div className="bg-white p-4 rounded-xl border border-slate-100 grid grid-cols-1 sm:grid-cols-4 gap-4 items-center shadow-sm">
                
                {/* Search */}
                <div className="relative sm:col-span-2">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    placeholder="Search notices title or description..."
                    value={noticeSearch}
                    onChange={(e) => setNoticeSearch(e.target.value)}
                  />
                </div>

                {/* Category filter */}
                <div>
                  <select
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    value={noticeFilterCategory}
                    onChange={(e) => setNoticeFilterCategory(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    <option value="Admission">Admission</option>
                    <option value="Exam">Exam</option>
                    <option value="Academic">Academic</option>
                    <option value="Event">Event</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <select
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    value={noticeFilterStatus}
                    onChange={(e) => setNoticeFilterStatus(e.target.value)}
                  >
                    <option value="">All States</option>
                    <option value="published">Published Only</option>
                    <option value="draft">Drafts Only</option>
                    <option value="pinned">Pinned Only</option>
                  </select>
                </div>

              </div>

              {/* Notices List */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                        <th className="p-4 pl-6">Notice Info</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Publish Date</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-xs font-medium">
                      {filteredNotices.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-slate-400 font-medium">
                            No matching notices found in database. Create one above!
                          </td>
                        </tr>
                      ) : (
                        filteredNotices.map((notice: any) => (
                          <tr key={notice._id} className="hover:bg-slate-50/30 transition-colors">
                            <td className="p-4 pl-6 space-y-1 max-w-sm sm:max-w-md">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {notice.pinned && (
                                  <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded">
                                    <Pin className="w-2.5 h-2.5" /> Pinned
                                  </span>
                                )}
                                <span className="font-bold text-slate-800 line-clamp-1">{notice.title}</span>
                              </div>
                              <p className="text-slate-500 text-[11px] line-clamp-2 leading-relaxed">{notice.description}</p>
                              {notice.googleDriveUrl && (
                                <span className="inline-flex items-center gap-1 text-[10px] text-blue-600 hover:underline">
                                  <ExternalLink className="w-3 h-3" />
                                  <span>Attached Doc Link</span>
                                </span>
                              )}
                            </td>
                            <td className="p-4 shrink-0">
                              <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-md text-slate-600">
                                {notice.category}
                              </span>
                            </td>
                            <td className="p-4 text-slate-600 font-mono text-[11px]">
                              {notice.publishDate ? new Date(notice.publishDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              }) : 'Draft'}
                            </td>
                            <td className="p-4">
                              <div className="flex flex-col items-center gap-1">
                                <button
                                  onClick={() => toggleNoticePublish(notice._id, notice.published !== false)}
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 transition-all ${
                                    notice.published !== false
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100'
                                      : 'bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100'
                                  }`}
                                >
                                  {notice.published !== false ? 'Published' : 'Draft'}
                                </button>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => toggleNoticePin(notice._id, !!notice.pinned)}
                                  className={`p-1.5 rounded-lg border transition-all ${
                                    notice.pinned
                                      ? 'text-indigo-600 bg-indigo-50 border-indigo-200 hover:bg-indigo-100'
                                      : 'text-slate-400 bg-slate-50 border-slate-200 hover:bg-slate-100'
                                  }`}
                                  title={notice.pinned ? 'Unpin' : 'Pin to Top'}
                                >
                                  <Pin className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => openNoticeModal(notice)}
                                  className="p-1.5 text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-all"
                                  title="Edit Notice"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                  <button
                                    onClick={() => setConfirmDeleteId(notice._id)}
                                    disabled={actionLoading}
                                    className={`p-1.5 rounded-lg transition-all border ${
                                      deletingId === notice._id 
                                        ? 'bg-slate-100 border-slate-200 text-slate-400' 
                                        : 'text-red-600 bg-red-50 hover:bg-red-100 border-red-100'
                                    }`}
                                    title="Delete Notice"
                                  >
                                    {deletingId === notice._id ? (
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                      <Trash2 className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ==================================== LEADERSHIP MESSAGE TAB ==================================== */}
          {activeTab === 'leadership' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Founder Management Card */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-5">
                <div className="border-b border-slate-50 pb-3 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Founder Management</h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CBG Core</span>
                </div>

                <form onSubmit={saveFounder} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Founder Name</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      value={founderForm.name}
                      onChange={(e) => setFounderForm({ ...founderForm, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Designation / Title</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      value={founderForm.designation}
                      onChange={(e) => setFounderForm({ ...founderForm, designation: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Google Drive Photo URL</label>
                    <input
                      type="url"
                      placeholder="https://drive.google.com/file/d/..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      value={founderForm.googleDrivePhotoUrl}
                      onChange={(e) => setFounderForm({ ...founderForm, googleDrivePhotoUrl: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Founder Message Editorial</label>
                    <textarea
                      rows={6}
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium leading-relaxed focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      value={founderForm.message}
                      onChange={(e) => setFounderForm({ ...founderForm, message: e.target.value })}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="w-full py-2.5 bg-primary hover:bg-primary-dark text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Founder Editorial Details</span>
                  </button>
                </form>
              </div>

              {/* Manager Management Card */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-5">
                <div className="border-b border-slate-50 pb-3 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Manager Management</h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Governing Council</span>
                </div>

                <form onSubmit={saveManager} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Manager Name</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      value={managerForm.name}
                      onChange={(e) => setManagerForm({ ...managerForm, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Designation / Title</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      value={managerForm.designation}
                      onChange={(e) => setManagerForm({ ...managerForm, designation: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Google Drive Photo URL</label>
                    <input
                      type="url"
                      placeholder="https://drive.google.com/file/d/..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      value={managerForm.googleDrivePhotoUrl}
                      onChange={(e) => setManagerForm({ ...managerForm, googleDrivePhotoUrl: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Manager Message Editorial</label>
                    <textarea
                      rows={6}
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium leading-relaxed focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      value={managerForm.message}
                      onChange={(e) => setManagerForm({ ...managerForm, message: e.target.value })}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="w-full py-2.5 bg-primary hover:bg-primary-dark text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Manager Editorial Details</span>
                  </button>
                </form>
              </div>

            </div>
          )}

          {/* ==================================== ADMISSION MANAGEMENT TAB ==================================== */}
          {activeTab === 'leaders' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <LeadershipManagement notify={showNotification} />
              </div>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <GalleryManagement notify={showNotification} />
              </div>
            </div>
          )}

          {activeTab === 'admission' && (
            <AdmissionManagement />
          )}

          {activeTab === 'faculties' && (
            <FacultyManagementTab />
          )}

          {activeTab === 'documents' && (
            <DocumentManagementTab />
          )}

          {/* ==================================== WEBSITE SETTINGS TAB ==================================== */}
          {activeTab === 'settings' && (
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 max-w-4xl mx-auto space-y-6">
              <div className="border-b border-slate-50 pb-4 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">College Settings Profile</h3>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">General Ledger</span>
              </div>

              <form onSubmit={saveSettings} className="space-y-6 text-xs font-semibold text-slate-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wider text-slate-500">College Name</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                      value={settingsForm.collegeName}
                      onChange={(e) => setSettingsForm({ ...settingsForm, collegeName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wider text-slate-500">College Tagline</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                      value={settingsForm.tagline}
                      onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wider text-slate-500">Official Email</label>
                    <input
                      type="email"
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono"
                      value={settingsForm.officeEmail}
                      onChange={(e) => setSettingsForm({ ...settingsForm, officeEmail: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wider text-slate-500">Official Website URL</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono"
                      value={settingsForm.website}
                      onChange={(e) => setSettingsForm({ ...settingsForm, website: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wider text-slate-500">Primary Liaison Phone</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono"
                      value={settingsForm.primaryPhone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, primaryPhone: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wider text-slate-500">Alternate / Mobile Phone</label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono"
                      value={settingsForm.secondaryPhone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, secondaryPhone: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wider text-slate-500">Google Drive Logo URL</label>
                    <input
                      type="url"
                      placeholder="https://drive.google.com/file/d/..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono"
                      value={settingsForm.logoUrl}
                      onChange={(e) => setSettingsForm({ ...settingsForm, logoUrl: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wider text-slate-500">Google Drive Brochure URL</label>
                    <input
                      type="url"
                      placeholder="https://drive.google.com/file/d/..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono"
                      value={settingsForm.brochureUrl}
                      onChange={(e) => setSettingsForm({ ...settingsForm, brochureUrl: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[11px] uppercase tracking-wider text-slate-500">Official Street Address</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                      value={settingsForm.address}
                      onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[11px] uppercase tracking-wider text-slate-500">Google Map iframe Embed Source Link (src parameter ONLY)</label>
                    <textarea
                      rows={2}
                      required
                      placeholder="https://www.google.com/maps/embed?pb=..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono"
                      value={settingsForm.googleMapEmbedLink}
                      onChange={(e) => setSettingsForm({ ...settingsForm, googleMapEmbedLink: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[11px] uppercase tracking-wider text-slate-500">Google Map Share Link URL</label>
                    <input
                      type="url"
                      required
                      placeholder="https://maps.google.com/?q=..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono"
                      value={settingsForm.googleMapUrl}
                      onChange={(e) => setSettingsForm({ ...settingsForm, googleMapUrl: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[11px] uppercase tracking-wider text-slate-500">General Footer Text</label>
                    <textarea
                      rows={3}
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium leading-relaxed"
                      value={settingsForm.footerText}
                      onChange={(e) => setSettingsForm({ ...settingsForm, footerText: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wider text-slate-500">Current Admission Status</label>
                    <select
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                      value={settingsForm.admissionStatus}
                      onChange={(e) => setSettingsForm({ ...settingsForm, admissionStatus: e.target.value })}
                    >
                      <option value="Open">Admission Status: OPEN</option>
                      <option value="Closed">Admission Status: CLOSED</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Persist Institutional Settings</span>
                </button>
              </form>
            </div>
          )}

          {/* ==================================== CONTACT HELP DESK TAB ==================================== */}
          {activeTab === 'contact' && (
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 max-w-3xl mx-auto space-y-6">
              <div className="border-b border-slate-50 pb-4 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Helpdesk & Outreach Channels</h3>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Public Channels</span>
              </div>

              <form onSubmit={saveSettings} className="space-y-6 text-xs font-semibold text-slate-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wider text-slate-500">Office Working Hours</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Monday - Saturday: 9:00 AM - 4:00 PM"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                      value={contactForm.officeHours}
                      onChange={(e) => setContactForm({ ...contactForm, officeHours: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wider text-slate-500">WhatsApp Liaison Number</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono"
                      value={contactForm.whatsAppNumber}
                      onChange={(e) => setContactForm({ ...contactForm, whatsAppNumber: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[11px] uppercase tracking-wider text-slate-500">Emergency / Help Hotline</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono"
                      value={contactForm.emergencyContact}
                      onChange={(e) => setContactForm({ ...contactForm, emergencyContact: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wider text-slate-500">Facebook Channel URL</label>
                    <input
                      type="url"
                      placeholder="https://facebook.com/..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono"
                      value={contactForm.facebook}
                      onChange={(e) => setContactForm({ ...contactForm, facebook: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wider text-slate-500">Instagram Handle URL</label>
                    <input
                      type="url"
                      placeholder="https://instagram.com/..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono"
                      value={contactForm.instagram}
                      onChange={(e) => setContactForm({ ...contactForm, instagram: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wider text-slate-500">LinkedIn Institution Profile URL</label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono"
                      value={contactForm.linkedin}
                      onChange={(e) => setContactForm({ ...contactForm, linkedin: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wider text-slate-500">YouTube Outreach URL</label>
                    <input
                      type="url"
                      placeholder="https://youtube.com/..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono"
                      value={contactForm.youtube}
                      onChange={(e) => setContactForm({ ...contactForm, youtube: e.target.value })}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Persist Helpdesk Outreach Details</span>
                </button>
              </form>
            </div>
          )}

        </div>
      </main>

      {/* ==================================== NOTICE CRUD MODAL ==================================== */}
      {isNoticeModalOpen && (
        <div id="notice-crud-modal" className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 animate-fade-in font-sans">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 md:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                {editingNotice ? 'Edit Notice parameters' : 'Publish new Bulletin notice'}
              </h3>
              <button
                onClick={() => setIsNoticeModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-base"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleNoticeFormSubmit} className="space-y-5 text-xs font-semibold text-slate-700">
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-slate-500">Notice Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Admissions Open for LL.B 3 Years"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  value={noticeForm.title}
                  onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-slate-500">Category Tag</label>
                  <select
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                    value={noticeForm.category}
                    onChange={(e) => setNoticeForm({ ...noticeForm, category: e.target.value })}
                  >
                    <option value="Admission">Admission</option>
                    <option value="Exam">Exam</option>
                    <option value="Academic">Academic</option>
                    <option value="Event">Event</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-slate-500">Publish Date</label>
                  <input
                    type="date"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono"
                    value={noticeForm.publishDate}
                    onChange={(e) => setNoticeForm({ ...noticeForm, publishDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-slate-500">Expiry Date (Optional)</label>
                  <input
                    type="date"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono"
                    value={noticeForm.expiryDate}
                    onChange={(e) => setNoticeForm({ ...noticeForm, expiryDate: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-slate-500">Google Drive share Link URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono"
                    value={noticeForm.googleDriveUrl}
                    onChange={(e) => setNoticeForm({ ...noticeForm, googleDriveUrl: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-slate-500">Description / Details Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detailed context of the notice..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium leading-relaxed"
                  value={noticeForm.description}
                  onChange={(e) => setNoticeForm({ ...noticeForm, description: e.target.value })}
                />
              </div>

              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                    checked={noticeForm.pinned}
                    onChange={(e) => setNoticeForm({ ...noticeForm, pinned: e.target.checked })}
                  />
                  <span>Pin Notice to Top of Bulletin</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                    checked={noticeForm.published}
                    onChange={(e) => setNoticeForm({ ...noticeForm, published: e.target.checked })}
                  />
                  <span>Publish Immediately</span>
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsNoticeModalOpen(false)}
                  className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 py-2.5 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-lg transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingNotice ? 'Update Notice' : 'Post Notice'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
