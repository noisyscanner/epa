import {Schema} from 'mongoose';
import {generateToken} from '../../helpers';
import {ClientAccessTokenSchema, getExpiry} from './AccessTokenSchema';
import {BaseSchema} from './BaseSchema';
import config from '../../../config.json';

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
        type: ClientAccessTokenSchema
    }
});

ClientSchema.methods.touchToken = function() {
    return new Promise((resolve, reject) => {
        this.access_token.expires_at = getExpiry(config.oauth.client_token_lifetime_minutes)();
        this.save((error) => {
            if (error) {
                reject(error);
                return;
            }

            resolve();
        });
    });
};

ClientSchema.loadClass(BaseSchema);
