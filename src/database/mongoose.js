// mongoose with native Promise

import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

export { mongoose };
