import { auth } from '../firebase';

export const authHandler = async (req, res) => {
    try {
        const user = await auth.getUser(req.headers.authorization);
        res.json({ user });
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized' });
    }
};