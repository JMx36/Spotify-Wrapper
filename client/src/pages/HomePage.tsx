import React from 'react'
import MainContentView from '../components/MainContentView'
import LeftBarView from '../components/LeftBarView'


const HomePage = () => {


  return (
    <div className="app-content-view">
      <LeftBarView/>
      <MainContentView/>
    </div>
  )
}

export default HomePage