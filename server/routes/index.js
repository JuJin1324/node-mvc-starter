const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

/* GET home page. */
router.get('/', auth.hasAuthorized,  (req, res, next) => {
    res.render('pages/index', {title: 'Express from server directory'});
});

module.exports = router;
