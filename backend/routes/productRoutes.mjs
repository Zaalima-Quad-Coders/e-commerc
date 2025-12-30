import express from 'express';
import { createProduct, getAllProducts ,updateProduct,deleteProduct, getSingleProduct} from '../controllers/productController.mjs';

const router = express.Router();


router.route("/products").get(getAllProducts).post(createProduct) ;
router.route("/products/:id").put(updateProduct).delete(deleteProduct).get(getSingleProduct);


export default router;