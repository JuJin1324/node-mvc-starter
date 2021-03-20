const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');
const commentController = require('./comment.controller');

router.get('/', auth.hasAuthenticated, commentController.list);
router.post('/', auth.hasAuthenticated, commentController.create);

module.exports = router;
