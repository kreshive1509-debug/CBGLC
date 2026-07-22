import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  Save,
  RotateCcw,
  ArrowLeft,
  LogOut,
  Plus,
  Trash2,
  Edit,
  ChevronUp,
  ChevronDown,
  GraduationCap,
  BookOpen,
  DollarSign,
  Users,
  Lightbulb,
  Building,
  Info,
  FileText,
  MapPin,
  Zap,
  Settings as SettingsIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { signalCmsUpdated } from '../../utils/cmsSync';
import { COURSES } from '../../constants/data';
import { apiUrl } from '../../utils/api';

export function CMSManagement() {
  const { settings, refreshData } = useData();
  const { getFreshToken, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(settings);
  const [activeTab, setActiveTab] = useState('hero');
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [courseDrafts, setCourseDrafts] = useState<Record<string, {
    careerOpportunities: string;
    admissionCriteria: string;
    eligibility: string;
  }>>({});
  const defaultCourseMap = new Map(COURSES.map((course) => [course.id, course]));
  const resolveDefaultCourse = (course: any, index: number) => {
    const byId = course?.id ? defaultCourseMap.get(course.id) : null;
    if (byId) return byId;

    const courseName = typeof course?.name === 'string' ? course.name.trim().toLowerCase() : '';
    if (courseName) {
      const byName = COURSES.find((item) => item.name.trim().toLowerCase() === courseName);
      if (byName) return byName;
    }

    return COURSES[index] || COURSES[0];
  };

  useEffect(() => {
    setFormData(settings);
    const drafts: Record<string, {
      careerOpportunities: string;
      admissionCriteria: string;
      eligibility: string;
    }> = {};

    (settings.courses || []).forEach((course: any, index: number) => {
      const key = course.id || `course-${index}`;
      const defaultCourse = resolveDefaultCourse(course, index);
      drafts[key] = {
        careerOpportunities: textArrayToValue(course.careerOpportunities || defaultCourse?.careerOpportunities),
        admissionCriteria: typeof course.admissionCriteria === 'string'
          ? course.admissionCriteria
          : typeof defaultCourse?.eligibility === 'string'
            ? defaultCourse.eligibility
            : '',
        eligibility: typeof course.eligibility === 'string'
          ? course.eligibility
          : typeof defaultCourse?.eligibility === 'string'
            ? defaultCourse.eligibility
            : '',
      };
    });

    setCourseDrafts((prev) => {
      const merged = { ...prev };

      Object.entries(drafts).forEach(([key, incoming]) => {
        const existing = prev[key];
        merged[key] = {
          careerOpportunities: incoming.careerOpportunities || existing?.careerOpportunities || '',
          admissionCriteria: incoming.admissionCriteria || existing?.admissionCriteria || '',
          eligibility: incoming.eligibility || existing?.eligibility || '',
        };
      });

      return merged;
    });
  }, [settings]);

  const tabs = [
    { id: 'hero', label: 'Hero Section', icon: Zap },
    { id: 'admission', label: 'Admission Control', icon: GraduationCap },
    { id: 'breaking-news', label: 'Breaking News', icon: Lightbulb },
    { id: 'vision-mission', label: 'Vision & Mission', icon: Lightbulb },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'fees', label: 'Fees Structure', icon: DollarSign },
    { id: 'eligibility', label: 'Eligibility', icon: Info },
    { id: 'curriculum', label: 'Curriculum', icon: FileText },
    { id: 'facilities', label: 'Facilities', icon: Building },
    { id: 'about', label: 'About College', icon: Building },
    { id: 'contact', label: 'Contact', icon: MapPin },
    { id: 'footer', label: 'Footer', icon: SettingsIcon },
  ];

  const showNotification = (msg: string, isError = false) => {
    if (isError) {
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(''), 5000);
    } else {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(''), 5000);
    }
  };

  const textArrayToValue = (value: any) => {
    if (Array.isArray(value)) {
      return value
        .map((item) => (typeof item === 'string' ? item : item?.name || item?.text || ''))
        .filter(Boolean)
        .join('\n');
    }

    if (typeof value === 'string') {
      return value;
    }

    return '';
  };

  const valueToTextArray = (value: string) =>
    value
      .split(/\r?\n/)
      .map((line) => line.replace(/^[•\-\u2022]+\s*/, '').trim())
      .filter(Boolean);

  const getCourseDraftKey = (course: any, idx: number) => course?.id || `course-${idx}`;

  const getCourseDraft = (course: any, idx: number) => {
    const key = getCourseDraftKey(course, idx);
    const defaultCourse = resolveDefaultCourse(course, idx);
    return courseDrafts[key] || {
      careerOpportunities: textArrayToValue(course.careerOpportunities || defaultCourse?.careerOpportunities),
      admissionCriteria: typeof course.admissionCriteria === 'string'
        ? course.admissionCriteria
        : typeof defaultCourse?.eligibility === 'string'
          ? defaultCourse.eligibility
          : '',
      eligibility: typeof course.eligibility === 'string'
        ? course.eligibility
        : typeof defaultCourse?.eligibility === 'string'
          ? defaultCourse.eligibility
          : '',
    };
  };

  const updateCourseDraft = (
    course: any,
    idx: number,
    field: 'careerOpportunities' | 'admissionCriteria' | 'eligibility',
    value: string
  ) => {
    const key = getCourseDraftKey(course, idx);
    setCourseDrafts((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] || getCourseDraft(course, idx)),
        [field]: value,
      }
    }));
  };

  const serializeCoursesForSave = (courses: any[]) =>
    courses.map((course: any, index: number) => {
      const draft = getCourseDraft(course, index);
      return {
        ...course,
        careerOpportunities: valueToTextArray(draft.careerOpportunities),
        admissionCriteria: draft.admissionCriteria,
        eligibility: draft.eligibility,
      };
    });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const authToken = await getFreshToken();

    // Verify token exists before sending
    if (!authToken) {
      showNotification('Authentication token not found. Please log in again.', true);
      setIsSaving(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        courses: serializeCoursesForSave(formData.courses || [])
      };

      const response = await fetch(apiUrl('/api/settings'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        showNotification('CMS updated successfully!');
        refreshData();
        signalCmsUpdated();
      } else {
        const errorData = await response.json().catch(() => ({}));
        showNotification(`Failed to update CMS: ${errorData.error || response.statusText}`, true);
      }
    } catch (err: any) {
      showNotification(err.message || 'Error updating CMS', true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all changes?')) {
      setFormData(settings);
      const drafts: Record<string, {
        careerOpportunities: string;
        admissionCriteria: string;
        eligibility: string;
      }> = {};

      (settings.courses || []).forEach((course: any, index: number) => {
        const key = course.id || `course-${index}`;
        const defaultCourse = resolveDefaultCourse(course, index);
        drafts[key] = {
          careerOpportunities: textArrayToValue(course.careerOpportunities || defaultCourse?.careerOpportunities),
          admissionCriteria: typeof course.admissionCriteria === 'string'
            ? course.admissionCriteria
            : typeof defaultCourse?.eligibility === 'string'
              ? defaultCourse.eligibility
              : '',
          eligibility: typeof course.eligibility === 'string'
            ? course.eligibility
            : typeof defaultCourse?.eligibility === 'string'
              ? defaultCourse.eligibility
              : '',
        };
      });

      setCourseDrafts(drafts);
    }
  };

  const handleInputChange = (path: string, value: any) => {
    const keys = path.split('.');
    let current = formData;
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!current[key]) current[key] = {};
      current = current[key];
    }
    current[keys[keys.length - 1]] = value;
    setFormData({ ...formData });
  };

  const addArrayItem = (path: string, defaultItem: any) => {
    const keys = path.split('.');
    let current = formData;
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!current[key]) current[key] = [];
      current = current[key];
    }
    const lastKey = keys[keys.length - 1];
    if (!Array.isArray(current[lastKey])) current[lastKey] = [];
    current[lastKey].push(defaultItem);
    setFormData({ ...formData });
  };

  const removeArrayItem = (path: string, index: number) => {
    const keys = path.split('.');
    let current = formData;
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      current = current[key];
    }
    const lastKey = keys[keys.length - 1];
    current[lastKey].splice(index, 1);
    setFormData({ ...formData });
  };

  const renderTextField = (label: string, path: string, isTextarea = false) => {
    const keys = path.split('.');
    let value: any = formData;
    for (const key of keys) {
      value = value?.[key] || '';
    }

    const stringValue = typeof value === 'string' ? value : (value ? String(value) : '');

    return (
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-700">{label}</label>
        {isTextarea ? (
          <textarea
            value={stringValue}
            onChange={(e) => handleInputChange(path, e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none text-sm"
          />
        ) : (
          <input
            type="text"
            value={stringValue}
            onChange={(e) => handleInputChange(path, e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none text-sm"
          />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/admin/dashboard" className="p-2 hover:bg-slate-200 rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">CMS Management</h1>
              <p className="text-slate-600 text-sm mt-1">Manage all website content dynamically</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save All Changes'}
            </button>
            <button
              onClick={() => {
                if (window.confirm('Logout?')) {
                  logout();
                  navigate('/admin/login');
                }
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        {/* Notifications */}
        <AnimatePresence>
          {successMsg && (
            <motion.div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              {successMsg}
            </motion.div>
          )}
          {errorMsg && (
            <motion.div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {errorMsg}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-56 flex-shrink-0">
            <div className="bg-white rounded-lg border border-slate-200 p-2 sticky top-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-left mb-1 transition-all ${
                      activeTab === tab.id
                        ? 'bg-primary text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-grow">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-lg border border-slate-200 p-8"
            >
              {/* Hero Section */}
              {activeTab === 'hero' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Hero Section CMS</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {renderTextField('Hero Title', 'heroTitle')}
                      {renderTextField('Hero Subtitle', 'heroSubtitle')}
                      {renderTextField('Background Image URL', 'heroBackgroundUrl')}
                      {renderTextField('Tagline', 'heroSmallTagline')}
                      {renderTextField('Admission Badge Text', 'heroAdmissionBadge')}
                      {renderTextField('Primary CTA Text', 'heroPrimaryCtaText')}
                      {renderTextField('Secondary CTA Text', 'heroSecondaryCtaText')}
                      {renderTextField('Overlay Text', 'heroOverlayText', true)}
                    </div>
                  </div>
                </div>
              )}

              {/* Admission Status Control */}
              {activeTab === 'admission' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Admission Status Control</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">Admission Status</label>
                      <select
                        value={formData.admissionStatus}
                        onChange={(e) => handleInputChange('admissionStatus', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/50"
                      >
                        <option value="Open">Open</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>
                    {renderTextField('Academic Session', 'academicSession')}
                    {renderTextField('Admission Message', 'admissionMessage', true)}
                  </div>
                </div>
              )}

              {/* Breaking News */}
              {activeTab === 'breaking-news' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Breaking News Ticker</h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.breakingNewsStatus}
                          onChange={(e) => handleInputChange('breakingNewsStatus', e.target.checked)}
                          className="w-4 h-4 rounded"
                        />
                        <span className="text-sm font-semibold">Enable Breaking News Ticker</span>
                      </label>
                    </div>

                    {formData.breakingNewsMessages?.map((msg: any, idx: number) => (
                      <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-slate-700">Message {idx + 1}</h3>
                          <button
                            onClick={() => removeArrayItem('breakingNewsMessages', idx)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <input
                          type="text"
                          placeholder="News text"
                          value={(msg as any)?.text || ''}
                          onChange={(e) => {
                            const updated = [...(formData.breakingNewsMessages || [])];
                            if (updated[idx]) {
                              updated[idx] = { ...updated[idx], text: e.target.value };
                              handleInputChange('breakingNewsMessages', updated);
                            }
                          }}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        />
                        <input
                          type="number"
                          placeholder="Speed (1-5)"
                          value={(msg as any)?.speed || 1}
                          onChange={(e) => {
                            const updated = [...(formData.breakingNewsMessages || [])];
                            if (updated[idx]) {
                              updated[idx] = { ...updated[idx], speed: Number(e.target.value) };
                              handleInputChange('breakingNewsMessages', updated);
                            }
                          }}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        />
                      </div>
                    ))}

                    <button
                      onClick={() =>
                        addArrayItem('breakingNewsMessages', {
                          id: Date.now().toString(),
                          text: '',
                          speed: 1,
                          order: (formData.breakingNewsMessages?.length || 0) + 1
                        })
                      }
                      className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90"
                    >
                      <Plus className="w-4 h-4" /> Add Message
                    </button>
                  </div>
                </div>
              )}

              {/* Vision & Mission */}
              {activeTab === 'vision-mission' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Vision & Mission</h2>

                  {/* Vision Section */}
                  <div className="space-y-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900">Vision</h3>
                    {renderTextField('Vision Title', 'visionTitle')}
                    {renderTextField('Vision Quote', 'visionQuote')}
                    {renderTextField('Vision Description', 'visionDescription', true)}
                    {renderTextField('Vision Caption', 'visionCaption')}

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">Vision Points</label>
                      {(formData.visionPoints as Array<{ id: string; text: string }>)?.map((point: any, idx: number) => (
                        <div key={idx} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={(point as any)?.text || ''}
                            onChange={(e) => {
                              const updated = [...((formData.visionPoints as any[]) || [])];
                              if (updated[idx]) {
                                updated[idx] = { ...updated[idx], text: e.target.value };
                                handleInputChange('visionPoints', updated);
                              }
                            }}
                            className="flex-grow px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            placeholder="Vision point"
                          />
                          <button
                            onClick={() => removeArrayItem('visionPoints', idx)}
                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => addArrayItem('visionPoints', { id: Date.now().toString(), text: '' })}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-primary"
                      >
                        <Plus className="w-4 h-4" /> Add Point
                      </button>
                    </div>
                  </div>

                  {/* Mission Section */}
                  <div className="space-y-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900">Mission</h3>
                    {renderTextField('Mission Title', 'missionTitle')}
                    {renderTextField('Mission Quote', 'missionQuote')}
                    {renderTextField('Mission Description', 'missionDescription', true)}
                    {renderTextField('Mission Caption', 'missionCaption')}

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">Mission Points</label>
                      {(formData.missionPoints as Array<{ id: string; text: string }>)?.map((point: any, idx: number) => (
                        <div key={idx} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={(point as any)?.text || ''}
                            onChange={(e) => {
                              const updated = [...((formData.missionPoints as any[]) || [])];
                              if (updated[idx]) {
                                updated[idx] = { ...updated[idx], text: e.target.value };
                                handleInputChange('missionPoints', updated);
                              }
                            }}
                            className="flex-grow px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            placeholder="Mission point"
                          />
                          <button
                            onClick={() => removeArrayItem('missionPoints', idx)}
                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => addArrayItem('missionPoints', { id: Date.now().toString(), text: '' })}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-primary"
                      >
                        <Plus className="w-4 h-4" /> Add Point
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Courses Management */}
              {activeTab === 'courses' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Courses Management</h2>
                  {formData.courses?.map((course: any, idx: number) => (
                    <div key={idx} className="p-6 bg-slate-50 rounded-lg border border-slate-200 space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-slate-900 text-lg">{course.name || `Course ${idx + 1}`}</h3>
                        <button
                          onClick={() => removeArrayItem('courses', idx)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Basic Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-2">Course Name</label>
                          <input
                            type="text"
                            placeholder="e.g., B.A. LL.B (5-Year)"
                            value={course.name || ''}
                            onChange={(e) => {
                              const updated = [...formData.courses];
                              updated[idx].name = e.target.value;
                              handleInputChange('courses', updated);
                            }}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-2">Image URL</label>
                          <input
                            type="url"
                            placeholder="Direct image link"
                            value={course.imageUrl || ''}
                            onChange={(e) => {
                              const updated = [...formData.courses];
                              updated[idx].imageUrl = e.target.value;
                              handleInputChange('courses', updated);
                            }}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-2">Duration</label>
                          <input
                            type="text"
                            placeholder="e.g., 5 Years"
                            value={course.duration || ''}
                            onChange={(e) => {
                              const updated = [...formData.courses];
                              updated[idx].duration = e.target.value;
                              handleInputChange('courses', updated);
                            }}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-2">Available Seats</label>
                          <input
                            type="number"
                            placeholder="Number of seats"
                            value={course.seats || 0}
                            onChange={(e) => {
                              const updated = [...formData.courses];
                              updated[idx].seats = Number(e.target.value);
                              handleInputChange('courses', updated);
                            }}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-2">Badge (e.g., BCI Approved)</label>
                          <input
                            type="text"
                            placeholder="Badge text"
                            value={course.badge || ''}
                            onChange={(e) => {
                              const updated = [...formData.courses];
                              updated[idx].badge = e.target.value;
                              handleInputChange('courses', updated);
                            }}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-2">Semester</label>
                          <input
                            type="text"
                            placeholder="e.g., Odd/Even/Both"
                            value={course.semester || ''}
                            onChange={(e) => {
                              const updated = [...formData.courses];
                              updated[idx].semester = e.target.value;
                              handleInputChange('courses', updated);
                            }}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-2">Minimum Percentage</label>
                          <input
                            type="text"
                            placeholder="e.g., 45%"
                            value={course.minimumPercentage || ''}
                            onChange={(e) => {
                              const updated = [...formData.courses];
                              updated[idx].minimumPercentage = e.target.value;
                              handleInputChange('courses', updated);
                            }}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          />
                        </div>
                      </div>

                      {/* Descriptions */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-2">Short Description</label>
                        <textarea
                          placeholder="Brief course overview (1-2 lines)"
                          value={course.shortDescription || ''}
                          onChange={(e) => {
                            const updated = [...formData.courses];
                            updated[idx].shortDescription = e.target.value;
                            handleInputChange('courses', updated);
                          }}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          rows={2}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-2">Long Description</label>
                        <textarea
                          placeholder="Detailed course description"
                          value={course.longDescription || ''}
                          onChange={(e) => {
                            const updated = [...formData.courses];
                            updated[idx].longDescription = e.target.value;
                            handleInputChange('courses', updated);
                          }}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-2">Elite Career Pathways</label>
                          <textarea
                            placeholder="One career path per line"
                            value={getCourseDraft(course, idx).careerOpportunities}
                            onChange={(e) => {
                              updateCourseDraft(course, idx, 'careerOpportunities', e.target.value);
                            }}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            rows={5}
                          />
                          <p className="text-[11px] text-slate-500 mt-1">Add each career pathway on a new line.</p>
                        </div>
                      </div>

                      {/* Criteria & Requirements */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-2">Admission Criteria</label>
                        <textarea
                          placeholder="Use one point per line"
                          value={getCourseDraft(course, idx).admissionCriteria}
                          onChange={(e) => {
                            updateCourseDraft(course, idx, 'admissionCriteria', e.target.value);
                          }}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          rows={5}
                        />
                        <p className="text-[11px] text-slate-500 mt-1">Each line becomes a bullet point in the blue eligibility box.</p>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-2">Eligibility Requirements</label>
                        <textarea
                          placeholder="Use one point per line"
                          value={getCourseDraft(course, idx).eligibility}
                          onChange={(e) => {
                            updateCourseDraft(course, idx, 'eligibility', e.target.value);
                          }}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          rows={5}
                        />
                        <p className="text-[11px] text-slate-500 mt-1">Each line becomes a bullet point in the blue eligibility box.</p>
                      </div>

                      {/* URLs & Status */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-2">Curriculum PDF URL</label>
                          <input
                            type="text"
                            placeholder="Google Drive or external link"
                            value={course.curriculumPdfUrl || ''}
                            onChange={(e) => {
                              const updated = [...formData.courses];
                              updated[idx].curriculumPdfUrl = e.target.value;
                              handleInputChange('courses', updated);
                            }}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-2">Status</label>
                          <select
                            value={course.status || 'Published'}
                            onChange={(e) => {
                              const updated = [...formData.courses];
                              updated[idx].status = e.target.value;
                              handleInputChange('courses', updated);
                            }}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          >
                            <option value="Published">Published</option>
                            <option value="Draft">Draft</option>
                            <option value="Hidden">Hidden</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-2">Apply Button Text</label>
                          <input
                            type="text"
                            placeholder="e.g., Apply Now"
                            value={course.applyButtonText || 'Apply Now'}
                            onChange={(e) => {
                              const updated = [...formData.courses];
                              updated[idx].applyButtonText = e.target.value;
                              handleInputChange('courses', updated);
                            }}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-2">Display Order</label>
                          <input
                            type="number"
                            placeholder="Display sequence"
                            value={course.displayOrder || idx + 1}
                            onChange={(e) => {
                              const updated = [...formData.courses];
                              updated[idx].displayOrder = Number(e.target.value);
                              handleInputChange('courses', updated);
                            }}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      addArrayItem('courses', {
                        id: Date.now().toString(),
                        name: '',
                        shortDescription: '',
                        longDescription: '',
                        seats: 0,
                        duration: '',
                        semester: '',
                        badge: '',
                        imageUrl: '',
                        status: 'Published',
                        displayOrder: (formData.courses?.length || 0) + 1,
                        careerOpportunities: [],
                        admissionCriteria: '',
                        eligibility: '',
                        minimumPercentage: '',
                        curriculumPdfUrl: '',
                        applyButtonText: 'Apply Now'
                      })
                    }
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add Course
                  </button>
                </div>
              )}

              {/* Fees Structure */}
              {activeTab === 'fees' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Fees Structure</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderTextField('Admission Fee', 'fees.admissionFee')}
                    {renderTextField('Semester Fee', 'fees.semesterFee')}
                    {renderTextField('Annual Fee', 'fees.annualFee')}
                    {renderTextField('Library Fee', 'fees.libraryFee')}
                    {renderTextField('Exam Fee', 'fees.examFee')}
                    {renderTextField('Hostel Fee', 'fees.hostelFee')}
                    {renderTextField('Security Deposit', 'fees.securityDeposit')}
                    {renderTextField('Scholarship', 'fees.scholarship')}
                    {renderTextField('Other Charges', 'fees.otherCharges')}
                    <div className="md:col-span-2">
                      {renderTextField('Payment Notes', 'fees.paymentNotes', true)}
                    </div>
                  </div>
                </div>
              )}

              {/* Eligibility */}
              {activeTab === 'eligibility' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Eligibility Criteria</h2>
                  {renderTextField('Title', 'eligibility.title')}
                  {renderTextField('Minimum Marks', 'eligibility.minimumMarks')}
                  {renderTextField('Reserved Category Rules', 'eligibility.reservedCategoryRules', true)}
                  {renderTextField('Age Requirement', 'eligibility.ageRequirement')}

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Documents Required</label>
                    {((formData.eligibility as any)?.documentsRequired || [])?.map((doc: any, idx: number) => (
                      <div key={idx} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={(doc as any)?.text || ''}
                          onChange={(e) => {
                            const updated = [...((formData.eligibility as any)?.documentsRequired || [])];
                            if (updated[idx]) {
                              updated[idx] = { ...updated[idx], text: e.target.value };
                              handleInputChange('eligibility.documentsRequired', updated);
                            }
                          }}
                          className="flex-grow px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        />
                        <button
                          onClick={() => removeArrayItem('eligibility.documentsRequired', idx)}
                          className="px-3 py-2 text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addArrayItem('eligibility.documentsRequired', { id: Date.now().toString(), text: '' })}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-primary"
                    >
                      <Plus className="w-4 h-4" /> Add Document
                    </button>
                  </div>
                </div>
              )}

              {/* Curriculum */}
              {activeTab === 'curriculum' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Curriculum</h2>
                  {renderTextField('Curriculum PDF URL (Google Drive)', 'curriculumPdfUrl')}
                  <p className="text-sm text-slate-600">Paste the Google Drive PDF link</p>
                </div>
              )}

              {/* Facilities */}
              {activeTab === 'facilities' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Facilities</h2>
                  {formData.facilities?.map((facility: any, idx: number) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                      <div className="flex justify-between">
                        <h3 className="font-bold text-slate-900">Facility {idx + 1}</h3>
                        <button
                          onClick={() => removeArrayItem('facilities', idx)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Facility title"
                        value={facility.title}
                        onChange={(e) => {
                          const updated = [...formData.facilities];
                          updated[idx].title = e.target.value;
                          handleInputChange('facilities', updated);
                        }}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                      />
                      <textarea
                        placeholder="Description"
                        value={facility.description}
                        onChange={(e) => {
                          const updated = [...formData.facilities];
                          updated[idx].description = e.target.value;
                          handleInputChange('facilities', updated);
                        }}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        rows={2}
                      />
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      addArrayItem('facilities', {
                        id: Date.now().toString(),
                        title: '',
                        description: '',
                        displayOrder: (formData.facilities?.length || 0) + 1
                      })
                    }
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg"
                  >
                    <Plus className="w-4 h-4" /> Add Facility
                  </button>
                </div>
              )}

              {/* About College */}
              {activeTab === 'about' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">About College</h2>
                  {renderTextField('Title', 'aboutTitle')}
                  {renderTextField('Subtitle', 'aboutSubtitle')}
                  {renderTextField('Description', 'aboutDescription', true)}
                  {renderTextField('Image URL', 'aboutImageUrl')}

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Highlights</label>
                    {formData.aboutHighlights?.map((highlight: any, idx: number) => (
                      <div key={idx} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="Highlight text"
                          value={highlight.text}
                          onChange={(e) => {
                            const updated = [...formData.aboutHighlights];
                            updated[idx].text = e.target.value;
                            handleInputChange('aboutHighlights', updated);
                          }}
                          className="flex-grow px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        />
                        <button
                          onClick={() => removeArrayItem('aboutHighlights', idx)}
                          className="px-3 py-2 text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addArrayItem('aboutHighlights', { id: Date.now().toString(), text: '', icon: '' })}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-primary"
                    >
                      <Plus className="w-4 h-4" /> Add Highlight
                    </button>
                  </div>
                </div>
              )}

              {/* Contact */}
              {activeTab === 'contact' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Contact Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderTextField('Primary Phone', 'primaryPhone')}
                    {renderTextField('Secondary Phone', 'secondaryPhone')}
                    {renderTextField('Alternate Phone', 'alternatePhone')}
                    {renderTextField('Email', 'officeEmail')}
                    {renderTextField('Address', 'address', true)}
                    {renderTextField('City', 'city')}
                    {renderTextField('State', 'state')}
                    {renderTextField('Pincode', 'pincode')}
                    {renderTextField('Office Hours', 'officeHours')}
                    {renderTextField('Latitude', 'latitude')}
                    {renderTextField('Longitude', 'longitude')}
                    {renderTextField('Google Map URL', 'googleMapUrl')}
                  </div>
                </div>
              )}

              {/* Footer */}
              {activeTab === 'footer' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Footer</h2>
                  {renderTextField('Footer Text', 'footerText', true)}
                  {renderTextField('Copyright Text', 'copyrightText')}
                  {renderTextField('Designed By', 'designedBy')}

                  <div>
                    <label className="flex items-center gap-2 mb-4">
                      <input
                        type="checkbox"
                        checked={((formData as any)?.showDesignedByCredit) || false}
                        onChange={(e) => handleInputChange('showDesignedByCredit', e.target.checked)}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-sm font-semibold">Show Designed By Credit</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Quick Links</label>
                    {formData.footerQuickLinks?.map((link: any, idx: number) => (
                      <div key={idx} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="Label"
                          value={link.label}
                          onChange={(e) => {
                            const updated = [...formData.footerQuickLinks];
                            updated[idx].label = e.target.value;
                            handleInputChange('footerQuickLinks', updated);
                          }}
                          className="flex-grow px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Path"
                          value={link.path}
                          onChange={(e) => {
                            const updated = [...formData.footerQuickLinks];
                            updated[idx].path = e.target.value;
                            handleInputChange('footerQuickLinks', updated);
                          }}
                          className="flex-grow px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        />
                        <button
                          onClick={() => removeArrayItem('footerQuickLinks', idx)}
                          className="px-3 py-2 text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addArrayItem('footerQuickLinks', { id: Date.now().toString(), label: '', path: '', displayOrder: (formData.footerQuickLinks?.length || 0) + 1 })}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-primary"
                    >
                      <Plus className="w-4 h-4" /> Add Quick Link
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
