import React, { createContext, useContext, useState, useEffect } from 'react';
import { COLLEGE_INFO, FOUNDER_INFO, MANAGER_INFO, NOTICES, Notice } from '../constants/data';
import { CMS_UPDATE_KEY } from '../utils/cmsSync';
import { apiUrl } from '../utils/api';
import { apiFetch, safeJson } from '../utils/http';

export interface WebsiteSettings {
  collegeName: string;
  tagline: string;
  logoUrl: string;
  faviconUrl?: string;
  
  address: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  googleMapEmbedLink: string;
  googleMapUrl: string;
  latitude?: string;
  longitude?: string;
  
  primaryPhone: string;
  secondaryPhone: string;
  alternatePhone?: string;
  whatsAppNumber: string;
  emergencyContact: string;
  officeEmail: string;
  admissionEmail: string;
  supportEmail: string;
  website: string;
  officeHours: string;
  
  facebook: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  twitter: string;
  
  admissionStatus: 'Open' | 'Closed';
  academicSession: string;
  admissionMessage: string;
  breakingNewsStatus: boolean;
  breakingNewsText?: string;
  breakingNewsMessages: Array<{ id: string; text: string; speed: number; order: number }>;
  heroBackgroundUrl: string;
  heroTitle: string;
  heroSubtitle: string;
  heroSmallTagline: string;
  heroAdmissionBadge: string;
  heroPrimaryCtaText: string;
  heroSecondaryCtaText: string;
  heroStats: Array<{ label: string; value: string }>;
  heroOverlayText: string;
  brochureUrl: string;
  brochureButtonText: string;

  aboutTitle: string;
  aboutSubtitle: string;
  aboutDescription: string;
  aboutImageUrl: string;
  aboutHighlights: Array<{ id: string; text: string; icon: string }>;
  aboutStats: Array<{ label: string; value: string }>;
  visionTitle: string;
  visionIcon?: string;
  visionQuote: string;
  visionDescription: string;
  visionPoints: Array<{ id: string; text: string }>;
  visionCaption?: string;
  missionTitle: string;
  missionIcon?: string;
  missionQuote: string;
  missionDescription: string;
  missionPoints: Array<{ id: string; text: string }>;
  missionCaption?: string;
  courses: any[];
  facilities: any[];
  fees: any;
  eligibility: any;
  coreSubjects: Array<{ id: string; name: string; displayOrder: number }>;
  curriculumPdfUrl: string;
  
  footerText: string;
  copyrightText: string;
  designedBy: string;
  showDesignedByCredit?: boolean;
  footerQuickLinks: Array<{ id?: string; label: string; path: string; displayOrder?: number }>;
  footerUsefulLinks: Array<{ id?: string; label: string; path: string; displayOrder?: number }>;

  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogImageUrl?: string;
  googleAnalyticsId?: string;
  googleSearchConsoleId?: string;
  googleSheetsId: string;
  isGoogleSheetsEnabled: boolean;
}

export interface PersonInfo {
  name: string;
  designation: string;
  message: string;
  googleDrivePhotoUrl: string;
}

export interface AdmissionSettings {
  admissionStatus: 'Open' | 'Closed';
  academicSession: string;
  admissionMessage: string;
  breakingNewsStatus: boolean;
  breakingNewsText: string;
}

interface DataContextType {
  settings: WebsiteSettings;
  founder: PersonInfo;
  manager: PersonInfo;
  notices: any[];
  leaders: any[];
  galleryImages: any[];
  admissionSettings: AdmissionSettings | null;
  isLoading: boolean;
  backendOffline: boolean;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Initial fallback settings mapped from COLLEGE_INFO
const fallbackSettings: WebsiteSettings = {
  collegeName: COLLEGE_INFO.name,
  tagline: COLLEGE_INFO.tagline,
  logoUrl: "https://i.ibb.co/LhC8RzQ3/Whats-App-Image-2026-07-18-at-14-04-51.jpg",
  address: COLLEGE_INFO.address,
  landmark: "",
  city: "Lucknow",
  state: "Uttar Pradesh",
  pincode: "226024",
  googleMapEmbedLink: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3558.1171830605335!2d80.9392233!3d26.8998083!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399bfd0a80000001%3A0x6b1cc461fc1373be!2sChandra+Bhanu+Gupta+Law+College!5e0!3m2!1sen!2sin!4v1563245465432!5m2!1sen!2sin",
  googleMapUrl: COLLEGE_INFO.mapCoordinates,
  primaryPhone: COLLEGE_INFO.phone,
  secondaryPhone: COLLEGE_INFO.mobile,
  whatsAppNumber: "+91-9415056789",
  emergencyContact: "+91-9415012345",
  officeEmail: COLLEGE_INFO.email,
  admissionEmail: COLLEGE_INFO.email,
  supportEmail: COLLEGE_INFO.email,
  website: COLLEGE_INFO.website,
  officeHours: "Monday - Saturday: 9:00 AM - 4:00 PM",
  facebook: "https://facebook.com/cbglawcollege",
  instagram: "https://instagram.com/cbglawcollege",
  linkedin: "https://linkedin.com/school/cbglawcollege",
  youtube: "https://youtube.com/cbglawcollege",
  twitter: "https://twitter.com/cbglawcollege",
  admissionStatus: "Open",
  academicSession: "2026-27",
  admissionMessage: "Admissions Open",
  breakingNewsStatus: false,
  breakingNewsText: "Admissions Open",
  breakingNewsMessages: [
    { id: "1", text: "Admissions Open for the academic session 2026-27", speed: 1, order: 1 }
  ],
  heroBackgroundUrl: "",
  heroTitle: COLLEGE_INFO.name,
  heroSubtitle: "Shaping ethical lawyers and public leaders through excellence in legal education.",
  heroSmallTagline: "Approved by BCI (Bar Council of India)",
  heroAdmissionBadge: "Admission Open",
  heroPrimaryCtaText: "Admission Enquiry",
  heroSecondaryCtaText: "Download Brochure",
  heroStats: [
    { label: 'BCI Approved', value: '100%' },
    { label: 'Law Programs', value: '2+' },
    { label: 'Campus', value: 'Lucknow' }
  ],
  heroOverlayText: "Premiere Law College in Chandrawal",
  brochureUrl: "https://drive.google.com/file/d/1PlaceholderBrochureID/view?usp=sharing",
  brochureButtonText: "Download Brochure",
  aboutTitle: "A Legacy Of Academic Jurisprudence",
  aboutSubtitle: "About Chandra Bhanu Gupta College",
  aboutDescription: "A premium law institute nurturing advocates, judicial officers, and socially responsible citizens through rigorous legal education and practical training.",
  aboutImageUrl: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80",
  aboutHighlights: [
    { id: "1", text: "BCI Approved", icon: "" },
    { id: "2", text: "Lucknow University Affiliation", icon: "" },
    { id: "3", text: "Clinical legal training", icon: "" },
    { id: "4", text: "Academic excellence", icon: "" }
  ],
  aboutStats: [
    { label: 'Years of legacy', value: '20+' },
    { label: 'Student-focused', value: '100%' },
    { label: 'Programs', value: '2' }
  ],
  visionTitle: "Our Vision",
  visionQuote: "Nurturing advocacy with ethics, wisdom, and social commitment.",
  visionDescription: "To emerge as a premier center of excellence in legal education, molding young intellects into socially responsible, ethical, and highly competent legal professionals.",
  visionPoints: [
    { id: "1", text: "Ethical legal practice" },
    { id: "2", text: "Research-centric learning" },
    { id: "3", text: "Social justice orientation" }
  ],
  missionTitle: "Our Mission",
  missionQuote: "Transforming legal education through innovation, practice, and values.",
  missionDescription: "To deliver transformative legal education through innovative teaching methodologies, hands-on moot court exercises, and state-of-the-art research facilities.",
  missionPoints: [
    { id: "1", text: "Practical legal exposure" },
    { id: "2", text: "Courtroom readiness" },
    { id: "3", text: "Inclusive academic support" }
  ],
  courses: [],
  facilities: [],
  fees: {},
  eligibility: {},
  coreSubjects: [],
  curriculumPdfUrl: "",
  footerText: `${COLLEGE_INFO.name} (Established in ${COLLEGE_INFO.established})`,
  copyrightText: "© 2026 All Rights Reserved by Veltora IT Solutions",
  designedBy: "Designed & Developed by Veltora IT Solutions",
  showDesignedByCredit: true,
  footerQuickLinks: [
    { label: 'About College', path: '/about' },
    { label: 'Courses', path: '/courses' },
    { label: 'Facilities', path: '/facilities' },
    { label: 'Contact Us', path: '/contact' }
  ],
  footerUsefulLinks: [
    { label: 'Notices', path: '/notices' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Admissions', path: '/admission-enquiry' },
    { label: 'FAQs', path: '/faq' }
  ],
  metaTitle: "Chandra Bhanu Gupta Law College | Best Law College in Lucknow",
  metaDescription: "Chandra Bhanu Gupta Law College, Lucknow is affiliated to University of Lucknow and approved by Bar Council of India. Offering LL.B. courses.",
  metaKeywords: "Law College, Lucknow, LLB, legal education, CBG Law College",
  googleSheetsId: "",
  isGoogleSheetsEnabled: false
};

const fallbackFounder: PersonInfo = {
  name: FOUNDER_INFO.name,
  designation: FOUNDER_INFO.title,
  message: FOUNDER_INFO.message,
  googleDrivePhotoUrl: FOUNDER_INFO.image
};

const fallbackManager: PersonInfo = {
  name: MANAGER_INFO.name,
  designation: MANAGER_INFO.title,
  message: MANAGER_INFO.message,
  googleDrivePhotoUrl: MANAGER_INFO.image
};

const normalizeSettingsData = (data: any): Partial<WebsiteSettings> => ({
  ...data,
  logoUrl: data.logoUrl || data.googleDriveLogoUrl || '',
  brochureUrl: data.brochureUrl || data.googleDriveBrochureUrl || '',
  primaryPhone: data.primaryPhone ?? data.phone ?? '',
  secondaryPhone: data.secondaryPhone ?? data.alternatePhone ?? '',
  officeEmail: data.officeEmail ?? data.email ?? '',
  admissionEmail: data.admissionEmail ?? data.email ?? data.officeEmail ?? '',
  supportEmail: data.supportEmail ?? data.email ?? data.officeEmail ?? '',
  breakingNewsMessages: Array.isArray(data.breakingNewsMessages) ? data.breakingNewsMessages : (data.breakingNewsText ? [data.breakingNewsText] : []),
  heroStats: Array.isArray(data.heroStats) ? data.heroStats : [],
  aboutHighlights: Array.isArray(data.aboutHighlights) ? data.aboutHighlights : [],
  aboutStats: Array.isArray(data.aboutStats) ? data.aboutStats : [],
  courses: Array.isArray(data.courses) ? data.courses : [],
  facilities: Array.isArray(data.facilities) ? data.facilities : [],
  footerQuickLinks: Array.isArray(data.footerQuickLinks) ? data.footerQuickLinks : [],
  footerUsefulLinks: Array.isArray(data.footerUsefulLinks) ? data.footerUsefulLinks : [],
});

// Map static Notices format to database format
const fallbackNotices = NOTICES.map(n => ({
  _id: n.id,
  title: n.title,
  description: n.description,
  category: n.category,
  publishDate: new Date(n.date).toISOString(),
  expiryDate: null,
  googleDriveUrl: n.category === 'Admission' ? 'https://drive.google.com/file/d/1Placeholder/view' : '',
  pinned: n.important,
  published: true,
  createdAt: new Date(n.date).toISOString(),
  updatedAt: new Date(n.date).toISOString()
}));

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<WebsiteSettings>(fallbackSettings);
  const [founder, setFounder] = useState<PersonInfo>(fallbackFounder);
  const [manager, setManager] = useState<PersonInfo>(fallbackManager);
  const [notices, setNotices] = useState<any[]>(fallbackNotices);
  const [leaders, setLeaders] = useState<any[]>([]);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [admissionSettings, setAdmissionSettings] = useState<AdmissionSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [backendOffline, setBackendOffline] = useState(false);

  const refreshData = async () => {
    let requestFailed = false;
    setIsLoading(true);

    const handleEndpointError = (context: string, error: unknown) => {
      requestFailed = true;
      console.warn(`Could not load ${context} from dynamic API endpoints, using fully integrated fallback data.`, error);
    };

    try {
      // Fetch settings
      const settingsRes = await apiFetch(apiUrl('/api/settings'), {}, 'DataContext');
      if (!settingsRes.ok) {
        requestFailed = true;
      } else {
        const data = await safeJson(settingsRes, 'DataContext settings');
        setSettings({ ...fallbackSettings, ...normalizeSettingsData(data) });
      }
    } catch (error) {
      handleEndpointError('settings', error);
    }

    try {
      // Fetch founder
      const founderRes = await apiFetch(apiUrl('/api/founder'), {}, 'DataContext');
      if (!founderRes.ok) {
        requestFailed = true;
      } else {
        const data = await safeJson(founderRes, 'DataContext founder');
        setFounder({ ...fallbackFounder, ...data });
      }
    } catch (error) {
      handleEndpointError('founder', error);
    }

    try {
      // Fetch manager
      const managerRes = await apiFetch(apiUrl('/api/manager'), {}, 'DataContext');
      if (!managerRes.ok) {
        requestFailed = true;
      } else {
        const data = await safeJson(managerRes, 'DataContext manager');
        setManager({ ...fallbackManager, ...data });
      }
    } catch (error) {
      handleEndpointError('manager', error);
    }

    try {
      // Fetch notices
      const noticesRes = await apiFetch(apiUrl('/api/notices'), {}, 'DataContext');
      if (!noticesRes.ok) {
        requestFailed = true;
      } else {
        const data = await safeJson(noticesRes, 'DataContext notices');
        setNotices(data);
      }
    } catch (error) {
      handleEndpointError('notices', error);
    }

    try {
      // Fetch leaders
      const leadersRes = await apiFetch(apiUrl('/api/leaders'), { cache: 'no-store' }, 'DataContext');
      if (!leadersRes.ok) {
        requestFailed = true;
      } else {
        const data = await safeJson(leadersRes, 'DataContext leaders');
        setLeaders(data);
      }
    } catch (error) {
      handleEndpointError('leaders', error);
    }

    try {
      // Fetch gallery images
      const galleryRes = await apiFetch(apiUrl('/api/gallery'), {}, 'DataContext');
      if (!galleryRes.ok) {
        requestFailed = true;
      } else {
        const data = await safeJson(galleryRes, 'DataContext gallery');
        setGalleryImages(data);
      }
    } catch (error) {
      handleEndpointError('gallery images', error);
    }

    try {
      // Fetch admission settings
      const admissionRes = await apiFetch(apiUrl('/api/admission-settings'), {}, 'DataContext');
      if (!admissionRes.ok) {
        requestFailed = true;
      } else {
        const data = await safeJson(admissionRes, 'DataContext admission settings');
        setAdmissionSettings(data);
      }
    } catch (error) {
      handleEndpointError('admission settings', error);
    } finally {
      setBackendOffline(requestFailed);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    const handleCmsUpdate = () => {
      refreshData();
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === CMS_UPDATE_KEY) {
        refreshData();
      }
    };

    window.addEventListener('cms-updated', handleCmsUpdate as EventListener);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('cms-updated', handleCmsUpdate as EventListener);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  return (
    <DataContext.Provider value={{ settings, founder, manager, notices, leaders, galleryImages, admissionSettings, isLoading, backendOffline, refreshData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
