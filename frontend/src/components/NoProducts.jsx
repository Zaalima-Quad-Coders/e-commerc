import React from 'react'
import '../componentStyles/NoProducts.css'
import { ReportProblem } from '@mui/icons-material'

const NoProducts = (keyword) => {
  return (
    <>
      <div className="no-products-content">
        <div className="no-products-icon"><ReportProblem/></div>
        <h3 className="no-products-title">No Products Found </h3>
        <p className="no-products-message">
          {keyword ? `We couldm't find any products matching "${keyword}". Try using different keywords or brows our complete catalog.` : 'No products are available. Please check back leter'}
        </p>
      </div>
    </>
  )
}

export default NoProducts