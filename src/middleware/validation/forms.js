import { body } from 'express-validator';

/**
 * Validation rules for contact form
 */
const contactValidation = [
  body('subject')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Subject must be at least 2 characters'),

  body('message')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Message must be at least 10 characters')
];

/**
 * Validation rules for login form
 */
const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password is required'),
];

/**
 * Validation rules for user registration
 */
const registrationValidation = [
    body('name')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Name must be at least 2 characters'),
    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Must be a valid email address'),
    body('emailConfirm')
        .trim()
        .custom((value, { req }) => value === req.body.email)
        .withMessage('Email addresses must match'),
    body('password')
        .isLength({ min: 8 })
        .matches(/[0-9]/)
        .withMessage('Password must contain at least one number')
        .matches(/[!@#$%^&*]/)
        .withMessage('Password must contain at least one special character'),
    body('passwordConfirm')
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Passwords must match')
];

export {
  loginValidation,
  registrationValidation,
  contactValidation
};