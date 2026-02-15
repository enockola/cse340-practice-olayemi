import { body, validationResult } from 'express-validator';
import { findUserByEmail, verifyPassword } from '../../models/forms/login.js';
import { Router } from 'express';

const router = Router();

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
 * Display the login form.
 */
const showLoginForm = (req, res) => {
  res.render('forms/login/form', {
    title: 'User Login',
    errorMessage: null,
    formData: {},
  });
};

/**
 * Process login form submission.
 */
const processLogin = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Login validation errors:', errors.array());

    return res.render('forms/login/form', {
      title: 'User Login',
      errorMessage: 'Invalid email or password',
      errors: errors.array(),
      formData: { email: req.body?.email || '' },
    });
  }

  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await findUserByEmail(email);

    if (!user) {
      console.log('User not found:', email);
      return res.render('forms/login/form', {
        title: 'User Login',
        errorMessage: 'Invalid email or password',
        formData: { email },
      });
    }

    // Verify password
    const ok = await verifyPassword(password, user.password);

    if (!ok) {
      console.log('Invalid password for:', email);
      return res.render('forms/login/form', {
        title: 'User Login',
        errorMessage: 'Invalid email or password',
        formData: { email },
      });
    }

    // SECURITY: Remove password from user object before storing in session
    delete user.password;

    // Store safe user data in session
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
    };

    return res.redirect('/dashboard');
  } catch (error) {
    console.error('Error processing login:', error);
    return res.render('forms/login/form', {
      title: 'User Login',
      errorMessage: 'Invalid email or password',
      formData: { email: req.body?.email || '' },
    });
  }
};

/**
 * Handle user logout.
 *
 * NOTE: connect.sid is the default session cookie name since we did not
 * specify a custom name when creating the session in server.js.
 */
const processLogout = (req, res) => {
  if (!req.session) {
    return res.redirect('/');
  }

  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      res.clearCookie('connect.sid');
      return res.redirect('/');
    }

    res.clearCookie('connect.sid');
    res.redirect('/');
  });
};

/**
 * Display protected dashboard (requires login).
 */
const showDashboard = (req, res) => {
  const user = req.session.user;
  const sessionData = req.session;

  // Security check! Ensure user and sessionData do not contain password field
  if (user && user.password) {
    console.error('Security error: password found in user object');
    delete user.password;
  }
  if (sessionData.user && sessionData.user.password) {
    console.error('Security error: password found in sessionData.user');
    delete sessionData.user.password;
  }

  res.render('dashboard', {
    title: 'Dashboard',
    user,
    sessionData,
  });
};

// Routes
router.get('/', showLoginForm);
router.post('/', loginValidation, processLogin);

export default router;
export { processLogout, showDashboard };
