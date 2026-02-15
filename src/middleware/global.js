/**
 * Helper function to get the current greeting based on the time of day.
 */
const getCurrentGreeting = () => {
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
        return 'Good Morning!';
    }

    if (currentHour < 18) {
        return 'Good Afternoon!';
    }

    return 'Good Evening!';
};

/**
 * Express middleware that adds head asset management functionality to routes.
 * Provides arrays for storing CSS and JS assets with priority support.
 * 
 * Adds these methods to the response object:
 * - res.addStyle(css, priority) - Add CSS/link tags to head
 * - res.addScript(js, priority) - Add script tags 
 * 
 * Adds these functions to EJS templates via res.locals:
 * - renderStyles() - Outputs all CSS in priority order (high to low)
 * - renderScripts() - Outputs all JS in priority order (high to low)
 */
const setHeadAssetsFunctionality = (res) => {
    res.locals.styles = [];
    res.locals.scripts = [];

    res.addStyle = (css, priority = 0) => {
        res.locals.styles.push({ content: css, priority });
    };

    res.addScript = (js, priority = 0) => {
        res.locals.scripts.push({ content: js, priority });
    };

    res.locals.renderStyles = () => {
    return [...res.locals.styles]
        .sort((a, b) => b.priority - a.priority)
        .map(item => item.content)
        .join('\n');
    };

    res.locals.renderScripts = () => {
    return [...res.locals.scripts]
        .sort((a, b) => b.priority - a.priority)
        .map(item => item.content)
        .join('\n');
    };

};

/**
 * Middleware to add local variables to res.locals for use in all templates.
 * Templates can access these values but are not required to use them.
 */
const addLocalVariables = (req, res, next) => {
    setHeadAssetsFunctionality(res);

    res.locals.currentYear = new Date().getFullYear();
    res.locals.NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
    res.locals.queryParams = { ...req.query };
    res.locals.greeting = `<p>${getCurrentGreeting()}</p>`;
    // Convenience variable for UI state based on session state
    res.locals.isLoggedIn = false;
    if (req.session && req.session.user) {
        res.locals.isLoggedIn = true;
    }

    const themes = ['blue-theme', 'green-theme', 'red-theme'];
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    res.locals.bodyClass = randomTheme;

    console.log('renderStyles exists?', typeof res.locals.renderStyles);

    next();
};

export { addLocalVariables };