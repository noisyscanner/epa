import {Schema} from 'mongoose';
import config from '../../../config.json';

export const getExpiry = (TOKEN_LIFETIME_MINUTES) => () => {
    const date = new Date();
    date.setMinutes(date.getMinutes() + TOKEN_LIFETIME_MINUTES);
    return date;
};

export const UserAccessTokenSchema = new Schema({
    token: {
        type: String,
        required: true
    },
    expires_at: {
        type: Date,
        required: true,
        default: getExpiry(config.oauth.user_token_lifetime_minutes)
    }
});

export const ClientAccessTokenSchema = new Schema({
    token: {
        type: String,
        required: true
    },
    expires_at: {
        type: Date,
        required: true,
        default: getExpiry(config.oauth.client_token_lifetime_minutes)
    }
});
