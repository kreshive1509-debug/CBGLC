import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { apiUrl } from '../../utils/api';
import { apiFetch, safeJson } from '../../utils/http';
import { Plus, Edit, Trash2, Save, CheckCircle, AlertCircle, Users, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function FacultyManagementTab() {
  const { token } = useAdminAuth();
  const [faculties, setFaculties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<any | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    designation: '',
    department: '',
    qualification: '',
    experience: '',
    description: '',
    photoUrl: '',
    email: '',
    linkedin: '',
    website: '',
    expertise: '',
    displayOrder: 0,
    isVisible: true
  });

  const fetchFaculties = async () => {
    try {
      const res = await apiFetch(apiUrl('/api/faculties'), { cache: 'no-store' }, 'FacultyTab');
      const data = await safeJson<any>(res, 'FacultyTab fetch');
      setFaculties(data.faculties || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculties();
  }, []);

  const openModal = (faculty?: any) => {
    if (faculty) {
      setEditingFaculty(faculty);
      setFormData({
        ...faculty,
        expertise: Array.isArray(faculty.expertise) ? faculty.expertise.join(', ') : (faculty.expertise || '')
      });
    } else {
      setEditingFaculty(null);
      setFormData({
        fullName: '',
        designation: '',
        department: '',
        qualification: '',
        experience: '',
        description: '',
        photoUrl: '',
        email: '',
        linkedin: '',
        website: '',
        expertise: '',
        displayOrder: 0,
        isVisible: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    
    try {
      const payload = {
        ...formData,
        expertise: formData.expertise.split(',').map(s => s.trim()).filter(Boolean)
      };

      const url = editingFaculty ? `/api/faculties/${editingFaculty._id}` : '/api/faculties';
      const method = editingFaculty ? 'PUT' : 'POST';

      const res = await apiFetch(apiUrl(url), {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      }, 'FacultyTab submit');

      if (res.ok) {
        setIsModalOpen(false);
        fetchFaculties();
        window.dispatchEvent(new Event('cms-updated'));
      } else {
        const err = await safeJson<any>(res, 'FacultyTab error').catch(() => ({}));
        alert(err.error || 'Failed to save faculty');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving faculty');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setActionLoading(true);
    try {
      const res = await apiFetch(apiUrl(`/api/faculties/${id}`), {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      }, 'FacultyTab delete');

      if (res.ok) {
        setConfirmDeleteId(null);
        fetchFaculties();
        window.dispatchEvent(new Event('cms-updated'));
      } else {
        alert('Failed to delete faculty');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
      setActionLoading(false);
    }
  };

  const toggleVisibility = async (id: string, current: boolean) => {
    try {
      await apiFetch(apiUrl(`/api/faculties/${id}/visibility`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isVisible: !current })
      }, 'FacultyTab toggle');
      fetchFaculties();
      window.dispatchEvent(new Event('cms-updated'));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Faculty Management</h3>
        <button
          onClick={() => openModal()}
          className="bg-primary hover:bg-primary-dark text-white font-bold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Faculty</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                <th className="p-4 pl-6">Profile</th>
                <th className="p-4">Designation & Dept</th>
                <th className="p-4">Order</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs font-medium">
              {faculties.length === 0 && !loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400 font-medium">
                    No faculty members found.
                  </td>
                </tr>
              ) : (
                faculties.map((faculty) => (
                  <tr key={faculty._id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
                          {faculty.photoUrl ? (
                            <img src={faculty.photoUrl} alt={faculty.fullName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400"><Users className="w-5 h-5" /></div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{faculty.fullName}</p>
                          <p className="text-[10px] text-slate-500 line-clamp-1">{faculty.qualification}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-slate-700">{faculty.designation}</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">{faculty.department}</p>
                    </td>
                    <td className="p-4 text-slate-600 font-mono text-[11px]">{faculty.displayOrder}</td>
                    <td className="p-4">
                      <div className="flex flex-col items-center gap-1">
                        <button
                          onClick={() => toggleVisibility(faculty._id, faculty.isVisible !== false)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 transition-all ${
                            faculty.isVisible !== false
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100'
                              : 'bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100'
                          }`}
                        >
                          {faculty.isVisible !== false ? 'Visible' : 'Hidden'}
                        </button>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openModal(faculty)}
                          className="p-1.5 text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(faculty._id)}
                          disabled={actionLoading}
                          className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 rounded-lg transition-all"
                          title="Delete"
                        >
                          {deletingId === faculty._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 animate-fade-in font-sans">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 md:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                {editingFaculty ? 'Edit Faculty Profile' : 'Add New Faculty'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold text-base">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-slate-500">Full Name</label>
                  <input type="text" required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-slate-500">Designation</label>
                  <input type="text" required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg" value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-slate-500">Department</label>
                  <input type="text" required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-slate-500">Qualification</label>
                  <input type="text" required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg" value={formData.qualification} onChange={e => setFormData({...formData, qualification: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-slate-500">Photo URL</label>
                  <input type="url" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono" value={formData.photoUrl} onChange={e => setFormData({...formData, photoUrl: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-slate-500">Display Order</label>
                  <input type="number" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono" value={formData.displayOrder} onChange={e => setFormData({...formData, displayOrder: parseInt(e.target.value) || 0})} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-slate-500">Expertise (Comma separated)</label>
                <input type="text" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg" value={formData.expertise} onChange={e => setFormData({...formData, expertise: e.target.value})} placeholder="e.g. Constitutional Law, Criminal Justice" />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-slate-500">Short Description / Bio</label>
                <textarea rows={3} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>

              <div className="flex gap-4 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 border border-slate-200 rounded-lg">Cancel</button>
                <button type="submit" disabled={actionLoading} className="flex-1 py-2 bg-primary text-white font-bold rounded-lg flex items-center justify-center gap-2"><Save className="w-4 h-4"/> Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmDeleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center">
            <AlertCircle className="w-10 h-10 text-red-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Faculty?</h3>
            <p className="text-sm text-slate-500 mb-6">This action cannot be undone.</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setConfirmDeleteId(null)} className="py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold">Cancel</button>
              <button onClick={() => handleDelete(confirmDeleteId)} className="py-2.5 bg-red-600 text-white rounded-xl font-bold">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
