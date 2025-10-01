import Order from "../modules/order.js";
import Product from "../modules/product.js";

export async function createOrder(req, res) {
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
        .then(async (lastBills) => {
            if(lastBills.length == 0){
                orderData.orderId = "ORD0001";
            }
            else {
                const lastBill = lastBills[0];
                const lastOrderId = lastBill.orderId;
                const lastOrderNumber = lastOrderId.replace("ORD", "");
                const lastOrderNumberInt = parseInt(lastOrderNumber);
                const newOrderNumberInt = lastOrderNumberInt + 1;
                const newOrderNumberStr = newOrderNumberInt.toString().padStart(4, '0');
                orderData.orderId = "ORD" + newOrderNumberStr;
            }

            for (let i = 0; i < body.billItem.length; i++) {
                const product = await Product.findOne({
                    productId: body.billItem[i].productId,
                });
                if (product == null) {
                    res.status(400).json({
                        message: `Product with ID ${body.billItem[i].productId} not found`
                    });
                    return;
                }

                orderData.billItem[i]={
                    productId: product.productId,
                    productName: product.name,
                    image : product.images[0],
                    price: product.price,
                    quantity: body.billItem[i].quantity
                }
                orderData.totalPrice = orderData.totalPrice    + product.price * body.billItem[i].quantity;
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

export async function updateOrderStatus(req, res) {
    try {
        if (req.user == null) {
            res.status(403).json({
                message: "You need to login first"
            });
            return;
        }
        if (req.user.role != "admin") {
            res.status(403).json({
                message: "You are not authorized to update order status"
            });
            return;
        }
        const orderId = req.params.orderId;
        const order = await Order.findOneAndUpdate({ orderId: orderId}, req.body);

        res.json({
            message: "Order status updated successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Order not Update",
            error: error.message
        });
        return;
    }
}