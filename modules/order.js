import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    orderId : {
        type: String,
        required: true,
        unique: true
    },
    date : {
        type: Date,
        default: Date.now
    },
    email : {
        type: String,
        required: true
    },
    name :{
        type: String,
        required: true
    },
    address : {
        type: String,
        required: true  
    },
    status : {
        type: String,
        required: true,
        default: "pending" // Default status is 'pending'
    },
    phoneNumber : {
        type: String,
        required: true
    },
    billItem : {
        type: [{
            productId: String,
            productName: String,   
            images: String,
            quantity: Number,
            price: Number
        }],
        required: true
    },
    totalPrice : {
        type: Number,
        required: true
    }
})

const Order = mongoose.model("order", orderSchema);
export default Order;