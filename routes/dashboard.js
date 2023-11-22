const router = require('express').Router();
const Blog = require('../models/Blog');

router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const userId = req.user._id;
        
        // Ensure that userId is a valid mongoose ObjectId
        if (!userId) {
            console.error('User ID not found in req.user');
            return res.status(500).send('Internal Server Error');
        }

        // Fetch only the blogs of the currently logged-in user
        const blogs = await Blog.find({ userId: userId });

        res.render('pages/dashboard', {
            title: 'Dashboard',
            name: req.user.name,
            email: req.user.email,
            blogs: blogs || [], // Provide a default empty array if blogs is undefined
        });

    } catch (error) {
        // Handle the error
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login'); // Redirect to login if not authenticated
}

module.exports = router;

    