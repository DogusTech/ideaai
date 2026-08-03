import { db } from '../firebase';

export const dbHandler = async (req, res) => {
    try {
        const data = await db.collection('users').get();
        res.json({ data: data.docs.map(doc => doc.data()) });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};