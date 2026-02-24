// import mongoose from "mongoose";

// const orderSchema = new mongoose.Schema({
//     products: [{
//         type: mongoose.ObjectId,
//         ref: 'Products',
//     }],
//     payment: {},
//     buyer: {
//         type: mongoose.ObjectId,
//         ref: 'users',
//     },
//     status: {
//         type: String,
//         default: 'not process',
//         enum: ["not process", "processing", "order Conffom", "Shipped", "Deliverd", "cancel",]
//     },
// connformat
// }, { timeseries: true }
// )
// export default mongoose.model('orderss', orderSchema)

import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        products: [
            {
                type: mongoose.ObjectId,
                ref: "Products",
            },
        ],
        payment: {
            
        },
        buyer: {
            type: mongoose.ObjectId,
            ref: "users",
        },
        status: {
            type: String,
            default: "Not Process",
            enum: ["Not Process", "Processing", "Shipped", "deliverd", "cancel"],
        },
    },
    { timestamps: true }
);

export default mongoose.model("Order", orderSchema);