import express from 'express';
import { createOrder, getOrder, updateOrderStatus } from '../controller/orderController.js';

const orderRouter = express.Router();
orderRouter.post('/', createOrder)
orderRouter.get('/', getOrder);
orderRouter.put('/:orderId',updateOrderStatus);

export default orderRouter;