const express = require('express');
const controller = require('../controllers/eventControllers');
const fileUpload = require('../middleware/fileUpload');

const router = express.Router();

// GET /events
router.get('/', controller.index);

// GET /events/new send the HTML form for creating a new event
router.get('/new', controller.new);

// POST /events create a new event
router.post('/', fileUpload.fileUpload, controller.create);

// GET /events/:id send the details of event identify by id with id = :id
router.get('/:id', controller.show);

// GET /events/:id/edit send the HTML form for editing a event
router.get('/:id/edit', controller.edit);

// PUT /events/:id update the event identify by id
router.put('/:id', fileUpload.fileUpload, controller.update);

// DELETE /events/:id delete the event identify by id
router.delete('/:id', controller.delete);

module.exports = router;