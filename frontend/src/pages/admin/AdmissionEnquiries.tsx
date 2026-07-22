import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../../utils/api';
import {
  Scale,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Trash2,
  ExternalLink,
  ChevronLeft
} from 'lucide-react';

export function AdmissionEnquiries() {
  const { token, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const res = await fetch(apiUrl('/api/enquiries'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setEnquiries(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(apiUrl(`/api/enquiries/${id}`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      fetchEnquiries();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredEnquiries = enquiries.filter(enq => {
    const matchesSearch = enq.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          enq.mobileNumber.includes(searchTerm) || 
                          enq.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === '' || enq.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/admin/dashboard')} className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-primary transition-all">
            <ChevronLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <h1 className="text-xl font-serif font-bold text-slate-900">Admission Enquiries</h1>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 flex gap-4">
          <input 
            type="text" 
            placeholder="Search by name, phone, email..." 
            className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Counselling Scheduled">Counselling Scheduled</option>
            <option value="Admission Confirmed">Admission Confirmed</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-500">
                    <tr>
                        <th className="p-4">Date/Time</th>
                        <th className="p-4">Student</th>
                        <th className="p-4">Program</th>
                        <th className="p-4">Contact</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs font-medium">
                    {filteredEnquiries.map(enq => (
                        <tr key={enq._id}>
                            <td className="p-4">{enq.date} {enq.time}</td>
                            <td className="p-4 font-bold">{enq.fullName}</td>
                            <td className="p-4">{enq.program}</td>
                            <td className="p-4">{enq.mobileNumber}<br/>{enq.email}</td>
                            <td className="p-4"><span className="px-2 py-1 rounded bg-slate-100">{enq.status}</span></td>
                            <td className="p-4 flex gap-2">
                                <button onClick={() => updateStatus(enq._id, 'Contacted')} className="text-blue-600">Contact</button>
                                <button onClick={() => updateStatus(enq._id, 'Closed')} className="text-red-600">Close</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}
