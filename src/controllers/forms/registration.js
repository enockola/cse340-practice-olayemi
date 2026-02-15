import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { emailExists, saveUser, getAllUsers } from '../../models/forms/registration.js';

const router = Router();

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

/**
 * Display the registration form page.
 */
const showRegistrationForm = (req, res) => {
  res.render('forms/registration/form', {
    title: 'User Registration',
    errors: [],
    formData: {}
  });
};


/**
 * Handle user registration with validation and password hashing.
 */
const processRegistration = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Log validation errors for debugging
    console.log('Registration validation errors:', errors.array());
    // Redirect back to the form
    return res.redirect('/register');
  }

  // Extract validated data
  const { name, email, password } = req.body;

  try {
    // Check if email already exists
    const exists = await emailExists(email);

    if (exists) {
      console.log('Email already registered');
      return res.redirect('/register');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    await saveUser(name, email, hashedPassword);

    console.log(`User registered successfully: ${email}`);

    // Redirect to list page
    return res.redirect('/register/list');
  } catch (error) {
    console.error('Error processing registration:', error);
    return res.redirect('/register');
  }
};

/**
 * Display all registered users.
 */
const showAllUsers = async (req, res) => {
  let users = [];

  try {
    users = await getAllUsers();
  } catch (error) {
    console.error('Error fetching users:', error);
  }

  res.render('forms/registration/list', {
    title: 'Registered Users',
    users,
  });
};

/**
 * GET /register - Display the registration form
 */
router.get('/', showRegistrationForm);

/**
 * POST /register - Handle registration form submission with validation
 */
router.post('/', registrationValidation, processRegistration);

/**
 * GET /register/list - Display all registered users
 */
router.get('/list', showAllUsers);

export default router;