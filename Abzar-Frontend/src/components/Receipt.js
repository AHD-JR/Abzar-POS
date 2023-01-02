import { useEffect, useState } from "react";

const Receipt = ({value, staff}) => {
    const [receipt, setReceipt] = useState(null);
    
    useEffect(() => {
      if(!value) return
        setReceipt(value)
    }, [value])


    
    return (
      <>
        {
          receipt && (
            // <div className="md:w-2/6 print:w-full relative">

            <div
              id="receipt"
              className="border-2 text-[8px] w-full bg-white items-center"
            >
              <div className="print:text-xs mx-auto h-screen px-2 print:h-screen print:font-mono">
                <div className="divide-y divide-dashed divide-slate-800">
                  <div className="pb-4">
                    <img src="/logo.png" alt="" className="w-24 mx-auto" />
                    {/* <h1 className="py-3 text-center text-xl font-bold uppercase">Chippz Republic</h1> */}
                    <p className="text-lg text-center font-semibold">
                      Abzar Global Ventures
                    </p>
                    <p className="text-xs text-center font-semibold">
                      Block E 5 No 1 & 8 Sabon Gari Main Market
                    </p>
                  </div>
                  <div className="flex justify-between py-2">
                    <p className="py-1 text-xs w-full">
                      Receipt: #{receipt.receiptNo}
                    </p>
                    <p className="py-1 text-right print:text-xs w-full text-xs">
                      Host: {`${staff.firstName} ${staff.lastName}`}
                    </p>
                  </div>
                  <div className="py-2 text-center">
                    <p className="text-xs font-bold">
                      {receipt.createdAt.substr(0, 10)} at{" "}
                      {receipt.createdAt.substr(12, 1) - 1}
                      {receipt.createdAt.substr(13, 6)}
                    </p>
                    <p className="py-1 text-xs capitalize">
                      {receipt.orderType === "Reservation"
                        ? "Credit Purchase"
                        : receipt.orderType}{" "}
                      for {receipt.customer}
                    </p>
                    {receipt.orderType === "Reservation" && (
                      <p className="py-1 text-xs capitalize">
                        Date:{" "}
                        {new Date(
                          Date.parse(receipt.reservationDate)
                        ).toDateString()}
                      </p>
                    )}
                    {
                      receipt.payType && (
                        <p className="py-1 text-xs capitalize">Payment Type: {receipt?.payType}</p>
                      )
                    }
                  </div>
                  <div className="py-2 pb-4 text-xs">
                    <table className="w-full text-left font-mono">
                      <thead className="border-b">
                        <tr>
                          <th className="px-4 py-2">#</th>
                          <th className="w-full px-4 py-2">Item</th>
                          <th className="px-4">Qty</th>
                          <th className="px-4 py-2">Price</th>
                          <th className="px-4 py-2">Sale</th>
                        </tr>
                      </thead>
                      <tbody>
                        {receipt.items.map((item) => (
                          <tr key={item._id}>
                            <td className="px-4 py-1">
                              {receipt.items.indexOf(item) + 1}
                            </td>
                            <td className="w-full text-[10px] px-4 py-1">
                              {item.item.name}
                            </td>
                            <td className="px-4 py-1">{item.qty}</td>
                            <td className="px-4 py-1">₦{item.item.price}</td>
                            <td className="px-4 py-1">
                              ₦{item.item.price * item.qty}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="py-3 text-xs">
                    <div className="flex items-center justify-between w-full">
                      <p className="w-full ">Subtotal</p>
                      <p className="w-full text-right">
                      ₦{receipt.items.reduce((accumulator, object) => {
                          return accumulator + object.item.price * object.qty;
                        }, 0)}{" "}
                        {
                          receipt.discount > 0 && (
                            <span>- ₦{receipt.discount}</span>
                          )
                        }
                      </p>
                      {/* <p className="bg-red-400">
                          ₦
                          {(receipt.items.reduce((accumulator, object) => {
                              return accumulator + object.item.price * object.qty;
                            }, 0))} - ₦{receipt.discount}
                        </p> */}
                    </div>
                    {/* <div className="flex items-center justify-between">
                        <h2 className="w-full">Total Tax (VAT, 7.5%)</h2>
                        <h2 className="">
                          ₦
                          {(receipt.items.reduce((accumulator, object) => {
                              return accumulator + object.item.price * object.qty;
                            }, 0) /
                            100) *
                            7.5}
                        </h2>
                      </div> */}
                    {receipt.orderType === "Shipment" && (
                      <div className="flex items-center justify-between">
                        <h2>Delivery Fee</h2>
                        <h2 className="">₦{receipt.shipmentFee}</h2>
                      </div>
                    )}
                    {receipt.discount !== 0 && (
                      <div className="flex items-center justify-between">
                        <h2>Discount</h2>
                        <h1>₦{receipt.discount}</h1>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between py-4 text-xs">
                    <h2 className="w-full">
                      Total ({receipt.items.length}{" "}
                      {receipt.items.length > 1 ? "items" : "item"})
                    </h2>
                    <h2 className="text-xl font-semibold">
                      ₦
                      {receipt.items.reduce((accumulator, object) => {
                        return accumulator + object.item.price * object.qty;
                      }, 0) - receipt.discount}
                    </h2>
                  </div>
                  <div className="py-4 text-center text-xs">
                    {/* <p>{D.toDateString()} | {D.toTimeString().substr(0,5)}</p> */}
                  </div>
                </div>
                <div className="border-t border-slate-800 py-4 text-center text-xs">
                  <p className="font-semibold">Contact Us:</p>
                  <p className="font-semibold">08142525663</p>
                </div>
              </div>
            </div>
          )
          // </div>
        }
      </>
    );
}

export default Receipt;