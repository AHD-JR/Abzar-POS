import React, { useEffect, useState } from "react";
import printJS from "print-js";
import jwtDecode from "jwt-decode";
import SideNavStaff from "../../components/SideNavStaff";
import { useSelector, useDispatch } from "react-redux";
import {
  revokeOrder,
  getOrderHistory,
} from "../../utils/redux/actions/staffSlice";
import Receipt from "../../components/Receipt"

const History = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.staff.orderHistory);
  const revokedOrder = useSelector((state) => state.staff.revokedOrder);
  const staff = jwtDecode(JSON.parse(localStorage.getItem("USER_TEMP")).token);

  const [selectedPage, setSelectedPage] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(false);
  const [pickedOrder, setPickedOrder] = useState(null);

  useEffect(() => {
    dispatch(getOrderHistory({ nextPage: selectedPage }));
  }, [selectedPage, revokedOrder]);

  // const handleIterate = (iteration) => {
  //   if (iteration === "+" && selectedPage === orders.pagesCount - 1) return;
  //   if (iteration === "-" && selectedPage === 0) return;
  //   if (iteration === "+") return setSelectedPage(selectedPage + 1);
  //   if (iteration === "-") return setSelectedPage(selectedPage - 1);
  // };

  const handleIterate = (iteration) => {
    if(iteration === "+" && selectedPage === orders.pagesCount - 1) return
    if(iteration === "-" && selectedPage === 0) return
    if(iteration === "+") return setSelectedPage(selectedPage+1)
    if(iteration === "-") return setSelectedPage(selectedPage-1)
  }

  const handleRevokeOrder = () => {
    if (!selectedOrder) return;
    dispatch(revokeOrder({ _id: selectedOrder._id }));
    dispatch(getOrderHistory({ nextPage: selectedPage }));
    setSelectedOrder();
  };

  const D = (date) =>
    new Date(date).toLocaleString("en-US", {
      timeZone: "Africa/Lagos",
    });

  // const D = new Date()

  return (
    <div className="w-screen h-screen flex text-sm bg-[#f1f1f1]">
      {selectedOrder && (
        <div className="flex items-center justify-center absolute z-40 bg-[rgba(0,0,0,.5)] w-full h-screen">
          <div className=" bg-white shadow-xl px-16 py-16 rounded-2xl">
            <p className="text-xl">
              Are you sure you want to revoke order {selectedOrder.receiptNo}?
            </p>
            <div className="flex gap-4 justify-between pt-6 w-full">
              <button
                onClick={() => setSelectedOrder()}
                className="w-full px-8 py-6 bg-green-500 text-white rounded-2xl shadow"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRevokeOrder()}
                className="w-full px-8 py-6 bg-red-500 text-white rounded-2xl shadow"
              >
                Revoke Order
              </button>
            </div>
          </div>
        </div>
      )}
      {pickedOrder && (
        // <div className="flex  bg-black bg-opacity-50 justify-center items-center pt-2 px-4">
        <div className="flex items-center w-full bg-black bg-opacity-50 h-screen absolute justify-center pt-2 px-4">
          <div className="w-[40vw]">
          {pickedOrder && pickedOrder.items && (
            <Receipt staff={staff} value={pickedOrder} />
            )}
            </div>
          <div className="flex flex-col bg-white w-96 px-16 rounded-r-xl h-5/6 py-32 ">
            <button
              className="bg-blue-500 ring-4 rounded-t-xl h-screen w-full text-white px-6 py-2"
              type="button"
              onClick={() =>
                printJS({
                  printable: "receipt",
                  css: [
                    "https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css",
                    "font-size: 8px",
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
      <SideNavStaff page="history" />
      <div className="flex-1 overflow-hidden  flex-grow divide-y mx-6 mt-4 w-full bg-white rounded-xl">
        <div className="flex justify-between px-8 py-6">
          <h1 className="text-xl font-semibold">Order History</h1>
          {/* <div className="flex">
            <button
              onClick={() => handleIterate("-")}
              className={`px-4 py-3  border rounded-l-xl ${
                selectedPage === 0
                  ? "border-gray-200 bg-gray-100"
                  : "border-green-100 bg-green-500 text-white"
              }`}
            >
              Prev
            </button>
            <button
              onClick={() => handleIterate("+")}
              className={`px-4 py-3 border rounded-r-xl ${
                selectedPage < orders.pagesCount - 1
                  ? "border-green-100 bg-green-500 text-white"
                  : "border-gray-200 bg-gray-100"
              }`}
            >
              Next
            </button>
          </div> */}
          <div className="flex">
              <button onClick={() => handleIterate("-")} className={`px-4 py-2  border rounded-l-xl ${selectedPage === 0 ? "border-gray-200 bg-gray-100" : "border-green-100 bg-green-500 text-white"  }`}>Prev</button>
              <button onClick={() => handleIterate("+")} className={`px-4 py-2 border rounded-r-xl ${selectedPage < orders.pagesCount - 1 ? "border-green-100 bg-green-500 text-white" : "border-gray-200 bg-gray-100" }`}>Next</button>
            </div>
        </div>
        <div className="px-6 overflow-hidden h-[calc(100%-100px)]">
          <div className=" h-full">
            <table className="mt-4 py-4 w-full text-left">
              <thead className="border-b border-gray-200 py-2">
                <tr className="my-2 font-normal">
                  <th className="py-2 font-normal">Order #</th>
                  <th className="py-2 font-normal">Order Type</th>
                  {/* <th className='py-2 font-normal'>Time</th> */}
                  <th className="py-2 font-normal">Date</th>
                  <th className="py-2 font-normal">Customer</th>
                  <th className="py-2 font-normal">Sale</th>
                  {/* <th className='py-2 font-normal'>Host</th> */}
                  <th className="py-2 font-normal">Status</th>
                  {/* <th></th> */}
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders &&
                  orders.orders &&
                  orders.orders.map((order) => (
                    <tr key={order._id}>
                      <td className="py-2">{order.receiptNo}</td>
                      <td className="py-2">{order.orderType}</td>
                      {/* <td className='py-2'>{new Date(order.createdAt).toTimeString().substr(0,5)}</td> */}
                      <td className="py-2">{D(order.createdAt)}</td>
                      <td className="py-2">{order.customer}</td>
                      <td className="py-2">
                        ₦
                          {
                            ((order.items.reduce((accumulator, object) => {
                              return accumulator + (object.item.price * object.qty);
                          }, 0)) + (order.shipmentFee ? order.shipmentFee : 0))  - order.discount
                          }
                      </td>
                      {/* <td className='py-2'>{(async() => await getHostName(order.createdBy)) || "hrllo"}</td> */}
                      <td
                        className={`py-2 ${
                          order.revoked ? "text-red-500" : "text-green-500"
                        }`}
                      >
                        {order.revoked ? "Revoked" : "Fulfilled"}
                      </td>
                      {/* <td className='py-2'>
                                            {
                                                order.revoked ?
                                                <button disabled={true} className="px-4 py-2 bg-gray-100 text-gray-400 rounded-xl">Revoke</button>
                                                :
                                                <button onClick={() => setSelectedOrder(order)} className="px-4 py-2 bg-red-500 text-white rounded-xl">Revoke</button>
                                            }
                                        </td> */}
                      <td className="py-2">
                        <button
                          onClick={() => setPickedOrder(order)}
                          className="px-4 py-2 text-white bg-blue-500 rounded-lg shadow"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
