import {isCardRegistered} from '../fetchers';

// HEAD /v1/cards/:card_number
export const checkCard = (req, res, next) => {
    const {card_number} = req.params;

    isCardRegistered(card_number)
        .then((cardIsRegistered) => {
            const status = (cardIsRegistered) ? 200 : 404;
            res.status(status).send();
        })
        .catch(next);
};
