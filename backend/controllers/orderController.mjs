import Order from "../models/orderModel.mjs";
import Product from "../models/productModel.mjs";
import User from "../models/userModel.mjs";
import handleAsynError from "../middleware/handleAsynError.mjs";
import HandleError from "../utils/handleError.mjs";

//Create New Order

export const createNewOrder = handleAsynError(async (req, res, next) => {
    const { shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id
    })
    res.status(201).json({
        success: true,
        order

    })
});

//Get Single Order
export const getSingleOrder = handleAsynError(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) {
        return next(new HandleError("No Order Found with this Id", 404));
    }
    res.status(200).json({
        success: true,
        order
    })
});

//All my Orders
export const getAllMyOrders = handleAsynError(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });
    if (!orders) {
        return next(new HandleError("No Orders Found", 404));
    }
    res.status(200).json({
        success: true,
        orders
    })
})

// Get All Orders -- Admin
export const getAllOrders = handleAsynError(async (req, res, next) => {
    const orders = await Order.find();
    let totalAmount = 0;
    orders.forEach(order => {
        totalAmount += order.totalPrice;
    });

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
});

// Update Order Status -- Admin
export const updateOrderStatus = handleAsynError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new HandleError("No Order Found with this Id", 404));
    }
    if (order.orderstatus === "Delivered") {
        return next(new HandleError("You have already delivered this order", 400));
    }
    await Promise.all(order.orderItems.map(item => updateQuantity(item.product, item.quantity)
    ))
    order.orderstatus = req.body.status;
    if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
    }
    await order.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true,
        order
    });

    async function updateQuantity(id, quantity) {
        const product = await Product.findById(id);
        if (!product) {
            throw new HandleError("Product not found", 404);
        }
        product.stock -= quantity;
        await product.save({ validateBeforeSave: false });
    }

});

// delete Order -- Admin (optional)

export const deleteOrder = handleAsynError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);  
    if (!order) {
        return next(new HandleError("No Order Found with this Id", 404));
    }
    if (order.orderstatus !== "Delivered") {
        return next(new HandleError("Cannot delete an order that is not delivered", 400));
    }
    await order.deleteOne({_id: req.params.id });
    res.status(200).json({
        success: true,
        message: "Order Deleted Successfully"
    });
});