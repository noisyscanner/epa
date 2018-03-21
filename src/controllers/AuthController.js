import {User} from '../models/User';
import {Client} from '../models/Client';
import {Validator} from '../Validator';

const userAuth = (card_number, pin) => new Promise((resolve, reject) => {
    User.findOne({card_number, pin}, (error, user) => {
        if (error) {
            reject({status: 500, error});
            return;
        }

        if (!user) {
            reject({status: 404, error: {message: 'User not found - the card has not been registered yet.'}});
            return;
        }

        user.makeToken((token, error) => {
            if (error) {
                reject({status: 500, error});
                return;
            }

            resolve(token);
        });
    });
});

const clientAuth = (client_id, client_secret) => new Promise((resolve, reject) => {
    Client.findOne({client_id, client_secret}, (error, client) => {
        if (error) {
            reject({status: 500, error});
            return;
        }

        if (!client) {
            reject({status: 400, error: {message: 'Invalid client credentials'}});
            return;
        }

        client.makeToken((token, error) => {
            if (error) {
                reject({status: 500, error});
                return;
            }

            resolve(token);
        });
    });
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
            required: true,
            when: grant_type === 'card'
        },
        client_id: {
            required: true,
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
        case 'card':
            const {card_number, pin} = req.body;
            promise = userAuth(card_number, pin);
            break;
        case 'client_credentials':
            const {client_id, client_secret} = req.body;
            promise = clientAuth(client_id, client_secret);
            break;
        default:
            break;
    }

    promise
        .then((token) => {
            res.status(201).send({
                access_token: token.token,
                expires_at: token.expires_at
            });
        })
        .catch(({status, error}) => {
            res.status(status).send({error})
        });
};

export const invalidateToken = (req, res, next) => {
    req.user.invalidateToken((error) => {
        if (error) {
            next(error);
            return;
        }

        res.status(204).send();
    });
};
