import {Schema} from 'mongoose';
import {generateToken} from '../../helpers';
import {AccessTokenSchema} from './AccessTokenSchema';
import {BaseSchema} from './BaseSchema';

export const ClientSchema = new Schema({
    name: {
        type: String,
        maxlength: 32,
        unique: true,
        required: 'Name is required'
    },
    client_id: {
        type: String,
        minlength: 32,
        maxlength: 32,
        unique: true,
        default: generateToken
    },
    client_secret: {
        type: String,
        minlength: 32,
        maxlength: 32,
        unique: true,
        default: generateToken
    },
    access_token: {
        type: AccessTokenSchema
    }
});

ClientSchema.loadClass(BaseSchema);
