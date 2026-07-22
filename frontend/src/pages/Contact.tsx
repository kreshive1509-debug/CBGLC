import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Globe, Clock, CheckCircle2, Navigation, Send } from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading';
import { useData } from '../context/DataContext';
import { SEOHelper } from '../components/SEOHelper';
import { COLLEGE_INFO } from '../constants/data';
import { apiUrl } from '../utils/api';
import { apiFetch, safeJson } from '../utils/http';

export const Contact: React.FC = () => {
  const { settings } = useData();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Enquiry',
    message: ''
  });
  const [isSent, setIsSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const response = await apiFetch(apiUrl('/api/contact'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      }, 'Contact');

      if (!response.ok) {
        const errorData = await safeJson<any>(response, 'Contact submit error').catch(() => ({}));
        throw new Error(errorData.message || 'Unable to send message');
      }

      setIsSent(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'General Enquiry',
        message: ''
      });
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Unable to send message right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="bg-white">
      <SEOHelper
        title={`Contact & Admissions Helpdesk | ${settings.collegeName}`}
        description={`Get in touch with the admissions office and administration at ${settings.collegeName}, Chandrawal, Lucknow. View phone numbers, emails, office hours, and official Google Maps location.`}
      />
      {/* Page Header */}
      <section className="relative py-20 bg-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 select-none pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1920&q=80"
            alt="Contact CBG Law"
            className="w-full h-full object-cover opacity-15 filter brightness-75"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-slate-950/80" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-bold uppercase tracking-widest text-gold bg-white/5 border border-white/10 px-4 py-1.5 rounded-full"
          >
            GET IN TOUCH
          </motion.span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight mt-4">
            Contact Our Admissions Office
          </h1>
          <div className="h-[3px] bg-gold mx-auto mt-4 w-16" />
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mt-4">
            Connect with our administrative desk, ask about academic schedules, or plan a physical verification visit.
          </p>
        </div>
      </section>

      {/* Main Grid: Info + Contact Form */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Info Column */}
            <div className="lg:col-span-5 space-y-8">
              
              <div className="space-y-4">
                <h2 className="font-serif text-2xl sm:text-3.5xl font-extrabold text-slate-800">
                  We'd Love To Hear From You
                </h2>
                <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                  Whether you are a prospective student, parent, or legal scholar seeking information about LL.B counseling, feel free to drop a line.
                </p>
              </div>

              {/* Direct Touch points */}
              <div className="space-y-5">
                <div className="flex items-start gap-4 p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary border border-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif font-extrabold text-slate-800 text-sm">Postal Address</h4>
                    <p className="text-slate-500 text-xs leading-relaxed mt-1">
                        {settings.address}<br/>
                        {settings.landmark && <span>{settings.landmark}, </span>}
                        {settings.city}, {settings.state} - {settings.pincode}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary border border-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif font-extrabold text-slate-800 text-sm">Call Center</h4>
                    <p className="text-slate-500 text-xs leading-relaxed mt-1">
                      Office: <a href={`tel:${settings.primaryPhone}`} className="hover:text-primary transition-colors font-semibold">{settings.primaryPhone}</a>
                      {settings.secondaryPhone && (
                        <>
                            <br />
                            Secondary: <span className="font-semibold">{settings.secondaryPhone}</span>
                        </>
                      )}
                      {settings.whatsAppNumber && (
                        <>
                            <br />
                            WhatsApp: <span className="font-semibold">{settings.whatsAppNumber}</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary border border-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif font-extrabold text-slate-800 text-sm">Emails & Web</h4>
                    <p className="text-slate-500 text-xs leading-relaxed mt-1">
                      Office: <a href={`mailto:${settings.officeEmail}`} className="hover:text-primary transition-colors font-semibold">{settings.officeEmail}</a>
                      <br />
                      Admissions: <a href={`mailto:${settings.admissionEmail}`} className="hover:text-primary transition-colors font-semibold">{settings.admissionEmail}</a>
                      <br />
                      Website: <a href={settings.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors font-semibold">{settings.website}</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary border border-primary/10 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif font-extrabold text-slate-800 text-sm">Admissions Helpline Hours</h4>
                    <p className="text-slate-500 text-xs leading-relaxed mt-1">
                      {settings.officeHours}
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Contact Form Column */}
            <div className="lg:col-span-7">
              <div className="bg-white border border-slate-100 shadow-xl rounded-3xl p-8 sm:p-10 relative">
                
                <h3 className="font-serif text-xl sm:text-2xl font-extrabold text-slate-800 mb-6">
                  Send Administrative Query
                </h3>

                {!isSent ? (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-all ${
                            errors.name
                              ? 'border-red-400 focus:ring-red-100'
                              : 'border-slate-200 focus:ring-primary/20 focus:border-primary'
                          }`}
                        />
                        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="e.g. 9876543210"
                          className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john.doe@example.com"
                        className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-all ${
                          errors.email
                            ? 'border-red-400 focus:ring-red-100'
                            : 'border-slate-200 focus:ring-primary/20 focus:border-primary'
                        }`}
                      />
                      {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Subject of Query
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                      >
                        <option value="General Enquiry">General Academic Inquiry</option>
                        <option value="Admissions Help">Admission Criteria Clarification</option>
                        <option value="Fees Framework">Fees Structure & Instalments</option>
                        <option value="Hostel Sports">Hostel & Campus Facilities</option>
                        <option value="Other">Other Administrative Request</option>
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Your Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Detail your question here..."
                        className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-all ${
                          errors.message
                            ? 'border-red-400 focus:ring-red-100'
                            : 'border-slate-200 focus:ring-primary/20 focus:border-primary'
                        }`}
                      />
                      {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-primary hover:bg-primary-light text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md flex justify-center items-center gap-2 cursor-pointer disabled:opacity-70"
                    >
                      <Send className="w-4 h-4 text-gold" />
                      <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                    </button>
                  </form>
                ) : (
                  /* Form Success State */
                  <div className="text-center py-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full mb-4">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-slate-800">Message Sent Successfully!</h3>
                    <p className="text-slate-500 text-xs sm:text-sm mt-2 max-w-sm mx-auto">
                      Your query has been securely transmitted. Our support coordinator will connect with you via email shortly.
                    </p>
                    <button
                      onClick={() => setIsSent(false)}
                      className="mt-6 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                    >
                      Send Another Message
                    </button>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Google Map Full-Width Placeholder Container */}
      <section className="py-12 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeading
            badge="Navigation & Routes"
            title="Locate Us On The Map"
            subtitle="Plan your drive to Sector C, Chandrawal, Lucknow. Easily accessible via public transit."
          />

          <div className="bg-slate-200/60 rounded-3xl h-[450px] overflow-hidden border border-slate-200/80 relative shadow-xs mt-10">
            {settings.googleMapEmbedLink ? (
              <iframe
                src={settings.googleMapEmbedLink}
                className="w-full h-full border-0"
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="CBG Law College Location"
              />
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                    <div className="z-10 bg-white p-8 rounded-3xl shadow-xl max-w-md border border-slate-100">
                        <div className="w-12 h-12 rounded-full bg-primary/5 text-primary flex items-center justify-center mx-auto mb-4">
                            <Navigation className="w-6 h-6 text-primary" />
                        </div>
                        <h4 className="font-serif font-bold text-slate-800 text-base">Google Maps Route Indicator</h4>
                        <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                            The live map container will load here. You can open direct routing parameters or coordinates to navigate to {settings.collegeName}.
                        </p>
                        <div className="flex gap-4 justify-center mt-5">
                            <a
                            href={settings.googleMapUrl || `https://maps.google.com/?q=${settings.collegeName}+Lucknow`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-light text-white text-[11px] font-bold uppercase tracking-wider py-2.5 px-5 rounded-lg shadow-sm"
                            >
                            <span>Get Driving Directions</span>
                            </a>
                        </div>
                    </div>
                </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
