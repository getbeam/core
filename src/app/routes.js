import { Router } from 'express';
import apiV1Router from './api/v1/routes';
import authRouter from './auth';

// eslint-disable-next-line new-cap
const routes = Router();

routes.use('/api/v1', apiV1Router);
routes.use('/auth', authRouter);

export default routes;
