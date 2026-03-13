const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://realestate:mohitraj6205@cluster0.em7qp.mongodb.net/skill-webory"; 

async function run() {
    try {
        await mongoose.connect(MONGODB_URI);
        const PushSubscription = mongoose.models.PushSubscription || mongoose.model('PushSubscription', new mongoose.Schema({
            endpoint: String,
            keys: { p256dh: String, auth: String },
            userId: String
        }));
        const count = await PushSubscription.countDocuments();
        console.log("SUBSCRIPTION_COUNT:", count);
        mongoose.connection.close();
    } catch (e) {
        console.error(e);
    }
}
run();
