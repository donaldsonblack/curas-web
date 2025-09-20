import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as QRCode from 'qrcode';

const API_BASE_URL = 'http://localhost:8080/api';
const QR_CODE_DIR = path.join(__dirname, '../frontend/public/qr');

// --- Mock Data Definitions ---

const PILOT_WARD = { name: 'Cardiology HDU' };

const ASSET_TYPES = [
  'Ventilator', 'Defibrillator', 'IV Pump', 'Patient Monitor', 'ECG Machine',
  'Anesthesia Machine', 'Infusion Pump', 'Syringe Pump', 'Dialysis Machine', 'Crash Cart'
];

const CHECKLIST_TEMPLATES = [
  {
    name: 'Daily Crash Cart Checklist',
    description: 'Daily check for the primary crash cart in the ward.',
    items: [
      { label: 'Defibrillator charged', required: true, item_type: 'YNN', item_order: 1 },
      { label: 'Airway supplies stocked', required: true, item_type: 'YNN', item_order: 2 },
      { label: 'Medication drawer sealed', required: true, item_type: 'YNN', item_order: 3 },
      { label: 'Suction functional', required: true, item_type: 'YNN', item_order: 4 },
    ]
  },
  {
    name: 'Weekly Defibrillator Check',
    description: 'Weekly functional and supply check for all defibrillators.',
    items: [
      { label: 'Device passes self-test', required: true, item_type: 'YNN', item_order: 1 },
      { label: 'Pads within expiry date', required: true, item_type: 'YNN', item_order: 2 },
      { label: 'Battery level > 50%', required: true, item_type: 'YNN', item_order: 3 },
    ]
  }
];

// --- Helper Functions ---

async function generateQrCode(assetTag: string, assetId: string) {
  const qrContent = JSON.stringify({ assetId, assetTag });
  const filePath = path.join(QR_CODE_DIR, `${assetTag}.png`);
  try {
    await QRCode.toFile(filePath, qrContent);
    console.log(`✅ Generated QR code for ${assetTag}`);
  } catch (err) {
    console.error(`❌ Failed to generate QR code for ${assetTag}:`, err);
  }
}

async function seed() {
  console.log('--- Starting Curas MVP Seeding Script ---');

  // 1. Ensure QR code directory exists
  if (!fs.existsSync(QR_CODE_DIR)) {
    console.log(`Creating QR code directory at: ${QR_CODE_DIR}`);
    fs.mkdirSync(QR_CODE_DIR, { recursive: true });
  }

  // 2. Create Pilot Ward
  // In a real run, we would make an API call here.
  // const { data: ward } = await axios.post(`${API_BASE_URL}/wards`, PILOT_WARD);
  const mockWard = { id: 'a1a1a1a1-b2b2-c3c3-d4d4-e5e5e5e5e5e5', ...PILOT_WARD };
  console.log(`✅ (Mock) Created Ward: ${mockWard.name} (ID: ${mockWard.id})`);

  // 3. Create Assets and QR Codes
  console.log('\n--- Seeding Assets ---');
  for (let i = 1; i <= 60; i++) {
    const isCritical = i <= 10;
    const assetTag = `CURAS-${String(i).padStart(4, '0')}`;
    const asset = {
      assetTag,
      type: ASSET_TYPES[i % ASSET_TYPES.length],
      location: `Bay ${String(i % 10 + 1).padStart(2, '0')}`,
      wardId: mockWard.id,
      critical: isCritical,
      status: 'AVAILABLE',
    };

    // const { data: createdAsset } = await axios.post(`${API_BASE_URL}/assets`, asset);
    const mockCreatedAsset = { id: `asset-${i}`, ...asset };
    console.log(`  - (Mock) Created Asset: ${asset.assetTag} (${asset.type})`);
    await generateQrCode(asset.assetTag, mockCreatedAsset.id);
  }

  // 4. Create Checklist Templates
  console.log('\n--- Seeding Checklist Templates ---');
  for (const template of CHECKLIST_TEMPLATES) {
    const payload = { ...template, wardIds: [mockWard.id] };
    // const { data: createdTemplate } = await axios.post(`${API_BASE_URL}/checklist-templates`, payload);
    console.log(`✅ (Mock) Created Checklist Template: ${template.name}`);
  }

  console.log('\n--- Seeding Complete ---');
}

seed().catch(error => {
  if (axios.isAxiosError(error)) {
    console.error('❌ A network error occurred. Is the backend API running?');
    console.error(`    Error: ${error.message}`);
  } else {
    console.error('An unexpected error occurred:', error);
  }
  process.exit(1);
});
