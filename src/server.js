import express from 'express';
import v1 from './server.v1';

const server = express();

server.use('/v1', v1);

export default server;

export const listen = () => {
  server.listen(3000, () => {
    console.log('Hello!');
  });
};
