const fs = require('fs');

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter(Boolean)
    .map(line => {
      const i = line.indexOf('=');
      if (i === -1) return [null, null];
      return [line.substring(0, i).trim(), line.substring(i + 1).replace(/^"|"$/g, '').trim()];
    })
    .filter(([k]) => k)
);

const { initializeApp, cert } = require('firebase-admin/app');
const { getDatabase } = require('firebase-admin/database');

const app = initializeApp({
  credential: cert({
    projectId: env.FIREBASE_PROJECT_ID,
    clientEmail: env.FIREBASE_CLIENT_EMAIL,
    privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  }),
  databaseURL: `https://${env.FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`
});

const db = getDatabase(app);

async function test() {
  try {
    console.log("Testing RTDB Write...");
    await db.ref('test/ping').set({ ts: Date.now() });
    console.log("RTDB Write: SUCCESS");
    process.exit(0);
  } catch (err) {
    console.error("RTDB ERROR DETECTED:", err);
    process.exit(1);
  }
}

test();
