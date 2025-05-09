import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import SpotifyLogo from '../assets/spotify-logo.svg'
import HomeLogo from '../assets/home.svg'
// import SearchLogo from '../assets/search.svg'
import BrowseLogo from '../assets/vinyls-browse.svg?react'
import SearchLogo from '../assets/search.svg?react';
import XLogo from '../assets/cross.svg?react';
import useAPIReq, { RequestType } from '../hooks/useAPIReq';
import axios, { AxiosRequestConfig } from 'axios';
import { useUserContext } from '../hooks/useUserContext';

const getUserImage = (data: {images : string[]}) => {
  return data.images[0];
};

const userHasImage = (data: {images : object[]}) => {
  return data.images.length > 0;
};

const getFirstLetter = (data: {display_name : string}) => {

  const name = data.display_name;

  if (name.length <= 0) return '?';

  return name[0].toUpperCase();
};

 
const handleUserImage = (data: any) => {

  if (!data || !data.display_name) return <span className='profile-icon profile-icon-text' style={{backgroundColor: "rgb(25, 230, 140)"}}>?</span>;

  return userHasImage(data) ?
                 <div className="profile-icon circular-mask red-border-1px">
                   <img src={getUserImage(data)} style={{width: '100%', height: '100%'}}/> 
                  </div> 
                  : <span className='profile-icon profile-icon-text' style={{backgroundColor: "rgb(25, 230, 140)"}}>
                      {getFirstLetter(data)}
                        </span>
};

// enum LoginState {
//   CheckingStatus,
//   FetchedError, 
//   TimedOut,
//   Neutral
// }


const Navbar = () => {

  const [isInputFocus, SetInputFocus] = useState<boolean>(false);
  // const [logingState, setLoginState] = useState<LoginState>(LoginState.Neutral);

  const loginReqConfigs = useMemo( ()=> {
          return   {
                      method: RequestType.GET,
                      url: '/login-status'
                    }
        }, []) 

  const userReqConfigs = useMemo( ()=> {
          return   {
                      method: RequestType.GET,
                      url: '/me'
                    }
        }, []) 
                                                     
  const userContext = useUserContext();
  const user = userContext.user;

  const myAxiosInstance = useMemo(() => {
      return axios.create({ baseURL: 'http://localhost:8888' });
    }, []);


  const loginReq = useAPIReq({
    axiosConfigs: loginReqConfigs,  
    axiosInstance: myAxiosInstance,
    onMount: true
  });

  const userInfoReq = useAPIReq({
    axiosConfigs: userReqConfigs,  
    axiosInstance: myAxiosInstance,
    onMount: false,
  });

  useEffect(() => {

    console.log('Login Data', loginReq.data);
    console.log('Is user logged in?', user.loggedIn);

    // only return if user is logged in and there was no error in the userReq

    if (loginReq.error && user.loggedIn)
    {
      console.warn('Logging out');
      userContext.logout();
      return;
    }

    if (!loginReq.data){
      console.warn('No Loggin request data');
      return;
    }

    if (loginReq.data.status)
    {
      console.log('Successfully Logged in');
      userContext.login({loggedIn : true});
      console.log('fetching user data');
      userInfoReq.refetch();
    }

    else if (user.loggedIn) 
    {
      console.log('Forced Logging out');
      userContext.logout();
    }

  }, [loginReq.data, loginReq.error])


  useEffect(() => {

    if (!userInfoReq.error) return; // no error exit

    if (userInfoReq.error === 'CanceledError') return; // it is a canceled error
  
    console.log('User is logged in but user data was not received. Checking if we are still logged in...')
    
    loginReq.refetch();

  }, [userInfoReq.error])

  return (
    <nav id="navbar">
      
        <button>
          <img src={SpotifyLogo} className='logo' />
        </button>
        
        {
          !user.loggedIn ? <a href="http://localhost:8888/login" rel="noopener noreferrer"> Login </a>
                  : <></>
        }
        
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
            {
              handleUserImage(userInfoReq.data)
            }  
        </button>
    </nav>
  )
}

export default Navbar