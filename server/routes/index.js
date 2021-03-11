const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

/* GET home page. */
router.get('/', authMiddleware.isLoggedIn,  (req, res, next) => {
    res.render('pages/index', {title: 'Express from server directory'});
});

module.exports = router;
