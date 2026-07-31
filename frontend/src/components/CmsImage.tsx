import React, { useEffect, useState } from 'react';
import { ImageIcon } from 'lucide-react';

interface CmsImageProps {
  src?: string | null;
  alt?: string;
  className?: string;
  containerClassName?: string;
  placeholderText?: string;
  isOffline?: boolean;
}

export const CmsImage: React.FC<CmsImageProps> = ({
  src,
  alt = '',
  className = 'w-full h-full object-cover',
  containerClassName = 'relative overflow-hidden w-full h-full bg-slate-100',
  placeholderText = 'Image unavailable',
  isOffline = false,
}) => {
  const [hasError, setHasError] = useState(false);
  const normalizedSrc = typeof src === 'string' ? src.trim() : '';

  useEffect(() => {
    setHasError(false);
  }, [normalizedSrc]);

  const showPlaceholder = isOffline || !normalizedSrc || hasError;

  return (
    <div className={containerClassName}>
      {showPlaceholder ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-slate-100 text-slate-400 px-4 text-center">
          <ImageIcon className="w-8 h-8" />
          <span className="text-xs font-semibold tracking-wide">{placeholderText}</span>
        </div>
      ) : (
        <img
          src={normalizedSrc}
          alt={alt}
          className={className}
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
};
