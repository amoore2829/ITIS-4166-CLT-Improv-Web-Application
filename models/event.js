const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const express = require('express');
const { DateTime } = require('luxon');


const app = express();

const meetupSchema = new Schema(
    {
        category: {type: String, enum: ['Afternoon Session', 'Evening Session', 'Freestyle', 'Junior', 'Middle', 'Senior', 'Free Range', 'Other'], default: 'Other', required: [true, "Category is required"]},
        title: {type: String, required: [true, "Title is required"], minLength: [2, "Title should be at least 2 characters"]},
        content: {type: String, required: [true, "Details are required"], minLength: [10, "Description should be at least 10 characters"]},
        location: {type: String, required: [true, "Location is required"], minLength: [3, "Location should be at least 3 characters"]},
        host: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        startTime: {type: Date, required: [true, "Start date is required"]},
        endTime: {type: Date, required: [true, "End date is required"]},
        image: {type: String, required: [true, "Image is required"]}
    },
    {timestamps: true}
)

module.exports = mongoose.model('Meetup', meetupSchema);


exports.find = () => events;

exports.findByID = id => events.find(event=>event.id === id);

exports.save = function (event) {
    let unparsedDate = event.startTime;
    let unparsedEnd = event.endTime;
    let parsedDate = DateTime.fromJSDate(new Date(unparsedDate)).toLocaleString(DateTime.DATETIME_SHORT);
    let parsedEnd = DateTime.fromJSDate(new Date(unparsedEnd)).toLocaleString(DateTime.DATETIME_SHORT);
    event.startTime = parsedDate;
    event.endTime = parsedEnd;
    event.id = uuidv4();
    events.push(event);
};

exports.findAll = function () {
    const result = events.reduce(function (eventObject, event) {
        eventObject[event.id] = eventObject[event.id] || [];
        eventObject[event.id].push(event);
        return eventObject;
    }, Object.create(null));
    console.log("All events: ", result);

    Object.keys(result).forEach(function (id) {
        console.log(result[id]);
    });

    return result;
};


exports.updateById = function (id, newEvent) {
    let event = events.find(event=>event.id === id);
    if(event) {
        event.title = newEvent.title;
        event.content = newEvent.content;
        event.hostName = newEvent.hostName;
        event.category = newEvent.category;

        let unparsedDate = newEvent.startTime;
        let unparsedEnd = newEvent.endTime;
        let parsedDate = DateTime.fromJSDate(new Date(unparsedDate)).toLocaleString(DateTime.DATETIME_SHORT);
        let parsedEnd = DateTime.fromJSDate(new Date(unparsedEnd)).toLocaleString(DateTime.DATETIME_SHORT);
        event.startTime = parsedDate;
        event.endTime = parsedEnd;

        event.content = newEvent.content;
        event.location = newEvent.location;
        event.image = newEvent.image;

        return true;
    }
    else {
        return false;
    }
}

exports.deleteById = function (id) {
    let index = events.findIndex(event=>event.id === id);
    if(index !== -1) {
         // splice method deletes the story
        events.splice(index, 1);
        return true;
    } else {
        return false;
    }
}


exports.getAllDistinctCategories = function() {

    const distinctCategories = new Set();
  
    events.forEach(event => {
      distinctCategories.add(event.category);
    });
  
    return Array.from(distinctCategories);
  }



