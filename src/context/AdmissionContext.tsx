import React, { createContext, useContext, useState } from 'react';

interface AdmissionContextType {
  isModalOpen: boolean;
  openModal: (courseId?: string) => void;
  closeModal: () => void;
  selectedCourseId: string;
}

const AdmissionContext = createContext<AdmissionContextType | undefined>(undefined);

export const AdmissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState('');

  const openModal = (courseId?: string) => {
    if (courseId) {
      setSelectedCourseId(courseId);
    } else {
      setSelectedCourseId('');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourseId('');
  };

  return (
    <AdmissionContext.Provider value={{ isModalOpen, openModal, closeModal, selectedCourseId }}>
      {children}
    </AdmissionContext.Provider>
  );
};

export const useAdmissionModal = () => {
  const context = useContext(AdmissionContext);
  if (context === undefined) {
    throw new Error('useAdmissionModal must be used within an AdmissionProvider');
  }
  return context;
};
