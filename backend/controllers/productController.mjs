import Product from "../models/productModel.mjs";
import HandleError from "../utils/handleError.mjs";
import handleAsynError from "../middleware/handleAsynError.mjs";
import APIFunctionality from "../utils/apiFunctionality.mjs";


export const createProduct = handleAsynError(async (req, res, next) => {
    req.body.user = req.user.id;
    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product
    });
})

export const getAllProducts = handleAsynError(async (req, res, next) => {
    // console.log(req.query);
    const resultPerPage = 3;
    const apiFeatures = new APIFunctionality(Product.find(), req.query).search().filter();

    // getting filtered query before pagination
    const filteredQuery = apiFeatures.query.clone();
    const productsCount = await filteredQuery.countDocuments();

    //calculate totalpages based on filter
    const totalPages = Math.ceil(productsCount / resultPerPage);
    const page = Number(req.query.page) || 1;
    if (page > totalPages && productsCount > 0) {
        return next(new HandleError("Page number exceeds total pages", 404));
    }

    //apply pagination
    apiFeatures.pagination(resultPerPage);
    const products = await apiFeatures.query;
    if (!products || products.length === 0) {
        return next(new HandleError("No products found", 404));
    }
    res.status(200).json({
        success: true,
        products,
        productsCount,
        resultPerPage,
        totalPages,
        currentPage: page
    })
})


//update product 

export const updateProduct = handleAsynError(async (req, res, next) => {
    let product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!product) {
        return next(new HandleError("Product not found", 404));
    }
    res.status(200).json({
        success: true,
        product
    });
})


//delete product

export const deleteProduct = handleAsynError(async (req, res, next) => {
    let product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
        return next(new HandleError("Product not found", 404));
    }
    res.status(200).json({
        success: true,
        message: "Product deleted successfully"
    });
})


// access single product details

export const getSingleProduct = handleAsynError(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new HandleError("Product not found", 404));
    }
    res.status(200).json({
        success: true,
        product
    });
})