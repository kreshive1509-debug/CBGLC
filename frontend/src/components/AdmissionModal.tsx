import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Calendar, Clock, Phone, Mail, GraduationCap, CheckCircle, Award } from 'lucide-react';
import { useAdmissionModal } from '../context/AdmissionContext';
import { COLLEGE_INFO } from '../constants/data';
import { apiUrl } from '../utils/api';

export const AdmissionModal: React.FC = () => {
  const { isModalOpen, closeModal, selectedCourseId } = useAdmissionModal();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    program: selectedCourseId || 'llb-3yrs',
    highestQualification: 'Intermediate',
    preferredCounselling: 'Phone',
    query: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset selected program if course id changes when modal opens
  React.useEffect(() => {
    if (selectedCourseId) {
      setFormData(prev => ({ ...prev, program: selectedCourseId }));
    }
  }, [selectedCourseId, isModalOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (formData.fullName.length < 3 || formData.fullName.length > 60 || /\d/.test(formData.fullName)) newErrors.fullName = 'Full Name must be 3-60 characters and contain no numbers';
    if (!/^\d{10}$/.test(formData.mobileNumber)) newErrors.mobileNumber = 'Mobile number must be exactly 10 digits';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email address';
    if (!formData.program) newErrors.program = 'Program is required';
    if (!formData.highestQualification) newErrors.highestQualification = 'Highest Qualification is required';
    if (!formData.preferredCounselling) newErrors.preferredCounselling = 'Preferred Counselling is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const response = await fetch(apiUrl('/api/enquiries'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!response.ok) throw new Error('Submission failed');
      setIsSubmitted(true);
    } catch (err) {
      alert('Error submitting enquiry. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      mobileNumber: '',
      email: '',
      program: 'llb-3yrs',
      highestQualification: 'Intermediate',
      preferredCounselling: 'Phone',
      query: ''
    });
    setIsSubmitted(false);
    closeModal();
  };

  return (
    <AnimatePresence>
      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleReset}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden bg-white rounded-2xl shadow-2xl border border-slate-100 z-10"
          >
            {/* Header Highlight Bar */}
            <div className="h-2 bg-gradient-to-r from-primary to-gold" />

            {/* Close Button */}
            <button
              onClick={handleReset}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {!isSubmitted ? (
              <div className="p-5 md:p-6">
                {/* College Title */}
                <div className="text-center mb-4 md:mb-5">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/5 rounded-full text-primary mb-3">
                    <ScaleIcon />
                  </div>
                  <h3 className="font-serif text-lg text-primary uppercase tracking-wider font-semibold">
                    {COLLEGE_INFO.name}
                  </h3>
                  <p className="text-xs text-gold font-medium uppercase tracking-widest mt-1">
                    Approved by BCI • Affiliated to Lucknow University
                  </p>
                  <h2 className="text-2xl font-serif text-slate-800 font-bold mt-2">
                    Admission Enquiry 2026-27
                  </h2>
                  <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
                    Please submit your academic interest below. Our admissions counsel of deans will review and reach you.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className={`w-full px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-all ${
                          errors.fullName
                            ? 'border-red-400 focus:ring-red-100 focus:border-red-400'
                            : 'border-slate-200 focus:ring-primary/20 focus:border-primary'
                        }`}
                      />
                      {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                    </div>

                    {/* Mobile Number */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        placeholder="e.g. 9876543210"
                        className={`w-full px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-all ${
                          errors.mobileNumber
                            ? 'border-red-400 focus:ring-red-100 focus:border-red-400'
                            : 'border-slate-200 focus:ring-primary/20 focus:border-primary'
                        }`}
                      />
                      {errors.mobileNumber && <p className="text-xs text-red-500 mt-1">{errors.mobileNumber}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {/* Email Address */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john.doe@example.com"
                        className={`w-full px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-all ${
                          errors.email
                            ? 'border-red-400 focus:ring-red-100 focus:border-red-400'
                            : 'border-slate-200 focus:ring-primary/20 focus:border-primary'
                        }`}
                      />
                      {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>

                    {/* Program of Interest */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                        Program of Interest <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="program"
                        value={formData.program}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                      >
                        <option value="llb-3yrs">LL.B (3 Years Program)</option>
                        <option value="llb-5yrs">B.A. LL.B (5 Years Integrated)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {/* Highest Qualification */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                        Highest Qualification <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="highestQualification"
                        value={formData.highestQualification}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                      >
                        <option value="Intermediate">Class 12th / Intermediate</option>
                        <option value="Graduate">Graduation (BA, BSc, BCom, etc.)</option>
                        <option value="PostGraduate">Post-Graduation (MA, MSc, etc.)</option>
                        <option value="AwaitingResults">Result Awaited / Class 12th Exams</option>
                      </select>
                    </div>

                    {/* Preferred Counseling Mode */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                        Preferred counseling
                      </label>
                      <select
                        name="preferredCounselling"
                        value={formData.preferredCounselling}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                      >
                        <option value="Phone">Phone Call Consultation</option>
                        <option value="WhatsApp">WhatsApp Chat Coordination</option>
                        <option value="Physical">Schedule Campus Physical Visit</option>
                      </select>
                    </div>
                  </div>

                  {/* Message/Comments */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                      Query or Special Message (Optional)
                    </label>
                    <textarea
                      name="query"
                      value={formData.query}
                      onChange={handleChange}
                      rows={2}
                      placeholder="Enter any questions regarding fees, hostels, syllabus, etc."
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>

                  {/* Submission and Advisory Note */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-start gap-3 mt-1.5">
                    <Calendar className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-500 leading-relaxed">
                      <strong>Important Note:</strong> Online submission is a preliminary registration. Final admission will be completed strictly upon document verification and counseling session at our Chandrawal campus.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2.5">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="w-1/3 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-sm transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-2/3 py-2.5 bg-primary hover:bg-primary-light text-white font-medium rounded-xl text-sm transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 flex justify-center items-center gap-2 cursor-pointer"
                    >
                      <span>{isLoading ? 'Submitting...' : 'Submit Admission Enquiry'}</span>
                    </button>
                  </div>

                  <div className="mt-2.5 flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary/70" />
                    <p className="text-[11px] leading-relaxed text-slate-500">
                      Submission may take a few extra moments as our servers automatically scale to reduce unnecessary energy consumption and support a more sustainable digital infrastructure. Thank you for your patience.
                    </p>
                  </div>
                </form>
              </div>
            ) : (
              /* Success State */
              <div className="p-10 text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", damping: 10 }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-emerald-50 rounded-full text-emerald-500 mb-6"
                >
                  <CheckCircle className="w-12 h-12" />
                </motion.div>

                <h2 className="text-2xl font-serif text-slate-800 font-bold mb-3">
                  Enquiry Submitted Successfully!
                </h2>
                <div className="bg-emerald-50/50 text-emerald-800 text-sm px-4 py-2 rounded-lg font-medium inline-block mb-6">
                  Reference Code: CBG-2026-{Math.floor(1000 + Math.random() * 9000)}
                </div>

                <div className="max-w-md mx-auto bg-slate-50 border border-slate-100 rounded-xl p-6 text-left space-y-4 mb-8">
                  <h4 className="font-semibold text-slate-700 text-sm flex items-center gap-2">
                    <Award className="w-4 h-4 text-gold" />
                    Next Verification Guidelines
                  </h4>
                  <ul className="text-xs text-slate-500 space-y-2.5 list-decimal pl-4 leading-relaxed">
                    <li>
                      <strong>Academic Review:</strong> Our Admission Dean will verify your high school / graduation parameters against standard Lucknow University eligibility mandates.
                    </li>
                    <li>
                      <strong>Helpline Callback:</strong> You will receive an official advisory call on <strong>{formData.mobileNumber}</strong> or email on <strong>{formData.email}</strong> within 24 working hours.
                    </li>
                    <li>
                      <strong>Campus Physical Visit:</strong> Secure your seat by visiting our campus at Sector C, Chandrawal, Lucknow, with original Class 10th, 12th, graduation marksheets, and 4 passport size photos.
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href={`tel:${COLLEGE_INFO.phone}`}
                    className="px-6 py-3 border border-slate-200 rounded-xl text-slate-700 font-medium text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4 text-primary" />
                    Call Admission Office
                  </a>
                  <button
                    onClick={handleReset}
                    className="px-8 py-3 bg-primary hover:bg-primary-light text-white font-medium rounded-xl text-sm transition-all shadow-md shadow-primary/20 cursor-pointer"
                  >
                    Back to Website
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// Internal minimal scale SVG icon
const ScaleIcon = () => (
  <svg
    className="w-6 h-6"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1" />
    <path d="M3 14h11" />
    <path d="M8 10V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6" />
    <path d="M23 16v1a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-1" />
    <path d="M15 14h6" />
    <circle cx="15" cy="8" r="2" />
    <circle cx="9" cy="8" r="2" />
    <path d="M12 2v20" />
    <path d="M17 22H7" />
  </svg>
);
