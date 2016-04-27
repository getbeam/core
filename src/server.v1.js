import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes.v1';

const v1 = express();

v1.use(bodyParser.json());
v1.use('/', routes);

export default v1;
