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
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');

const app = initializeApp({
  credential: cert({
    projectId: env.FIREBASE_PROJECT_ID,
    clientEmail: env.FIREBASE_CLIENT_EMAIL,
    privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  })
});

const db = getFirestore(app);
const auth = getAuth(app);

async function test() {
  try {
    console.log("Testing Create Custom Token...");
    const token = await auth.createCustomToken("test-uid-123");
    console.log("Create Custom Token: SUCCESS (Token starts with: " + token.substring(0, 15) + "...)");
  } catch (err) {
    console.error("ERROR DETECTED:", err);
  }
}

test();
