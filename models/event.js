const { DateTime } = require("luxon");
const {v4: uuidv4} = require('uuid');
const events = [
    {
        id: '1',
        title: 'First Practice',
        content: 'This is the first practice.',
        hostName: 'Alex Moore',
        startTime: DateTime.fromObject({year: 2023, month: 10, day: 10, hour: 10, minute: 30})
        .toLocaleString(DateTime.DATETIME_SHORT),
        endTime: DateTime.fromObject({year: 2023, month: 10, day: 10, hour: 11, minute: 30})
        .toLocaleString(DateTime.DATETIME_SHORT),
        image: 'images/firstPractice.jpg',
        location: 'Belk Gym',
        category: 'Afternoon Session'
    },
    {
        id: '2',
        title: 'Second Practice',
        content: 'This is the second practice.',
        hostName: 'Spongebob Squarepants',
        startTime: DateTime.fromObject({year: 2023, month: 10, day: 15, hour: 10, minute: 30})
        .toLocaleString(DateTime.DATETIME_SHORT),
        endTime: DateTime.fromObject({year: 2023, month: 10, day: 15, hour: 11, minute: 30})
        .toLocaleString(DateTime.DATETIME_SHORT),
        image: 'images/secondPractice.jpg',
        location: 'Belk Gym',
        category: 'Evening Session'
    },
    {
        id: '3',
        title: 'Competition',
        content: 'This is the competition.',
        hostName: 'Alex Moore',
        startTime: DateTime.fromObject({year: 2023, month: 10, day: 30, hour: 10, minute: 30})
        .toLocaleString(DateTime.DATETIME_SHORT),
        endTime: DateTime.fromObject({year: 2023, month: 10, day: 30, hour: 11, minute: 30})
        .toLocaleString(DateTime.DATETIME_SHORT),
        image: 'images/competition.jpg',
        location: 'Belk Gym',
        category: 'free-range'
    }
];

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


