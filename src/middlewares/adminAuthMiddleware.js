const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/userModel')


const verifyAdmin = (req, res, next) => { 
    
    const authHeader = req.header['authorization'];
    if(!authHeader){ 
        return res.status(401).json({message: 'Authorization header missing!'});
    }

    const token = authHeader.split(' ')[1];
    if(!token){ 
        return res.status(401).json({message: 'Token missing!'})
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded)=>{ 
        if(err){ 
            return res.status(401).json({message: 'Invalid Token!'});
        }

        if (!decoded.userId) {
            return res.status(401).json({ message: 'User ID not found in token' });
          }

        if(!mongoose.Types.ObjectId.isValid(decoded.userId)){ 
            return res.status(401).json({message: 'Invalid user ID'})
        }

        const user = User.findById({_id: decoded.userId});
        const isAdmin = user.role == 'Admin';

        if(!isAdmin){ 
            return res.status(401).json({message: "You're not authorized to access this route as a user!"});
        }

        req.userId = decoded.userId;
        next();
    })
};


module.exports = verifyAdmin;