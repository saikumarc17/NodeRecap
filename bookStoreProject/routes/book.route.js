const express = require('express');
const router = express.Router();
const controller = require('../controllers/books.controller');

router.get('/', controller.getAllBooks);

router.get('/:id', controller.getBookById);

router.post('/', controller.addBook);

router.delete('/:id', controller.deleteBookById);

module.exports = router;