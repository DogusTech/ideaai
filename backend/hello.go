import { Firestore } from '@google-cloud/firestore';
import db from './db';
export async function getHello() {
    const snapshot = await db.collection('hello').get();
    return snapshot.docs.map(doc => doc.data());
}