const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const crypto = require('crypto');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
  try {
    if (!profile.emails || !profile.emails[0]) {
      return done(new Error("No email found in Google profile"), null);
    }

    let user = await User.findOne({ email: profile.emails[0].value });

    if (!user) {
      user = await User.create({
        email: profile.emails[0].value,
        password: crypto.randomBytes(20).toString('hex'), // Secure random password for schema requirement
        name: profile.displayName || profile.emails[0].value.split('@')[0]
      });
    }

    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));

// Passport requires serialization when using sessions
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
