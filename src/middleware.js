import log from 'loglevel';
import {User} from './models/User';
import {Client} from './models/Client';
import {findModel} from './fetchers';
import {ValidationError} from './Validator';

class AuthError extends Error {
    constructor(message) {
        super();
        this.message = message || 'Invalid Authorization';
    }
}

const authMiddleware = (model) => (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        throw new AuthError;
    }

    const match = authHeader.match(/Bearer ([a-f0-9]{32})/);
    if (!match) {
        throw new AuthError;
    }

    findModel(model, {
        'access_token.token': match[1],
        'access_token.expires_at': {
            $gt: Date.now()
        }
    })
        .then((instance) => {
            if (!instance) {
                throw new AuthError;
            }

            return instance.touchToken()
                .then(() => {
                    const key = instance.constructor.modelName.toLowerCase();
                    req[key] = instance;
                    next();
                });
        })
        .catch(next);
};

export const clientAuthMiddleware = authMiddleware(Client);
export const userAuthMiddleware = authMiddleware(User);

export const errorHandler = (err, req, res, next) => {
    switch (true) {
    case err.name === 'ValidationError': // Mongoose ValidationError
        res.status(400).send({
            errors: Object.entries(err.errors).reduce((acc, [k, {message}]) => {
                acc[k] = message;
                return acc;
            }, {})
        });
        return;
    case err instanceof ValidationError: // Our ValidationError
        res.status(400).send(err);
        break;
    case err instanceof AuthError:
        res.status(401).send({error: err});
        return;
    default:
        log.error(err);
        res.status(500).send({error: err});
        return;
    }
};
