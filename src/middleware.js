import {User} from './models/User';
import {Client} from './models/Client';

const authError = (req, res) => res.status(401).send({error: 'Invalid Authorization'});

export const clientAuthMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        authError(req, res);
        return;
    }

    const match = authHeader.match(/Bearer ([a-f0-9]{32})/);
    if (!match) {
        authError(req, res);
        return;
    }

    Client.findOne({
        'access_token.token': match[1],
        'access_token.expires_at': {
            $gt: Date.now()
        }
    }, (error, client) => {
        if (error) {
            res.status(500).send({error});
            return;
        }

        if (!client) {
            authError(req, res);
            return;
        }

        client.touchToken((error) => {
            if (error) {
                res.status(500).send({error});
                return;
            }

            req.client = client;
            next();
        });
    });
};

export const userAuthMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        authError(req, res);
        return;
    }

    const match = authHeader.match(/Bearer ([a-f0-9]{32})/);
    if (!match) {
        authError(req, res);
        return;
    }

    User.findOne({
        'access_token.token': match[1],
        'access_token.expires_at': {
            $gt: Date.now()
        }
    }, (error, user) => {
        if (error) {
            res.status(500).send({error});
            return;
        }

        if (!user) {
            authError(req, res);
            return;
        }

        user.touchToken((error) => {
            if (error) {
                res.status(500).send({error});
                return;
            }

            req.user = user;
            next();
        });
    });
};

export const errorHandler = (err, req, res, next) => {
    switch (err.name) {
        case 'ValidationError':
            return res.status(400).send({
                errors: Object.entries(err.errors).reduce((acc, [k, {message}]) => {
                    acc[k] = message;
                    return acc;
                }, {})
            });
        default:
            console.log(err);
            return res.status(500).send({error: err});
    }
};
