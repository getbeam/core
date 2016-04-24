import { Router } from 'express';

// eslint-disable-next-line new-cap
const routes = Router();

routes.get('/', (req, res) => {
  res.marko('tmpl');
});

export default routes;
