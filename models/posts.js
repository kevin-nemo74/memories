let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let comments = require('./comments');

let opts = { toJSON: { virtuals: true } };


const postSchema = new Schema({
    title: String,
    body: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
}, opts);




postSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await comments.deleteMany({
            _id: {
                $in: doc.comments
            }
        })
    }
})


module.exports = mongoose.model('Post', postSchema);