import bodyParser from 'body-parser';
import passport from './modules/passport';
import marko from './modules/marko-view';

export default [
  bodyParser.json(),
  passport.initialize(),
  marko()
];
