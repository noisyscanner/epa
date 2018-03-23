import sha1 from 'sha1';
import {Client, User} from './models';

export const isCardRegistered = (card_number) => new Promise((resolve, reject) =>
    User.count({card_number: sha1(card_number)}, (error, count) => {
        if (error) {
            reject(error);
            return;
        }

        resolve(count > 0);
    }));

export const findModel = (model, opts) => new Promise((resolve, reject) => {
    model.findOne(opts, (error, instance) => {
        if (error) {
            reject(error);
            return;
        }

        resolve(instance);
    });
});

export const findUser = (opts) => {
    if (opts.card_number) {
        opts.card_number = sha1(opts.card_number);
    }

    if (opts.pin) {
        opts.pin = sha1(opts.pin);
    }

    return findModel(User, opts);
};

export const findClient = (opts) => findModel(Client, opts);
