import React, { useState } from 'react'
import '../componentStyles/Rating.css';
import { SpaRounded } from '@mui/icons-material';

const Rating = (value,onRatingChange,disabled) => {
    const [hoveredRating,setHoveredRating] = useState(0);
    const [selectedRating,setSelectedRating] = useState(value || 0)
    //Handle star hover
    const handleMouseEnter = (rating)=>{
        if(!disabled){
            setHoveredRating(rating)
        }
    }
    // Mouse leave
    const handleMouseLeave=()=>{
        if(!disabled){
            setHoveredRating(0)
        }
    }
    //Handle click
    const handleClick=(rating)=>{
        if(!disabled){
            setHoveredRating(rating)
            if(onRatingChange){
                onRatingChange(rating)
            }
        }
    }
// Function to generates stars based on selected rating
    const generateStars=()=>{
        const stars = [];
        for (let i=1; i<=5; i++){
            const isFilled = i <= (hoveredRating || selectedRating)
            stars.push(
                
                <span
                key={i} 
                className={`star ${isFilled?'filled':'empty'}`}
                onMouseEnter={()=>handleMouseEnter}
                onMouseLeave={()=>handleMouseLeave}
                onClick={()=>handleClick}
                style={ {pointerEvents:disabled?'none':'auto'}}
                >
                ⭐️
                </span>
            )
        }
        return stars
    }

  return (
    <div>
        <div className="rating"> {generateStars()}

        </div>
    </div>
  )
}

export default Rating