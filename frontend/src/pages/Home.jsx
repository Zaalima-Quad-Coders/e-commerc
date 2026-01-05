import React from 'react'
import '../pageStyles/Home.css'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import ImageSlider from '../components/ImageSlider'
import Product from '../components/Product'

const products = [
        {
            "_id": "6954f8b1a083fec21b457c49",
            "name": "p1",
            "description": "decs1",
            "price": 100,
            "ratings": 4,
            "images": [
                {
                    "public_id": "this is id1",
                    "url": "this is url1",
                    "_id": "6954f8b1a083fec21b457c4a"
                }
            ],
            "category": "paint",
            "stock": 1,
            "numofReviews": 2,
            "reviews": [],
            "createdAt": "2025-12-31T10:19:29.193Z",
            "__v": 0
        },
        {
            "_id": "6954f8d7a083fec21b457c4c",
            "name": "p2",
            "description": "decs2",
            "price": 200,
            "ratings": 0,
            "images": [
                {
                    "public_id": "this is id2",
                    "url": "this is url2",
                    "_id": "6954f8d7a083fec21b457c4d"
                }
            ],
            "category": "shirt",
            "stock": 1,
            "numofReviews": 0,
            "reviews": [],
            "createdAt": "2025-12-31T10:20:07.521Z",
            "__v": 0
        }
    ]

function Home() {
    return (
        <>
        <Navbar/>
        <ImageSlider/>
            <div className='home-container'>
                <h2 className="home-heading">
                    Trending Now
                </h2>
                <div className="home-product-container">
                    {products.map((product,index)=>(<Product product={product} key={index}/>
                ))}
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Home