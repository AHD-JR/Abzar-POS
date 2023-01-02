import { Navigate } from "react-router-dom";
import jwt from 'jwt-decode'
import {useDispatch} from 'react-redux'
import {signOut} from '../utils/redux/actions/staffSlice'

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch()
  // const USER = JSON.parse(localStorage.getItem("USER_TEMP"))
  const D = new Date()
  if (!JSON.parse(localStorage.getItem("USER_TEMP")) || jwt(JSON.parse(localStorage.getItem("USER_TEMP")).token).exp < D.getTime()/1000 ||  jwt(JSON.parse(localStorage.getItem("USER_TEMP")).token).role !== "Staff" ) {
    dispatch(signOut())
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute