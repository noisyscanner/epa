import mongoose from 'mongoose';
import {ClientSchema} from './schemas/ClientSchema';

export const Client = mongoose.model('Client', ClientSchema);
