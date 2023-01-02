import { Navigate } from "react-router-dom";
import jwt from 'jwt-decode'
import {useDispatch} from 'react-redux'
import {signOut} from '../utils/redux/actions/staffSlice'

const AdminRoute = ({ user, children }) => {
  const dispatch = useDispatch()
  const USER = JSON.parse(localStorage.getItem("USER_TEMP"))
  const D = new Date()
  if (!USER || jwt(USER.token).exp < D.getTime()/1000 ||  jwt(USER.token).role !== "Admin" ) {
    dispatch(signOut())
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default AdminRoute