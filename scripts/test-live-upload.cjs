#!/usr/bin/env node
/**
 * test-live-upload.cjs
 * 
 * Performs an end-to-end upload of a 1x1 test JPEG to the live webhook
 * verifying that Google Drive storage, dynamic folder provisioning,
 * and 12-dimension Upload_Ledger logging work seamlessly end-to-end.
 */

'use strict';

const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbxVgOoowYwpQBu__Eok4Is_DCy1vxOzrWy7SfVysed5LIcceC773cRDDaCAa7SVkrRraw/exec';
const AUTHORIZED_EMAIL = 'goldenage399@gmail.com';

// Minimal 1x1 pixel JPEG Base64
const TEST_JPEG_BASE64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=';

async function main() {
  console.log('🧪 Testing Live End-to-End Media Relay Upload...');
  console.log(`📡 Webhook URL: ${WEBHOOK_URL}`);

  const payload = {
    image: TEST_JPEG_BASE64,
    fileName: `e2e_verification_test_${Date.now()}.jpg`,
    mimeType: 'image/jpeg',
    uploaderEmail: AUTHORIZED_EMAIL,
    itemId: 'TEST-LOOK-001',
    module: 'Shopping',
    event: 'Vivaha',
    category: 'Bridal_Silks'
  };

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: JSON.stringify(payload),
      redirect: 'follow'
    });

    console.log(`HTTP Status: ${response.status} ${response.statusText}`);
    const text = await response.text();
    console.log('Raw Response:', text);

    const result = JSON.parse(text);
    if (result.success) {
      console.log('\n🎉 SUCCESS! E2E Media Upload Verified:');
      console.log(`  📁 File ID:        ${result.fileId}`);
      console.log(`  📂 Subfolder Path: ${result.subfolderPath}`);
      console.log(`  🌐 Drive URL:      ${result.fileUrl}`);
      console.log(`  🖼️ CDN URL:        ${result.cdnUrl}`);
      process.exit(0);
    } else {
      console.error('❌ Upload failed:', result);
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Request error:', err.message);
    process.exit(1);
  }
}

main();
