let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const commentSchema = new Schema({
    body: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    time: String
});

module.exports = mongoose.model('Comment', commentSchema);