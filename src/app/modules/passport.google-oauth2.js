import { Strategy } from 'passport-google-oauth20';
import { User } from '../../database';

const strategy = new Strategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true
  },
  (req, accessToken, refreshToken, profile, next) => {
    // # Callback of Google OAuth2.0
    // Check if the user is already registered and pass the user to the
    // next callback.
    // If user is not registered, create him!

    User.findOne({ googleId: profile._json.id })
      .then(foundUser => {
        if (foundUser) {
          return next(null, foundUser);
        }

        const user = new User({
          googleId: profile._json.id,
          email: profile._json.emails[0].value,
          name: profile._json.displayName
        });

        // Tell request that we're dealing with a new signup
        req.isSignup = true; // eslint-disable-line no-param-reassign
        return user.save();
      })
      .then(user => (next(null, user)))
      .catch(err => (next(err)));
  }
);

export default strategy;
