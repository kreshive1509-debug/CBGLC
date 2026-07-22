// Shared Types for Chandra Bhanu Gupta Law College App

export interface Course {
  id: string;
  name: string;
  duration: string;
  seats: string;
  eligibility: string;
  type: string;
  shortDesc: string;
  longDesc: string;
  careerOpportunities: string[];
  subjects: string[];
}

export interface Facility {
  id: string;
  title: string;
  description: string;
  image: string;
  details: string;
}

export interface Notice {
  id: string;
  date: string;
  category: 'Admission' | 'Exam' | 'Academic' | 'Event';
  title: string;
  description: string;
  content: string;
  important: boolean;
}

export interface HighlightItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  year: string;
  quote: string;
}
