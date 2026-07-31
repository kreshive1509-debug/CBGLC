import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { apiUrl } from '../../utils/api';
import { apiFetch, safeJson } from '../../utils/http';
import { Plus, Edit, Trash2, Save, AlertCircle, BookOpen, Loader2 } from 'lucide-react';

export function DocumentManagementTab() {
  const { token } = useAdminAuth();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<any | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    link: '',
    linkType: 'Google Drive',
    buttonText: 'Open',
    publishDate: new Date().toISOString().split('T')[0],
    validTill: '',
    priority: 'Medium',
    displayOrder: 0,
    isVisible: true,
    openInNewTab: true
  });

  const fetchDocuments = async () => {
    try {
      const res = await apiFetch(apiUrl('/api/documents'), { cache: 'no-store' }, 'DocumentTab');
      const data = await safeJson<any>(res, 'DocumentTab fetch');
      setDocuments(data.documents || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const openModal = (doc?: any) => {
    if (doc) {
      setEditingDoc(doc);
      setFormData({
        title: doc.title || '',
        description: doc.description || '',
        category: doc.category || '',
        link: doc.link || '',
        linkType: doc.linkType || 'Google Drive',
        buttonText: doc.buttonText || 'Open',
        publishDate: doc.publishDate ? new Date(doc.publishDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        validTill: doc.validTill ? new Date(doc.validTill).toISOString().split('T')[0] : '',
        priority: doc.priority || 'Medium',
        displayOrder: doc.displayOrder || 0,
        isVisible: doc.isVisible !== false,
        openInNewTab: doc.openInNewTab !== false
      });
    } else {
      setEditingDoc(null);
      setFormData({
        title: '',
        description: '',
        category: '',
        link: '',
        linkType: 'Google Drive',
        buttonText: 'Open',
        publishDate: new Date().toISOString().split('T')[0],
        validTill: '',
        priority: 'Medium',
        displayOrder: 0,
        isVisible: true,
        openInNewTab: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    
    try {
      const url = editingDoc ? `/api/documents/${editingDoc._id}` : '/api/documents';
      const method = editingDoc ? 'PUT' : 'POST';

      const payload = { ...formData };
      if (!payload.validTill) delete (payload as any).validTill;

      const res = await apiFetch(apiUrl(url), {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      }, 'DocumentTab submit');

      if (res.ok) {
        setIsModalOpen(false);
        fetchDocuments();
        window.dispatchEvent(new Event('cms-updated'));
      } else {
        const err = await safeJson<any>(res, 'DocumentTab error').catch(() => ({}));
        alert(err.error || 'Failed to save document');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving document');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setActionLoading(true);
    try {
      const res = await apiFetch(apiUrl(`/api/documents/${id}`), {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      }, 'DocumentTab delete');

      if (res.ok) {
        setConfirmDeleteId(null);
        fetchDocuments();
        window.dispatchEvent(new Event('cms-updated'));
      } else {
        alert('Failed to delete document');
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
      await apiFetch(apiUrl(`/api/documents/${id}/visibility`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isVisible: !current })
      }, 'DocumentTab toggle');
      fetchDocuments();
      window.dispatchEvent(new Event('cms-updated'));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Document Center Management</h3>
        <button
          onClick={() => openModal()}
          className="bg-primary hover:bg-primary-dark text-white font-bold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Document</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                <th className="p-4 pl-6">Document Info</th>
                <th className="p-4">Category & Priority</th>
                <th className="p-4">Publish Date</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs font-medium">
              {documents.length === 0 && !loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400 font-medium">
                    No documents found.
                  </td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr key={doc._id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{doc.title}</p>
                          <a href={doc.link} target="_blank" rel="noreferrer" className="text-[10px] text-primary hover:underline line-clamp-1">{doc.linkType} Link</a>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-wider mr-2">{doc.category}</span>
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${doc.priority === 'High' ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-500'}`}>{doc.priority}</span>
                    </td>
                    <td className="p-4 text-slate-600 font-mono text-[11px]">
                      {doc.publishDate ? new Date(doc.publishDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col items-center gap-1">
                        <button
                          onClick={() => toggleVisibility(doc._id, doc.isVisible !== false)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 transition-all ${
                            doc.isVisible !== false
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100'
                              : 'bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100'
                          }`}
                        >
                          {doc.isVisible !== false ? 'Visible' : 'Hidden'}
                        </button>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openModal(doc)} className="p-1.5 text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-all" title="Edit">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setConfirmDeleteId(doc._id)} disabled={actionLoading} className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 rounded-lg transition-all" title="Delete">
                          {deletingId === doc._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
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
                {editingDoc ? 'Edit Document' : 'Add New Document'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold text-base">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-slate-500">Document Title</label>
                <input type="text" required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-slate-500">Category</label>
                  <input type="text" required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="e.g. Admission, Circular" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-slate-500">Priority</label>
                  <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-slate-500">Document Link (URL)</label>
                <input type="url" required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-slate-500">Link Type</label>
                  <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg" value={formData.linkType} onChange={e => setFormData({...formData, linkType: e.target.value})}>
                    <option value="Google Drive">Google Drive</option>
                    <option value="Google Form">Google Form</option>
                    <option value="External URL">External URL</option>
                    <option value="PDF">PDF Link</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-slate-500">Button Text</label>
                  <input type="text" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg" value={formData.buttonText} onChange={e => setFormData({...formData, buttonText: e.target.value})} placeholder="e.g. Open Document" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-slate-500">Publish Date</label>
                  <input type="date" required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono" value={formData.publishDate} onChange={e => setFormData({...formData, publishDate: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-slate-500">Valid Till (Optional)</label>
                  <input type="date" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono" value={formData.validTill} onChange={e => setFormData({...formData, validTill: e.target.value})} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-slate-500">Short Description</label>
                <textarea rows={2} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
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
            <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Document?</h3>
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
