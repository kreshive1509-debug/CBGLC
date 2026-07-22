import mongoose from 'mongoose';
import { isMongoConnected } from '../config/db';
import _Notice from '../models/Notice';
import Founder from '../models/Founder';
import Manager from '../models/Manager';
import Settings from '../models/Settings';
import AdmissionSettings from '../models/AdmissionSettings';
import AdmissionEnquiry from '../models/AdmissionEnquiry';
import GalleryImage from '../models/GalleryImage';
import Leader from '../models/Leader';
import ContactMessage from '../models/ContactMessage';

const Notice = _Notice as any;
const GalleryImageModel: any = GalleryImage;
const LeaderModel: any = Leader;

const toStringArray = (value: any): string[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (typeof item === 'string') return item.trim();
      if (item && typeof item === 'object') {
        return String(item.name ?? item.text ?? '').trim();
      }
      return '';
    })
    .filter(Boolean);
};

const normalizeCourseEntry = (course: any, index: number) => ({
  id: course?.id || `course-${index}`,
  name: course?.name || course?.title || '',
  shortDescription: course?.shortDescription || course?.description || '',
  longDescription: course?.longDescription || course?.description || '',
  seats: typeof course?.seats === 'number' ? course.seats : Number(course?.seats) || 0,
  duration: course?.duration || '',
  semester: course?.semester || '',
  badge: course?.badge || course?.programBadge || course?.type || '',
  imageUrl: course?.imageUrl || course?.bannerImageUrl || course?.coverImageUrl || '',
  status: course?.status === 'Draft' ? 'Draft' : 'Published',
  displayOrder: typeof course?.displayOrder === 'number' ? course.displayOrder : index,
  admissionCriteria: typeof course?.admissionCriteria === 'string' ? course.admissionCriteria : '',
  eligibility: typeof course?.eligibility === 'string' ? course.eligibility : '',
  minimumPercentage: typeof course?.minimumPercentage === 'string' ? course.minimumPercentage : '',
  subjects: toStringArray(course?.subjects),
  careerOpportunities: toStringArray(course?.careerOpportunities),
  coreSubjects: toStringArray(course?.coreSubjects),
  curriculumPdfUrl: course?.curriculumPdfUrl || course?.curriculumPdf || '',
  applyButtonText: course?.applyButtonText || 'Apply Now',
});

const normalizeSettingsPayload = (updateData: any) => ({
  ...updateData,
  courses: Array.isArray(updateData?.courses)
    ? updateData.courses.map((course: any, index: number) => normalizeCourseEntry(course, index))
    : updateData?.courses,
});

const normalizeLeaderRecord = (leader: any) => {
  const fullName = String(leader?.fullName || leader?.name || '').trim();
  const designation = String(leader?.designation || '').trim();
  const membership = String(leader?.membership || '').trim() || (
    designation.toLowerCase().includes('founder') || fullName.toLowerCase().includes('founder')
      ? 'Founder'
      : designation.toLowerCase().includes('manager') || fullName.toLowerCase().includes('manager')
        ? 'Manager'
        : 'Member'
  );

  return {
    ...leader,
    fullName,
    designation,
    membership,
    photoUrl: leader?.photoUrl || '',
    editorialMessage: leader?.editorialMessage || '',
    published: leader?.published ?? true,
    featured: leader?.featured ?? false,
    displayOrder: typeof leader?.displayOrder === 'number' ? leader.displayOrder : 0,
    createdAt: leader?.createdAt || new Date().toISOString(),
    updatedAt: leader?.updatedAt || leader?.createdAt || new Date().toISOString(),
  };
};

const toPlain = (value: any) => {
  if (!value) return null;
  return typeof value.toObject === 'function' ? value.toObject() : value;
};

export const storage = {
  // --- SETTINGS ---
  async getSettings() {
    if (!isMongoConnected()) return {};
    const settings = await Settings.findOne().lean();
    return settings || {};
  },

  async updateSettings(updateData: any) {
    const normalizedUpdate = normalizeSettingsPayload(updateData);
    if (!isMongoConnected()) return null;

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(normalizedUpdate);
    } else {
      Object.assign(settings, normalizedUpdate);
    }
    await settings.save();
    return toPlain(settings);
  },

  // --- FOUNDER ---
  async getFounder() {
    if (!isMongoConnected()) return {};
    const founder = await Founder.findOne().lean();
    return founder || {};
  },

  async updateFounder(updateData: any) {
    if (!isMongoConnected()) return null;

    let founder = await Founder.findOne();
    if (!founder) {
      founder = new Founder(updateData);
    } else {
      Object.assign(founder, updateData);
    }
    await founder.save();
    return toPlain(founder);
  },

  // --- MANAGER ---
  async getManager() {
    if (!isMongoConnected()) return {};
    const manager = await Manager.findOne().lean();
    return manager || {};
  },

  async updateManager(updateData: any) {
    if (!isMongoConnected()) return null;

    let manager = await Manager.findOne();
    if (!manager) {
      manager = new Manager(updateData);
    } else {
      Object.assign(manager, updateData);
    }
    await manager.save();
    return toPlain(manager);
  },

  // --- NOTICES ---
  async getNotices(filters: { category?: string; search?: string; status?: string } = {}) {
    if (!isMongoConnected()) return [];

    const query: any = {};
    if (filters.category) {
      query.category = filters.category;
    }
    if (filters.status) {
      if (filters.status === 'published') query.published = true;
      if (filters.status === 'draft') query.published = false;
      if (filters.status === 'pinned') query.pinned = true;
    }
    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
      ];
    }

    return Notice.find(query).sort({ pinned: -1, publishDate: -1 }).lean();
  },

  async getNoticeById(id: string) {
    if (!isMongoConnected() || !mongoose.Types.ObjectId.isValid(id)) return null;
    return Notice.findById(id).lean();
  },

  async createNotice(noticeData: any) {
    if (!isMongoConnected()) return null;

    const notice = new Notice({
      ...noticeData,
      publishDate: noticeData.publishDate ? new Date(noticeData.publishDate) : new Date(),
      expiryDate: noticeData.expiryDate ? new Date(noticeData.expiryDate) : undefined,
    });
    await notice.save();
    return toPlain(notice);
  },

  async updateNotice(id: string, updateData: any) {
    if (!isMongoConnected() || !mongoose.Types.ObjectId.isValid(id)) return null;
    const dataToUpdate = { ...updateData };
    if (updateData.publishDate) dataToUpdate.publishDate = new Date(updateData.publishDate);
    if (updateData.expiryDate) dataToUpdate.expiryDate = new Date(updateData.expiryDate);

    return Notice.findByIdAndUpdate(id, dataToUpdate, {
      new: true,
      runValidators: true,
    }).lean();
  },

  async deleteNotice(id: string) {
    if (!isMongoConnected() || !mongoose.Types.ObjectId.isValid(id)) return null;
    return Notice.findByIdAndDelete(id).lean();
  },

  // --- GALLERY ---
  async getGalleryImages(filters: { category?: string; search?: string; visible?: boolean } = {}) {
    if (!isMongoConnected()) return [];

    const query: any = {};
    if (filters.category) query.category = filters.category;
    if (typeof filters.visible === 'boolean') query.visible = filters.visible;
    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { category: { $regex: filters.search, $options: 'i' } },
      ];
    }
    return GalleryImage.find(query).sort({ displayOrder: 1, createdAt: -1 }).lean();
  },

  async getGalleryImageById(id: string) {
    if (!isMongoConnected() || !mongoose.Types.ObjectId.isValid(id)) return null;
    return GalleryImageModel.findById(id).lean();
  },

  async findGalleryImageByUrl(url: string) {
    if (!isMongoConnected()) return null;
    return GalleryImageModel.findOne({ url }).lean();
  },

  async createGalleryImage(imageData: any) {
    if (!isMongoConnected()) return null;

    const image = new GalleryImage(imageData);
    await image.save();
    return toPlain(image);
  },

  async updateGalleryImage(id: string, updateData: any) {
    if (!isMongoConnected() || !mongoose.Types.ObjectId.isValid(id)) return null;
    return GalleryImageModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).lean();
  },

  async deleteGalleryImage(id: string) {
    if (!isMongoConnected() || !mongoose.Types.ObjectId.isValid(id)) return null;
    return GalleryImageModel.findByIdAndDelete(id).lean();
  },

  // --- LEADERS ---
  async getLeaders() {
    if (!isMongoConnected()) return [];

    let leaders = await Leader.find().sort({ createdAt: 1, _id: 1 }).lean();
    if (leaders.length === 0) {
      const founder = await this.getFounder();
      const manager = await this.getManager();
      const seedLeaders: any[] = [];

      if (founder && Object.keys(founder).length > 0) {
        seedLeaders.push({
          photoUrl: founder.googleDrivePhotoUrl || '',
          fullName: founder.name || 'Founder',
          designation: founder.designation || 'Founder',
          membership: 'Founder',
          editorialMessage: founder.message || '',
          buttonText: 'Read Full Message',
          buttonUrl: '/founder',
          published: true,
          featured: true,
          displayOrder: 0,
        });
      }

      if (manager && Object.keys(manager).length > 0) {
        seedLeaders.push({
          photoUrl: manager.googleDrivePhotoUrl || '',
          fullName: manager.name || 'Manager',
          designation: manager.designation || 'Manager',
          membership: 'Manager',
          editorialMessage: manager.message || '',
          buttonText: 'Read Full Message',
          buttonUrl: '/manager',
          published: true,
          featured: false,
          displayOrder: 1,
        });
      }

      if (seedLeaders.length > 0) {
        leaders = await Leader.insertMany(seedLeaders);
        return leaders
          .map((leader: any) => normalizeLeaderRecord(toPlain(leader)))
          .sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      }
    }

    return leaders
      .map((leader: any) => normalizeLeaderRecord(toPlain(leader)))
      .sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  },

  async getLeaderById(id: string) {
    if (!isMongoConnected() || !mongoose.Types.ObjectId.isValid(id)) return null;
    const leader = await LeaderModel.findById(id).lean();
    return leader ? normalizeLeaderRecord(leader) : null;
  },

  async findLeaderByPhotoUrl(photoUrl: string) {
    if (!isMongoConnected()) return null;
    return LeaderModel.findOne({ photoUrl }).lean();
  },

  async createLeader(leaderData: any) {
    if (!isMongoConnected()) return null;

    const leader = new Leader(leaderData);
    await leader.save();
    return normalizeLeaderRecord(toPlain(leader));
  },

  async updateLeader(id: string, updateData: any) {
    if (!isMongoConnected() || !mongoose.Types.ObjectId.isValid(id)) return null;
    const updated = await LeaderModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).lean();
    return updated ? normalizeLeaderRecord(updated) : null;
  },

  async deleteLeader(id: string) {
    if (!isMongoConnected() || !mongoose.Types.ObjectId.isValid(id)) return null;
    return LeaderModel.findByIdAndDelete(id).lean();
  },

  // --- ADMISSION SETTINGS ---
  async getAdmissionSettings() {
    if (!isMongoConnected()) return {};
    const settings = await AdmissionSettings.findOne().lean();
    return settings || {};
  },

  async updateAdmissionSettings(updateData: any) {
    if (!isMongoConnected()) return null;

    let settings = await AdmissionSettings.findOne();
    if (!settings) {
      settings = new AdmissionSettings(updateData);
    } else {
      Object.assign(settings, updateData);
    }
    await settings.save();
    return toPlain(settings);
  },

  // --- ENQUIRIES ---
  async getEnquiries() {
    if (!isMongoConnected()) return [];
    return AdmissionEnquiry.find().sort({ timestamp: -1 }).lean();
  },

  async createEnquiry(enquiryData: any) {
    if (!isMongoConnected()) return null;

    const enquiry = new AdmissionEnquiry(enquiryData);
    await enquiry.save();
    return toPlain(enquiry);
  },

  async updateEnquiryStatus(id: string, status: string) {
    if (!isMongoConnected()) return null;
    return AdmissionEnquiry.findByIdAndUpdate(id, { status }, {
      new: true,
      runValidators: true,
    }).lean();
  },

  // --- CONTACT MESSAGES ---
  async createContactMessage(messageData: any) {
    if (!isMongoConnected()) return null;

    const message = new ContactMessage(messageData);
    await message.save();
    return toPlain(message);
  },

  isMongoConnected() {
    return isMongoConnected();
  },

  isValidObjectId(id: string) {
    return mongoose.Types.ObjectId.isValid(id);
  }
};
