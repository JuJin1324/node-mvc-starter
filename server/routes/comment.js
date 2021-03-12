const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const commentController = require('../controllers/comment');

router.get('/', auth.hasAuthenticated, commentController.list);
router.post('/', auth.hasAuthenticated, commentController.create);

module.exports = router;
