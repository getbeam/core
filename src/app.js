import express from 'express';
import middleware from './app/middleware';
import routes from './app/routes';
import cons from 'consolidate';
import path from 'path';

const app = express();

app.engine('html', cons.nunjucks);
app.set('view engine', 'html');
app.set('views', path.resolve(__dirname, 'app', 'views'));
app.use(middleware);
app.use('/assets', express.static(path.resolve(__dirname, '..', 'assets')));
app.use('/', routes);

export default app;
