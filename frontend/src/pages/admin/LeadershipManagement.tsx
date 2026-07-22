import React, { useEffect, useMemo, useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { apiUrl } from '../../utils/api';
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
  fullName: '',
  designation: '',
  membership: 'Member',
  photoUrl: '',
  editorialMessage: '',
  published: true,
  displayOrder: 0
};

const buildLegacyLeaderPayload = (formData: typeof DEFAULT_LEADER_FORM, existingLeader?: any) => {
  const fullName = String(formData.fullName || '').trim();
  const designation = String(formData.designation || '').trim();
  const membership = String(formData.membership || '').trim();
  const photoUrl = String(formData.photoUrl || '').trim();
  const editorialMessage = String(formData.editorialMessage || '').trim();

  const legacyPhotoUrl =
    (existingLeader?.photoUrl && String(existingLeader.photoUrl).trim()) ||
    photoUrl ||
    `https://placeholder.local/leader-${encodeURIComponent(fullName.toLowerCase() || 'member')}`;

  const legacyMessage =
    editorialMessage ||
    `${fullName} - ${designation} (${membership})`;

  return {
    fullName,
    designation,
    membership,
    photoUrl: legacyPhotoUrl,
    editorialMessage: legacyMessage,
    published: formData.published,
    displayOrder: formData.displayOrder,
  };
};

const resolveMembership = (leader: any) => {
  const explicitMembership = String(leader?.membership || '').trim();
  if (explicitMembership) return explicitMembership;

  const message = String(leader?.editorialMessage || '').trim();
  const match = message.match(/\(([^()]+)\)\s*$/);
  if (match?.[1]) return match[1].trim();

  const designation = String(leader?.designation || '').trim().toLowerCase();
  if (designation.includes('founder')) return 'Founder';
  if (designation.includes('manager')) return 'Manager';
  return 'Member';
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
      const res = await fetch(apiUrl('/api/leaders'), { cache: 'no-store' });
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
        const fullName = String(leader.fullName || '').toLowerCase();
        const designation = String(leader.designation || '').toLowerCase();
        const membership = resolveMembership(leader).toLowerCase();
        return (
          fullName.includes(term) ||
          designation.includes(term) ||
          membership.includes(term)
        );
      })
      .sort((a, b) => {
        const aCreated = new Date(a.createdAt || 0).getTime();
        const bCreated = new Date(b.createdAt || 0).getTime();
        return aCreated - bCreated || (a.displayOrder ?? 0) - (b.displayOrder ?? 0);
      });
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
      fullName: leader.fullName || '',
      designation: leader.designation || '',
      membership: resolveMembership(leader),
      photoUrl: leader.photoUrl || '',
      editorialMessage: leader.editorialMessage || '',
      published: leader.published ?? true,
      displayOrder: leader.displayOrder ?? 0
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const saveLeader = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !String(formData.fullName || '').trim() ||
      !String(formData.designation || '').trim() ||
      !String(formData.membership || '').trim()
    ) {
      notify('Full name, designation, and membership are required.', true);
      return;
    }

    setActionLoading(true);
    try {
      const endpoint = editingLeader ? apiUrl(`/api/leaders/${editingLeader._id}`) : apiUrl('/api/leaders');
      const method = editingLeader ? 'PUT' : 'POST';
      const payload = buildLegacyLeaderPayload(formData, editingLeader);
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        notify(data.error || 'Unable to save leader.', true);
        return;
      }
      notify(editingLeader ? 'Leader updated successfully.' : 'Leader created successfully.');
      await fetchLeaders();
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
      const res = await fetch(apiUrl(`/api/leaders/${confirmDeleteId}`), {
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
      const res = await fetch(apiUrl(`/api/leaders/${leader._id}/publish`), {
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
      const res = await fetch(apiUrl(`/api/leaders/${leader._id}`), {
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

  return (
    <div className="space-y-8">
      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-gold font-bold mb-2">Leadership Management</p>
              <h3 className="text-xl font-extrabold text-slate-900">Create governing council records</h3>
              <p className="text-sm text-slate-500 mt-1">Maintain founder and manager separately while adding council members as table records.</p>
            </div>
            <button
              onClick={resetForm}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-sm hover:bg-primary-dark transition-all"
            >
              <Plus className="w-4 h-4" />
              New Member
            </button>
          </div>

          <form onSubmit={saveLeader} className="space-y-4">
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
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Occupation / Designation</label>
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
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Membership</label>
              <input
                type="text"
                value={formData.membership}
                onChange={(e) => setFormData({ ...formData, membership: e.target.value })}
                placeholder="Member / Trustee / Advisor"
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <label className="inline-flex items-center gap-2 px-4 py-3 border border-slate-200 rounded-2xl cursor-pointer text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="form-checkbox h-4 w-4 text-primary"
                />
                Published
              </label>
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
                placeholder="Search members by name or designation"
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
                  <th className="px-4 py-4">S.No</th>
                  <th className="px-4 py-4">Name</th>
                  <th className="px-4 py-4">Occupation / Designation</th>
                  <th className="px-4 py-4">Membership</th>
                  <th className="px-4 py-4">Order</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td className="px-4 py-4"><div className="h-4 w-8 bg-slate-200 rounded-xl" /></td>
                      <td className="px-4 py-4"><div className="h-4 w-32 bg-slate-200 rounded-xl" /></td>
                      <td className="px-4 py-4"><div className="h-4 w-24 bg-slate-200 rounded-xl" /></td>
                      <td className="px-4 py-4"><div className="h-4 w-20 bg-slate-200 rounded-xl" /></td>
                      <td className="px-4 py-4"><div className="h-4 w-12 bg-slate-200 rounded-xl" /></td>
                      <td className="px-4 py-4"><div className="h-4 w-20 bg-slate-200 rounded-xl" /></td>
                      <td className="px-4 py-4 text-right"><div className="h-8 w-24 bg-slate-200 rounded-2xl mx-auto" /></td>
                    </tr>
                  ))
                ) : pagedLeaders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">No council members found. Add the governing council records to populate this table.</td>
                  </tr>
                ) : (
                  pagedLeaders.map((leader, index) => (
                    <tr key={leader._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-4 align-top font-semibold text-slate-700">{(page - 1) * pageSize + index + 1}</td>
                      <td className="px-4 py-4 align-top font-semibold text-slate-800">{leader.fullName}</td>
                      <td className="px-4 py-4 align-top">
                        <span className="inline-flex px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] uppercase tracking-wider">{leader.designation}</span>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <span className="inline-flex px-2 py-1 rounded-full bg-primary/5 text-primary text-[10px] uppercase tracking-wider">
                          {resolveMembership(leader)}
                        </span>
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
