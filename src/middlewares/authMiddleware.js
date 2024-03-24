const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Middleware to verify JWT token and validate user ID
const verifyToken = (req, res, next) => {
  // Check if the authorization header exists
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  // Extract the token from the authorization header
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }

  // Verify the token
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    if (!decoded.userId) {
      return res.status(401).json({ message: 'User ID not found in token' });
    }
    


    // Attach the user ID to the request object
    req.userId = decoded.userId;

    // Check if the user ID is attached to the request object
    

    next();
  });
};

module.exports = verifyToken;
