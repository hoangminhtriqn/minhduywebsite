const express = require('express');
const passport = require('passport');
const { googleAuthSuccess, googleAuthFailure, getCurrentUser } = require('../controllers/googleAuthController');
const { protect } = require('../middleware/authMiddleware'); // Use existing auth middleware

const router = express.Router();

// @route   GET /api/auth/google
// @desc    Start Google OAuth flow
// @access  Public
router.get('/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  })
);

// @route   GET /api/auth/google/callback  
// @desc    Google OAuth callback - handle response from Google
// @access  Public
router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/api/auth/google/failure',
    session: false // We're using JWT, not sessions
  }),
  googleAuthSuccess
);

// @route   GET /api/auth/google/failure
// @desc    Google OAuth failure redirect
// @access  Public
router.get('/google/failure', googleAuthFailure);

// @route   GET /api/auth/me
// @desc    Get current user info (for both local and Google users)
// @access  Private
router.get('/me', protect, getCurrentUser);

module.exports = router;