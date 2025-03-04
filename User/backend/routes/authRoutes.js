const express = require('express');
const { signup, login } = require('../controllers/authControllers');
const passport = require('passport');
const jwt = require('jsonwebtoken')
const router = express.Router();
const User = require("../models/User");

router.post('/signup', signup);
router.post('/login', login);

// Google Auth Routes
/*router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const token = req.user.token;
    res.redirect(`http://10.0.2.2:19006?token=${token}`);
  }
);

// GitHub Auth Routes
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get(
  '/github/callback',
  passport.authenticate('github', { session: false }),
  (req, res) => {
    const token = req.user.token
    res.redirect(`http://10.0.2.2:19006?token=${token}`);
  }
);*/

module.exports = router;