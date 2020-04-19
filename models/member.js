import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const warSchema = new Schema({
    tag: String,
    count: Number,
    mia: Number,
    wars: Object
});

const memberSchema = new Schema({
    name: String,
    role: String,
    lastOnline: String,
    tag: String,
    donated: Number,
    received: Number,
    warInfo: {
        type: warSchema,
        default: undefined
    }

});



export default mongoose.model("member", memberSchema); 