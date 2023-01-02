import React, {useState, useMemo, useEffect} from 'react'
import AdminSideNavStaff from '../../components/AdminSideNavStaff';
import {useSelector, useDispatch} from 'react-redux'
import {getAllDiscounts, createDiscount, deleteDiscount} from '../../utils/redux/actions/adminSlice'

const Discounts = () => {
    const dispatch = useDispatch()
    const discounts = useSelector(state => state.admin.allDiscounts)
    const [addCoupon, setAddCoupon] = useState(false)
    const [newCoupon, setNewCoupon] = useState({
        title: '',
        percentage: 0
    })
    const [couponToDelete, setCouponToDelete] = useState()

    useEffect(() => {
        dispatch(getAllDiscounts())
    }, [])


    const handleAddCoupon = () => {
        const {title, percentage} = newCoupon
        if(!title || !percentage) return
        const newData = {
            title,
            percentage
        }
        setAddCoupon(false)
        setNewCoupon({
            title: '',
            percentage: 0
        })
        dispatch(createDiscount(newData))
    }

    const handleDeleteCoupon = () => {
        const {_id} = couponToDelete
        if(!_id) return
        setCouponToDelete(false)
        setNewCoupon({
            title: '',
            percentage: 0
        })
        dispatch(deleteDiscount({_id}))
    }

    return ( 
        <div className="w-screen h-screen flex bg-[#f1f1f1]">
            {couponToDelete && 
                <div className="flex items-center justify-center absolute z-40 bg-[rgba(0,0,0,.5)] w-full h-screen">
                    <div className=" bg-white shadow-xl px-16 py-16 rounded-2xl">
                        <p className="text-xl">Are you sure you want to delete {couponToDelete.title}?</p>
                        <div className="flex gap-4 justify-between pt-6 w-full">
                            <button 
                            onClick={() => setCouponToDelete()}  
                            className="w-full px-8 py-6 bg-green-500 text-white rounded-2xl shadow">Cancel</button>
                            <button 
                            onClick={() => handleDeleteCoupon()}
                            className="w-full px-8 py-6 bg-red-500 text-white rounded-2xl shadow">Delete</button>
                        </div>
                    </div>
                </div>
            }
            
            {addCoupon && <div className="flex items-center justify-center absolute z-40 bg-[rgba(0,0,0,.5)] w-full h-screen">
                <div 
                className=" bg-white shadow-xl px-6 py-6 rounded-2xl">
                   <div className="">
                        <h6 className='py-2'>Coupon Name</h6>
                        <input value={newCoupon.title} onChange={(e) => setNewCoupon({...newCoupon, title: e.target.value})} type="text" placeholder='Coupon Title' className="px-6 py-2 focus:outline-none rounded-xl bg-gray-100 shadow-inner" />
                   </div>
                   <div className="">
                        <h6 className='py-2'>Price</h6>
                        <input value={newCoupon.percentage} min={1} max={100} onChange={(e) => setNewCoupon({...newCoupon, percentage: e.target.value})} type="number" placeholder='Percentage 1 - 100' className="px-6 py-2 focus:outline-none rounded-xl bg-gray-100 shadow-inner" />
                   </div>
                   
                   <div className="flex pt-4 justify-between gap-4">
                        <button onClick={() => setAddCoupon(null, setNewCoupon({
                            title: '',
                            percentage: 0
                        }))} className="px-6 w-full py-3 rounded-xl shadow text-white bg-red-500">Cancel</button>
                        <button onClick={() => handleAddCoupon()} className="px-6 w-full py-3 rounded-xl shadow text-white bg-green-500">Create</button>
                   </div>
                   </div>
                </div>
                }
            <AdminSideNavStaff page="coupons" />
            <div className="flex-1 flex-grow divide-y mx-6 mt-4 w-full  bg-white rounded-xl">
                <div className="flex justify-between px-8 py-6">
                    <h1 className='text-xl font-semibold'>Discount Coupons</h1>
                    <button onClick={() => setAddCoupon(true)} className="px-6 py-2 bg-blue-500 text-white rounded-xl shadow">New Coupon</button>
                </div>
                
                <div className="px-6 py-4 overflow-y-scroll h-[calc(100%-25%)]">
                <table className="table-auto py-4 mx-6 w-8/12 text-left">
                    <thead className='border-b sticky border-gray-200 py-2'>
                        <tr className='my-2 font-normal'>
                            <th className='py-2 font-normal w-full'>Title</th>
                            <th className='py-2 font-normal w-full'>Percentage</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            discounts && discounts.map(item => (
                                <tr key={item._id}>
                                    <td className='py-2 w-full border-b border-gray-100'>{item.title}</td>
                                    <td className='py-2 px-32 border-b border-gray-100'>{item.percentage}%</td>
                                    <td className="px-4">
                                        <button onClick={() => setCouponToDelete(item)} className="px-4 py-2 rounded-xl text-white shadow bg-red-500">Delete Coupon</button>
                                    </td>
                                </tr>
                            ))
                        }

                    </tbody>
                    </table>
                    {
                        !discounts[0] &&
                        <h1 className="text-3xl text-gray-300 text-center mx-auto pt-16">No coupon is found</h1>
                    }
                </div>
            </div>
        </div>
     );
}
 
export default Discounts;