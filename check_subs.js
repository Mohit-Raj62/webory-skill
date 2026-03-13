import dbConnect from "./src/lib/db";
import PushSubscription from "./src/models/PushSubscription";

async function checkSub() {
    await dbConnect();
    const subs = await PushSubscription.find({});
    console.log("Total Subscriptions:", subs.length);
    subs.forEach(s => {
        console.log("ID:", s._id, "Endpoint:", s.endpoint.substring(0, 50) + "...");
    });
    process.exit(0);
}

checkSub();
