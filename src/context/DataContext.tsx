import React, { createContext, useContext, useState, useEffect } from 'react';
import { COLLEGE_INFO, FOUNDER_INFO, MANAGER_INFO, NOTICES, Notice } from '../constants/data';

export interface WebsiteSettings {
  collegeName: string;
  tagline: string;
  logoUrl: string;
  
  // Location/Address
  address: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  googleMapEmbedLink: string;
  googleMapUrl: string;
  
  // Phone/Email
  primaryPhone: string;
  secondaryPhone: string;
  whatsAppNumber: string;
  emergencyContact: string;
  officeEmail: string;
  admissionEmail: string;
  supportEmail: string;
  website: string;
  officeHours: string;
  
  // Social Media
  facebook: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  twitter: string;
  
  // Admission/Hero/Brochure
  admissionStatus: 'Open' | 'Closed';
  academicSession: string;
  admissionMessage: string;
  breakingNewsStatus: boolean;
  breakingNewsText: string;
  heroBackgroundUrl: string;
  brochureUrl: string;
  brochureButtonText: string;
  
  // Footer/Copyright
  footerText: string;
  copyrightText: string;
  designedBy: string;

  // SEO
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  // Google Sheets
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
  admissionSettings: AdmissionSettings | null;
  isLoading: boolean;
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
  heroBackgroundUrl: "",
  brochureUrl: "https://drive.google.com/file/d/1PlaceholderBrochureID/view?usp=sharing",
  brochureButtonText: "Download Brochure",
  footerText: `${COLLEGE_INFO.name} (Established in ${COLLEGE_INFO.established})`,
  copyrightText: "© 2026 All Rights Reserved by Veltora IT Solutions",
  designedBy: "Designed & Developed by Veltora IT Solutions",
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
  const [admissionSettings, setAdmissionSettings] = useState<AdmissionSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshData = async () => {
    try {
      // Fetch settings
      const settingsRes = await fetch('/api/settings');
      if (settingsRes.ok) {
        const data = await settingsRes.json();
        setSettings({ ...fallbackSettings, ...normalizeSettingsData(data) });
      }

      // Fetch founder
      const founderRes = await fetch('/api/founder');
      if (founderRes.ok) {
        const data = await founderRes.json();
        setFounder({ ...fallbackFounder, ...data });
      }

      // Fetch manager
      const managerRes = await fetch('/api/manager');
      if (managerRes.ok) {
        const data = await managerRes.json();
        setManager({ ...fallbackManager, ...data });
      }

      // Fetch notices
      const noticesRes = await fetch('/api/notices');
      if (noticesRes.ok) {
        const data = await noticesRes.json();
        setNotices(data);
      }
      
      // Fetch admission settings
      const admissionRes = await fetch('/api/admission-settings');
      if (admissionRes.ok) {
        const data = await admissionRes.json();
        setAdmissionSettings(data);
      }
    } catch (error) {
      console.warn('Could not load data from dynamic API endpoints, using fully integrated fallback data.', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <DataContext.Provider value={{ settings, founder, manager, notices, admissionSettings, isLoading, refreshData }}>
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
