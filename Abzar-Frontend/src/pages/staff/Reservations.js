import React, { useEffect, useState } from 'react'
import SideNavStaff from '../../components/SideNavStaff';
import {useSelector, useDispatch} from 'react-redux'
import {fulfilReservation, getReservationHistory} from '../../utils/redux/actions/staffSlice'
import jwtDecode from "jwt-decode";
import printJS from "print-js";
import Receipt from '../../components/Receipt';

const Reservations = () => {
    const dispatch = useDispatch()
    const reservations = useSelector(state => state.staff.reservationsHistory)
    const fulfilledReservation = useSelector(state => state.staff.fulfilledReservation)
    const [selectedPage, setSelectedPage] = useState(0)
    const [selectedReservation, setSelectedReservation] = useState()
    const [pickedOrder, setPickedOrder] = useState(null);

  const staff = jwtDecode(JSON.parse(localStorage.getItem("USER_TEMP")).token);


    useEffect(() => {
        dispatch(getReservationHistory({nextPage: selectedPage}))
    }, [selectedPage, fulfilledReservation])

    const handleIterate = (iteration) => {
        if(iteration === "+" && selectedPage === reservations.pagesCount - 1) return
        if(iteration === "-" && selectedPage === 0) return
        if(iteration === "+") return setSelectedPage(selectedPage+1)
        if(iteration === "-") return setSelectedPage(selectedPage-1)
    }

    const handleFulfilReservation = () => {
        if(!selectedReservation._id) return
        dispatch(fulfilReservation({_id: selectedReservation._id, staff: staff._id}))
        setSelectedReservation()
    }

    const D = (date) => new Date(date).toLocaleString('en-US', {
        timeZone: 'Africa/Lagos'
        })

    return ( 
        <div className="w-screen h-screen flex text-sm bg-[#f1f1f1]">
            {selectedReservation && 
                <div className="flex items-center justify-center absolute z-40 bg-[rgba(0,0,0,.5)] w-full h-screen">
                    <div className=" bg-white shadow-xl px-16 py-16 rounded-2xl">
                        <p className="text-xl">Are you sure you want to fulfil reservation {selectedReservation.receiptNo}?</p>
                        <div className="flex gap-4 justify-between pt-6 w-full">
                                <button 
                                onClick={() => setSelectedReservation()}  
                                className="w-full px-8 py-6 bg-green-500 text-white rounded-2xl shadow">Cancel</button>
                                <button 
                                onClick={() => handleFulfilReservation()}
                                className="w-full px-8 py-6 bg-red-500 text-white rounded-2xl shadow">Fulfil Order</button>
                            </div>
                    </div>
                </div>
            }
            {pickedOrder && (
        <div className="flex absolute w-full h-screen bg-black bg-opacity-50 justify-center items-center pt-2 px-4">
          {pickedOrder && pickedOrder.items && (
            <Receipt value={pickedOrder} staff={staff} />
          )}
          <div className="flex flex-col bg-white w-96 px-16 rounded-r-xl h-5/6 py-32 ">
            <button
              className="bg-blue-500 ring-4 rounded-t-xl h-screen w-full text-white px-6 py-2"
              type="button"
              onClick={() =>
                printJS({
                  printable: "receipt",
                  css: [
                    "https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css",
                    "font-size: 10px",
                  ],
                  type: "html",
                  scanStyles: true,
                })
              }
            >
              Print Receipt
            </button>
            <button
              className="bg-red-500 ring-4 ring-red-400 rounded-b-xl h-screen w-full text-white px-6 py-2"
              type="button"
              onClick={() => setPickedOrder(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
            <SideNavStaff page="reservations" />
            <div className="flex-1 overflow-hidden  flex-grow divide-y mx-6 mt-4 w-full bg-white rounded-xl">
                <div className="flex justify-between px-8 py-6">
                    <h1 className='text-xl font-semibold'>Reservations History</h1>
                    <div className="flex">
                        <button onClick={() => handleIterate("-")} className={`px-4 py-3  border rounded-l-xl ${selectedPage === 0 ? "border-gray-200 bg-gray-100" : "border-green-100 bg-green-500 text-white"  }`}>Prev</button>
                        <button onClick={() => handleIterate("+")} className={`px-4 py-3 border rounded-r-xl ${selectedPage < reservations.pagesCount - 1 ? "border-green-100 bg-green-500 text-white" : "border-gray-200 bg-gray-100" }`}>Next</button>
                    </div>
                </div>
                <div className="px-6 overflow-hidden h-[calc(100%-100px)]">
                    <div className=" h-full">
                    <table className="mt-4 py-4 w-full text-left">
                        <thead className='border-b border-gray-200 py-2'>
                            <tr className='my-2 font-normal'>
                                <th className='py-2 font-normal'>Order #</th>
                                <th className='py-2 font-normal'>Order Type</th>
                                {/* <th className='py-2 font-normal'>Time</th> */}
                                <th className='py-2 font-normal'>Date</th>
                                <th className='py-2 font-normal'>Customer</th>
                                <th className='py-2 font-normal'>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                reservations && reservations.orders && reservations.orders.filter(order => order.revoked === false).map(order => (
                                    <tr key={order._id}>
                                        <td className='py-2'>{order.receiptNo}</td>
                                        <td className='py-2'>{order.orderType}</td>
                                        {/* <td className='py-2'>{new Date(order.createdAt).toTimeString().substr(0,5)}</td> */}
                                        <td className='py-2'>{D(order.createdAt)}</td>
                                        <td className='py-2'>{order.customer}</td>
                                        <td className={`py-2 ${order.reservationFulfilled ? "text-green-500" : "text-red-500"}`}>{order.reservationFulfilled ? "Fulfilled" : "Unfulfilled"}</td>
                                        <td className='py-2'>
                                            {
                                                order.reservationFulfilled ?
                                                <button className="px-4 py-2 bg-gray-100 text-gray-300 rounded-xl">Fulfill</button>
                                                :
                                                <button onClick={() => setSelectedReservation(order)} className="px-4 py-2 bg-green-500 text-white rounded-xl">Fulfill</button>
                                            }
                                        </td>
                                        <td className="py-2">
                                            <button
                                            onClick={() => setPickedOrder(order)}
                                            className="px-4 py-2 text-white bg-blue-500 rounded-lg shadow"
                                            >
                                            View
                                            </button>
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
 
export default Reservations;