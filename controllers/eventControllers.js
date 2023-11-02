const express = require('express');
const model = require('../models/event');
const { DateTime } = require("luxon");

exports.index = (req, res, next) => {
    //res.send('send all events');
    let events = model.find();;

    let category = model.getAllDistinctCategories();

    if (events.length) {
        res.render("./event/index", { events, category });
    } else {
        let err = new Error("No events to show!");
        err.status = 404;
        next(err);
    }
};

// GET /events/new: send the HTML form for creating a new event
exports.new = (req, res) => {
    res.render('./event/new');
};

// POST /events: create a new event
exports.create = (req, res) => {
    // res.send('create a new event');
    let event = req.body;

    event.image = "/images/" + req.file.filename;

    model.save(event);
    console.log(event);
    res.redirect('/events');
};

// GET /events/:id: send the details of event identify by id with id = :id
exports.show = (req, res, next) => {
    let id = req.params.id;
    let event = model.findByID(id);
    if (event) {
        res.render('./event/show', {event});
    } else {
        let err = new Error('Cannot find event with id ' + id);
        err.status = 404;
        next(err);
    }
};

// GET /events/:id/edit: send the HTML form for editing a event
exports.edit = (req, res, next) => {
    let id = req.params.id;
    let event = model.findByID(id);
    if (event) {
        res.render('./event/edit', {event});
    } else {
        let err = new Error('Cannot find event with id ' + id);
        err.status = 404;
        next(err);
    }
    // res.send('send the edit form' + req.params.id);
};

// PUT /events/:id: update the event identify by id
exports.update = (req, res, next) => {
    let event = req.body;
    let id = req.params.id;

    event.image = "/images/" + req.file.filename;

    if (model.updateById(id, event)) {
        res.redirect('/events/'+id);
    } else {
        let err = new Error('Cannot find event with id ' + id);
        err.status = 404;
        next(err);
    }
};

// DELETE /events/:id: delete the event identify by id
exports.delete = (req, res, next) => {
    let id = req.params.id;
    if(model.deleteById(id)) {
        res.redirect('/events');
    } else {
        let err = new Error('Cannot find story with id ' + id);
        err.status = 404;
        next(err);
    }
};