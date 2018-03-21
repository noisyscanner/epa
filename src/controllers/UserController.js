import {User} from '../models/User';
import {serialiseUser} from '../serialisers';
import {Validator} from '../Validator';

const getUserLinks = () => [
    {
        rel: 'self',
        href: '/v1/users/me'
    },
    {
        rel: 'balance',
        href: '/v1/users/me'
    }
];

const getBalanceLinks = () => [
    {
        rel: 'self',
        href: '/v1/users/me/balance'
    },
    {
        rel: 'user',
        href: '/v1/users/me'
    }
];

// GET /v1/users/me
export const me = (req, res) => {
    res.send({
        user: serialiseUser(req.user),
        links: getUserLinks()
    });
};

// DELETE /v1/users/me
export const deleteMyself = (req, res, next) =>
    req.user.remove((error) => {
        if (error) {
            next(error);
            return;
        }

        res.status(204).send();
    });

// GET /v1/users/me/balance
export const getBalance = (req, res) => {
    res.send({
        balance: req.user.balance,
        links: getBalanceLinks()
    })
};

// PATCH /v1/users/me/balance
export const setBalance = (req, res, next) => {
    const errors = new Validator({
        add: {
            required: true,
            type: Number
        }
    }).validate(req.body);

    if (errors) {
        res.status(400).send({errors});
        return;
    }

    const {user, body: {add}} = req;

    user.balance += add;
    user.save((error) => {
        if (error) {
            next(error);
            return;
        }

        res.send({
            balance: user.balance,
            links: getBalanceLinks()
        });
    });
};

// POST /v1/users
export const createUser = (req, res, next) => {
    const user = new User(req.body);
    user.save((error) => {
        if (error) {
            next(error);
            return;
        }

        const href = '/v1/users/me';

        res
            .status(201)
            .header('Location', href)
            .send({
                user: serialiseUser(user),
                links: getUserLinks()
            });
    });
};
