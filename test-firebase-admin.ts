import { loadEnvConfig } from '@next/env';
import { cert } from 'firebase-admin/app';

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const pk = process.env.FIREBASE_PRIVATE_KEY;
console.log("Raw PK starts with:", pk?.substring(0, 50));
console.log("Has literal \\n?", pk?.includes('\\n'));
console.log("Has actual newline?", pk?.includes('\n'));

try {
  let finalPk = pk;
  if (finalPk?.startsWith('"') && finalPk?.endsWith('"')) {
    finalPk = finalPk.slice(1, -1);
  }
  if (finalPk?.includes('\\n')) {
    finalPk = finalPk.replace(/\\n/g, '\n');
  }
  console.log("Final PK starts with:", finalPk?.substring(0, 50));
  cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: finalPk,
  });
  console.log("Cert loaded successfully!");
} catch (e) {
  console.error("Cert load failed:", e);
}
