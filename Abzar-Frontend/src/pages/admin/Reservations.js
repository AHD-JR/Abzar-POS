import React, { useEffect, useState } from "react";
import AdminSideNavStaff from "../../components/AdminSideNavStaff";
import { useSelector, useDispatch } from "react-redux";
import {
  fulfilReservation,
  getReservationHistory,
  revokeOrder,
} from "../../utils/redux/actions/adminSlice";
import { InboxIcon } from "@heroicons/react/24/outline";

const Reservations = () => {
  const dispatch = useDispatch();
  const reservations = useSelector((state) => state.staff.reservationsHistory || []);
  const fulfilledReservation = useSelector(
    (state) => state.staff.fulfilledReservation
  );
  const [selectedPage, setSelectedPage] = useState(0);
  const [selectedReservation, setSelectedReservation] = useState();
  const [orderToRevoke, setOrderToRevoke] = useState();

  useEffect(() => {
    dispatch(getReservationHistory({ nextPage: selectedPage }));
  }, [selectedPage, fulfilledReservation]);

  const handleIterate = (iteration) => {
    if (iteration === "+" && selectedPage === reservations.pagesCount - 1)
      return;
    if (iteration === "-" && selectedPage === 0) return;
    if (iteration === "+") return setSelectedPage(selectedPage + 1);
    if (iteration === "-") return setSelectedPage(selectedPage - 1);
  };

  const handleFulfilReservation = () => {
    if (!selectedReservation._id) return;
    dispatch(fulfilReservation({ _id: selectedReservation._id }));
    setSelectedReservation();
  };

  const D = (date) =>
    new Date(date).toLocaleString("en-US", {
      timeZone: "Africa/Lagos",
    });

  return (
    <div className="w-screen h-screen text-sm flex bg-[#f1f1f1]">
      {selectedReservation && (
        <div className="flex items-center justify-center absolute z-40 bg-[rgba(0,0,0,.5)] w-full h-screen">
          <div className=" bg-white shadow-xl px-16 py-16 rounded-2xl">
            <p className="text-xl">
              Are you sure you want to fulfil reservation{" "}
              {selectedReservation.receiptNo}?
            </p>
            <div className="flex gap-4 justify-between pt-6 w-full">
              <button
                onClick={() => setSelectedReservation()}
                className="w-full px-8 py-6 bg-green-500 text-white rounded-2xl shadow"
              >
                Cancel
              </button>
              <button
                onClick={() => handleFulfilReservation()}
                className="w-full px-8 py-6 bg-red-500 text-white rounded-2xl shadow"
              >
                Fulfil Order
              </button>
            </div>
          </div>
        </div>
      )}
      {orderToRevoke && (
        <div className="flex items-center justify-center absolute z-40 bg-[rgba(0,0,0,.5)] w-full h-screen">
          <div className=" bg-white shadow-xl px-16 py-16 rounded-2xl">
            <p className="text-xl">
              Are you sure you want to revoke reservation{" "}
              {orderToRevoke.receiptNo}?
            </p>
            <div className="flex gap-4 justify-between pt-6 w-full">
              <button
                onClick={() => setOrderToRevoke()}
                className="w-full px-8 py-6 bg-green-500 text-white rounded-2xl shadow"
              >
                Cancel
              </button>
              <button
                onClick={() => dispatch(revokeOrder(orderToRevoke))}
                className="w-full px-8 py-6 bg-red-500 text-white rounded-2xl shadow"
              >
                Revoke
              </button>
            </div>
          </div>
        </div>
      )}
      <AdminSideNavStaff page="reservations" />
      <div className="flex-1 overflow-hidden  flex-grow divide-y mx-6 mt-4 w-full bg-white rounded-xl">
        <div className="flex items-center justify-between px-8 py-4">
          <h1 className="text-lg font-semibold">Reservations History</h1>
          <div className="flex">
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
                selectedPage < reservations.pagesCount - 1
                  ? "border-green-100 bg-green-500 text-white"
                  : "border-gray-200 bg-gray-100"
              }`}
            >
              Next
            </button>
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
                  <th className="py-2 font-normal">Status</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {reservations &&
                  reservations.orders &&
                  reservations.orders
                    .filter((order) => order.revoked === false)
                    .map((order) => (
                      <tr key={order._id}>
                        <td className="py-2">{order.receiptNo}</td>
                        <td className="py-2">{order.orderType}</td>
                        {/* <td className='py-2'>{new Date(order.createdAt).toTimeString().substr(0,5)}</td> */}
                        <td className="py-2">{D(order.createdAt)}</td>
                        <td className="py-2">{order.customer}</td>
                        <td className="py-2">
                          ₦
                          {order.items
                            .map((item) => item.item.price * item.qty)
                            .reduce((prev, curr) => prev + curr, 0)}
                        </td>
                        <td
                          className={`py-2 ${
                            order.reservationFulfilled
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {order.reservationFulfilled ? "Fulfilled" : null}
                          {order.reservationFulfilled === false &&
                          order.revoked === false
                            ? "Unfulfilled"
                            : null}
                          {order.revoked === true ? "Revoked" : null}
                        </td>
                        <td className="py-2">
                          {order.reservationFulfilled ? (
                            <button className="px-4 py-2 bg-gray-100 text-gray-300 rounded-xl">
                              Fulfil
                            </button>
                          ) : (
                            <button
                              onClick={() => setSelectedReservation(order)}
                              className="px-4 py-2 bg-green-500 text-white rounded-xl"
                            >
                              Fulfil
                            </button>
                          )}
                          {order.revoked || order.reservationFulfilled ? (
                            <button className="px-4 py-2 ml-3 bg-gray-100 text-gray-300 rounded-xl">
                              Revoke
                            </button>
                          ) : (
                            <button
                              onClick={() => setOrderToRevoke(order)}
                              className="px-4 py-2 ml-3 bg-red-500 text-white rounded-xl"
                            >
                              Revoke
                            </button>
                          )}
                        </td>
                        <td className="py-2"></td>
                      </tr>
                    ))}
              </tbody>
            </table>
            {reservations.orders === [] && 
              <div className="flex flex-col items-center py-44">
                <InboxIcon width={128} height={128} color={"#ccc"} />
                <p className="text-[#ccc]">No record was found!</p>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservations;
