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

const Notice = _Notice as any;

const LOCAL_DB_PATH = path.join(process.cwd(), 'backend', 'data', 'db.json');

// Helper to read local JSON DB
const readLocalDB = () => {
  try {
    if (!fs.existsSync(LOCAL_DB_PATH)) {
      return { settings: {}, founder: {}, manager: {}, notices: [], admissionSettings: {} };
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
    if (!parsed.enquiries) {
        parsed.enquiries = [];
    }
    return parsed;
  } catch (err) {
    console.error('Error reading local JSON database:', err);
    return { settings: {}, founder: {}, manager: {}, notices: [], admissionSettings: {}, enquiries: [] };
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
    if (isMongoConnected()) {
      let settings = await Settings.findOne();
      if (!settings) {
        settings = new Settings(updateData);
      } else {
        Object.assign(settings, updateData);
      }
      await settings.save();
      return settings;
    } else {
      const db = readLocalDB();
      db.settings = { ...db.settings, ...updateData };
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

  isMongoConnected() {
    return isMongoConnected();
  },

  isValidObjectId(id: string) {
    return mongoose.Types.ObjectId.isValid(id);
  }
};
