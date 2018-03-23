import {Validator} from '../Validator';
import {findClient, findUser} from '../fetchers';

const userAuth = (card_number, pin) =>
    findUser({card_number, pin})
        .then((user) => {
            if (!user) {
                // TODO: Actual Error
                throw {
                    status: 404,
                    error: {message: 'User not found - the card has not been registered yet.'}
                };
            }

            return user.makeToken();
        });

const clientAuth = (client_id, client_secret) =>
    findClient({client_id, client_secret})
        .then((client) => {
            if (!client) {
                throw {status: 400, error: {message: 'Invalid client credentials'}};
            }

            return client.makeToken();
        });

export const tokens = (req, res) => {
    const {grant_type} = req.body;

    const validator = new Validator({
        grant_type: {
            required: true,
            oneOf: ['card', 'client_credentials']
        },
        card_number: {
            required: true,
            when: grant_type === 'card'
        },
        pin: {
            required: 'PIN is required',
            when: grant_type === 'card'
        },
        client_id: {
            required: 'Client ID is required',
            when: grant_type === 'client_credentials'
        },
        client_secret: {
            required: true,
            when: grant_type === 'client_credentials'
        }
    });

    const errors = validator.validate(req.body);

    if (errors) {
        res.status(400).send({errors});
        return;
    }

    let promise;

    switch (grant_type) {
    case 'card': {
        const {card_number, pin} = req.body;
        promise = userAuth(card_number, pin);
        break;
    }
    case 'client_credentials': {
        const {client_id, client_secret} = req.body;
        promise = clientAuth(client_id, client_secret);
        break;
    }
    }

    promise
        .then((token) => {
            res.status(201).send({
                access_token: token.token,
                expires_at: token.expires_at
            });
        })
        .catch((error) => {
            if (error.status) {
                res.status(error.status).send({error: error.error});
                return;
            }

            res.status(500).send({error});
        });
};

export const invalidateToken = (req, res, next) =>
    req.user.invalidateToken()
        .then(() => res.status(204).send())
        .catch(next);
