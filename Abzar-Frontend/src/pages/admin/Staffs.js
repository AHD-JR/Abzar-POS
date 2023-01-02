import React, { useEffect, useState } from 'react'
import AdminSideNavStaff from '../../components/AdminSideNavStaff';
import {useSelector, useDispatch} from 'react-redux'
import {createStaff, getAllStaff, deleteStaff, editStaff} from '../../utils/redux/actions/adminSlice'

const Staffs = () => {
    const dispatch = useDispatch()
    const staffs = useSelector(state => state.admin.allStaffs)
    const createdStaff = useSelector(state => state.admin.createdStaff)
    const deletedStaff = useSelector(state => state.admin.deletedStaff)
    const adminInfo = JSON.parse(localStorage.getItem("USER_TEMP"))
    const [addStaff, setAddStaff] = useState(false)
    const [staffToDelete, setStaffToDelete] = useState()
    const [newStaffDetails, setNewStaffDetails] = useState()
    const [newStaff, setNewStaff] = useState({
        firstName: '',
        lastName: '',
        password: '',
        username: '',
        role: 'Staff'
    })

    useEffect(() => {
        dispatch(getAllStaff())
        setStaffToDelete()
    }, [createdStaff, deletedStaff])

    const handleAddStaff = () => {
        const {lastName, firstName, role, password, username} = newStaff
        if(!lastName || !firstName || !password || !username) return
        dispatch(createStaff({
            firstName,
            lastName,
            username,
            password,
            role
        }))
        setNewStaff({
            firstName: '',
            lastName: '',
            password: '',
            username: '',
            role: 'Staff'
        })
        setAddStaff(false)
    }

    return ( 
        <div className="w-screen h-screen text-sm flex bg-[#f1f1f1]">
             {staffToDelete && 
                <div className="flex items-center justify-center absolute z-40 bg-[rgba(0,0,0,.5)] w-full h-screen">
                    <div className=" bg-white shadow-xl px-16 py-16 rounded-2xl">
                        <p className="text-xl">Are you sure you want to delete {staffToDelete.name}?</p>
                        <div className="flex gap-4 justify-between pt-6 w-full">
                            <button 
                            onClick={() => setStaffToDelete()}  
                            className="w-full px-8 py-6 bg-green-500 text-white rounded-2xl shadow">Cancel</button>
                            <button 
                            onClick={() => dispatch(deleteStaff(staffToDelete))}
                            className="w-full px-8 py-6 bg-red-500 text-white rounded-2xl shadow">Delete</button>
                        </div>
                    </div>
                </div>
            }
            {addStaff && 
                <div className="flex items-center justify-center absolute z-40 bg-[rgba(0,0,0,.5)] w-full h-screen">
                    <div className=" bg-white shadow-xl px-16 py-16 rounded-2xl">
                    <div className="">
                        <h6 className='py-2'>Username</h6>
                        <input value={newStaff.username} onChange={(e) => setNewStaff({...newStaff, username: e.target.value})} type="text" placeholder='Username' className="px-6 py-2 focus:outline-none rounded-xl bg-gray-100 shadow-inner" />
                    </div>
                    <div className="">
                        <h6 className='py-2'>First Name</h6>
                        <input value={newStaff.firstName} onChange={(e) => setNewStaff({...newStaff, firstName: e.target.value})} type="text" placeholder='First Name' className="px-6 py-2 focus:outline-none rounded-xl bg-gray-100 shadow-inner" />
                    </div>
                    <div className="">
                        <h6 className='py-2'>Last Name</h6>
                        <input value={newStaff.lastName} onChange={(e) => setNewStaff({...newStaff, lastName: e.target.value})} type="text" placeholder='Last Name' className="px-6 py-2 focus:outline-none rounded-xl bg-gray-100 shadow-inner" />
                    </div>
                    <div className="">
                        <h6 className='py-2'>Password</h6>
                        <input value={newStaff.password} onChange={(e) => setNewStaff({...newStaff, password: e.target.value})} type="text" placeholder='Password' className="px-6 py-2 focus:outline-none rounded-xl bg-gray-100 shadow-inner" />
                    </div>
                    <select defaultValue={newStaff.role} onChange={(e) => setNewStaff({...newStaff, role: e.target.value})}  className="px-6 py-2 mt-4 focus:outline-none rounded-xl bg-gray-100 shadow border">
                        <option value={"Staff"}>Staff</option>
                        <option value={"Admin"}>Admin</option>
                    </select>
                    <div className="flex gap-4 justify-between pt-6 w-full">
                        <button 
                        onClick={() => setAddStaff(false)}  
                        className="w-full px-6 py-2 bg-green-500 text-white rounded-2xl shadow">Cancel</button>
                        <button 
                        onClick={() => handleAddStaff()}
                        className="w-full px-6 py-2 bg-red-500 text-white rounded-2xl shadow">Create Staff</button>
                    </div>
                </div>
            </div>
            }
            {newStaffDetails &&
                <div className="flex items-center justify-center absolute z-40 bg-[rgba(0,0,0,.5)] w-full h-screen">
                    <div className=" bg-white shadow-xl px-16 py-16 rounded-2xl">
                        <div className="">
                            <h6 className='py-2'>Username</h6>
                            <input value={newStaffDetails.username} onChange={(e) => setNewStaffDetails({...newStaffDetails, username: e.target.value})} type="text" placeholder='Username' className="px-6 py-2 focus:outline-none rounded-xl bg-gray-100 shadow-inner" />
                        </div>
                        <div className="">
                            <h6 className='py-2'>First Name</h6>
                            <input value={newStaffDetails.firstName} onChange={(e) => setNewStaffDetails({...newStaffDetails, firstName: e.target.value})} type="text" placeholder='First Name' className="px-6 py-2 focus:outline-none rounded-xl bg-gray-100 shadow-inner" />
                        </div>
                        <div className="">
                            <h6 className='py-2'>Last Name</h6>
                            <input value={newStaffDetails.lastName} onChange={(e) => setNewStaffDetails({...newStaffDetails, lastName: e.target.value})} type="text" placeholder='Last Name' className="px-6 py-2 focus:outline-none rounded-xl bg-gray-100 shadow-inner" />
                        </div>
                        <div className="">
                            <h6 className='py-2'>Password</h6>
                            <input value={newStaffDetails.password} onChange={(e) => setNewStaffDetails({...newStaffDetails, password: e.target.value})} type="text" placeholder='Password' className="px-6 py-2 focus:outline-none rounded-xl bg-gray-100 shadow-inner" />
                        </div>
                        <div className="flex gap-4 justify-between pt-6 w-full">
                            <button 
                            onClick={() => setAddStaff(false, setNewStaffDetails())}  
                            className="w-full px-6 py-2 bg-green-500 text-white rounded-2xl shadow">Cancel</button>
                            <button 
                            onClick={() => dispatch(editStaff(newStaffDetails))}
                            className="w-full px-6 py-2 bg-red-500 text-white rounded-2xl shadow">Edit Staff</button>
                        </div>
                    </div>
                </div>
            }
            <AdminSideNavStaff page="staffs" />
            <div className="flex-1 overflow-hidden  flex-grow divide-y mx-6 mt-4 w-full bg-white rounded-xl">
                <div className="flex items-center justify-between px-8 py-4">
                    <div className="flex items-center justify-between w-full">
                        <h1 className='text-lg font-semibold'>Staffs</h1>
                        <button onClick={() => setAddStaff(true)} className="px-6 py-2 bg-blue-500 text-white rounded-xl shadow">Add Staff</button>
                    </div>
                </div>
                <div className="px-6 overflow-y-scroll h-[calc(100%-10%)]">
                    <div className=" h-full">
                    <table className="mt-4 py-4 w-full text-left">
                        <thead className='border-b border-gray-200 py-2'>
                            <tr className='my-2 font-normal'>
                                <th className='py-2 font-normal'>Username</th>
                                <th className='py-2 font-normal'>FullName</th>
                                <th className='py-2 font-normal'>Role</th>
                                
                                {/* <th className='py-2 font-normal'>Host</th> */}
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                staffs && staffs.staffs && staffs.staffs.map(staff => (
                                    <tr key={staff._id}>
                                        <td className='py-2'>{staff.username}</td>
                                        <td className='py-2'>{staff.firstName} {staff.lastName}</td>
                                        <td className='py-2'>{staff.role}</td>
                                        <td className='py-2'>
                                            <button onClick={() => setNewStaffDetails({...staff, password: ''})} className="px-4 py-2 bg-blue-500 text-white shadow rounded-xl">Edit</button>
                                            <button onClick={() => setStaffToDelete(staff)} className="px-4 py-2 bg-red-500 text-white shadow rounded-xl ml-4">Delete</button>
                                            {/* <button onClick={() => setSelectedOrder(order)} className="px-4 py-2 bg-red-500 text-white rounded-xl">Revoke</button> */}
                                        </td>
                                    </tr>
                                ))
                            }
                            {
                                staffs && staffs.admins && staffs.admins.map(admin => (
                                    <tr key={admin._id}>
                                        <td className='py-2'>{admin.username}</td>
                                        <td className='py-2'>{admin.firstName} {admin.lastName}</td>
                                        <td className='py-2'>{admin.role}</td>
                                        <td className='py-2'>
                                            <button onClick={() => setNewStaffDetails({...admin, password: ''})} className="px-4 py-2 bg-blue-500 text-white shadow rounded-xl">Edit</button>
                                            <button disabled={(admin._id === adminInfo._id)} onClick={() => setStaffToDelete(admin)} className={`px-4 py-2 bg-red-500 text-white shadow rounded-xl ml-4 ${admin._id === adminInfo._id ? "hidden" :  ""}`}>Delete</button>
                                            {
                                                console.log(admin._id, )
                                            }
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
        </div>
     );
}
 
export default Staffs;