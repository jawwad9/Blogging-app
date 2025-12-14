import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Layout.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import AllBlogs from './pages/AllBlogs.jsx'
import Profile from './pages/Profile.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Userblog from './pages/Userblog.jsx'
let router = createBrowserRouter([{
  path:'/',
  element:<Layout/>,
  children:[
    {
      path:'',
      element:<AllBlogs/>
    },
    {
      path:'login',
      element:<Login/>,
    },
    {
      path:'register',
      element:<Register/>
    },
    {
      path:'allblogs',
      element:<AllBlogs/>
    },
    {
      path:'profile',
      element:<Profile/>
    },
    {
      path:'dashboard',
      element:<Dashboard/>
    },{
      path:"/userblog/:uid",
       element:<Userblog />
    }
  ]
}])


createRoot(document.getElementById('root')).render(
  <>
  <RouterProvider router={router} >

    <App />
  </RouterProvider>
  </>
)
