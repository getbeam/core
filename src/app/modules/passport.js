import passport from 'passport';
import GoogleOAuth2Strategy from './passport.google-oauth2';
import { User } from '../../database';

passport.use(GoogleOAuth2Strategy);

// Passport will serialize the user with this method in order to
// deserialize him later. This can simply be done with returning the userID.
passport.serializeUser((user, next) => {
  next(null, user.id);
});

// Since we serialized the user by his ID, deserializing is fetching the
// user by his ID.
passport.deserializeUser((id, next) => {
  User.findOne({ id }, (err, user) => {
    next(err, user);
  });
});

export default passport;
