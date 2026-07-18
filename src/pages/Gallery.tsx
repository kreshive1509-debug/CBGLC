import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, ZoomIn, Eye, Layers } from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading';
import { GALLERY_IMAGES } from '../constants/data';

export const Gallery: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<typeof GALLERY_IMAGES[0] | null>(null);

  const categories = ['All', 'Campus', 'Academics', 'Moot Court', 'Events'];

  // Filter logic
  const filteredImages = activeCategory === 'All'
    ? GALLERY_IMAGES
    : GALLERY_IMAGES.filter(img => img.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="bg-white">
      {/* Page Header */}
      <section className="relative py-20 bg-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 select-none pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1920&q=80"
            alt="Campus Gallery"
            className="w-full h-full object-cover opacity-20 filter brightness-75"
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
            VISUAL TOUR
          </motion.span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight mt-4">
            Campus Media Gallery
          </h1>
          <div className="h-[3px] bg-gold mx-auto mt-4 w-16" />
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mt-4">
            A pictorial glimpse representing smart classroom environments, moot litigation battles, and elite cultural celebrations.
          </p>
        </div>
      </section>

      {/* Filter and Grid block */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center items-center gap-2 mb-12">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-primary text-white border-primary shadow-md shadow-primary/10'
                    : 'bg-white text-slate-500 border-slate-200 hover:text-primary hover:border-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Interactive Responsive Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredImages.map(img => (
                <motion.div
                  key={img.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedImage(img)}
                  className="relative group overflow-hidden rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 aspect-4/3 bg-slate-100 cursor-pointer"
                >
                  <img
                    src={img.url}
                    alt={img.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Glassmorphic Overlay on Hover */}
                  <div className="absolute inset-0 bg-primary/80 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6 text-white z-10">
                    <div className="flex justify-end">
                      <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-white backdrop-blur-md">
                        <ZoomIn className="w-5 h-5" />
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-gold font-bold tracking-widest">{img.category}</span>
                      <h4 className="text-base font-serif font-bold mt-1 leading-tight">{img.title}</h4>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

        </div>
      </section>

      {/* Lightbox / Enlarged View Modal */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="fixed inset-0 bg-slate-900/90 backdrop-blur-md"
            />

            {/* Content box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl z-10 border border-slate-100"
            >
              <div className="relative aspect-16/10 sm:aspect-16/9 bg-slate-950">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.title}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
                
                {/* Close Button overlay */}
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-slate-900/60 hover:bg-slate-950 text-white rounded-full flex items-center justify-center backdrop-blur-md cursor-pointer transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 bg-white border-t border-slate-100 flex justify-between items-center flex-wrap gap-4">
                <div>
                  <span className="text-xs uppercase text-gold font-bold tracking-wider">{selectedImage.category}</span>
                  <h3 className="font-serif font-extrabold text-slate-800 text-lg sm:text-xl mt-1 leading-tight">
                    {selectedImage.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="px-6 py-2.5 bg-primary hover:bg-primary-light text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm cursor-pointer"
                >
                  Close View
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
