const express = require('express');
const model = require('../models/event');
const { DateTime } = require("luxon");

exports.index = (req, res, next) => {
    //res.send('send all events');
    model.find()
    .then((events) => {
        let array = Array.from(events);
        result = array.reduce(function (eventObject, event) {
            eventObject[event.category] = eventObject[event.category] || [];
            eventObject[event.category].push(event);
            return eventObject;
        }, Object.create(null));

        console.log('Events:', events);

        return res.render('./event/index', { eventObject: result }); // Corrected variable name
    })
    .catch(err => next(err));
};

// GET /events/new: send the HTML form for creating a new event
exports.new = (req, res) => {
    res.render('./event/new');
};

// POST /events: create a new event
exports.create = (req, res, next) => {
    // res.send('create a new event');
    let event = (req.body);

    event.host = req.session.user;
    console.log(req.session);

    event.image = "images/" + req.file.filename;
    
    event2 = new model(event);

    event2.save()
    .then((event) =>  {
        res.redirect('/events')

    }).catch(err => 
        {
            if (err.name === 'ValidationError')
            {
                err.status = 400;
            }
            return next(err);
        })
};

// GET /events/:id: send the details of event identify by id with id = :id
exports.show = (req, res, next) =>
{
    let id = req.params.id;
    if (!id.match(/^[0-9a-fA-F]{24}$/))
    {
        let err = new Error('Invalid id given: ' + id)
        err.status = 400;
        return next(err);
    }

    model.findById(id).populate('host', 'firstName lastName')
    .then(
        (event) => {
            if (event)
            {
                console.log(event);
                res.render('./event/show', {event})
            }
            else
            {
                let err = new Error("Cannot find event with id " + id);
                err.status = 404;
                next(err);
            }
}
    )
    .catch(err => next(err))
};

// GET /events/:id/edit: send the HTML form for editing a event
exports.edit = (req, res, next) => {
    let id = req.params.id;
    if (!id.match(/^[0-9a-fA-F]{24}$/))
    {
        let err = new Error('Invalid id given: ' + id)
        err.status = 400;
        return next(err);
    }
    model.findById(id)
    .then(
        (event) => {
            if (event)
            {
                res.render('./event/edit', {event})
            }
            else
            {
                let err = new Error("Cannot find event with id " + id);
                err.status = 404;
                next(err);
            }
                }
    )
    .catch(err => next(err))
    // res.send('send the edit form' + req.params.id);
};

// PUT /events/:id: update the event identify by id
exports.update = (req, res, next) => {
    let event = req.body;
    let id = req.params.id;
    if (!id.match(/^[0-9a-fA-F]{24}$/))
    {
        let err = new Error('Invalid id given: ' + id)
        err.status = 400;
        return next(err);
    }
    event.image = "images/" + req.file.filename;
    model.findByIdAndUpdate(id, event, {useFindAndModify: false, runValidators: true})
    .then((event) =>
    {
        if (event)
        {
            console.log("updated movie event");
            return res.redirect('/events/' + id);
        }
        else {
            let err = new Error('Cannot find a event with id ' + id);
            err.status = 404;
            next(err);
        }
    } )
    .catch(err => 
        {
            if (err.name === 'ValidationError')
            {
                err.status = 400;
            }
            return next(err); 
        })
};

// DELETE /events/:id: delete the event identify by id
exports.delete = (req, res, next) => {
    let id = req.params.id;
    if (!id.match(/^[0-9a-fA-F]{24}$/))
    {
        let err = new Error('Invalid id given: ' + id)
        err.status = 400;
        return next(err);
    }

    model.findOneAndDelete({_id: id})
    .then((event) =>
    {
        if (event)
        {
            return res.redirect('/events');
        }
        else
        {
            let err = new Error('Cannot find a event with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err))
};