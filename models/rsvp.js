const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rsvpSchema = new Schema({
    status: {type: String, enum: ['YES', 'NO', 'MAYBE'], required: [true, 'Status is required']},
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    event: {type: Schema.Types.ObjectId, ref: 'events'},
}
);

module.exports = mongoose.model('rsvp', rsvpSchema);