import React, { useEffect, useState } from 'react'
import SideNavStaff from '../../components/SideNavStaff';
import {useSelector, useDispatch} from 'react-redux'
import {getProfile, editProfile} from '../../utils/redux/actions/adminSlice'

const Staffs = () => {
    const dispatch = useDispatch()
    const editedProfile = useSelector(state => state.admin.editedProfile)
    const profile = useSelector(state => state.admin.profile)
    const [newProfile, setNewProfile] = useState()

    useEffect(() => {
        dispatch(getProfile())
        setNewProfile(profile)
    }, [editedProfile])

    return ( 
        <div className="w-screen h-screen flex bg-[#f1f1f1]">
            
            <SideNavStaff page="history" />
            <div className="flex-1 overflow-hidden  flex-grow divide-y mx-6 mt-4 w-max bg-white rounded-xl">
                <div className="flex justify-between px-8 py-6">
                    <div className="flex justify-between w-full">
                        <h1 className='text-xl font-semibold'>Manage Profile</h1>
                    </div>
                </div>
                { newProfile && <div className="grid grid-cols-2 w-full px-6 py-4">
                    <div className="">
                        <h6 className='py-2'>Name</h6>
                        <input value={newProfile.name} onChange={(e) => setNewProfile({...newProfile, name: e.target.value})} type="text" placeholder='Username' className="px-6 py-2 focus:outline-none rounded-xl bg-gray-100 shadow-inner" />
                    </div>
                    <div className="">
                        <h6 className='py-2'>Address</h6>
                        <input value={newProfile.address} onChange={(e) => setNewProfile({...newProfile, address: e.target.value})} type="text" placeholder='Username' className="px-6 py-2 focus:outline-none rounded-xl bg-gray-100 shadow-inner" />
                    </div>
                    <div className="">
                        <h6 className='py-2'>Receipt Text</h6>
                        <input value={newProfile.receiptText} onChange={(e) => setNewProfile({...newProfile, receiptText: e.target.value})} type="text" placeholder='Username' className="px-6 py-2 focus:outline-none rounded-xl bg-gray-100 shadow-inner" />
                    </div>
                </div>}
                    <button className="ml-6 px-4 py-2 bg-green-500 rounded-xl shadow text-white mt-4">Update Profile</button>
                
            </div>
            
        </div>
     );
}
 
export default Staffs;