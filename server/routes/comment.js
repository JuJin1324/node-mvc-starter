const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const commentController = require('../controllers/comment');

router.get('/', auth.hasAuthorized, commentController.list);
router.post('/', auth.hasAuthorized, commentController.create);

module.exports = router;
