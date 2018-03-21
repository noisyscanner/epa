import {generateToken} from '../../helpers';
import {getExpiry} from './AccessTokenSchema';

export class BaseSchema {
    makeToken(cb) {
        const token = generateToken();
        this.access_token = {token};
        this.save((error) => {
            cb(this.access_token, error);
        });
    }

    touchToken(cb) {
        this.access_token.expires_at = getExpiry();
        this.save(cb);
    }

    invalidateToken(cb) {
        this.access_token.expires_at = new Date();
        this.save(cb);
    }
}
