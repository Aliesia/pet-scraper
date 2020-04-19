import { MONGOURI } from './data.js';
import mongoose from 'mongoose';
import memberModel from './models/member.js';

mongoose.connect(MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

const compareAndSaveResults = async dataObj => {
    try {
        await mongoose.connection.db.dropCollection('members');

        dataObj.forEach(async function (member) {
            let memberData = new memberModel(member);
            await memberData.save();

        })


    } catch (err) {
        console.error(err);
    }
};

export default compareAndSaveResults;