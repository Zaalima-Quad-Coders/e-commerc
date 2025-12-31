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

// creating and updating product review
export const createProductReview = handleAsynError(async (req, res, next) => {
    const { rating, comment, productId } = req.body;
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    };
    const product = await Product.findById(productId);
    if (!product) {
        return next(new HandleError("Product not found", 404));
    }
    const isReviewed = product.reviews.find(
        (rev) => rev.user.toString() === req.user._id.toString()
    );
    if (isReviewed) {
        product.reviews.forEach((rev) => {
            if (rev.user.toString() === req.user._id.toString()) {  
                rev.rating = rating;
                rev.comment = comment;
            }
        });
    } else {
        product.reviews.push(review);
    }
    product.numofReviews = product.reviews.length;
    let sum = 0;
    product.reviews.forEach((rev) => {
        sum += rev.rating;
    });
    product.ratings = product.reviews.length > 0 ? sum / product.reviews.length : 0;
    await product.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true,
        message: "Review added successfully"
    });
});

// getting reviews

export const getProductReviews = handleAsynError(async (req, res, next) => {
    const product = await Product.findById(req.query.id);
    if (!product) {
        return next(new HandleError("Product not found", 404));
    }
    res.status(200).json({
        success: true,
        reviews: product.reviews
    });
});

//delete review
export const deleteReview = handleAsynError(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
    if (!product) {
        return next(new HandleError("Product not found", 404));
    }   
    const reviews = product.reviews.filter(
        (rev) => rev._id.toString() !== req.query.id.toString()
    );
    let sum = 0; 
    reviews.forEach((rev) => {
        sum += rev.rating;
    });
    const ratings = reviews.length > 0 ? sum / reviews.length : 0;
    const numofReviews = reviews.length;
    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numofReviews
    },{ new: true, runValidators: true });
    
    res.status(200).json({
        success: true,
        message: "Review deleted successfully"
    });
});

//admin gett all products

export const getAdminProducts = handleAsynError(async (req, res, next) => {
    const products = await Product.find();
    res.status(200).json({  
        success: true,
        products

    });
})