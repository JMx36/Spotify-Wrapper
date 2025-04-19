import React from 'react'

interface ClickScrollerProp<T> {
  Comp: React.ComponentType<T> // The type of the components
  propsList: T[]
}

const ClickScroller = <T extends object>({ Comp, propsList } : ClickScrollerProp<T>) => {
  return (
    <div className="click-scroller">
      <div className='scroll-container'>
        {
          propsList.map((props, index) => (
            <Comp key={index} {...props} />
          ))
        }
      </div>
    </div>
  )
}

export default ClickScroller