import express from 'express';
import middleware from './app/middleware';
import routes from './app/routes';

const app = express();

app.use(middleware);
app.use('/', routes);

export default app;
