import { db } from '../database';

const options = {
  server: { socketOptions: { keepAlive: 30000, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 30000, connectTimeoutMS: 30000 } }
};

export function connect() {
  return new Promise((resolve, reject) => {
    db.connect('mongodb://localhost/sssnap', options);
    db.connection
      .on('error', reject)
      .once('open', resolve);
  });
}
