import React, { useState } from 'react'
import '../componentStyles/Rating.css'
import { Star } from '@mui/icons-material'

const Rating = ({ value = 0, onRatingChange, disabled = false }) => {
  const [hoveredRating, setHoveredRating] = useState(0)
  const [selectedRating, setSelectedRating] = useState(value)

  const handleMouseEnter = (rating) => {
    if (!disabled) setHoveredRating(rating)
  }

  const handleMouseLeave = () => {
    if (!disabled) setHoveredRating(0)
  }

  const handleClick = (rating) => {
    if (!disabled) {
      setSelectedRating(rating)
      onRatingChange && onRatingChange(rating)
    }
  }

  const generateStars = () => {
    const stars = []

    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= (hoveredRating || selectedRating)

      stars.push(
        <span
          key={i}
          className={`star ${isFilled ? 'filled' : 'empty'}`}
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(i)}
          style={{ pointerEvents: disabled ? 'none' : 'auto' }}
        >
          <Star />
        </span>
      )
    }
    return stars
  }

  return <div className="rating">{generateStars()}</div>
}

export default Rating
