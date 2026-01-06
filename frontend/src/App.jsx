import React from 'react'
import Home from './pages/Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProductDetails from './pages/ProductDetails.jsx'
import Products from './pages/Products.jsx'

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} /> 
          <Route path="/product/:id" element={<ProductDetails />} /> 
          <Route path='/products' element = {<Products/>}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App


