import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useData } from '../context/DataContext';
import { GALLERY_IMAGES } from '../constants/data';

export const Gallery: React.FC = () => {
  const { galleryImages } = useData();
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<any | null>(null);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const images = galleryImages.length ? galleryImages : GALLERY_IMAGES;
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(images.map((img: any) => img.category || 'Unknown'))).filter(Boolean);
    return ['All', ...uniqueCategories];
  }, [images]);

  // Filter logic
  const filteredImages = useMemo(() => {
    if (activeCategory === 'All') {
      return images;
    }
    return images.filter((img: any) => img.category?.toLowerCase() === activeCategory.toLowerCase());
  }, [activeCategory, images]);

  // Find current image index for navigation
  const currentImageIndex = useMemo(() => {
    if (!selectedImage) return -1;
    return images.findIndex((img: any) => (img._id || img.id) === (selectedImage._id || selectedImage.id));
  }, [selectedImage, images]);

  // Navigation handlers
  const goToNext = () => {
    if (currentImageIndex < images.length - 1) {
      setSelectedImage(images[currentImageIndex + 1]);
    } else {
      setSelectedImage(images[0]); // Loop back to first
    }
  };

  const goToPrev = () => {
    if (currentImageIndex > 0) {
      setSelectedImage(images[currentImageIndex - 1]);
    } else {
      setSelectedImage(images[images.length - 1]); // Loop to last
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!selectedImage) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'Escape') setSelectedImage(null);
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedImage, currentImageIndex, images.length]);

  // Touch swipe handler
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    setTouchEnd(e.changedTouches[0].clientX);
    handleSwipe();
  };

  const handleSwipe = () => {
    if (touchStart - touchEnd > 50) {
      goToNext(); // Swiped left
    }
    if (touchEnd - touchStart > 50) {
      goToPrev(); // Swiped right
    }
  };

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
              {filteredImages.map((img, index) => (
                <motion.div
                  key={img._id || img.id || `${img.url}-${index}`}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedImage(img)}
                  className="relative group overflow-hidden rounded-2xl shadow-sm hover:shadow-2xl border border-slate-100 aspect-4/3 bg-slate-100 cursor-pointer"
                >
                  <img
                    src={img.url}
                    alt={img.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Premium Glassmorphic Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/40 to-transparent backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6 text-white z-10">
                    <div className="flex justify-end">
                      <motion.div 
                        whileHover={{ scale: 1.1 }}
                        className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-md border border-white/30 shadow-lg"
                      >
                        <ZoomIn className="w-5 h-5" />
                      </motion.div>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-gold font-bold tracking-widest drop-shadow-sm">{img.category}</span>
                      <h4 className="text-base font-serif font-bold mt-1 leading-tight drop-shadow-sm">{img.title}</h4>
                    </div>
                  </div>

                  {/* Shadow animation */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ring-2 ring-primary/50 shadow-[inset_0_0_30px_rgba(79,70,229,0.2)]" />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

        </div>
      </section>

      {/* Premium Lightbox / Fullscreen Modal */}
      <AnimatePresence>
        {selectedImage && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* Backdrop with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="fixed inset-0 bg-slate-950/95 backdrop-blur-lg"
            />

            {/* Lightbox Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="relative max-w-5xl w-full z-10"
            >
              {/* Main Image Container */}
              <div className="relative bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
                <div className="relative aspect-video sm:aspect-[16/10] bg-slate-950">
                  <motion.img
                    key={selectedImage._id || selectedImage.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    src={selectedImage.url}
                    alt={selectedImage.title}
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Close Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-4 right-4 w-10 h-10 bg-slate-800/70 hover:bg-slate-700 text-white rounded-full flex items-center justify-center backdrop-blur-md cursor-pointer transition-all border border-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>

                  {/* Navigation Arrows */}
                  {images.length > 1 && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={goToPrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-slate-800/70 hover:bg-slate-700 text-white rounded-full flex items-center justify-center backdrop-blur-md cursor-pointer transition-all border border-slate-600"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={goToNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-slate-800/70 hover:bg-slate-700 text-white rounded-full flex items-center justify-center backdrop-blur-md cursor-pointer transition-all border border-slate-600"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </motion.button>
                    </>
                  )}

                  {/* Image Counter */}
                  {images.length > 1 && (
                    <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-slate-800/70 text-white text-xs font-bold rounded-full backdrop-blur-md border border-slate-600">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  )}
                </div>

                {/* Info Footer */}
                <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 border-t border-slate-700 flex justify-between items-center flex-wrap gap-4">
                  <div>
                    <span className="text-xs uppercase text-gold font-bold tracking-wider">{selectedImage.category}</span>
                    <h3 className="font-serif font-extrabold text-slate-100 text-lg sm:text-xl mt-1 leading-tight">
                      {selectedImage.title}
                    </h3>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedImage(null)}
                    className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg cursor-pointer transition-all"
                  >
                    Close (ESC)
                  </motion.button>
                </div>
              </div>

              {/* Navigation Hints */}
              {images.length > 1 && (
                <div className="mt-4 text-center">
                  <p className="text-white/60 text-xs font-semibold">
                    Use ← → or swipe to navigate • ESC to close
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
