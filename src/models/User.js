import mongoose from 'mongoose';
import {UserSchema} from './schemas/UserSchema';

export const User = mongoose.model('User', UserSchema);
