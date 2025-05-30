import React from 'react';
import ReactDOM from 'react-dom/client';
import './Style/global.css';
import './index.css';
import App from './App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ProductExplore from './Components/ProductExplore';
import LoginPage from './Components/Login';
import Signup from './Components/Signup';
import HomePage from './Components/Home';
import SearchResult from './Components/SearchResult';

const router = createBrowserRouter([
  {
    path:'/',
    element:<App/>,
    children:[
      {
        path:'/',
        element:<HomePage/>
      },
      {
        path:'/explore',
        element:<ProductExplore/>
      },
      {
        path:'/login',
        element:<LoginPage/>
      },
      {
        path:'/signup',
        element:<Signup/>
      },
      {
        path:'/search',
        element:<SearchResult/>
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);