/*const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,  // ✅ Read from .env
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // ✅ Read from .env
      callbackURL: process.env.GOOGLE_CALLBACK_URL, // ✅ Read from .env
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = {
          id: profile.id,
          name: profile.displayName,
          email: profile.emails[0]?.value,
        };
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);*/
