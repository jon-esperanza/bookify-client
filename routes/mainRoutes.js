const express = require('express');
const controller = require('../controllers/mainController.js')

const router = express.Router();

// GET /: send home page to user
router.get('/', controller.index);

router.get('/signup', controller.signup);

module.exports = router;