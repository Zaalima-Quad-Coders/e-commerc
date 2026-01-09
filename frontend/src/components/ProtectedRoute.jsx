import React from 'react'
import { useSelector } from 'react-redux'
import Loder from './Loder';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = (element) => {
    const {isAuthenticated,loading} = useSelector(state=>state.user);
    if (loading){
        return <Loder/>
    }
    if(!isAuthenticated){
        return <Navigate to ="/login"/>
    }
  return element
}

export default ProtectedRoute