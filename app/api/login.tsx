import login from '../api/login';

export default async (req, res) => {
  try {
    const user = await login(req.body.email, req.body.password);
    res.status(200).json({ user });
  } catch (error) {
    res.status(401).json({ error: 'Invalid credentials' });
  }
};