import React, { useEffect, useState } from 'react'
import SideNav from '../../components/SideNavStaff';
import {useSelector, useDispatch} from 'react-redux'
import {revokeOrder, getDebtHistory} from '../../utils/redux/actions/staffSlice'
import {v4 as uuid} from 'uuid'
import { InboxIcon } from '@heroicons/react/24/outline';
import Receipt from '../../components/Receipt';
import ModalComponent from '../../components/ModalComp';
import printJS from "print-js";
import axios from '../../utils/axios';

const Debt = () => {
    const dispatch = useDispatch()
    const orders = useSelector(state => state.staff.debtHistory)
    const staff = useSelector(state => state.staff.staff)
    const revokedOrder = useSelector(state => state.staff.revokedOrder)
    const [selectedPage, setSelectedPage] = useState(0)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [showPaymentModal, setShowPaymentModal] = useState(false)
    const [showReceipt, setShowReceipt] = useState(false)
    const [showRevoke, setShowRevoke] = useState(false)

    useEffect(() => {
        dispatch(getDebtHistory({page: selectedPage}))
    }, [selectedPage, revokedOrder])

    const handleIterate = (iteration) => {
        if(iteration === "+" && selectedPage === orders.pagesCount - 1) return
        if(iteration === "-" && selectedPage === 0) return
        if(iteration === "+") return setSelectedPage(selectedPage+1)
        if(iteration === "-") return setSelectedPage(selectedPage-1)
    }

    const handlePayDebt = () => {
        if(!selectedOrder) return
        axios.put(`/staff/debt/resolve`, {
            _id: selectedOrder._id,
            amount: (selectedOrder.items.map(item => item.item.price * item.qty).reduce((prev, curr) => prev + curr, 0)) - selectedOrder.discount
        }).then(res => {
            dispatch(getDebtHistory({nextPage: selectedPage + 1}))
            setSelectedOrder()
        }).catch(err => {
            console.log(err)
        })
    }


    const handleRevokeOrder = () => {
        if(!selectedOrder) return
        dispatch(revokeOrder({_id: selectedOrder._id}))
        setShowRevoke(false)
        setSelectedOrder()

    }

    const D = (date) => new Date(date).toLocaleString('en-US', {
        timeZone: 'Africa/Lagos'
        })

    return ( 
        <div className="w-screen h-screen flex bg-[#f1f1f1]">
        {selectedOrder && showRevoke && (
          <ModalComponent
            show={selectedOrder && showRevoke}
            setShow={setSelectedOrder}
            title="Revoke Order"
          >
            <div className="flex flex-col gap-4 justify-between pl-10 pt-6 w-full">
              <p className="text-xl">
                Are you sure you want to revoke order #{selectedOrder.receiptNo}
                ?
              </p>
              <div className="flex gap-4 justify-between pt-6 w-full">
                <button
                  onClick={() => setShowRevoke(false)}
                  className="w-full px-8 py-6 bg-green-500 text-white rounded-2xl shadow"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRevokeOrder()}
                  className="w-full px-8 py-6 bg-red-500 text-white rounded-2xl shadow"
                >
                  Confirm
                </button>
              </div>
            </div>
          </ModalComponent>
        )}
        {selectedOrder && showPaymentModal && (
          <div className="flex items-center justify-center absolute z-40 bg-[rgba(0,0,0,.5)] w-full h-screen">
            <div className=" bg-white shadow-xl px-16 py-16 rounded-2xl">
              <p className="text-xl">
                Are you sure you want to mark order #{selectedOrder.receiptNo}{" "}
                as paid?
              </p>
              <div className="flex gap-4 justify-between pt-6 w-full">
                <button
                  onClick={() => setSelectedOrder()}
                  className="w-full px-8 py-6 bg-green-500 text-white rounded-2xl shadow"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handlePayDebt()}
                  className="w-full px-8 py-6 bg-red-500 text-white rounded-2xl shadow"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
        {selectedOrder && showReceipt && (
          <ModalComponent
            show={selectedOrder}
            setShow={setSelectedOrder}
            title=""
          >
            <div className="flex justify-between overflow-hidden items-center">
              <div id="receipt" className="w-[1024px]">
                <Receipt
                  staff={{
                    firstName: "Admin",
                    lastName: "",
                  }}
                  value={selectedOrder}
                />
              </div>
              <div className="flex flex-col gap-4 justify-between pl-10 pt-6 w-full">
                <button
                  onClick={() => setSelectedOrder()}
                  className="w-full px-16 py-16 bg-green-500 text-white rounded-2xl shadow"
                >
                  Close
                </button>
                <button
                  onClick={() =>
                    printJS({
                      printable: "receipt",
                      css: [
                        "https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css",
                      ],
                      type: "html",
                      scanStyles: true,
                    })
                  }
                  className="w-full px-16 py-16 bg-blue-500 text-white rounded-2xl shadow"
                >
                  Print
                </button>
              </div>
            </div>
          </ModalComponent>
        )}
        <SideNav page="debtbook" />
        <div className="flex-1 text-sm overflow-hidden  flex-grow divide-y mx-6 mt-4 w-full bg-white rounded-xl">
          <div className="flex justify-between px-8 py-6">
            <h1 className="text-md font-semibold">Debt History</h1>
            <div className="flex" id="pagination">
              <button
                onClick={() => handleIterate("-")}
                className="px-4 py-2 bg-gray-100 rounded-2xl shadow"
              >
                Prev
              </button>
              <p className="px-4 py-2 bg-gray-100 rounded-2xl shadow">
                {selectedPage + 1}
              </p>
              <button
                disabled={selectedPage === orders.pagesCount - 1}
                onClick={() => handleIterate("+")}
                className="px-4 py-2 bg-gray-100 rounded-2xl shadow"
              >
                Next
              </button>
            </div>
          </div>
          <div className="px-6 overflow-hidden h-[calc(100%-100px)]">
            <div className=" h-full">
              <table className="mt-4 py-4 w-full text-left">
                <thead className="border-b border-gray-100 px-4 py-2">
                  <tr className="my-2 font-normal">
                    <th className="py-2 font-normal px-4">#SN</th>
                    <th className="py-2 font-normal">Order Type</th>
                    {/* <th className='py-2 font-normal'>Time</th> */}
                    <th className="py-2 font-normal">Date</th>
                    <th className="py-2 font-normal">Customer</th>
                    <th className="py-2 font-normal">Sale</th>
                    <th className="py-2 font-normal">Status</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {orders &&
                    orders.orders &&
                    orders.orders.map((order) => (
                      <tr key={uuid()} className={`${
                        order.revoked ? "bg-gray-100" : ""
                      } px-6 border-t border-gray-50`}>
                        <td className="py-2 px-4">#{order.receiptNo}</td>
                        <td className="py-2">{order.orderType}</td>
                        {/* <td className='py-2'>{new Date(order.createdAt).toTimeString().substr(0,5)}</td> */}
                        <td className="py-2">{D(order.createdAt)}</td>
                        <td className="py-2">{order.customer}</td>
                        <td className="py-2">
                          ₦
                          {order.items
                            .map((item) => item.item.price * item.qty)
                            .reduce((prev, curr) => prev + curr, 0) +
                            (order.orderType === "Shipment"
                              ? order.shipmentFee
                              : 0) -
                            order.discount}
                        </td>
                        {/* <td className='py-2'>{(async() => await getHostName(order.createdBy)) || "hrllo"}</td> */}
                        <td
                          className={`py-2 ${
                            (order.paidTotal >=
                            order.items
                              .map((item) => item.item.price * item.qty)
                              .reduce((prev, curr) => prev + curr, 0) -
                              order.discount) && !order.revoked
                              ? "text-green-500"
                                : order.revoked
                              ? "text-gray-500" : "text-red-500"
                          }`}
                        >
                          {(order.paidTotal >=
                          order.items
                            .map((item) => item.item.price * item.qty)
                            .reduce((prev, curr) => prev + curr, 0) -
                            order.discount) && !order.revoked
                            ? "Paid"
                            : order.revoked ? "Revoked" : "Unpaid"}
                        </td>
                        <td className="py-2">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowReceipt(true);
                            }}
                            className="px-4 py-2 bg-green-500 text-white rounded-xl w-11/12"
                          >
                            View
                          </button>
                        </td>
                        <td className="py-2">
                          {!order.revoked &&
                          order.paidTotal <
                            order.items
                              .map((item) => item.item.price * item.qty)
                              .reduce((prev, curr) => prev + curr, 0) +
                              (order.orderType === "Shipment"
                                ? order.shipmentFee
                                : 0) -
                              order.discount ? (
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowPaymentModal(true);
                              }}
                              className="px-4 py-2 bg-red-500 text-white rounded-xl w-11/12"
                            >
                              Mark as paid
                            </button>
                          ) : (
                            <button
                              disabled
                              className="px-4 py-2 bg-gray-100 text-gray-400 rounded-xl w-11/12"
                            >
                              Mark as paid
                            </button>
                          )}
                        </td>
                        
                        <td className="py-2">
                          <button
                            disabled={order.revoked}
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowRevoke(true);
                            }}
                            className={`${
                              order.revoked
                                ? "bg-gray-100 text-gray-400"
                                : "bg-red-500"
                            } px-4 py-2 text-white rounded-xl w-11/12`}
                          >
                            Revoke
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {orders && orders.orders.length === 0 && (
                <div className="flex flex-col items-center py-44">
                  <InboxIcon width={128} height={128} color={"#ccc"} />
                  <p className="text-[#ccc]">No record was found!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
     );
}
 
export default Debt;