const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

/* GET home page. */
router.get('/', auth.hasAuthenticated, (req, res) => {
    res.render('pages/index', {title: 'Express from server directory'});
});

module.exports = router;
