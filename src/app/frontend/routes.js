import { Router } from 'express';

// eslint-disable-next-line new-cap
const routes = Router();

routes.get('/', (req, res) => {
  res.marko('tmpl', { hello: 'world' });
});

export default routes;
