import { body, param } from 'express-validator';

export const validateUserId = param('id').isInt({ min: 0 });

export const validateUserRegistration = [
    body('name').isString(),
    body('email').isEmail(),
];
