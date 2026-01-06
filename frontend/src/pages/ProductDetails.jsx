import React, { useEffect } from 'react'
import '../pageStyles/ProductDetails.css'
import { useState } from 'react'
import PageTitle from '../components/PageTitle'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Rating from '../components/Rating'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getProductDetails, removeErrors } from '../features/products/productSlice.mjs'
import { toast } from 'react-toastify'
import Loder from '../components/Loder'


function ProductDetails() {
    const [userRating, setuserRating] = useState(0);
    const handleRatingChange = (newRating) => {
        setuserRating(newRating``)

    }
    const { loading, error, product } = useSelector((state) => state.product)
    const dispatch = useDispatch();
    const { id } = useParams();
    useEffect(() => {
        if (id) {
            dispatch(getProductDetails(id));
        }
        return () => {
            dispatch(removeErrors())
        }
    }, [dispatch, id])

    useEffect(() => {
        if (error) {
            toast.error(error.message, { position: 'top-center', autoClose: 3000 });
            dispatch(removeErrors())
        }
    }, [dispatch, error])
    if (loading) {
        return (
            <>
                <Navbar />
                <Loder />
                <Footer />
            </>
        )
    }
    if (error || !product) {
        return (
            <>
                <PageTitle title='Product Details' />
                <Navbar />
                <Footer />
            </>
        )
    }


    return (
        <>
            <PageTitle title={`${product.name} - details`} />
            <Navbar />
            <div className="product-details-container">
                <div className="product-detail-container">
                    <div className="product-image-container">
                        <img src={product.images[0].url} alt={product.name} className='product-detail-image' />
                    </div>

                    <div className="product-info">
                        <h2>{product.name} </h2>
                        <p className="product-description">{product.description} </p>
                        <p className="product-price">Price :{product.price} </p>

                        <div className="product-rating">
                            <Rating
                                value={product.ratings}
                                disabled={true} />
                            <span className="productCardSpan"> ({product.numofReviews} {product.numofReviews === 1 ? "Review" : "Reviews"} )</span>
                        </div>
                        <div className="stock-status">
                            <span className={product.stock > 1 ? `in-stock` : 'out of stock'}>
                                {product.stock > 0 ? `In Stock (${product.stock}available)` : 'out of stock'}
                            </span>
                        </div>
                        {product.stock > 0 && (<><div className="quantity-controls">
                            <span className="quantity-lable">Quantity:</span>
                            <button className='quantity-button'>-</button>
                            <input type='text' value={1}
                                className='quantity-value' readOnly />
                            <button className='quantity-button'>+</button>
                        </div>
                            <button className="add-to-cart-btn">Add to Cart</button></>)}

                        <form className='review-form'>
                            <h3>Write a Review</h3>
                            <Rating
                                value={0}
                                disabled={false}
                                onRatingChange={handleRatingChange
                                } />
                            <textarea placeholder='Write your reeview...'
                                className="review-input"></textarea>
                            <button className="submit-review-btn">Submit Review</button>
                        </form>
                    </div>
                </div>

                <div className="reviews-container">
                    <h3>Coustmer Reviews</h3>
                    {product.reviews && product.reviews.length > 0 ? (<div className="reviews-section">
                        {product.reviews.map((reviews, index) => (<div className="review-item" key ={index}>
                            <div className="review-header">
                                <Rating value={reviews.rating} disabled={true} />
                            </div>
                            <p className="review-comment">{reviews.comment}</p>
                            <p className="review-name">By {reviews.name}</p>
                        </div>
                        ))}
                    </div>) : (
                        <p className='no-reviews'>No Reviews Yet</p>
                    )}
                </div>
            </div>
            <Footer />
        </>
    )
}

export default ProductDetails