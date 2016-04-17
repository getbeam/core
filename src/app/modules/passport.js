import passport from 'passport';
import GoogleOAuth2Strategy from './passport.google-oauth2';
import { User } from '../../database';

passport.use(GoogleOAuth2Strategy);

passport.serializeUser((user, next) => {
  next(null, user.id);
});

passport.deserializeUser((id, next) => {
  User.findOne({ id }, (err, user) => {
    next(err, user);
  });
});

export default passport;
