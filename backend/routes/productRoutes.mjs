import express from 'express';
import { createProduct, getAllProducts ,updateProduct,deleteProduct, getSingleProduct} from '../controllers/productController.mjs';
import { roleBasedAccess, verifyUserAuth } from '../middleware/userAuth.mjs';

const router = express.Router();


router.route("/products")
.get(verifyUserAuth,getAllProducts)
.post(verifyUserAuth,roleBasedAccess('admin'),createProduct) ;
router.route("/products/:id")
.put(verifyUserAuth,roleBasedAccess('admin'),updateProduct)
.delete(verifyUserAuth,roleBasedAccess('admin'),deleteProduct)
.get(verifyUserAuth,getSingleProduct);


export default router;