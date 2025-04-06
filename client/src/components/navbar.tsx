import React, { useState } from 'react'
import SpotifyLogo from '../assets/spotify-logo.svg'
import HomeLogo from '../assets/home.svg'
// import SearchLogo from '../assets/search.svg'
import BrowseLogo from '../assets/vinyls-browse.svg?react'
import SearchLogo from '../assets/search.svg?react';
import XLogo from '../assets/cross.svg?react';


const Navbar = () => {

  const [isInputFocus, SetInputFocus] = useState(false);

  return (
    <nav id="navbar">
        <button>
          <img src={SpotifyLogo} className='logo' />
        </button>
        <div className='middle-section'>
          <button className="navbar-btn">
            <img src={HomeLogo} className="btn-logo"/>
          </button>
          <form role="search" className="form-container">
            <SearchLogo className={`navbar-form-icon ${isInputFocus ? "search-focus-effect" : ""}`}/>
            <input type="text" placeholder='What would you like to play?' onFocus={() => SetInputFocus(true)} onBlur={() => SetInputFocus(false)}/>
            <div className='form-side-btns'>
              <button className="navbar-form-btn cross-logo">
                <XLogo className="navbar-form-btn-icon" />
              </button>
              <button className="navbar-form-btn">
                <BrowseLogo className="navbar-form-btn-icon" />
              </button>
            </div>
            
          </form>
        </div>
        <button className="navbar-btn">
            {/* <img src={HomeLogo} className="btn-logo"/> */}
            <div className="btn-logo profile-icon  circular-mask" style={{backgroundColor: "green"}}></div>
        </button>
    </nav>
  )
}

export default Navbar