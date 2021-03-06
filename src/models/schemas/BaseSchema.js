import {generateToken} from '../../helpers';

export class BaseSchema {
    makeToken() {
        return new Promise((resolve, reject) => {
            const token = generateToken();
            this.access_token = {token};
            this.save((error) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(this.access_token);
            });
        });
    }

    invalidateToken() {
        return new Promise((resolve, reject) => {
            this.access_token.expires_at = new Date();
            this.save((error) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve();
            });
        });
    }
}
