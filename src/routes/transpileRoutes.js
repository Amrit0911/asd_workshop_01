const express = require('express');
const { transpilePython } = require('../controllers/transpileController');

const router = express.Router();

router.post('/', transpilePython);

module.exports = router;
