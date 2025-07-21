import React from 'react'
import { Navigate, useLocation } from 'react-router-dom';

function CheckAuth({isAuthenticated,user,children}) {
  const location = useLocation();
  
  // Create proper auth path check
  const isAuthRoute = location.pathname.startsWith('/auth');
  
  if(!isAuthenticated) {
    // Redirect to login only if not on auth route
    if(!isAuthRoute) {
      return <Navigate to='/auth/login'/>
    }
  }
  else if(isAuthRoute) {
    // Redirect away from auth routes if logged in
    if(user?.role === 'admin'){
      return <Navigate to='/admin/dashboard'/>
    }
    return <Navigate to='/shop/home'/>
  }
  
  // Role-based access control
  if(user?.role !== 'admin' && location.pathname.startsWith('/admin')){
    return <Navigate to='/unauth'/>
  }
  
  if(user?.role === 'admin' && location.pathname.startsWith('/shop')){
    return <Navigate to='/admin/dashboard'/>
  }

  return <>{children}</>;
}

export default CheckAuth;
