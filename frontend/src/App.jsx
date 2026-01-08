import React from 'react'
import Home from './pages/Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProductDetails from './pages/ProductDetails.jsx'
import Products from './pages/Products.jsx'
import Register from './User/Register.jsx'

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} /> 
          <Route path="/product/:id" element={<ProductDetails />} /> 
          <Route path='/products' element = {<Products/>}/>
          <Route path='/products/:keyword' element = {<Products/>}/>
          <Route path='/register' element = {<Register/>}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App


