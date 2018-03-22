import config from '../../../config.json';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

export function getExpiry(TOKEN_LIFETIME_MINUTES = config.oauth.token_lifetime_minutes) {
    const date = new Date();
    date.setMinutes(date.getMinutes() + TOKEN_LIFETIME_MINUTES);
    return date;
}

export const AccessTokenSchema = new Schema({
    token: {
        type: String,
        required: true
    },
    expires_at: {
        type: Date,
        required: true,
        default: getExpiry
    }
});
