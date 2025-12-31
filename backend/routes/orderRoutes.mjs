import express from "express";
import { roleBasedAccess, verifyUserAuth } from '../middleware/userAuth.mjs';
import { createNewOrder, deleteOrder, getAllMyOrders, getAllOrders, getSingleOrder, updateOrderStatus } from "../controllers/orderController.mjs";



const router = express.Router();

router.route("/new/order").post(verifyUserAuth,createNewOrder)
router.route("/admin/order/:id")
.get(verifyUserAuth,roleBasedAccess("admin"), getSingleOrder)
.put(verifyUserAuth,roleBasedAccess("admin"), updateOrderStatus)
.delete(verifyUserAuth,roleBasedAccess("admin"), deleteOrder)
router.route("/admin/orders").get(verifyUserAuth,roleBasedAccess("admin"), getAllOrders)
router.route("/order/user").get(verifyUserAuth, getAllMyOrders)

export default router;