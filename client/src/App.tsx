import { Route, createBrowserRouter, 
  createRoutesFromElements, 
  RouterProvider
} from 'react-router-dom';

import './App.css'
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import { UserProvider } from './hooks/useUserContext';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route index element={<HomePage />} ></Route>
    </Route>

  )
);


function App() {
  
  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  )
}

export default App
