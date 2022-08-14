let mongoose = require('mongoose');
let passportLocalMongoose = require('passport-local-mongoose');
let Schema = mongoose.Schema;

let UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    friendReq: {
        type: Number,
        default: 0
    },
    friendReqList: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
