import { Router } from 'express';
import apiV1Router from './api/v1/routes';
import authRouter from './auth';
import frontendRouter from './frontend/routes';

// eslint-disable-next-line new-cap
const routes = Router();

routes.use('/api/v1', apiV1Router);
routes.use('/auth', authRouter);
routes.use('/', frontendRouter);

export default routes;
