import React from 'react'
import CategoriesBtn from './CategoriesBtn'

interface CategoriesScrollerProp {
  buttons : string[]
}

const CategoriesScroller = ({ buttons } : CategoriesScrollerProp) => {
  return (
    <div className='categories-scroller'>
        {
          buttons.map((text, index) => <CategoriesBtn text={text} key={index}/>)
        }

    </div>
  )
}

export default CategoriesScroller