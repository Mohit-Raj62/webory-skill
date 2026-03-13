const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://realestate:mohitraj6205@cluster0.em7qp.mongodb.net/skill-webory"; 

async function run() {
    try {
        await mongoose.connect(MONGODB_URI);
        const PushSubscription = mongoose.models.PushSubscription || mongoose.model('PushSubscription', new mongoose.Schema({}));
        const result = await PushSubscription.deleteMany({});
        console.log("DELETED_COUNT:", result.deletedCount);
        mongoose.connection.close();
    } catch (e) {
        console.error(e);
    }
}
run();
