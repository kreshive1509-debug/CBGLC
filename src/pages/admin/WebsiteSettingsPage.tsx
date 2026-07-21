import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Save, RotateCcw, Globe, Layout, Image, Phone, Mail, Share2, MapPin, GraduationCap, FileText, Search, ArrowLeft, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { signalCmsUpdated } from '../../utils/cmsSync';

export function WebsiteSettingsPage() {
  const { settings, refreshData } = useData();
  const { getFreshToken, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(settings);
  const [activeTab, setActiveTab] = useState('General');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const tabs = [
    { id: 'General', icon: Layout },
    { id: 'Header', icon: Globe },
    { id: 'Navbar', icon: Layout },
    { id: 'Hero', icon: Image },
    { id: 'Contact', icon: MapPin },
    { id: 'Phone', icon: Phone },
    { id: 'Email', icon: Mail },
    { id: 'Social Media', icon: Share2 },
    { id: 'Google Map', icon: MapPin },
    { id: 'Admission', icon: GraduationCap },
    { id: 'Brochure', icon: FileText },
    { id: 'Footer', icon: Layout },
    { id: 'Google Sheets', icon: FileText },
    { id: 'SEO', icon: Search },
  ];

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const authToken = await getFreshToken();
      if (!authToken) {
        alert('Authentication token not found. Please log in again.');
        return;
      }

      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        alert('Settings updated successfully!');
        refreshData();
        signalCmsUpdated();
      } else {
        alert('Error updating settings');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset changes?')) {
      setFormData(settings);
    }
  };

  const renderField = (label: string, field: keyof typeof formData, type: 'text' | 'textarea' | 'select' | 'checkbox' = 'text', options?: string[]) => {
    return (
      <div className="space-y-1">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">{label}</label>
        {type === 'text' && (
          <input
            type="text"
            value={formData[field] as string}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm"
          />
        )}
        {type === 'textarea' && (
          <textarea
            value={formData[field] as string}
            onChange={(e) => handleInputChange(field, e.target.value)}
            rows={3}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm resize-none"
          />
        )}
        {type === 'select' && (
          <select
            value={formData[field] as string}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm"
          >
            {options?.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        )}
        {type === 'checkbox' && (
          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={formData[field] as boolean}
              onChange={(e) => handleInputChange(field, e.target.checked)}
              className="w-4 h-4 rounded text-primary focus:ring-primary"
            />
            <span className="text-sm text-slate-600">Enable</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link 
              to="/admin/dashboard" 
              className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-600"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Website Settings</h1>
              <p className="text-slate-500 mt-1 text-sm font-medium">Manage all website information and CMS content.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all active:scale-95"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2 text-sm font-bold text-white bg-primary rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95 disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <div className="w-px h-8 bg-slate-200 mx-1" />
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to logout?')) {
                  logout();
                  navigate('/admin/login');
                }
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-600 bg-white border border-red-100 rounded-xl hover:bg-red-50 transition-all active:scale-95"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-sm sticky top-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left mb-1 last:mb-0 ${
                      activeTab === tab.id
                        ? 'bg-primary text-white shadow-md shadow-primary/20'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.id}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-grow">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm"
            >
              <div className="mb-6 pb-6 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900">{activeTab} Settings</h2>
                <p className="text-sm text-slate-500 mt-1">Update {activeTab.toLowerCase()} information across the website.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeTab === 'General' && (
                  <>
                    {renderField('College Name', 'collegeName')}
                    {renderField('Tagline', 'tagline')}
                    {renderField('Logo URL (Google Drive)', 'logoUrl')}
                  </>
                )}

                {activeTab === 'Header' && (
                  <>
                    {renderField('College Address', 'address')}
                    {renderField('City', 'city')}
                    {renderField('State', 'state')}
                    {renderField('Pincode', 'pincode')}
                    {renderField('Primary Phone', 'primaryPhone')}
                    {renderField('Academic Session', 'academicSession')}
                  </>
                )}

                {activeTab === 'Navbar' && (
                  <>
                    {renderField('College Short Name', 'collegeName')}
                    {renderField('Admission Enquiry Button Text', 'breakingNewsText')}
                    {renderField('Navbar Contact Number', 'primaryPhone')}
                  </>
                )}

                {activeTab === 'Hero' && (
                  <>
                    {renderField('Hero Heading', 'collegeName')}
                    {renderField('Hero Tagline', 'tagline')}
                    {renderField('Hero Background URL', 'heroBackgroundUrl')}
                    {renderField('Admission Message', 'admissionMessage')}
                  </>
                )}

                {activeTab === 'Contact' && (
                  <>
                    <div className="md:col-span-2">{renderField('Full Address', 'address', 'textarea')}</div>
                    {renderField('Landmark', 'landmark')}
                    {renderField('City', 'city')}
                    {renderField('State', 'state')}
                    {renderField('Pincode', 'pincode')}
                    {renderField('Office Timings', 'officeHours')}
                    {renderField('Official Website URL', 'website')}
                  </>
                )}

                {activeTab === 'Phone' && (
                  <>
                    {renderField('Primary Phone Number', 'primaryPhone')}
                    {renderField('Secondary Phone Number', 'secondaryPhone')}
                    {renderField('WhatsApp Number', 'whatsAppNumber')}
                    {renderField('Emergency Contact Number', 'emergencyContact')}
                  </>
                )}

                {activeTab === 'Email' && (
                  <>
                    {renderField('Office Email Address', 'officeEmail')}
                    {renderField('Admission Email Address', 'admissionEmail')}
                    {renderField('Support Email Address', 'supportEmail')}
                  </>
                )}

                {activeTab === 'Social Media' && (
                  <>
                    {renderField('Facebook URL', 'facebook')}
                    {renderField('Instagram URL', 'instagram')}
                    {renderField('LinkedIn URL', 'linkedin')}
                    {renderField('YouTube URL', 'youtube')}
                    {renderField('Twitter (X) URL', 'twitter')}
                  </>
                )}

                {activeTab === 'Google Map' && (
                  <>
                    <div className="md:col-span-2">
                      {renderField('Google Map Embed URL', 'googleMapEmbedLink', 'textarea')}
                      <p className="text-[10px] text-slate-400 mt-1">Copy the 'src' value from Google Maps embed iframe code.</p>
                    </div>
                    <div className="md:col-span-2">
                      {renderField('Google Map Share/Direction URL', 'googleMapUrl', 'textarea')}
                    </div>
                  </>
                )}

                {activeTab === 'Admission' && (
                  <>
                    {renderField('Admission Status', 'admissionStatus', 'select', ['Open', 'Closed'])}
                    {renderField('Academic Session', 'academicSession')}
                    <div className="md:col-span-2">{renderField('Admission Banner Message', 'admissionMessage', 'textarea')}</div>
                    {renderField('Enable Admission Alert Ticker', 'breakingNewsStatus', 'checkbox')}
                    {renderField('Admission Alert Text', 'breakingNewsText')}
                  </>
                )}

                {activeTab === 'Brochure' && (
                  <>
                    {renderField('Brochure Google Drive URL', 'brochureUrl')}
                    {renderField('Brochure Button Text', 'brochureButtonText')}
                  </>
                )}

                {activeTab === 'Footer' && (
                  <>
                    <div className="md:col-span-2">{renderField('Footer Description', 'footerText', 'textarea')}</div>
                    <div className="md:col-span-2">{renderField('Copyright Text', 'copyrightText')}</div>
                    {renderField('Designed & Developed By', 'designedBy')}
                  </>
                )}

                {activeTab === 'Google Sheets' && (
                  <>
                    {renderField('Enable Google Sheets Sync', 'isGoogleSheetsEnabled', 'checkbox')}
                    <div className="md:col-span-2">
                        {renderField('Spreadsheet ID', 'googleSheetsId')}
                        <p className="text-[10px] text-slate-400 mt-1">Found in the URL: https://docs.google.com/spreadsheets/d/<b>SPREADSHEET_ID</b>/edit</p>
                    </div>
                  </>
                )}

                {activeTab === 'SEO' && (
                  <>
                    <div className="md:col-span-2">{renderField('Meta Title', 'metaTitle')}</div>
                    <div className="md:col-span-2">{renderField('Meta Description', 'metaDescription', 'textarea')}</div>
                    <div className="md:col-span-2">{renderField('Meta Keywords', 'metaKeywords', 'textarea')}</div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
