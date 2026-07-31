import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { DEFAULT_CMS_DATA } from './src/data/defaultCmsData.js';
import { CMSData } from './src/types.js';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));

// Data file paths
const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'registrations.json');
const CMS_FILE = path.join(DATA_DIR, 'cmsContent.json');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');

// Ensure data and uploads directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Serve uploaded image assets statically
app.use('/uploads', express.static(UPLOADS_DIR));

interface RegistrationRecord {
  id: string;
  createdAt: string;
  languageSubmitted: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  calculatedAge: number;
  phone: string;
  email: string;
  religion?: string;
  education: string;
  occupation: string;
  district: string;
  taluka: string;
  gramPanchayat: string;
  village: string;
  pincode?: string;
  address?: string;
  participatedInCommunity: boolean;
  contestedElectionBefore: boolean;
  whyBecomeWardMember: string;
  contributionPlan: string;
  declarationAccepted: boolean;
  browserInfo?: string;
}

// Helper: Read Registrations
function getRegistrations(): RegistrationRecord[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading registrations file:', err);
  }
  return [];
}

// Helper: Save Registrations
function saveRegistrations(regs: RegistrationRecord[]) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(regs, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing registrations file:', err);
  }
}

// Helper: Read CMS Data
function getCmsData(): CMSData {
  try {
    if (fs.existsSync(CMS_FILE)) {
      const data = fs.readFileSync(CMS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading CMS content file:', err);
  }
  return DEFAULT_CMS_DATA;
}

// Helper: Save CMS Data
function saveCmsData(cmsData: CMSData) {
  try {
    fs.writeFileSync(CMS_FILE, JSON.stringify(cmsData, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing CMS content file:', err);
  }
}

// Initialize seed data if empty
if (!fs.existsSync(DATA_FILE) || getRegistrations().length === 0) {
  const sampleRegistrations: RegistrationRecord[] = [
    {
      id: "NGN-2026-8A91",
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      languageSubmitted: "kn",
      firstName: "ರಮೇಶ್ (Ramesh)",
      lastName: "ಗೌಡ (Gowda)",
      gender: "Male",
      dateOfBirth: "1996-05-14",
      calculatedAge: 30,
      phone: "9845123456",
      email: "ramesh.gowda@example.com",
      religion: "Hindu",
      education: "Graduate / Bachelor's Degree",
      occupation: "Agriculture / Farming",
      district: "Mandya",
      taluka: "Maddur",
      gramPanchayat: "Koppa Grama Panchayat",
      village: "Koppa",
      pincode: "571425",
      address: "Main Road, Koppa Village",
      participatedInCommunity: true,
      contestedElectionBefore: false,
      whyBecomeWardMember: "ನಮ್ಮ ಗ್ರಾಮದ ನೀರು ಮತ್ತು ರಸ್ತೆ ಸಮಸ್ಯೆಗಳನ್ನು ಪರಿಹರಿಸಿ ಯುವ ನಾಯಕತ್ವ ಬೆಳೆಸಲು (To solve water and road issues and build youth leadership)",
      contributionPlan: "ಸ್ವಚ್ಛತೆ ಮತ್ತು ಹನಿ ನೀರಾವರಿ ಯೋಜನೆಗಳನ್ನು ಗ್ರಾಮ ಸಭೆಯಲ್ಲಿ ತರಲು ನಿರ್ಧರಿಸಿದ್ದೇನೆ.",
      declarationAccepted: true,
      browserInfo: "Mozilla/5.0 (Linux; Android)"
    },
    {
      id: "NGN-2026-4F20",
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      languageSubmitted: "en",
      firstName: "Sunitha",
      lastName: "Patil",
      gender: "Female",
      dateOfBirth: "1998-09-22",
      calculatedAge: 27,
      phone: "9900112233",
      email: "sunitha.patil@example.com",
      religion: "Hindu",
      education: "Post Graduate / Master's Degree",
      occupation: "Social Worker / Community Leader",
      district: "Dharwad",
      taluka: "Kalghatgi",
      gramPanchayat: "Mishrikoti GP",
      village: "Mishrikoti",
      pincode: "581120",
      address: "Near Govt School, Mishrikoti",
      participatedInCommunity: true,
      contestedElectionBefore: false,
      whyBecomeWardMember: "To empower rural women, improve Anganwadi centers and build transparent Ward Sabhas.",
      contributionPlan: "Conduct digital Ward Sabhas every month and track developmental funds.",
      declarationAccepted: true,
      browserInfo: "Chrome 120.0 (Windows)"
    }
  ];
  saveRegistrations(sampleRegistrations);
}

if (!fs.existsSync(CMS_FILE)) {
  saveCmsData(DEFAULT_CMS_DATA);
}

// ADMIN AUTH CHECK
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

function isAuth(req: express.Request): boolean {
  const authHeader = req.headers['authorization'] || req.headers['x-admin-password'];
  if (!authHeader) return false;
  const pass = String(authHeader).replace('Bearer ', '').trim();
  return pass === ADMIN_PASSWORD;
}

// ==================== PUBLIC API ENDPOINTS ====================

// API: Get Dynamic CMS Content
app.get('/api/cms', (_req, res) => {
  const cms = getCmsData();
  const regs = getRegistrations();
  
  // Compute live stats if autoCount is enabled
  const computedStats = { ...cms.stats };
  if (cms.stats.autoCountRegistrations) {
    const districtsSet = new Set(regs.map(r => r.district));
    computedStats.villagesCovered = Math.max(cms.stats.villagesCovered, regs.length * 12);
    computedStats.activeParticipants = Math.max(cms.stats.activeParticipants, regs.length * 45);
  }

  return res.json({
    ...cms,
    computedStats,
    totalRegistrationsCount: regs.length
  });
});

// API: Get Dynamic Dropdowns
app.get('/api/dropdowns', (_req, res) => {
  const cms = getCmsData();
  return res.json(cms.dropdowns || DEFAULT_CMS_DATA.dropdowns);
});

// API: Register Prospective Ward Member
app.post('/api/register', (req, res) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      gender,
      dateOfBirth,
      phone,
      email,
      religion,
      education,
      occupation,
      district,
      taluka,
      gramPanchayat,
      village,
      pincode,
      address,
      participatedInCommunity,
      contestedElectionBefore,
      whyBecomeWardMember,
      contributionPlan,
      declarationAccepted,
      languageSubmitted
    } = req.body;

    // Validation
    if (!firstName || !lastName || !gender || !dateOfBirth || !phone || !email || !district || !village) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Phone validation
    const cleanPhone = String(phone).replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      return res.status(400).json({ error: "Phone number must be exactly 10 digits" });
    }

    // Age calculation
    const dob = new Date(dateOfBirth);
    if (isNaN(dob.getTime())) {
      return res.status(400).json({ error: "Invalid date of birth" });
    }

    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    if (age < 18) {
      return res.status(400).json({ 
        error: "You must be at least 18 years old to register as a prospective Ward Member." 
      });
    }

    if (!declarationAccepted) {
      return res.status(400).json({ error: "You must agree to the declaration to submit your application." });
    }

    const randomTag = Math.random().toString(36).substring(2, 6).toUpperCase();
    const newId = `NGN-2026-${randomTag}`;

    const newRecord: RegistrationRecord = {
      id: newId,
      createdAt: new Date().toISOString(),
      languageSubmitted: languageSubmitted || 'kn',
      firstName: String(firstName).trim(),
      middleName: middleName ? String(middleName).trim() : undefined,
      lastName: String(lastName).trim(),
      gender: String(gender),
      dateOfBirth: String(dateOfBirth),
      calculatedAge: age,
      phone: cleanPhone,
      email: String(email).trim().toLowerCase(),
      religion: religion ? String(religion) : undefined,
      education: String(education),
      occupation: String(occupation),
      district: String(district),
      taluka: String(taluka || ''),
      gramPanchayat: String(gramPanchayat || ''),
      village: String(village).trim(),
      pincode: pincode ? String(pincode).trim() : undefined,
      address: address ? String(address).trim() : undefined,
      participatedInCommunity: Boolean(participatedInCommunity),
      contestedElectionBefore: Boolean(contestedElectionBefore),
      whyBecomeWardMember: String(whyBecomeWardMember || ''),
      contributionPlan: String(contributionPlan || ''),
      declarationAccepted: true,
      browserInfo: req.headers['user-agent'] || 'Web Browser'
    };

    const currentRecords = getRegistrations();
    currentRecords.unshift(newRecord);
    saveRegistrations(currentRecords);

    return res.json({
      success: true,
      message: "Registration successful",
      registration: newRecord
    });
  } catch (err: any) {
    console.error("Error in /api/register:", err);
    return res.status(500).json({ error: "Server error registering applicant" });
  }
});

// ==================== ADMIN API ENDPOINTS ====================

// API: Admin Login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    return res.json({ success: true, token: ADMIN_PASSWORD });
  }
  return res.status(401).json({ success: false, error: "Invalid admin password" });
});

// API: Update Dynamic CMS Content (Admin)
app.post('/api/cms', (req, res) => {
  if (!isAuth(req)) {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  try {
    const updatedCms = req.body as CMSData;
    if (!updatedCms || typeof updatedCms !== 'object') {
      return res.status(400).json({ error: "Invalid CMS data payload" });
    }

    saveCmsData(updatedCms);
    return res.json({ success: true, cms: updatedCms });
  } catch (err: any) {
    console.error("Error saving CMS data:", err);
    return res.status(500).json({ error: "Failed to update CMS content" });
  }
});

// API: Image / Asset Upload (Admin)
app.post('/api/admin/image-upload', (req, res) => {
  if (!isAuth(req)) {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  try {
    const { base64Data, fileName } = req.body;
    if (!base64Data) {
      return res.status(400).json({ error: "No base64 data provided" });
    }

    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: "Invalid base64 format" });
    }

    const fileBuffer = Buffer.from(matches[2], 'base64');
    const ext = fileName ? path.extname(fileName) : '.jpg';
    const cleanExt = ext || '.jpg';
    const uniqueFileName = `upload_${Date.now()}_${Math.random().toString(36).substring(2, 6)}${cleanExt}`;
    const filePath = path.join(UPLOADS_DIR, uniqueFileName);

    fs.writeFileSync(filePath, fileBuffer);

    const fileUrl = `/uploads/${uniqueFileName}`;
    return res.json({ success: true, url: fileUrl });
  } catch (err: any) {
    console.error("Error uploading image asset:", err);
    return res.status(500).json({ error: "Failed to save image asset" });
  }
});

// API: Get Registrations (Admin)
app.get('/api/admin/registrations', (req, res) => {
  if (!isAuth(req)) {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  let records = getRegistrations();
  const search = String(req.query.search || '').toLowerCase().trim();
  const district = String(req.query.district || '').trim();
  const education = String(req.query.education || '').trim();
  const gender = String(req.query.gender || '').trim();

  if (search) {
    records = records.filter(r => 
      `${r.firstName} ${r.middleName || ''} ${r.lastName}`.toLowerCase().includes(search) ||
      r.phone.includes(search) ||
      r.district.toLowerCase().includes(search) ||
      r.village.toLowerCase().includes(search) ||
      r.id.toLowerCase().includes(search)
    );
  }

  if (district && district !== 'All') {
    records = records.filter(r => r.district.toLowerCase().includes(district.toLowerCase()));
  }

  if (education && education !== 'All') {
    records = records.filter(r => r.education === education);
  }

  if (gender && gender !== 'All') {
    records = records.filter(r => r.gender === gender);
  }

  return res.json({
    total: records.length,
    registrations: records
  });
});

// API: Edit Registration (Admin)
app.put('/api/admin/registrations/:id', (req, res) => {
  if (!isAuth(req)) {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  const targetId = req.params.id;
  let records = getRegistrations();
  const index = records.findIndex(r => r.id === targetId);

  if (index === -1) {
    return res.status(404).json({ error: "Registration record not found" });
  }

  const existing = records[index];
  const updatedRecord = {
    ...existing,
    ...req.body,
    id: existing.id,
    createdAt: existing.createdAt
  };

  records[index] = updatedRecord;
  saveRegistrations(records);

  return res.json({ success: true, registration: updatedRecord });
});

// API: Stats (Admin)
app.get('/api/admin/stats', (req, res) => {
  if (!isAuth(req)) {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  const records = getRegistrations();
  const todayStr = new Date().toISOString().split('T')[0];

  const todayCount = records.filter(r => r.createdAt.startsWith(todayStr)).length;
  
  const districtCounts: Record<string, number> = {};
  const genderCounts: Record<string, number> = {};
  const educationCounts: Record<string, number> = {};

  records.forEach(r => {
    districtCounts[r.district] = (districtCounts[r.district] || 0) + 1;
    genderCounts[r.gender] = (genderCounts[r.gender] || 0) + 1;
    educationCounts[r.education] = (educationCounts[r.education] || 0) + 1;
  });

  return res.json({
    total: records.length,
    todayCount,
    districtCounts,
    genderCounts,
    educationCounts
  });
});

// API: Delete Registration
app.delete('/api/admin/registrations/:id', (req, res) => {
  if (!isAuth(req)) {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  const targetId = req.params.id;
  let records = getRegistrations();
  const filtered = records.filter(r => r.id !== targetId);

  if (filtered.length === records.length) {
    return res.status(404).json({ error: "Registration record not found" });
  }

  saveRegistrations(filtered);
  return res.json({ success: true, message: "Registration record deleted successfully" });
});

// API: Export CSV
app.get('/api/admin/export/csv', (req, res) => {
  if (!isAuth(req)) {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  const records = getRegistrations();
  const headers = [
    "Registration ID",
    "Submitted Date",
    "First Name",
    "Middle Name",
    "Last Name",
    "Gender",
    "DOB",
    "Age",
    "Phone",
    "Email",
    "Religion",
    "Qualification",
    "Occupation",
    "District",
    "Taluka",
    "Gram Panchayat",
    "Village",
    "Pincode",
    "Address",
    "Participated in Community",
    "Contested Election",
    "Why Ward Member",
    "Contribution Plan"
  ];

  let csvContent = headers.join(',') + '\n';

  records.forEach(r => {
    const row = [
      `"${r.id}"`,
      `"${r.createdAt}"`,
      `"${r.firstName.replace(/"/g, '""')}"`,
      `"${(r.middleName || '').replace(/"/g, '""')}"`,
      `"${r.lastName.replace(/"/g, '""')}"`,
      `"${r.gender}"`,
      `"${r.dateOfBirth}"`,
      `"${r.calculatedAge}"`,
      `"${r.phone}"`,
      `"${r.email}"`,
      `"${r.religion || ''}"`,
      `"${r.education.replace(/"/g, '""')}"`,
      `"${r.occupation.replace(/"/g, '""')}"`,
      `"${r.district.replace(/"/g, '""')}"`,
      `"${r.taluka.replace(/"/g, '""')}"`,
      `"${r.gramPanchayat.replace(/"/g, '""')}"`,
      `"${r.village.replace(/"/g, '""')}"`,
      `"${r.pincode || ''}"`,
      `"${(r.address || '').replace(/"/g, '""')}"`,
      `"${r.participatedInCommunity ? 'Yes' : 'No'}"`,
      `"${r.contestedElectionBefore ? 'Yes' : 'No'}"`,
      `"${(r.whyBecomeWardMember || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      `"${(r.contributionPlan || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`
    ];
    csvContent += row.join(',') + '\n';
  });

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="namma_grama_nayaka_registrations_${Date.now()}.csv"`);
  return res.send(csvContent);
});

// API: Export JSON
app.get('/api/admin/export/json', (req, res) => {
  if (!isAuth(req)) {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  const records = getRegistrations();
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="namma_grama_nayaka_registrations_${Date.now()}.json"`);
  return res.send(JSON.stringify(records, null, 2));
});

// Vite Middleware & Static Server
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Namma Grama Nayaka Dynamic Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
