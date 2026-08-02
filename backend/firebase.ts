import { FirebaseApp } from 'firebase/app';
import { initializeApp } from 'firebase/app';

default function initFirebase() {
	const firebaseConfig = {
		apiKey: process.env.FIREBASE_API_KEY,
		authDomain: process.env.FIREBASE_AUTH_DOMAIN,
		projectId: process.env.FIREBASE_PROJECT_ID,
		storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
	tdsProjectId: process.env.FIREBASE_TDS_PROJECT_ID,
	measurementId: process.env.FIREBASE_MEASUREMENT_ID,
	};
	const app = initializeApp(firebaseConfig);
	return app;
}