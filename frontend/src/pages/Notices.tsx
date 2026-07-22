import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Search, Bell, AlertTriangle, ChevronDown, ChevronUp, Clock, Tag } from 'lucide-react';
import { useData } from '../context/DataContext';
import { SEOHelper } from '../components/SEOHelper';

export const Notices: React.FC = () => {
  const { notices, settings } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedNoticeId, setExpandedNoticeId] = useState<string | null>(null);

  const categories = ['All', 'Admission', 'Exam', 'Academic', 'Event'];

  // Toggle expand collapse
  const handleToggleNotice = (id: string) => {
    if (expandedNoticeId === id) {
      setExpandedNoticeId(null);
    } else {
      setExpandedNoticeId(id);
    }
  };

  // Filter & Search Logic
  const filteredNotices = notices
    .filter((n: any) => n.published !== false)
    .filter(notice => {
      const matchesCategory = selectedCategory === 'All' || notice.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch = notice.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            notice.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (notice.content && notice.content.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    })
    .sort((a: any, b: any) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.publishDate || b.createdAt).getTime() - new Date(a.publishDate || a.createdAt).getTime();
    });

  return (
    <div className="bg-white min-h-screen font-sans">
      <SEOHelper
        title={`Official Notices & Academic Announcements | ${settings.collegeName}`}
        description={`Stay updated with the latest exam timetables, semester notifications, academic calendars, and moot court events at ${settings.collegeName}, affiliated with Lucknow University.`}
      />
      {/* Page Header */}
      <section className="relative py-20 bg-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 select-none pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1920&q=80"
            alt="Notices Bulletin"
            className="w-full h-full object-cover opacity-15 filter brightness-75"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-slate-950/80" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-bold uppercase tracking-widest text-gold bg-white/5 border border-white/10 px-4 py-1.5 rounded-full inline-flex items-center gap-1.5"
          >
            <Bell className="w-3.5 h-3.5 text-gold animate-bounce" /> Live Academic Bulletin
          </motion.span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight mt-4">
            Official Notices & Announcements
          </h1>
          <div className="h-[3px] bg-gold mx-auto mt-4 w-16" />
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mt-4">
            Academic updates, exam sheets, admission parameters and legal seminar details affiliated with Lucknow University.
          </p>
        </div>
      </section>

      {/* Main Notice Explorer */}
      <section className="py-20 px-4 bg-slate-50/50">
        <div className="max-w-4xl mx-auto">
          
          {/* Search and Category Filter Toolbar */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder="Search notices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-slate-50/30"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Category tabs */}
            <div className="flex flex-wrap gap-1.5 justify-center">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-primary text-white border-primary shadow-xs'
                      : 'bg-white text-slate-500 border-slate-200 hover:text-primary hover:border-primary'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Notices Archive list */}
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {filteredNotices.length > 0 ? (
                filteredNotices.map((notice: any) => {
                  const isExpanded = expandedNoticeId === notice._id;
                  return (
                    <motion.div
                      layout
                      key={notice._id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                        notice.pinned
                          ? 'border-amber-200 shadow-sm shadow-amber-50'
                          : 'border-slate-100 shadow-xs'
                      }`}
                    >
                      {/* Notice Card Header (always visible) */}
                      <div
                        onClick={() => handleToggleNotice(notice._id)}
                        className="p-6 cursor-pointer flex justify-between items-start gap-4 hover:bg-slate-50/30 transition-colors"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 flex-wrap text-xs font-medium text-slate-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(notice.publishDate || notice.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Tag className="w-3.5 h-3.5" />
                              {notice.category}
                            </span>
                            {notice.pinned && (
                              <span className="bg-amber-500 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1 ml-1.5 animate-pulse">
                                <AlertTriangle className="w-3.5 h-3.5" /> IMPORTANT
                              </span>
                            )}
                          </div>

                          <h3 className="font-serif text-base sm:text-xl font-bold text-slate-800 leading-tight">
                            {notice.title}
                          </h3>
                          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                            {notice.description}
                          </p>
                        </div>

                        <div className="p-2 rounded-full hover:bg-slate-100 text-slate-400 shrink-0">
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                      </div>

                      {/* Expandable detailed content with animation */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            transition={{ duration: 0.35, ease: 'easeInOut' }}
                            className="border-t border-slate-50 overflow-hidden bg-slate-50/30"
                          >
                            <div className="p-6 sm:p-8 space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                              <div className="bg-white border border-slate-100 p-6 rounded-xl space-y-3 shadow-2xs">
                                <h4 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs sm:text-sm">
                                  <Clock className="w-4 h-4 text-primary" /> Full Announcement Details
                                </h4>
                                <p className="leading-relaxed whitespace-pre-line">{notice.content || notice.description}</p>
                              </div>
                              <div className="flex justify-end gap-3 pt-2">
                                <button
                                  onClick={() => handleToggleNotice(notice._id)}
                                  className="px-5 py-2 border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                                >
                                  Close Details
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })
              ) : (
                /* No Results empty state */
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center bg-white border border-slate-100 p-12 rounded-2xl shadow-xs"
                >
                  <p className="text-slate-400 font-serif text-lg">No notices found matching your criteria</p>
                  <p className="text-slate-500 text-xs mt-1">Try resetting the filters or searching with alternative keywords.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                    }}
                    className="mt-4 px-6 py-2.5 bg-primary hover:bg-primary-light text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs cursor-pointer"
                  >
                    Reset Explorer
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* University Calendar Link block */}
      <section className="py-20 bg-white px-4 text-center">
        <div className="max-w-2xl mx-auto space-y-5">
          <span className="text-3xl text-gold">📅</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-800">
            Lucknow University Academic Calendar
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Stay up to date with official university holidays, semester structures, and legal counsel moot schedules planned by the Lucknow registrar.
          </p>
          <div className="pt-2">
            <a
              href="https://www.lkouniv.ac.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-widest py-3 px-6 rounded-xl"
            >
              <span>Visit Lucknow Univ. Portal</span>
              ✕
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
