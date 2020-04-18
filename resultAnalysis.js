import { MONGOURI } from './data.js';
import mongoose from 'mongoose';

mongoose.connect(MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

const compareAndSaveResults = dataObj => {
    try {
        mongoose.disconnect();

    } catch (err) {
        console.error(err);
    }
};

export default compareAndSaveResults;