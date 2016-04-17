import { db } from '../../database';
import randomIdPlugin from '../random-id-plugin';

const UserSchema = new db.Schema(
  {
    id: { type: Number, unique: true, index: true },
    googleId: { type: String, unique: true },
    email: { type: String },
    name: { type: String },
  }, {
    noVirtualId: true,
  }
);

UserSchema.plugin(randomIdPlugin);

export const User = db.model('User', UserSchema);
