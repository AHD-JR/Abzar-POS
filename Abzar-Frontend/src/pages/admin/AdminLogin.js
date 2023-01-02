import React, {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {signIn} from '../../utils/redux/actions/adminSlice'

export default function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const admin = useSelector((state) => state.admin.admin)
  const [userInfo, setUserInfo] = useState({
    username: '',
    password: ''
})
    const [error, setError] = useState(null)

    const handleSetInfo = (update) => {
      setUserInfo(prevState => {
            const newState = {
                ...prevState,
                ...update
            }
            return newState
        })
    }

    const handleLogin = () => {
        if(userInfo.username.length < 4) return setError("Username must be more than 4 chars.")
        if(userInfo.password.length < 6) return setError("Password must be more than 4 chars and contain at least one number.")
        dispatch(signIn({...userInfo}))
        // if(admin) navigate("/dashboard", {to: true})
    }

    useEffect(() => {
        if(admin && admin._id) navigate("/dashboard", {to: true})
    }, [admin])

  return (
    <div className="bg-[#F1F7FC] grid place-items-center h-screen">
        <div className="bg-white py-6 place-items-center w-80 grid gap-4 rounded-[32px] shadow-lg px-8 pb-12 items-center mx-auto">
            <img src="/logo.png" alt="" className="mx-auto w-32" />
            <input value={userInfo.username} onChange={(e) => handleSetInfo({username: e.target.value})} type="text" placeholder='Username' className="px-6 py-[10px] w-10/12 bg-[#F8F8F8] focus:outline-none mx-auto rounded-full shadow-inner" />
            <input value={userInfo.password} onChange={(e) => handleSetInfo({password: e.target.value})} type="password" placeholder='Password' className="px-6 py-[10px] w-10/12 bg-[#F8F8F8] focus:outline-none mx-auto rounded-full shadow-inner" />
            <button onClick={() => handleLogin()} className="px-6 py-[10px] bg-green-500 text-white font-bold w-10/12 focus:outline-none mx-auto rounded-full shadow-inner">Login</button>
            {
                admin && admin.loginError && admin.loginError.msg && <h1 className='text-red-400'>{admin.loginError.msg}</h1>
            }
            {
                error && <h1 className='text-red-400 text-xs'>{error}</h1>
            }
        </div>
    </div>
  )
}
