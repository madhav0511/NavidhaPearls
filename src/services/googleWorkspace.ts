import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  User,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App singleton
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Desired Google Workspace Scopes
export const WORKSPACE_SCOPES = [
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file',
];

const provider = new GoogleAuthProvider();
WORKSPACE_SCOPES.forEach((scope) => provider.addScope(scope));
// Enable prompt to allow choosing navidha.pearls@gmail.com
provider.setCustomParameters({
  prompt: 'select_account',
});

const TOKEN_KEY = 'navidha_workspace_access_token';
let isSigningIn = false;
let cachedAccessToken: string | null =
  typeof window !== 'undefined'
    ? sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY)
    : null;
let currentUser: User | null = null;

export interface BookingDetails {
  bookingRef: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  occasion?: string;
  notes?: string;
  serviceTitle: string;
  serviceDescription: string;
  dateDisplay: string;
  dateRaw: string; // YYYY-MM-DD
  timeDisplay: string; // e.g. "11:00 AM" or "02:30 PM"
  locationName: string;
  locationAddress: string;
}

export interface AutomationResult {
  action1Email: { success: boolean; messageId?: string; error?: string };
  action2Calendar: { success: boolean; eventId?: string; htmlLink?: string; error?: string };
  action3Sheet: { success: boolean; sheetId?: string; spreadsheetUrl?: string; error?: string };
}

/**
 * Initialize Firebase Auth listener.
 * Maintains in-memory token lifecycle.
 */
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    currentUser = user;
    const token =
      cachedAccessToken ||
      (typeof window !== 'undefined'
        ? sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY)
        : null);

    console.log('[GoogleWorkspace Auth] initAuth onAuthStateChanged:', {
      userEmail: user?.email || null,
      tokenFound: !!token,
    });

    if (user && token) {
      cachedAccessToken = token;
      if (onAuthSuccess) onAuthSuccess(user, token);
    } else {
      if (!isSigningIn) {
        if (onAuthFailure) onAuthFailure();
      }
    }
  });
};

/**
 * Sign in with Google Popup and retrieve OAuth Access Token with Workspace scopes
 */
export const googleSignIn = async (): Promise<{ user: User; accessToken: string }> => {
  try {
    isSigningIn = true;
    console.log('[GoogleWorkspace Auth] Opening Google Sign-In popup with Workspace scopes...');
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to retrieve access token with required Workspace permissions.');
    }
    cachedAccessToken = credential.accessToken;
    if (typeof window !== 'undefined' && credential.accessToken) {
      sessionStorage.setItem(TOKEN_KEY, credential.accessToken);
      localStorage.setItem(TOKEN_KEY, credential.accessToken);
    }
    currentUser = result.user;
    console.log('[GoogleWorkspace Auth] Sign-In successful for:', result.user.email);
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('[GoogleWorkspace Auth] Google Workspace sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  if (cachedAccessToken) {
    console.log('[GoogleWorkspace Auth] getAccessToken: Using in-memory cached token');
    return cachedAccessToken;
  }
  if (typeof window !== 'undefined') {
    const token = sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
    if (token) {
      cachedAccessToken = token;
      console.log('[GoogleWorkspace Auth] getAccessToken: Retrieved token from storage');
      return token;
    }
  }
  console.log('[GoogleWorkspace Auth] getAccessToken: No token available in memory or storage');
  return null;
};

export const getCurrentUser = (): User | null => {
  return currentUser;
};

export const logout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
  currentUser = null;
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(TOKEN_KEY);
  }
};

/**
 * Helper to encode RFC 2822 email message in base64url for Gmail API
 */
function createBase64MimeMessage(
  to: string,
  from: string,
  subject: string,
  htmlBody: string
): string {
  const utf8Subject = `=?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`;
  const messageParts = [
    `From: Navidha Pearls Atelier <${from}>`,
    `To: ${to}`,
    `Reply-To: ${from}`,
    `Subject: ${utf8Subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: 7bit',
    '',
    htmlBody,
  ];
  const message = messageParts.join('\r\n');
  return btoa(unescape(encodeURIComponent(message)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Action 1: Auto send confirmation email to customer through navidha.pearls@gmail.com
 */
export async function sendCustomerConfirmationEmail(
  token: string,
  details: BookingDetails
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const senderEmail = auth.currentUser?.email || 'navidha.pearls@gmail.com';
    const atelierEmail = 'navidha.pearls@gmail.com';
    const emailSubject = `Navidha Consultation Confirmation: ${details.serviceTitle} [Ref: ${details.bookingRef}]`;

    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fbf9f5; margin: 0; padding: 24px; color: #14202e; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5ded5; border-radius: 4px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.04); }
          .header { background: #14202e; color: #f8f1e4; padding: 32px 28px; text-align: center; }
          .brand { font-size: 24px; letter-spacing: 0.25em; text-transform: uppercase; font-family: Georgia, serif; margin: 0; font-weight: normal; }
          .subbrand { font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #c8a45d; margin-top: 6px; }
          .content { padding: 32px 28px; }
          .greeting { font-size: 18px; font-weight: 600; margin-bottom: 12px; }
          .card { background: #fbf9f5; border: 1px solid #eae3d9; padding: 20px; border-radius: 2px; margin: 24px 0; }
          .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0ebe3; font-size: 13px; }
          .row:last-child { border-bottom: none; }
          .label { color: #777777; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em; }
          .val { font-weight: 600; color: #14202e; }
          .footer { background: #f4efe8; padding: 20px 28px; text-align: center; font-size: 12px; color: #667383; line-height: 1.6; }
          .gold-btn { display: inline-block; background: #c8a45d; color: #14202e; text-decoration: none; padding: 12px 24px; font-size: 12px; font-weight: bold; letter-spacing: 0.1em; text-transform: uppercase; margin-top: 16px; border-radius: 2px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="brand">NAVIDHA</h1>
            <div class="subbrand">FINE JEWELRY &amp; BESPOKE PEARLS</div>
          </div>
          <div class="content">
            <div class="greeting">Dear ${details.firstName} ${details.lastName},</div>
            <p style="font-size: 14px; line-height: 1.6; color: #444444;">
              Thank you for reserving a bespoke jewelry appointment with Navidha Pearls Atelier. Our Master Jeweler &amp; Senior Concierge have received your request and look forward to presenting our curated heirloom suites.
            </p>
            
            <div class="card">
              <div class="row">
                <span class="label">Booking Reference</span>
                <span class="val" style="color: #9a7a3e; font-family: monospace; font-size: 14px;">${details.bookingRef}</span>
              </div>
              <div class="row">
                <span class="label">Curated Experience</span>
                <span class="val">${details.serviceTitle}</span>
              </div>
              <div class="row">
                <span class="label">Date &amp; Time</span>
                <span class="val">${details.dateDisplay} at ${details.timeDisplay} IST</span>
              </div>
              <div class="row">
                <span class="label">Location / Format</span>
                <span class="val">${details.locationName}</span>
              </div>
              <div class="row">
                <span class="label">Venue Coordinates</span>
                <span class="val" style="font-weight: normal; font-size: 12px;">${details.locationAddress}</span>
              </div>
              ${details.occasion ? `
              <div class="row">
                <span class="label">Occasion</span>
                <span class="val">${details.occasion}</span>
              </div>` : ''}
              ${details.notes ? `
              <div class="row">
                <span class="label">Custom Notes</span>
                <span class="val" style="font-weight: normal; font-size: 12px;">${details.notes}</span>
              </div>` : ''}
            </div>

            <p style="font-size: 13px; line-height: 1.6; color: #555555;">
              A formal calendar invite has also been scheduled directly on our calendar. Should you require bespoke modifications or personal transportation assistance to our Hyderabad atelier, please reply directly to this email or contact our Concierge Line at <strong>+91 90000 22840</strong>.
            </p>
          </div>
          <div class="footer">
            <strong>Navidha Fine Pearls Atelier</strong><br>
            G20, Village Pointe, Manikonda, Hyderabad 500089, India<br>
            Direct: <a href="mailto:${atelierEmail}" style="color: #9a7a3e;">${atelierEmail}</a>
          </div>
        </div>
      </body>
      </html>
    `;

    const raw = createBase64MimeMessage(details.email, senderEmail, emailSubject, htmlBody);

    console.log('[sendCustomerConfirmationEmail] Dispatching Gmail API call for recipient:', details.email);
    const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw }),
    });

    console.log('[sendCustomerConfirmationEmail] Gmail API response HTTP status:', res.status);

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      console.error('[sendCustomerConfirmationEmail] Gmail API failed:', errJson);
      throw new Error(errJson.error?.message || `Gmail API error (${res.status})`);
    }

    const resData = await res.json();
    console.log('[sendCustomerConfirmationEmail] Gmail successfully sent! Message ID:', resData.id);
    return { success: true, messageId: resData.id };
  } catch (err: any) {
    console.error('[sendCustomerConfirmationEmail] Failed to send confirmation email via Gmail API:', err);
    return { success: false, error: err.message || 'Error sending email' };
  }
}

/**
 * Action 2: Auto create navidha.pearls@gmail.com Google Calendar entry with meeting details
 */
export async function createNavidhaCalendarEvent(
  token: string,
  details: BookingDetails
): Promise<{ success: boolean; eventId?: string; htmlLink?: string; error?: string }> {
  try {
    // Parse time into ISO with +05:30 offset
    // timeDisplay is like "11:00 AM" or "02:30 PM"
    let hour = 11;
    let minute = 0;
    const timeMatch = details.timeDisplay.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (timeMatch) {
      let h = parseInt(timeMatch[1], 10);
      const m = parseInt(timeMatch[2], 10);
      const ampm = timeMatch[3].toUpperCase();
      if (ampm === 'PM' && h < 12) h += 12;
      if (ampm === 'AM' && h === 12) h = 0;
      hour = h;
      minute = m;
    }

    const pad = (n: number) => n.toString().padStart(2, '0');
    const startIso = `${details.dateRaw}T${pad(hour)}:${pad(minute)}:00+05:30`;

    // Consultation default duration: 45 minutes
    let endHour = hour;
    let endMinute = minute + 45;
    if (endMinute >= 60) {
      endHour += 1;
      endMinute -= 60;
    }
    const endIso = `${details.dateRaw}T${pad(endHour)}:${pad(endMinute)}:00+05:30`;

    const eventPayload = {
      summary: `Navidha Consultation: ${details.serviceTitle} - ${details.firstName} ${details.lastName}`,
      description: [
        `Navidha Luxury Jewelry Consultation`,
        `Reference ID: ${details.bookingRef}`,
        `Client: ${details.firstName} ${details.lastName}`,
        `Email: ${details.email}`,
        `Phone: ${details.phone}`,
        `Experience: ${details.serviceTitle}`,
        `Format / Location: ${details.locationName}`,
        `Address: ${details.locationAddress}`,
        details.occasion ? `Occasion: ${details.occasion}` : '',
        details.notes ? `Client Notes: ${details.notes}` : '',
        `\nOrganized by Navidha Pearls Atelier (navidha.pearls@gmail.com)`,
      ]
        .filter(Boolean)
        .join('\n'),
      location: details.locationAddress || details.locationName,
      start: {
        dateTime: startIso,
        timeZone: 'Asia/Kolkata',
      },
      end: {
        dateTime: endIso,
        timeZone: 'Asia/Kolkata',
      },
      attendees: [
        {
          email: 'navidha.pearls@gmail.com',
          displayName: 'Navidha Pearls Atelier',
        },
        ...(details.email
          ? [
              {
                email: details.email,
                displayName: `${details.firstName} ${details.lastName}`,
              },
            ]
          : []),
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 60 },
        ],
      },
    };

    console.log('[createNavidhaCalendarEvent] Dispatching Google Calendar API event create...');
    const res = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events?sendUpdates=all',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventPayload),
      }
    );

    console.log('[createNavidhaCalendarEvent] Calendar API response HTTP status:', res.status);

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      console.error('[createNavidhaCalendarEvent] Calendar API error response:', errJson);
      throw new Error(errJson.error?.message || `Calendar API error (${res.status})`);
    }

    const eventData = await res.json();
    console.log('[createNavidhaCalendarEvent] Calendar event successfully created! ID:', eventData.id, 'Link:', eventData.htmlLink);
    return {
      success: true,
      eventId: eventData.id,
      htmlLink: eventData.htmlLink,
    };
  } catch (err: any) {
    console.error('[createNavidhaCalendarEvent] Failed to create Calendar entry:', err);
    return { success: false, error: err.message || 'Error creating calendar entry' };
  }
}

/**
 * Action 3: Auto create or append to Google Sheet in Google Drive with customer details, date, time
 */
export async function appendConsultationToGoogleSheet(
  token: string,
  details: BookingDetails
): Promise<{ success: boolean; sheetId?: string; spreadsheetUrl?: string; error?: string }> {
  try {
    const spreadsheetTitle = 'Navidha Consultations Log';
    let spreadsheetId: string | null = null;
    let spreadsheetUrl: string | null = null;

    // 1. Search Google Drive for existing sheet by title
    const searchRes = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=name='${encodeURIComponent(
        spreadsheetTitle
      )}' and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false&fields=files(id,name,webViewLink)`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (searchRes.ok) {
      const searchData = await searchRes.json();
      if (searchData.files && searchData.files.length > 0) {
        spreadsheetId = searchData.files[0].id;
        spreadsheetUrl = searchData.files[0].webViewLink;
      }
    }

    // 2. If not found, create new spreadsheet with header
    if (!spreadsheetId) {
      const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          properties: {
            title: spreadsheetTitle,
          },
          sheets: [
            {
              properties: {
                title: 'Consultations',
                gridProperties: {
                  frozenRowCount: 1,
                },
              },
              data: [
                {
                  startRow: 0,
                  startColumn: 0,
                  rowData: [
                    {
                      values: [
                        { userEnteredValue: { stringValue: 'Logged At (IST)' } },
                        { userEnteredValue: { stringValue: 'Booking Reference' } },
                        { userEnteredValue: { stringValue: 'Customer First Name' } },
                        { userEnteredValue: { stringValue: 'Customer Last Name' } },
                        { userEnteredValue: { stringValue: 'Customer Email' } },
                        { userEnteredValue: { stringValue: 'Phone Number' } },
                        { userEnteredValue: { stringValue: 'Service / Experience' } },
                        { userEnteredValue: { stringValue: 'Date' } },
                        { userEnteredValue: { stringValue: 'Time Slot (IST)' } },
                        { userEnteredValue: { stringValue: 'Location / Format' } },
                        { userEnteredValue: { stringValue: 'Occasion' } },
                        { userEnteredValue: { stringValue: 'Special Notes / Preferences' } },
                        { userEnteredValue: { stringValue: 'Status' } },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        }),
      });

      if (!createRes.ok) {
        const errJson = await createRes.json().catch(() => ({}));
        throw new Error(errJson.error?.message || `Failed to create spreadsheet (${createRes.status})`);
      }

      const createData = await createRes.json();
      spreadsheetId = createData.spreadsheetId;
      spreadsheetUrl = createData.spreadsheetUrl;
    }

    // 3. Inspect actual sheet tab name from metadata to avoid hardcoded names
    let tabName = 'Consultations';
    const metaRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties.title`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (metaRes.ok) {
      const metaData = await metaRes.json();
      if (metaData.sheets && metaData.sheets.length > 0) {
        tabName = metaData.sheets[0].properties.title || 'Consultations';
      }
    }

    // 4. Append row with customer and appointment details
    const timestamp = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'medium',
    });

    const newRow = [
      timestamp,
      details.bookingRef,
      details.firstName,
      details.lastName,
      details.email,
      details.phone,
      details.serviceTitle,
      details.dateDisplay,
      details.timeDisplay,
      details.locationName,
      details.occasion || 'General Consultation',
      details.notes || 'None',
      'Confirmed',
    ];

    console.log('[appendConsultationToGoogleSheet] Appending row to Google Sheet ID:', spreadsheetId, 'Tab:', tabName);
    console.log('[appendConsultationToGoogleSheet] Row payload:', newRow);

    const appendRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
        tabName
      )}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          majorDimension: 'ROWS',
          values: [newRow],
        }),
      }
    );

    console.log('[appendConsultationToGoogleSheet] Sheets API response HTTP status:', appendRes.status);

    if (!appendRes.ok) {
      const errJson = await appendRes.json().catch(() => ({}));
      console.error('[appendConsultationToGoogleSheet] Sheets API append error:', errJson);
      throw new Error(errJson.error?.message || `Failed to append row to Sheets (${appendRes.status})`);
    }

    if (!spreadsheetUrl) {
      spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
    }

    console.log('[appendConsultationToGoogleSheet] Row successfully appended! Sheet URL:', spreadsheetUrl);
    return {
      success: true,
      sheetId: spreadsheetId || undefined,
      spreadsheetUrl: spreadsheetUrl || undefined,
    };
  } catch (err: any) {
    console.error('[appendConsultationToGoogleSheet] Failed to append to Google Sheet:', err);
    return { success: false, error: err.message || 'Error updating Google Sheet' };
  }
}

/**
 * Execute all 3 actions in parallel/sequence and report status
 */
export async function executeAllBookingActions(
  token: string,
  details: BookingDetails
): Promise<AutomationResult> {
  console.log('[executeAllBookingActions] 🚀 Initiating 3 Google Workspace actions for ref:', details.bookingRef);
  console.log('[executeAllBookingActions] Token preview:', token ? `${token.substring(0, 10)}...` : 'NONE');

  const [emailResult, calendarResult, sheetResult] = await Promise.all([
    sendCustomerConfirmationEmail(token, details),
    createNavidhaCalendarEvent(token, details),
    appendConsultationToGoogleSheet(token, details),
  ]);

  console.log('[executeAllBookingActions] ✅ Action 1 (Gmail send):', emailResult);
  console.log('[executeAllBookingActions] ✅ Action 2 (Calendar event):', calendarResult);
  console.log('[executeAllBookingActions] ✅ Action 3 (Sheets append):', sheetResult);

  return {
    action1Email: emailResult,
    action2Calendar: calendarResult,
    action3Sheet: sheetResult,
  };
}

/**
 * Check Google Calendar availability for navidha.pearls@gmail.com
 * Evaluates overlapping events on the target date and returns list of busy time slots
 */
export async function checkCalendarAvailability(
  token: string,
  dateStr: string,
  timeSlots: string[],
  calendarEmail = 'navidha.pearls@gmail.com'
): Promise<{ busySlots: string[]; checkedCalendar?: string; error?: string }> {
  try {
    // Construct day boundary in Indian Standard Time (IST / UTC+05:30)
    const timeMin = `${dateStr}T00:00:00+05:30`;
    const timeMax = `${dateStr}T23:59:59+05:30`;

    let checkedCalendar = calendarEmail;
    // Attempt to query the target navidha.pearls@gmail.com calendar
    let res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
        calendarEmail
      )}/events?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(
        timeMax
      )}&singleEvents=true&orderBy=startTime`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // If access to specified calendar address fails (e.g. 404 or unshared), query 'primary' calendar
    if (!res.ok && res.status !== 401) {
      checkedCalendar = 'primary';
      res = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(
          timeMin
        )}&timeMax=${encodeURIComponent(timeMax)}&singleEvents=true&orderBy=startTime`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      return {
        busySlots: [],
        error: errJson.error?.message || `Google Calendar API error (${res.status})`,
      };
    }

    const data = await res.json();
    const events: Array<{
      start?: { dateTime?: string; date?: string };
      end?: { dateTime?: string; date?: string };
      status?: string;
    }> = data.items || [];

    const activeEvents = events.filter((e) => e.status !== 'cancelled');
    const busySlots: string[] = [];

    for (const slot of timeSlots) {
      const [time, modifier] = slot.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      if (modifier === 'PM' && hours < 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;

      const pad = (n: number) => String(n).padStart(2, '0');
      // 45 minute default consultation slot
      const slotStartTime = new Date(`${dateStr}T${pad(hours)}:${pad(minutes)}:00+05:30`).getTime();
      const slotEndTime = slotStartTime + 45 * 60 * 1000;

      const bufferMs = 10 * 60 * 1000; // Mandatory 10-minute buffer between meetings

      const hasConflict = activeEvents.some((evt) => {
        if (!evt.start || !evt.end) return false;
        const evtStart = evt.start.dateTime
          ? new Date(evt.start.dateTime).getTime()
          : new Date(`${evt.start.date}T00:00:00+05:30`).getTime();
        const evtEnd = evt.end.dateTime
          ? new Date(evt.end.dateTime).getTime()
          : new Date(`${evt.end.date}T23:59:59+05:30`).getTime();

        // 1. Direct meeting overlap
        const isOverlap = slotStartTime < evtEnd && slotEndTime > evtStart;
        // 2. Mandatory 10-min buffer gap after meeting (e.g., meeting ends 10:30, slot must start >= 10:40)
        const isBufferAfter = slotStartTime >= evtEnd && slotStartTime < evtEnd + bufferMs;
        // 3. Mandatory 10-min buffer gap before meeting (e.g., slot must finish 10 min prior to meeting start)
        const isBufferBefore = slotEndTime <= evtStart && slotEndTime + bufferMs > evtStart;

        return isOverlap || isBufferAfter || isBufferBefore;
      });

      if (hasConflict) {
        busySlots.push(slot);
      }
    }

    return { busySlots, checkedCalendar };
  } catch (err: any) {
    console.error('Error querying Google Calendar availability:', err);
    return { busySlots: [], error: err.message || 'Error checking availability' };
  }
}
