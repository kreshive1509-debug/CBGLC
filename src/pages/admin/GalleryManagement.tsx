import React, { useEffect, useMemo, useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { apiUrl } from '../../utils/api';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  Save,
  Loader2,
  XCircle,
  CheckCircle2
} from 'lucide-react';

const DEFAULT_FORM = {
  url: '',
  title: '',
  category: 'Campus',
  visible: true,
  displayOrder: 0
};

const CATEGORY_OPTIONS = [
  'Campus',
  'Academics',
  'Moot Court',
  'Events',
  'Infrastructure',
  'Library',
  'Seminar',
  'Workshop',
  'Convocation',
  'Others'
];

interface GalleryManagementProps {
  notify: (msg: string, isError?: boolean) => void;
}

export function GalleryManagement({ notify }: GalleryManagementProps) {
  const { getFreshToken } = useAdminAuth();
  const [images, setImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [editingImage, setEditingImage] = useState<any | null>(null);
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(apiUrl('/api/gallery'));
      if (res.ok) {
        const data = await res.json();
        setImages(data);
      } else {
        notify('Failed to load gallery images.', true);
      }
    } catch (err: any) {
      notify(err.message || 'Unable to load gallery images.', true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const filteredImages = useMemo(() => {
    return images
      .filter((item) => {
        if (categoryFilter && item.category !== categoryFilter) {
          return false;
        }
        if (!searchTerm) {
          return true;
        }
        const term = searchTerm.toLowerCase();
        return (
          item.title.toLowerCase().includes(term) ||
          item.category.toLowerCase().includes(term) ||
          item.url.toLowerCase().includes(term)
        );
      })
      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  }, [images, searchTerm, categoryFilter]);

  const pageSize = 7;
  const pageCount = Math.max(1, Math.ceil(filteredImages.length / pageSize));
  const pagedImages = filteredImages.slice((page - 1) * pageSize, page * pageSize);

  const resetForm = () => {
    setEditingImage(null);
    setFormData(DEFAULT_FORM);
  };

  const openEdit = (image: any) => {
    setEditingImage(image);
    setFormData({
      url: image.url,
      title: image.title,
      category: image.category,
      visible: image.visible ?? true,
      displayOrder: image.displayOrder ?? 0
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const saveImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.url.trim() || !formData.title.trim() || !formData.category.trim()) {
      notify('Image URL, title, and category are required.', true);
      return;
    }

    setActionLoading(true);
    try {
      const authToken = await getFreshToken();
      if (!authToken) {
        notify('Authentication token not found. Please log in again.', true);
        return;
      }

      const endpoint = editingImage ? apiUrl(`/api/gallery/${editingImage._id}`) : apiUrl('/api/gallery');
      const method = editingImage ? 'PUT' : 'POST';
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        notify(data.error || 'Unable to save image.', true);
        return;
      }

      notify(editingImage ? 'Gallery image updated successfully.' : 'Gallery image created successfully.');
      fetchImages();
      resetForm();
    } catch (err: any) {
      notify(err.message || 'Network error while saving image.', true);
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDelete = async (id: string) => {
    setConfirmDeleteId(id);
  };

  const deleteImage = async () => {
    if (!confirmDeleteId) return;
    setActionLoading(true);
    try {
      const authToken = await getFreshToken();
      if (!authToken) {
        notify('Authentication token not found. Please log in again.', true);
        return;
      }

      const res = await fetch(apiUrl(`/api/gallery/${confirmDeleteId}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const data = await res.json();
      if (!res.ok) {
        notify(data.error || 'Unable to delete image.', true);
        return;
      }
      notify('Gallery image deleted successfully.');
      fetchImages();
    } catch (err: any) {
      notify(err.message || 'Network error while deleting image.', true);
    } finally {
      setActionLoading(false);
      setConfirmDeleteId(null);
    }
  };

  const toggleVisibility = async (item: any) => {
    setActionLoading(true);
    try {
      const authToken = await getFreshToken();
      if (!authToken) {
        notify('Authentication token not found. Please log in again.', true);
        return;
      }

      const res = await fetch(apiUrl(`/api/gallery/${item._id}/visible`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ visible: !item.visible })
      });
      const data = await res.json();
      if (!res.ok) {
        notify(data.error || 'Unable to update visibility.', true);
        return;
      }
      notify(`Gallery image ${item.visible ? 'hidden' : 'published'} successfully.`);
      fetchImages();
    } catch (err: any) {
      notify(err.message || 'Network error while updating visibility.', true);
    } finally {
      setActionLoading(false);
    }
  };

  const updateOrder = async (item: any, delta: number) => {
    const newOrder = (item.displayOrder ?? 0) + delta;
    setActionLoading(true);
    try {
      const authToken = await getFreshToken();
      if (!authToken) {
        notify('Authentication token not found. Please log in again.', true);
        return;
      }

      const res = await fetch(apiUrl(`/api/gallery/${item._id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          ...item,
          displayOrder: newOrder
        })
      });
      const data = await res.json();
      if (!res.ok) {
        notify(data.error || 'Unable to reorder image.', true);
        return;
      }
      fetchImages();
    } catch (err: any) {
      notify(err.message || 'Network error while reordering.', true);
    } finally {
      setActionLoading(false);
    }
  };

  const categories = Array.from(new Set([...CATEGORY_OPTIONS, ...images.map((item) => item.category || '')].filter(Boolean)));

  return (
    <div className="space-y-8">
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-gold font-bold mb-2">Gallery Management</p>
              <h3 className="text-xl font-extrabold text-slate-900">Add and manage image assets</h3>
              <p className="text-sm text-slate-500 mt-1">Use direct ImgBB URLs only. Images are stored as metadata only.</p>
            </div>
            <button
              onClick={resetForm}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-sm hover:bg-primary-dark transition-all"
            >
              <Plus className="w-4 h-4" />
              New Image
            </button>
          </div>

          <form onSubmit={saveImage} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Image URL (ImgBB direct link)</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://i.ibb.co/.../image.jpg"
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Image Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Smart Classroom Interior"
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                  required
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400">This category controls the public gallery filter.</p>
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
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Status</label>
                <select
                  value={formData.visible ? 'published' : 'hidden'}
                  onChange={(e) => setFormData({ ...formData, visible: e.target.value === 'published' })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="published">Published</option>
                  <option value="hidden">Hidden</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={actionLoading}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-slate-950 rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-gold/10 hover:shadow-gold/20 transition-all"
            >
              <Save className="w-4 h-4" />
              {editingImage ? 'Update Image' : 'Save Image'}
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="mb-5 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">Gallery Registry</p>
              <h4 className="text-lg font-extrabold text-slate-900">Image catalog</h4>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by title, category or URL"
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                  className="pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-3 text-slate-400" />
                <select
                  value={categoryFilter}
                  onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
                  className="pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-4">Preview</th>
                  <th className="px-4 py-4">Title</th>
                  <th className="px-4 py-4">Category</th>
                  <th className="px-4 py-4">Order</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td className="px-4 py-4"><div className="h-10 w-16 bg-slate-200 rounded-xl" /></td>
                      <td className="px-4 py-4"><div className="h-4 w-32 bg-slate-200 rounded-xl" /></td>
                      <td className="px-4 py-4"><div className="h-4 w-24 bg-slate-200 rounded-xl" /></td>
                      <td className="px-4 py-4"><div className="h-4 w-12 bg-slate-200 rounded-xl" /></td>
                      <td className="px-4 py-4"><div className="h-4 w-20 bg-slate-200 rounded-xl" /></td>
                      <td className="px-4 py-4 text-right"><div className="h-8 w-24 bg-slate-200 rounded-2xl mx-auto" /></td>
                    </tr>
                  ))
                ) : pagedImages.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">No gallery images found. Add one above to populate the gallery.</td>
                  </tr>
                ) : (
                  pagedImages.map((image) => (
                    <tr key={image._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-4 align-top">
                        <div className="w-16 h-10 overflow-hidden rounded-2xl bg-slate-100">
                          <img src={image.url} alt={image.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                      </td>
                      <td className="px-4 py-4 align-top font-semibold text-slate-800">{image.title}</td>
                      <td className="px-4 py-4 align-top">
                        <span className="inline-flex px-2 py-1 rounded-full text-[10px] bg-slate-100 text-slate-600 uppercase tracking-wider">{image.category}</span>
                      </td>
                      <td className="px-4 py-4 align-top">{image.displayOrder ?? 0}</td>
                      <td className="px-4 py-4 align-top">
                        <span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-bold ${image.visible ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                          {image.visible ? 'Published' : 'Hidden'}
                        </span>
                      </td>
                      <td className="px-4 py-4 align-top text-right space-x-1">
                        <button onClick={() => updateOrder(image, -1)} className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600" title="Move up">
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button onClick={() => updateOrder(image, 1)} className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600" title="Move down">
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button onClick={() => toggleVisibility(image)} className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600" title="Toggle visibility">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => openEdit(image)} className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600" title="Edit image">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => confirmDelete(image._id)} className="p-2 rounded-xl border border-red-100 hover:bg-red-50 text-red-600" title="Delete image">
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
            <p className="text-[11px] text-slate-500">Showing {pagedImages.length} of {filteredImages.length} images</p>
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
                  <p className="text-sm text-slate-500">This will permanently remove the selected image from the gallery.</p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3">
                <button onClick={() => setConfirmDeleteId(null)} className="px-4 py-2 rounded-2xl border border-slate-200 text-slate-700 text-xs font-bold">Cancel</button>
                <button onClick={deleteImage} disabled={actionLoading} className="px-4 py-2 rounded-2xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 disabled:opacity-50">
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
