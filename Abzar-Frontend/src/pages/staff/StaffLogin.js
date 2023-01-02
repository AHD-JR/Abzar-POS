import React, { useEffect, useState } from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {signIn} from '../../utils/redux/actions/staffSlice'
import { useNavigate } from 'react-router-dom'

export default function StaffLogin() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const staff = useSelector((state) => state.staff.staff)
    const [userInfo, setStaffInfo] = useState({
        username: '',
        password: ''
    })
    const [error, setError] = useState(null)

    const handleSetInfo = (update) => {
        setError(null)
        setStaffInfo(prevState => {
            const newState = {
                ...prevState,
                ...update
            }
            return newState
        })
    }

    const handleLogin = () => {
        if(userInfo.username.length < 4) return setError("Username must be more than 4 chars.")
        if(userInfo.password.length < 6) return setError("Password must be more than 4 chars.")
        dispatch(signIn({...userInfo}))
        // if(staff) navigate("/sales", {to: true})
    }

    useEffect(() => {
        if(staff && staff._id) navigate("/sales", {to: true})
    }, [staff])

  return (
    <div className="bg-[#F1F7FC] grid place-items-center h-screen">
        <div className="bg-white py-6 place-items-center w-80 grid gap-4 rounded-[32px] shadow-lg px-8 pb-12 items-center mx-auto">
            <img src="/logo.png" alt="" className="mx-auto w-32" />
            <input type="text" value={userInfo.username} onChange={(e) => handleSetInfo({username: e.target.value})} placeholder='Username' className="px-6 py-[10px] w-10/12 bg-[#F8F8F8] focus:outline-none mx-auto rounded-full shadow-inner" />
            <input type="password" value={userInfo.password} onChange={(e) => handleSetInfo({password: e.target.value})} placeholder='Password' className="px-6 py-[10px] w-10/12 bg-[#F8F8F8] focus:outline-none mx-auto rounded-full shadow-inner" />
            <button onClick={() => handleLogin()} className="px-6 py-[10px] bg-green-500 text-white font-bold w-10/12 focus:outline-none mx-auto rounded-full shadow-inner">Login</button>
            {
                staff && staff.loginError && staff.loginError.msg && <h1 className='text-red-400'>{staff.loginError.msg}</h1>
            }
            {
                error && <h1 className='text-red-400 text-xs'>{error}</h1>
            }
        </div>
    </div>
  )
}
