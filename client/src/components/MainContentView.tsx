import React from 'react'
import CategoriesScroller from './CategoriesScroller'
import { JSX } from 'react/jsx-runtime'
import InfoCard, { InfoCardProp } from './InfoCard';
import ClickScroller from './ClickScroller';

interface ContentSectionProp {
  title: string
  data : any[]
}

const ContentSection = ({title, data} : ContentSectionProp) => {
  return (
    <section className="main-content-margin-space">
      <div className='flex-align-left'>
        <h2>{title}</h2>  
      </div>
      <ClickScroller Comp={InfoCard} propsList={data} />
    </section>
  )
}


const MainContentView = () => {
    
  const props: InfoCardProp[] = [];

  for (let i = 0; i < 10; ++i)
  {
    props.push({ type:'vertical', title: "THIS IS PXNDX"})
  }

  // Figure out how to pass a Component type to a component to populate a list

  return (
    <div className='view-container-base view-container-scroll-bar main-content-view '>
        <div className="categories-container">
          <CategoriesScroller buttons={["All", "Popular", "Genre"]}/>
        </div>
        {/* need to change the bottom style to css to make it more flexible */}
        <section style={{margin: "0 3%"}}> 
          <div className="recent-albums-container">
            <InfoCard type="horizontal" title='THIS IS PXNDX'/>
            <InfoCard type="horizontal" title='THIS IS PXNDX'/>
            <InfoCard type="horizontal" title='THIS IS PXNDX'/>
            <InfoCard type="horizontal" title='THIS IS PXNDX'/>
            <InfoCard type="horizontal" title='THIS IS PXNDX'/>
            <InfoCard type="horizontal" title='THIS IS PXNDX'/>
            <InfoCard type="horizontal" title='THIS IS PXNDX'/>
            <InfoCard type="horizontal" title='THIS IS PXNDX'/>
          </div>
          <ContentSection title='Made for you' data={props} />
          <ContentSection title='Made for you' data={props} />
          <ContentSection title='Made for you' data={props} />
          <ContentSection title='Made for you' data={props} />
          <ContentSection title='Made for you' data={props} />
        </section>
    </div>
  )
}

export default MainContentView