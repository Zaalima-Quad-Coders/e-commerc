import express from 'express';
import { createProduct, getAllProducts ,updateProduct,deleteProduct, getSingleProduct, getAdminProducts, createProductReview, getProductReviews, deleteReview} from '../controllers/productController.mjs';
import { roleBasedAccess, verifyUserAuth } from '../middleware/userAuth.mjs';

const router = express.Router();


router.route("/products")
.get(getAllProducts);
router.route("/admin/products")
.get(verifyUserAuth,roleBasedAccess('admin'),getAdminProducts);

router.route("/admin/product/create").post(verifyUserAuth,roleBasedAccess('admin'),createProduct) ;
router.route("/admin/products/:id")
.put(verifyUserAuth,roleBasedAccess('admin'),updateProduct)
.delete(verifyUserAuth,roleBasedAccess('admin'),deleteProduct);

router.route("/product/:id").get(getSingleProduct);
router.route("/review").put(verifyUserAuth,createProductReview);
router.route("/reviews").get(getProductReviews).delete(verifyUserAuth,deleteReview);



export default router;