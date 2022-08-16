let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let comments = require('./comments');

let opts = { toJSON: { virtuals: true } };


const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200')
})


const postSchema = new Schema({
    title: String,
    body: String,
    images: [ImageSchema],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    privacy: String
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