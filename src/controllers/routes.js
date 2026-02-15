import { Router } from 'express';

// Middleware
import { addDemoHeaders } from '../middleware/demo/headers.js';

// Controllers
import { catalogPage, courseDetailPage } from './catalog/catalog.js';
import { homePage, aboutPage, demoPage, testErrorPage } from './index.js';
import { facultyListPage, facultyDetailPage } from './faculty/faculty.js';
import contactRoutes from './forms/contact.js';
import registrationRoutes from './forms/registration.js';


// Create a new router instance
const router = Router();

// Add catalog-specific styles to all catalog routes
router.use('/catalog', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/catalog.css">');
    next();
});

router.use('/faculty', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/faculty.css">', 10);
    next();
});

// Add contact-specific styles to all contact routes
router.use('/contact', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/contact.css">');
    next();
});

// Add registration-specific styles to all registration routes
router.use('/register', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/registration.css">');
    next();
});

// Contact form routes
router.use('/contact', contactRoutes);

// Registration routes
router.use('/register', registrationRoutes);

// Home and basic pages
router.get('/', homePage);
router.get('/about', aboutPage);

// Course catalog routes
router.get('/catalog', catalogPage);
router.get('/catalog/:slugId', courseDetailPage);

// Demo page with special middleware
router.get('/demo', addDemoHeaders, demoPage);

// Route to trigger a test error
router.get('/test-error', testErrorPage);

console.log('Faculty routes loaded');

// Faculty routes
router.get('/faculty', facultyListPage);
router.get('/faculty/:facultySlug', facultyDetailPage);


export default router;
