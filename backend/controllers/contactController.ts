import nodemailer from 'nodemailer';
import { Request, Response } from 'express';
import { storage } from '../utils/storage';

const normalizeString = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

export const createContactMessage = async (req: Request, res: Response) => {
  try {
    if (!storage.isMongoConnected()) {
      return res.status(503).json({ message: 'Service Unavailable: MongoDB is not connected.' });
    }

    const name = normalizeString(req.body?.name);
    const email = normalizeString(req.body?.email).toLowerCase();
    const phone = normalizeString(req.body?.phone);
    const subject = normalizeString(req.body?.subject) || 'General Enquiry';
    const message = normalizeString(req.body?.message);

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required.' });
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }

    const now = new Date();
    const payload = {
      name,
      email,
      phone,
      subject,
      message,
      status: 'New',
      timestamp: now
    };

    await storage.createContactMessage(payload);

    const smtpConfigured = Boolean(
      process.env.SMTP_HOST &&
      process.env.SMTP_EMAIL &&
      process.env.SMTP_PASSWORD &&
      process.env.COLLEGE_EMAIL
    );

    if (smtpConfigured) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
          }
        });

        await transporter.sendMail({
          from: process.env.SMTP_EMAIL,
          to: process.env.COLLEGE_EMAIL,
          subject: `Contact Form: ${subject}`,
          html: `
            <h1>New Contact Form Submission</h1>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br />')}</p>
            <p><strong>Submitted:</strong> ${now.toLocaleString('en-IN')}</p>
          `
        });
      } catch (error) {
        console.error('SMTP notification failed for contact form');
      }
    } else {
      console.warn('SMTP not configured. Skipping email notification for contact form.');
    }

    res.status(201).json({ message: 'Message submitted successfully' });
  } catch (error) {
    console.error('Error submitting contact message:', error);
    res.status(500).json({ message: 'Error submitting contact message' });
  }
};
