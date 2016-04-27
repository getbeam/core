import { db } from '../../database';
import randomIdPlugin from '../random-id-plugin';

const UserSchema = new db.Schema(
  {
    id: { type: Number, unique: true, index: true },
    email: { type: String },
    name: { type: String },
    provider: {
      googleId: { type: String, unique: true }
    }
  }, {
    noVirtualId: true,
  }
);

UserSchema.plugin(randomIdPlugin);

export const User = db.model('User', UserSchema);
