import {AuthController, CardController, UserController} from './controllers';
import {userAuthMiddleware, clientAuthMiddleware, errorHandler} from './middleware';
import express from 'express';

export const createRouter = () => {
    const router = express.Router();

    router.use(express.json());

    router.post('/tokens', AuthController.tokens);

    router.head('/cards/:card_number', clientAuthMiddleware, CardController.checkCard);

    router.post('/users', clientAuthMiddleware, UserController.createUser);

    router.delete('/tokens/me', userAuthMiddleware, AuthController.invalidateToken);

    router.route('/users/me')
        .get(userAuthMiddleware, UserController.me)
        .delete(userAuthMiddleware, UserController.deleteMyself);

    router.route('/users/me/balance')
        .get(userAuthMiddleware, UserController.getBalance)
        .patch(userAuthMiddleware, UserController.setBalance);

    router.use(errorHandler);

    return router;
};
