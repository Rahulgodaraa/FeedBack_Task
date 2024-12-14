import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
    console.log("Token:", token);
console.log("Decoded User:", req.user);
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Access Denied, Token Missing' });
  }

  jwt.verify(token, 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid Token' });
    }
    req.user = user;
    next();
  });
};
