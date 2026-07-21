import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';
import Settings from '../models/Settings.js';

export const appendToGoogleSheet = async (data: any[]) => {
  try {
    const settings = await Settings.findOne();
    if (!settings || !settings.isGoogleSheetsEnabled || !settings.googleSheetsId) {
      return;
    }

    const auth = new GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client as any });

    const spreadsheetId = settings.googleSheetsId;
    const range = 'Sheet1!A1'; // Adjust as needed

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [data],
      },
    });

    console.log('Google Sheets append completed.');
  } catch {
    console.error('Error appending data to Google Sheets.');
  }
};
