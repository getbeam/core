import { Router } from 'express';
import passport from './modules/passport';

// eslint-disable-next-line new-cap
const auth = Router();

auth.get('/google',
  passport.authenticate('google',
    { scope: ['profile', 'email'] }
  )
);
auth.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.send(req.isSignup ? 'Signup!' : 'Already there');
  }
);

export default auth;
