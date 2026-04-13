


// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// exports.authMiddleware = async (req, res, next) => {
//   let token;

//   if (
//     !req.headers.authorization ||
//     !req.headers.authorization.startsWith("Bearer")
//   ) {
//     return res.status(401).json({ message: "Not authorized, no token" });
//   }

//   try {
//     token = req.headers.authorization.split(" ")[1];

//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Attach user info to request (excluding password)
//     req.user = await User.findById(decoded.id).select("-password");

//     next(); // Proceed to the next middleware or route handler
//   } catch (error) {
//     return res.status(401).json({ message: "Not authorized, token failed" });
//   }
// };















// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// exports.protect = async (req, res, next) => {
//     try {
//         let token;

//         if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//             token = req.headers.authorization.split(' ')[1];
//         }

//         if (!token) {
//             return res.status(401).json({ message: 'Not authorized, no token' });
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded;
//         next();
//     } catch (error) {
//         res.status(401).json({ message: 'Not authorized, token failed' });
//     }
// };

// exports.instructor = (req, res, next) => {
//     if (req.user && req.user.role === 'instructor') {
//         next();
//     } else {
//         res.status(403).json({ message: 'Access denied. Instructor only.' });
//     }
// };






// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// exports.protect = async (req, res, next) => {
//     try {
//         let token;

//         if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//             token = req.headers.authorization.split(' ')[1];
//         }

//         if (!token) {
//             return res.status(401).json({ message: 'Not authorized, no token' });
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const user = await User.findById(decoded.userId).select('-password');
        
//         if (!user) {
//             return res.status(401).json({ message: 'User not found' });
//         }

//         req.user = user;
//         next();
//     } catch (error) {
//         res.status(401).json({ message: 'Not authorized, token failed' });
//     }
// };

// exports.instructor = (req, res, next) => {
//     if (req.user && req.user.role === 'instructor') {
//         next();
//     } else {
//         res.status(403).json({ message: 'Access denied. Instructor only.' });
//     }
// };








const jwt = require('jsonwebtoken');
const User = require('../models/User');

const hasInstructorAccess = (role) => ["instructor", "teacher"].includes(role);

exports.protect = async (req, res, next) => {
    console.log('Protect middleware called');
    try {
        // Get token from header
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from token
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

exports.instructor = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!hasInstructorAccess(req.user.role)) {
        return res.status(403).json({ message: 'Access denied. Instructor or teacher only.' });
    }

    next();
};







