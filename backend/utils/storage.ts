import fs from 'fs';
import path from 'path';
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

const LOCAL_DB_PATH = path.join(process.cwd(), 'data', 'db.json');

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
  applyButtonText: course?.applyButtonText || 'Apply Now'
});

const normalizeSettingsPayload = (updateData: any) => ({
  ...updateData,
  courses: Array.isArray(updateData?.courses)
    ? updateData.courses.map((course: any, index: number) => normalizeCourseEntry(course, index))
    : updateData?.courses,
});

// Helper to read local JSON DB
const readLocalDB = () => {
  try {
    if (!fs.existsSync(LOCAL_DB_PATH)) {
      return { settings: {}, founder: {}, manager: {}, notices: [], galleryImages: [], leaders: [], admissionSettings: {}, enquiries: [], contactMessages: [] };
    }
    const data = fs.readFileSync(LOCAL_DB_PATH, 'utf-8');
    const parsed = JSON.parse(data);
    if (!parsed.admissionSettings) {
        parsed.admissionSettings = {
            admissionStatus: parsed.settings?.admissionStatus || 'Closed',
            academicSession: parsed.settings?.academicSession || '2026-27',
            admissionMessage: parsed.settings?.admissionMessage || 'Admissions Open',
            breakingNewsStatus: parsed.settings?.breakingNewsStatus || false,
            breakingNewsText: parsed.settings?.breakingNewsText || 'Admissions Open'
        };
    }
    if (!parsed.galleryImages) {
        parsed.galleryImages = [];
    }
    if (!parsed.leaders) {
        parsed.leaders = [];
    }
    if (!parsed.enquiries) {
        parsed.enquiries = [];
    }
    if (!parsed.contactMessages) {
        parsed.contactMessages = [];
    }
    return parsed;
  } catch (err) {
    console.error('Error reading local JSON database:', err);
    return { settings: {}, founder: {}, manager: {}, notices: [], galleryImages: [], leaders: [], admissionSettings: {}, enquiries: [], contactMessages: [] };
  }
};

// Helper to write local JSON DB
const writeLocalDB = (data: any) => {
  try {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local JSON database:', err);
  }
};

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
    updatedAt: leader?.updatedAt || leader?.createdAt || new Date().toISOString()
  };
};

export const storage = {
  // --- SETTINGS ---
  async getSettings() {
    if (isMongoConnected()) {
      let settings = await Settings.findOne();
      if (!settings) {
        // Seed database if empty
        const local = readLocalDB();
        settings = await Settings.create(local.settings);
      }
      return settings;
    } else {
      return readLocalDB().settings;
    }
  },

  async updateSettings(updateData: any) {
    const normalizedUpdate = normalizeSettingsPayload(updateData);
    if (isMongoConnected()) {
      let settings = await Settings.findOne();
      if (!settings) {
        settings = new Settings(normalizedUpdate);
      } else {
        Object.assign(settings, normalizedUpdate);
      }
      await settings.save();
      return settings;
    } else {
      const db = readLocalDB();
      db.settings = { ...db.settings, ...normalizedUpdate };
      writeLocalDB(db);
      return db.settings;
    }
  },

  // --- FOUNDER ---
  async getFounder() {
    if (isMongoConnected()) {
      let founder = await Founder.findOne();
      if (!founder) {
        const local = readLocalDB();
        founder = await Founder.create(local.founder);
      }
      return founder;
    } else {
      return readLocalDB().founder;
    }
  },

  async updateFounder(updateData: any) {
    if (isMongoConnected()) {
      let founder = await Founder.findOne();
      if (!founder) {
        founder = new Founder(updateData);
      } else {
        Object.assign(founder, updateData);
      }
      await founder.save();
      return founder;
    } else {
      const db = readLocalDB();
      db.founder = { ...db.founder, ...updateData };
      writeLocalDB(db);
      return db.founder;
    }
  },

  // --- MANAGER ---
  async getManager() {
    if (isMongoConnected()) {
      let manager = await Manager.findOne();
      if (!manager) {
        const local = readLocalDB();
        manager = await Manager.create(local.manager);
      }
      return manager;
    } else {
      return readLocalDB().manager;
    }
  },

  async updateManager(updateData: any) {
    if (isMongoConnected()) {
      let manager = await Manager.findOne();
      if (!manager) {
        manager = new Manager(updateData);
      } else {
        Object.assign(manager, updateData);
      }
      await manager.save();
      return manager;
    } else {
      const db = readLocalDB();
      db.manager = { ...db.manager, ...updateData };
      writeLocalDB(db);
      return db.manager;
    }
  },

  // --- NOTICES ---
  async getNotices(filters: { category?: string; search?: string; status?: string } = {}) {
    if (isMongoConnected()) {
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
          { description: { $regex: filters.search, $options: 'i' } }
        ];
      }
      // Sort by pinned desc, then publishDate desc
      return await Notice.find(query).sort({ pinned: -1, publishDate: -1 });
    } else {
      const db = readLocalDB();
      let list = db.notices || [];

      // Apply category filter
      if (filters.category) {
        list = list.filter((n: any) => n.category.toLowerCase() === filters.category!.toLowerCase());
      }

      // Apply status filter
      if (filters.status) {
        if (filters.status === 'published') list = list.filter((n: any) => n.published === true);
        if (filters.status === 'draft') list = list.filter((n: any) => n.published === false);
        if (filters.status === 'pinned') list = list.filter((n: any) => n.pinned === true);
      }

      // Apply search query
      if (filters.search) {
        const term = filters.search.toLowerCase();
        list = list.filter((n: any) => 
          n.title.toLowerCase().includes(term) || 
          n.description.toLowerCase().includes(term)
        );
      }

      // Sort by pinned first, then publishDate descending
      return list.sort((a: any, b: any) => {
        if (a.pinned !== b.pinned) {
          return a.pinned ? -1 : 1;
        }
        return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
      });
    }
  },

  async getNoticeById(id: string) {
    if (isMongoConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) return null;
      return await Notice.findById(id);
    } else {
      const db = readLocalDB();
      return db.notices.find((n: any) => n._id === id) || null;
    }
  },

  async createNotice(noticeData: any) {
    if (isMongoConnected()) {
      const notice = new Notice({
        ...noticeData,
        publishDate: noticeData.publishDate ? new Date(noticeData.publishDate) : new Date(),
        expiryDate: noticeData.expiryDate ? new Date(noticeData.expiryDate) : undefined,
      });
      await notice.save();
      return notice;
    } else {
      const db = readLocalDB();
      const newNotice = {
        _id: 'n_' + Date.now(),
        title: noticeData.title,
        description: noticeData.description,
        category: noticeData.category,
        publishDate: noticeData.publishDate || new Date().toISOString(),
        expiryDate: noticeData.expiryDate || null,
        googleDriveUrl: noticeData.googleDriveUrl || '',
        pinned: noticeData.pinned ?? false,
        published: noticeData.published ?? true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      db.notices.push(newNotice);
      writeLocalDB(db);
      return newNotice;
    }
  },

  // --- GALLERY ---
  async getGalleryImages(filters: { category?: string; search?: string; visible?: boolean } = {}) {
    if (isMongoConnected()) {
      const query: any = {};
      if (filters.category) query.category = filters.category;
      if (typeof filters.visible === 'boolean') query.visible = filters.visible;
      if (filters.search) {
        query.$or = [
          { title: { $regex: filters.search, $options: 'i' } },
          { category: { $regex: filters.search, $options: 'i' } }
        ];
      }
      return await GalleryImage.find(query).sort({ displayOrder: 1, createdAt: -1 });
    } else {
      const db = readLocalDB();
      let items = db.galleryImages || [];
      if (filters.category) {
        items = items.filter((item: any) => item.category.toLowerCase() === filters.category!.toLowerCase());
      }
      if (typeof filters.visible === 'boolean') {
        items = items.filter((item: any) => item.visible === filters.visible);
      }
      if (filters.search) {
        const term = filters.search.toLowerCase();
        items = items.filter((item: any) =>
          item.title.toLowerCase().includes(term) || item.category.toLowerCase().includes(term)
        );
      }
      return items.sort((a: any, b: any) => a.displayOrder - b.displayOrder || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  },

  async getGalleryImageById(id: string) {
    if (isMongoConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) return null;
      return await GalleryImageModel.findById(id).exec();
    } else {
      const db = readLocalDB();
      return db.galleryImages.find((img: any) => img._id === id) || null;
    }
  },

  async findGalleryImageByUrl(url: string) {
    if (isMongoConnected()) {
      return await GalleryImageModel.findOne({ url }).exec();
    } else {
      const db = readLocalDB();
      return db.galleryImages.find((img: any) => img.url === url) || null;
    }
  },

  async createGalleryImage(imageData: any) {
    if (isMongoConnected()) {
      const image = new GalleryImage(imageData);
      await image.save();
      return image;
    } else {
      const db = readLocalDB();
      const newImage = {
        _id: 'g_' + Date.now(),
        url: imageData.url,
        title: imageData.title,
        category: imageData.category,
        visible: imageData.visible ?? true,
        displayOrder: imageData.displayOrder ?? 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      db.galleryImages.push(newImage);
      writeLocalDB(db);
      return newImage;
    }
  },

  async updateGalleryImage(id: string, updateData: any) {
    if (isMongoConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) return null;
      return await GalleryImageModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    } else {
      const db = readLocalDB();
      const index = db.galleryImages.findIndex((img: any) => img._id === id);
      if (index === -1) return null;
      const updated = {
        ...db.galleryImages[index],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      db.galleryImages[index] = updated;
      writeLocalDB(db);
      return updated;
    }
  },

  async deleteGalleryImage(id: string) {
    if (isMongoConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) return null;
      return await GalleryImageModel.findByIdAndDelete(id).exec();
    } else {
      const db = readLocalDB();
      const index = db.galleryImages.findIndex((img: any) => img._id === id);
      if (index === -1) return false;
      db.galleryImages.splice(index, 1);
      writeLocalDB(db);
      return true;
    }
  },

  // --- LEADERS ---
  async getLeaders() {
    if (isMongoConnected()) {
      let leaders = await Leader.find().sort({ createdAt: 1, _id: 1 });
      if (leaders.length === 0) {
        const founder = await this.getFounder();
        const manager = await this.getManager();
        const seedLeaders: any[] = [];
        if (founder) {
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
            displayOrder: 0
          });
        }
        if (manager) {
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
            displayOrder: 1
          });
        }
        if (seedLeaders.length > 0) {
          leaders = await Leader.insertMany(seedLeaders);
          return leaders
            .map((leader: any) => normalizeLeaderRecord(leader.toObject ? leader.toObject() : leader))
            .sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        }
      }
      return leaders
        .map((leader: any) => normalizeLeaderRecord(leader.toObject ? leader.toObject() : leader))
        .sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else {
      const db = readLocalDB();
      if (!db.leaders || db.leaders.length === 0) {
        const founder = await this.getFounder();
        const manager = await this.getManager();
        const seedLeaders: any[] = [];
        if (founder) {
          seedLeaders.push({
            _id: 'l_' + Date.now() + '_f',
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
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
        if (manager) {
          seedLeaders.push({
            _id: 'l_' + Date.now() + '_m',
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
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
        if (seedLeaders.length > 0) {
          db.leaders = seedLeaders;
          writeLocalDB(db);
        }
      }
      return (db.leaders || [])
        .map((leader: any) => normalizeLeaderRecord(leader))
        .sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }
  },

  async getLeaderById(id: string) {
    if (isMongoConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) return null;
      const leader = await LeaderModel.findById(id).exec();
      return leader ? normalizeLeaderRecord(leader.toObject ? leader.toObject() : leader) : null;
    } else {
      const db = readLocalDB();
      const leader = db.leaders.find((entry: any) => entry._id === id) || null;
      return leader ? normalizeLeaderRecord(leader) : null;
    }
  },

  async findLeaderByPhotoUrl(photoUrl: string) {
    if (isMongoConnected()) {
      return await LeaderModel.findOne({ photoUrl }).exec();
    } else {
      const db = readLocalDB();
      return db.leaders.find((leader: any) => leader.photoUrl === photoUrl) || null;
    }
  },

  async createLeader(leaderData: any) {
    if (isMongoConnected()) {
      const leader = new Leader(leaderData);
      await leader.save();
      return normalizeLeaderRecord(leader.toObject ? leader.toObject() : leader);
    } else {
      const db = readLocalDB();
      const newLeader = {
        _id: 'l_' + Date.now(),
        photoUrl: leaderData.photoUrl || '',
        fullName: leaderData.fullName,
        designation: leaderData.designation,
        membership: leaderData.membership || 'Member',
        editorialMessage: leaderData.editorialMessage,
        buttonText: leaderData.buttonText || '',
        buttonUrl: leaderData.buttonUrl || '',
        published: leaderData.published ?? true,
        featured: leaderData.featured ?? false,
        displayOrder: leaderData.displayOrder ?? 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      db.leaders.push(newLeader);
      writeLocalDB(db);
      return normalizeLeaderRecord(newLeader);
    }
  },

  async updateLeader(id: string, updateData: any) {
    if (isMongoConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) return null;
      const updated = await LeaderModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
      return updated ? normalizeLeaderRecord(updated.toObject ? updated.toObject() : updated) : null;
    } else {
      const db = readLocalDB();
      const index = db.leaders.findIndex((leader: any) => leader._id === id);
      if (index === -1) return null;
      const updated = {
        ...db.leaders[index],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      db.leaders[index] = updated;
      writeLocalDB(db);
      return normalizeLeaderRecord(updated);
    }
  },

  async deleteLeader(id: string) {
    if (isMongoConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) return null;
      return await LeaderModel.findByIdAndDelete(id).exec();
    } else {
      const db = readLocalDB();
      const index = db.leaders.findIndex((leader: any) => leader._id === id);
      if (index === -1) return false;
      db.leaders.splice(index, 1);
      writeLocalDB(db);
      return true;
    }
  },


  async updateNotice(id: string, updateData: any) {
    if (isMongoConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) return null;
      const dataToUpdate = { ...updateData };
      if (updateData.publishDate) dataToUpdate.publishDate = new Date(updateData.publishDate);
      if (updateData.expiryDate) dataToUpdate.expiryDate = new Date(updateData.expiryDate);
      
      return await Notice.findByIdAndUpdate(id, dataToUpdate, { new: true });
    } else {
      const db = readLocalDB();
      const index = db.notices.findIndex((n: any) => n._id === id);
      if (index === -1) return null;

      const updated = {
        ...db.notices[index],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      db.notices[index] = updated;
      writeLocalDB(db);
      return updated;
    }
  },

  async deleteNotice(id: string) {
    if (isMongoConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) return null;
      return await Notice.findByIdAndDelete(id);
    } else {
      const db = readLocalDB();
      const index = db.notices.findIndex((n: any) => n._id === id);
      if (index === -1) return false;

      db.notices.splice(index, 1);
      writeLocalDB(db);
      return true;
    }
  },

  // --- ADMISSION SETTINGS ---
  async getAdmissionSettings() {
    if (isMongoConnected()) {
      let settings = await AdmissionSettings.findOne();
      if (!settings) {
        const local = readLocalDB();
        settings = await AdmissionSettings.create(local.admissionSettings);
      }
      return settings;
    } else {
      return readLocalDB().admissionSettings;
    }
  },

  async updateAdmissionSettings(updateData: any) {
    if (isMongoConnected()) {
      let settings = await AdmissionSettings.findOne();
      if (!settings) {
        settings = new AdmissionSettings(updateData);
      } else {
        Object.assign(settings, updateData);
      }
      await settings.save();
      return settings;
    } else {
      const db = readLocalDB();
      db.admissionSettings = { ...db.admissionSettings, ...updateData };
      writeLocalDB(db);
      return db.admissionSettings;
    }
  },

  // --- ENQUIRIES ---
  async getEnquiries() {
    if (isMongoConnected()) {
      return await AdmissionEnquiry.find().sort({ timestamp: -1 });
    } else {
      const db = readLocalDB();
      return (db.enquiries || []).sort((a: any, b: any) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    }
  },

  async createEnquiry(enquiryData: any) {
    if (isMongoConnected()) {
      const enquiry = new AdmissionEnquiry(enquiryData);
      await enquiry.save();
      return enquiry;
    } else {
      const db = readLocalDB();
      const newEnquiry = {
        _id: 'e_' + Date.now(),
        ...enquiryData,
        status: enquiryData.status || 'New',
        timestamp: enquiryData.timestamp || new Date().toISOString()
      };
      db.enquiries = db.enquiries || [];
      db.enquiries.push(newEnquiry);
      writeLocalDB(db);
      return newEnquiry;
    }
  },

  async updateEnquiryStatus(id: string, status: string) {
    if (isMongoConnected()) {
      return await (AdmissionEnquiry.findByIdAndUpdate as any)(id, { status }, { new: true });
    } else {
      const db = readLocalDB();
      const index = db.enquiries.findIndex((e: any) => e._id === id);
      if (index === -1) return null;

      db.enquiries[index].status = status;
      writeLocalDB(db);
      return db.enquiries[index];
    }
  },

  // --- CONTACT MESSAGES ---
  async createContactMessage(messageData: any) {
    if (isMongoConnected()) {
      const message = new ContactMessage(messageData);
      await message.save();
      return message;
    } else {
      const db = readLocalDB();
      const newMessage = {
        _id: 'c_' + Date.now(),
        ...messageData,
        status: messageData.status || 'New',
        timestamp: messageData.timestamp || new Date().toISOString()
      };
      db.contactMessages = db.contactMessages || [];
      db.contactMessages.push(newMessage);
      writeLocalDB(db);
      return newMessage;
    }
  },

  isMongoConnected() {
    return isMongoConnected();
  },

  isValidObjectId(id: string) {
    return mongoose.Types.ObjectId.isValid(id);
  }
};
