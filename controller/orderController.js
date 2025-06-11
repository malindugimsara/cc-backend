import Order from "../modules/order.js";

export function createOrder(req, res) {
    if (req.user == null) {
        res.status(403).json({
            message: "You need to login first"
        });
        return;
    }

    const body = req.body;
    const orderData ={
        orderId :"",
        email : req.user.email,
        name : body.name,
        address : body.address,
        phoneNumber : body.phoneNumber,
        billItem : [],
        totalPrice : 0,
    };

    Order.find()
        .sort
        (
            {date: -1}
        ) .limit(1) // Get the last order
        .then((lastBills) => {
            if(lastBills.length == 0){
                orderData.orderId = "ORD0001";
            }
            else {
                const lastBill = lastBills[0];
                const lastOrderId = lastBill.orderId;
                const lastOrderNumber = lastOrderId.repalce("ORD", "");
                const lastOrderNumberInt = parseInt(lastOrderNumber);
                const newOrderNumberInt = lastOrderNumberInt + 1;
                const newOrderNumberStr = newOrderNumberInt.toString().padStart(4, '0');
                orderData.orderId = "ORD" + newOrderNumberStr;
            }




            const order= new Order(orderData);
            order.save().then(() => {
                res.json({
                    message: "Order created successfully",
                    orderId: order.orderId
                });
            }).catch((err) => {
                console.error("Error creating order:", err);
                res.status(500).json({
                    message: "Error creating order",
                    error: err.message
                });
            });
        })
    
    
}

export function getOrder(req, res) {
    if (req.user == null) {
        res.status(403).json({
            message: "You need to login first"
        });
        return;
    }

    if (req.user.role == "admin"){
        Order.find().then((orders) => {
            res.json(orders);
        }).catch((err) => {
            res.status(500).json({
                message: "Error fetching orders",
                error: err.message
            });
        });
    } else{
        Order.find({
            email: req.user.email
        }).then((orders) => {
            res.json(orders);
        }).catch((err) => {
            res.status(500).json({
                message: "Error fetching orders",
                error: err.message
            });
        });
    }

}