import React from 'react'

interface CategoryBtnProp {
    text: string
}


const CategoriesBtn = ({ text } : CategoryBtnProp) => {
  return (
    <button className='categories-btn'>
        {text}
    </button>
  )
}

export default CategoriesBtn