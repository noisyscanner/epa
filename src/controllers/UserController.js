import {User} from '../models';
import {serialiseUser} from '../serialisers';
import {ValidationError, Validator} from '../Validator';

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
    });
};

// PATCH /v1/users/me/balance
export const setBalance = (req, res, next) => {
    const errors = new Validator({
        delta: {
            required: true,
            type: Number
        }
    }).validate(req.body);

    if (errors) {
        res.status(400).send({errors});
        return;
    }

    const {user, body: {delta}} = req;

    if (user.balance + delta < 0) {
        res.status(400).send({error: {message: 'User does not have sufficient funds'}});
        return;
    }

    user.balance += delta;
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
    // Validation is done here, instead of in the Schema, as PIN and card number are hashed
    const validator = new Validator({
        first_name: {
            required: true,
        },
        surname: {
            required: true
        },
        mobile_number: {
            required: true,
            func: [Validator.validateMobileNumber, 'Please enter a valid mobile number']
        },
        employee_id: {
            required: 'Employee ID is required',
            func: [Validator.validateEmployeeID, 'Please enter a valid employee ID']
        },
        email: {
            required: true,
            func: [Validator.validateEmail, 'Please enter a valid email address']
        },
        card_number: {
            required: true,
            func: [Validator.validateCardNumber, 'Please enter a valid card number']
        },
        pin: {
            required: 'PIN is required',
            func: [Validator.validatePIN, 'PIN number must be a 4 digit number']
        }
    });

    const errors = validator.validate(req.body);
    if (errors) {
        throw new ValidationError(errors);
    }

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
