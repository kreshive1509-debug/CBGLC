import React, { useEffect } from 'react';

interface SEOHelperProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'article' | 'educational';
  ogImage?: string;
  jsonLd?: Record<string, any>;
}

export const SEOHelper: React.FC<SEOHelperProps> = ({
  title,
  description,
  canonicalUrl,
  ogType = 'website',
  ogImage = 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&h=630&q=80',
  jsonLd
}) => {
  const defaultBaseUrl = 'https://cbglawcollege.in';
  const finalCanonical = canonicalUrl || `${defaultBaseUrl}${window.location.pathname}`;

  useEffect(() => {
    // 1. Update Title
    document.title = title;

    // Helper to select or create meta tags
    const setMetaTag = (attributeName: string, attributeValue: string, contentValue: string) => {
      let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', contentValue);
    };

    // Helper to select or create link tags
    const setLinkTag = (relValue: string, hrefValue: string) => {
      let element = document.querySelector(`link[rel="${relValue}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', relValue);
        document.head.appendChild(element);
      }
      element.setAttribute('href', hrefValue);
    };

    // 2. Set description
    setMetaTag('name', 'description', description);

    // 3. Set Canonical Link
    setLinkTag('canonical', finalCanonical);

    // 4. Set Open Graph Tags
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', finalCanonical);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:image', ogImage);

    // 5. Set Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', ogImage);

    // 6. Dynamic JSON-LD Structured Data
    const jsonLdId = 'dynamic-jsonld-schema';
    let scriptElement = document.getElementById(jsonLdId) as HTMLScriptElement;
    
    if (jsonLd) {
      if (!scriptElement) {
        scriptElement = document.createElement('script');
        scriptElement.id = jsonLdId;
        scriptElement.type = 'application/ld+json';
        document.head.appendChild(scriptElement);
      }
      scriptElement.text = JSON.stringify(jsonLd);
    } else {
      // If no custom jsonLd is supplied, we clean up any pre-existing dynamic JSON-LD tag
      if (scriptElement) {
        scriptElement.remove();
      }
    }

    // Clean up dynamic script tag on unmount if it exists
    return () => {
      // In SPAs, let's keep the tags updated or let the next page's SEOHelper update them
    };
  }, [title, description, finalCanonical, ogType, ogImage, jsonLd]);

  return null; // This is a helper utility that does not render anything on screen
};
