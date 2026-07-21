import { Request, Response } from 'express';
import { storage } from '../utils/storage';
import nodemailer from 'nodemailer';

export const createEnquiry = async (req: Request, res: Response) => {
  try {
    const { fullName, mobileNumber, email, program, highestQualification, preferredCounselling, query } = req.body;

    // Validate fields
    if (!fullName || !mobileNumber || !email || !program || !highestQualification || !preferredCounselling) {
      return res.status(400).json({ message: 'All required fields must be filled.' });
    }

    // Format date and time
    const now = new Date();
    const date = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    const time = now.toLocaleTimeString('en-IN', { hour: 'numeric', minute: 'numeric', hour12: true });

    const enquiryData = {
      fullName,
      mobileNumber,
      email,
      program,
      highestQualification,
      preferredCounselling,
      query,
      date,
      time,
      timestamp: now
    };

    await storage.createEnquiry(enquiryData);

    // 1. Google Sheet Integration
    try {
        const { appendToGoogleSheet } = await import('../utils/googleSheets.js');
        await appendToGoogleSheet([
            date,
            time,
            fullName,
            mobileNumber,
            email,
            program,
            highestQualification,
            preferredCounselling,
            query || 'N/A',
            'New',
            now.toISOString()
        ]);
    } catch (e) {
        console.error('Google Sheets integration failed');
    }

    // 2. Email Notification
    const smtpConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD && process.env.COLLEGE_EMAIL);

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
                subject: 'New Admission Enquiry Received',
                html: `
                    <h1>New Admission Enquiry</h1>
                    <p><strong>Student Name:</strong> ${fullName}</p>
                    <p><strong>Mobile Number:</strong> ${mobileNumber}</p>
                    <p><strong>Email Address:</strong> ${email}</p>
                    <p><strong>Program:</strong> ${program}</p>
                    <p><strong>Highest Qualification:</strong> ${highestQualification}</p>
                    <p><strong>Preferred Counselling:</strong> ${preferredCounselling}</p>
                    <p><strong>Query:</strong> ${query || 'N/A'}</p>
                    <p><strong>Date:</strong> ${date}</p>
                    <p><strong>Time:</strong> ${time}</p>
                `
            });
        } catch (e) {
            console.error('SMTP notification failed');
        }
    } else {
        console.warn('SMTP not configured. Skipping email notification for admission enquiry.');
    }

    res.status(201).json({ message: 'Enquiry submitted successfully' });
  } catch (error) {
    console.error('Error submitting enquiry:', error);
    res.status(500).json({ message: 'Error submitting enquiry' });
  }
};

export const getAllEnquiries = async (req: Request, res: Response) => {
    try {
        const enquiries = await storage.getEnquiries();
        res.status(200).json(enquiries);
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    res.status(500).json({ message: 'Error fetching enquiries' });
  }
};

export const updateEnquiryStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updatedEnquiry = await storage.updateEnquiryStatus(id, status);
        res.status(200).json(updatedEnquiry);
  } catch (error) {
    console.error('Error updating enquiry:', error);
    res.status(500).json({ message: 'Error updating enquiry' });
  }
};
