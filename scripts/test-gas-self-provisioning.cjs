#!/usr/bin/env node
/**
 * test-gas-self-provisioning.cjs
 * 
 * Invokes live GAS Webhook to trigger setupMediaRelaySheets()
 * and verifies that the control plane tabs and headers are bootstrapped.
 */

'use strict';

const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbxVgOoowYwpQBu__Eok4Is_DCy1vxOzrWy7SfVysed5LIcceC773cRDDaCAa7SVkrRraw/exec';
const AUTHORIZED_EMAIL = 'goldenage399@gmail.com';

async function main() {
  console.log('🚀 Triggering live Google Apps Script self-provisioning bootstrap...');
  console.log(`📡 Target URL: ${WEBHOOK_URL}`);
  console.log(`👤 Authorized Email: ${AUTHORIZED_EMAIL}`);

  const payload = {
    action: 'SETUP_SHEETS',
    uploaderEmail: AUTHORIZED_EMAIL
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

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('Failed to parse response as JSON');
      process.exit(1);
    }

    if (data.success) {
      console.log('✅ SUCCESS! Google Spreadsheet control tabs provisioned and formatted.');
      console.log('Result:', JSON.stringify(data, null, 2));
      process.exit(0);
    } else {
      console.error('❌ FAILED: Response indicates failure:', data);
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Request error:', err.message);
    process.exit(1);
  }
}

main();
