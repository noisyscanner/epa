import {User} from '../models/User';
import {Validator} from '../Validator';

// HEAD /v1/cards/:card_number
export const checkCard = (req, res, next) => {
    const errors = new Validator({
        card_number: {
            required: true
        }
    }).validate(req.params);

    if (errors) {
        res.status(400).send();
        return;
    }

    const {card_number} = req.params;

    User.count({card_number}, (error, count) => {
        if (error) {
            next(error);
            return;
        }

        const status = (count === 0) ? 404 : 200;
        res.status(status).send();
    })
};
