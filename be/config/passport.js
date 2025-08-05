const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const { USER_ROLES, LOGIN_PROVIDERS } = require('../models/User');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL || "/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Tìm user existing với GoogleId
    let user = await User.findOne({ GoogleId: profile.id });
    
    if (user) {
      return done(null, user);
    }
    
    // Tìm user với email giống nhau (link accounts)
    user = await User.findOne({ Email: profile.emails[0].value });
    
    if (user) {
      // Link existing account với Google (không thay đổi role hiện tại)
      user.GoogleId = profile.id;
      user.LoginProvider = LOGIN_PROVIDERS.GOOGLE;
      user.Avatar = user.Avatar || profile.photos[0].value;
      await user.save();
      return done(null, user);
    }
    
    // Tạo user mới - Google users luôn có role USER
    user = new User({
      GoogleId: profile.id,
      Email: profile.emails[0].value,
      FullName: profile.displayName,
      Avatar: profile.photos[0].value,
      LoginProvider: LOGIN_PROVIDERS.GOOGLE,
      Role: USER_ROLES.USER, // Đảm bảo Google users chỉ có role USER
      Phone: '0000000000', // Temporary phone number for Google users
    });
    
    await user.save();
    done(null, user);
  } catch (error) {
    console.error('Google OAuth Error:', error);
    done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;