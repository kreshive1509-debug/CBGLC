import React, { useEffect, useMemo, useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  Save,
  Loader2,
  XCircle
} from 'lucide-react';

const DEFAULT_LEADER_FORM = {
  photoUrl: '',
  fullName: '',
  designation: '',
  editorialMessage: '',
  buttonText: 'Read Full Message',
  buttonUrl: '',
  published: true,
  featured: false,
  displayOrder: 0
};

export function LeadershipManagement({ notify }: { notify: (msg: string, isError?: boolean) => void }) {
  const { token } = useAdminAuth();
  const [leaders, setLeaders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [editingLeader, setEditingLeader] = useState<any | null>(null);
  const [formData, setFormData] = useState(DEFAULT_LEADER_FORM);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const fetchLeaders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/leaders');
      if (res.ok) {
        const data = await res.json();
        setLeaders(data);
      } else {
        notify('Failed to load leaders.', true);
      }
    } catch (err: any) {
      notify(err.message || 'Unable to load leaders.', true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaders();
  }, []);

  const filteredLeaders = useMemo(() => {
    return leaders
      .filter((leader) => {
        const term = searchTerm.toLowerCase();
        if (!searchTerm) return true;
        return (
          leader.fullName.toLowerCase().includes(term) ||
          leader.designation.toLowerCase().includes(term) ||
          leader.editorialMessage.toLowerCase().includes(term)
        );
      })
      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  }, [leaders, searchTerm]);

  const pageSize = 6;
  const pageCount = Math.max(1, Math.ceil(filteredLeaders.length / pageSize));
  const pagedLeaders = filteredLeaders.slice((page - 1) * pageSize, page * pageSize);

  const resetForm = () => {
    setEditingLeader(null);
    setFormData(DEFAULT_LEADER_FORM);
  };

  const openEdit = (leader: any) => {
    setEditingLeader(leader);
    setFormData({
      photoUrl: leader.photoUrl,
      fullName: leader.fullName,
      designation: leader.designation,
      editorialMessage: leader.editorialMessage,
      buttonText: leader.buttonText || 'Read Full Message',
      buttonUrl: leader.buttonUrl || '',
      published: leader.published ?? true,
      featured: leader.featured ?? false,
      displayOrder: leader.displayOrder ?? 0
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const saveLeader = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.photoUrl.trim() || !formData.fullName.trim() || !formData.designation.trim() || !formData.editorialMessage.trim()) {
      notify('Photo URL, full name, designation, and message are required.', true);
      return;
    }

    setActionLoading(true);
    try {
      const endpoint = editingLeader ? `/api/leaders/${editingLeader._id}` : '/api/leaders';
      const method = editingLeader ? 'PUT' : 'POST';
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) {
        notify(data.error || 'Unable to save leader.', true);
        return;
      }
      notify(editingLeader ? 'Leader updated successfully.' : 'Leader created successfully.');
      fetchLeaders();
      resetForm();
    } catch (err: any) {
      notify(err.message || 'Network error while saving leader.', true);
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDelete = async (id: string) => {
    setConfirmDeleteId(id);
  };

  const deleteLeader = async () => {
    if (!confirmDeleteId) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/leaders/${confirmDeleteId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) {
        notify(data.error || 'Unable to delete leader.', true);
        return;
      }
      notify('Leader deleted successfully.');
      fetchLeaders();
    } catch (err: any) {
      notify(err.message || 'Network error while deleting leader.', true);
    } finally {
      setActionLoading(false);
      setConfirmDeleteId(null);
    }
  };

  const toggleVisibility = async (leader: any) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/leaders/${leader._id}/publish`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ published: !leader.published })
      });
      const data = await res.json();
      if (!res.ok) {
        notify(data.error || 'Unable to update publication status.', true);
        return;
      }
      notify(`Leader ${leader.published ? 'unpublished' : 'published'} successfully.`);
      fetchLeaders();
    } catch (err: any) {
      notify(err.message || 'Network error while updating leader.', true);
    } finally {
      setActionLoading(false);
    }
  };

  const updateOrder = async (leader: any, delta: number) => {
    const newOrder = (leader.displayOrder ?? 0) + delta;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/leaders/${leader._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ...leader, displayOrder: newOrder })
      });
      const data = await res.json();
      if (!res.ok) {
        notify(data.error || 'Unable to reorder leader.', true);
        return;
      }
      fetchLeaders();
    } catch (err: any) {
      notify(err.message || 'Network error while reordering.', true);
    } finally {
      setActionLoading(false);
    }
  };

  const featuredBadge = formData.featured ? 'Featured Record' : 'Standard Record';

  return (
    <div className="space-y-8">
      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-gold font-bold mb-2">Leadership Management</p>
              <h3 className="text-xl font-extrabold text-slate-900">Create dynamic leader profiles</h3>
              <p className="text-sm text-slate-500 mt-1">Maintain founder/manager legacy while adding unlimited leaders.</p>
            </div>
            <button
              onClick={resetForm}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-sm hover:bg-primary-dark transition-all"
            >
              <Plus className="w-4 h-4" />
              New Leader
            </button>
          </div>

          <form onSubmit={saveLeader} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Photo URL (ImgBB direct link)</label>
              <input
                type="url"
                value={formData.photoUrl}
                onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                placeholder="https://i.ibb.co/.../profile.jpg"
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Prof. Dr. Name"
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Designation</label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  placeholder="Principal / Director"
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Editorial Message</label>
              <textarea
                value={formData.editorialMessage}
                onChange={(e) => setFormData({ ...formData, editorialMessage: e.target.value })}
                rows={6}
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Button Text</label>
                <input
                  type="text"
                  value={formData.buttonText}
                  onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Button URL</label>
                <input
                  type="url"
                  value={formData.buttonUrl}
                  onChange={(e) => setFormData({ ...formData, buttonUrl: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Display Order</label>
                <input
                  type="number"
                  min={0}
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <label className="inline-flex items-center gap-2 px-4 py-3 border border-slate-200 rounded-2xl cursor-pointer text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="form-checkbox h-4 w-4 text-primary"
                />
                Published
              </label>
              <label className="inline-flex items-center gap-2 px-4 py-3 border border-slate-200 rounded-2xl cursor-pointer text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="form-checkbox h-4 w-4 text-primary"
                />
                Featured
              </label>
              <div className="col-span-2 flex items-center justify-end text-[11px] text-slate-500 font-semibold">
                {featuredBadge}
              </div>
            </div>
            <button
              type="submit"
              disabled={actionLoading}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/10 hover:bg-primary-dark transition-all"
            >
              <Save className="w-4 h-4" />
              {editingLeader ? 'Update Leader' : 'Save Leader'}
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">Leadership Registry</p>
              <h4 className="text-lg font-extrabold text-slate-900">Published leader profiles</h4>
            </div>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search leaders by name or role"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                className="pl-10 pr-4 py-3 w-full rounded-2xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-4">Photo</th>
                  <th className="px-4 py-4">Name</th>
                  <th className="px-4 py-4">Designation</th>
                  <th className="px-4 py-4">Order</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td className="px-4 py-4"><div className="h-10 w-10 bg-slate-200 rounded-full" /></td>
                      <td className="px-4 py-4"><div className="h-4 w-32 bg-slate-200 rounded-xl" /></td>
                      <td className="px-4 py-4"><div className="h-4 w-24 bg-slate-200 rounded-xl" /></td>
                      <td className="px-4 py-4"><div className="h-4 w-12 bg-slate-200 rounded-xl" /></td>
                      <td className="px-4 py-4"><div className="h-4 w-20 bg-slate-200 rounded-xl" /></td>
                      <td className="px-4 py-4 text-right"><div className="h-8 w-24 bg-slate-200 rounded-2xl mx-auto" /></td>
                    </tr>
                  ))
                ) : pagedLeaders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">No leaders found. Add the founder and manager first, then create additional leader records.</td>
                  </tr>
                ) : (
                  pagedLeaders.map((leader) => (
                    <tr key={leader._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-4 align-top">
                        <div className="w-10 h-10 overflow-hidden rounded-full bg-slate-100">
                          <img src={leader.photoUrl} alt={leader.fullName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                      </td>
                      <td className="px-4 py-4 align-top font-semibold text-slate-800">{leader.fullName}</td>
                      <td className="px-4 py-4 align-top">
                        <span className="inline-flex px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] uppercase tracking-wider">{leader.designation}</span>
                      </td>
                      <td className="px-4 py-4 align-top">{leader.displayOrder ?? 0}</td>
                      <td className="px-4 py-4 align-top">
                        <span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-bold ${leader.published ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                          {leader.published ? 'Published' : 'Hidden'}
                        </span>
                      </td>
                      <td className="px-4 py-4 align-top text-right space-x-1">
                        <button onClick={() => updateOrder(leader, -1)} className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600" title="Move up">
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button onClick={() => updateOrder(leader, 1)} className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600" title="Move down">
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button onClick={() => toggleVisibility(leader)} className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600" title="Toggle publish">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => openEdit(leader)} className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600" title="Edit leader">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => confirmDelete(leader._id)} className="p-2 rounded-xl border border-red-100 hover:bg-red-50 text-red-600" title="Delete leader">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-slate-500">Showing {pagedLeaders.length} of {filteredLeaders.length}</p>
            <div className="inline-flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                className="px-3 py-2 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 disabled:opacity-40"
              >
                Prev
              </button>
              <span className="text-xs text-slate-500">Page {page} / {pageCount}</span>
              <button
                disabled={page >= pageCount}
                onClick={() => setPage((prev) => Math.min(pageCount, prev + 1))}
                className="px-3 py-2 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {confirmDeleteId && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm"
          >
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-sm w-full p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-red-50 text-red-600">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">Confirm deletion</h4>
                  <p className="text-sm text-slate-500">This will permanently remove the selected leader from the list.</p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3">
                <button onClick={() => setConfirmDeleteId(null)} className="px-4 py-2 rounded-2xl border border-slate-200 text-slate-700 text-xs font-bold">Cancel</button>
                <button onClick={deleteLeader} disabled={actionLoading} className="px-4 py-2 rounded-2xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 disabled:opacity-50">
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete Now'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
