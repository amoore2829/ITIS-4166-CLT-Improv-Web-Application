const express = require('express');
const controller = require('../controllers/eventControllers');
const fileUpload = require('../middleware/fileUpload');
const {isLoggedIn, isAuthor} = require('../middleware/auth');
const { validateId } = require('../middleware/validator');


const router = express.Router();

// GET /events
router.get('/', controller.index);

// GET /events/new send the HTML form for creating a new event
router.get('/new', isLoggedIn, controller.new);

// POST /events create a new event
router.post('/', isLoggedIn, fileUpload.fileUpload, controller.create);

// GET /events/:id send the details of event identify by id with id = :id
router.get('/:id', validateId, controller.show);

// GET /events/:id/edit send the HTML form for editing a event
router.get('/:id/edit', validateId, isLoggedIn, isAuthor, controller.edit);

// PUT /events/:id update the event identify by id
router.put('/:id', validateId, isLoggedIn, isAuthor, fileUpload.fileUpload, controller.update);

// DELETE /events/:id delete the event identify by id
router.delete('/:id', validateId, isLoggedIn, isAuthor, controller.delete);

// POST /events/:id/rsvp: create a new rsvp for the event
router.post('/:id/rsvp', validateId, isLoggedIn, controller.rsvp);


module.exports = router;