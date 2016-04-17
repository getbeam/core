import bodyParser from 'body-parser';
import passport from './modules/passport';

export default [
  bodyParser.json(),
  passport.initialize()
];
