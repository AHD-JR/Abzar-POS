import React, {useState, useEffect} from 'react'
import AdminSideNavStaff from '../../components/AdminSideNavStaff';
import {useSelector, useDispatch} from 'react-redux'
import {getTodaySummary, getSummaryByDate} from '../../utils/redux/actions/adminSlice'
import printJS from 'print-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, } from '@fortawesome/free-solid-svg-icons'
import {v4 as uuid} from 'uuid'

const Dashboard = () => {
    const dispatch = useDispatch()
    const {todaySummary: summary, pending: todayStatus} = useSelector(state => state.admin.todaySummary)
    const {summaryByDate, pending: byDateStatus} = useSelector(state => state.admin.summaryByDate)
    const [error, setError] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    useEffect(() => {
        dispatch(getTodaySummary())
    }, [dispatch])

    useEffect(() => {
        setError('')
        if(!startDate && !endDate) return
        if(!startDate || !endDate) return setError("Please include valid dates and input both 'from' and 'to' dates")
        if(startDate > endDate) return setError("Starting date cannot be greater than ending date")
        dispatch(getSummaryByDate({startDate: new Date(startDate), endDate: new Date(endDate)}))
    }, [startDate, endDate])

    const handleGenerateSummary = () => {
        if(!startDate || !endDate) return setError("Please include valid dates and input both 'from' and 'to' dates")
        if(startDate > endDate) return setError("Starting date cannot be greater than ending date")
        if(!summaryByDate) return setError("Please include valid dates")
        setError('')
        printJS({
        documentTitle: `Sales summary from ${new Date(startDate).toDateString()} to ${new Date(endDate).toDateString()}`,
        printable: 'datesummary', 
        css: ["https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css", "font-size: 10px"], 
        type: 'html', 
        scanStyles: true})
    }

    return (
      <div className="w-screen h-screen text-sm flex bg-[#f1f1f1]">
        <AdminSideNavStaff page="dashboard" />
        <div className="flex-1 flex-grow divide-y mx-6 mt-4 w-full  bg-white rounded-xl">
          <div className="py-6 px-8">
            <h1 className="text-lg font-semibold">Generate Report</h1>
          </div>
          <div className="py-6 px-8 flex gap-6">
            <button
              onClick={() =>
                printJS({
                  printable: "dailysummary",
                  css: [
                    "https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css",
                    "font-size: 10px",
                  ],
                  type: "html",
                  scanStyles: true,
                })
              }
              className={`text-md px-6 py-3 rounded-xl font-semibold ${
                todayStatus
                  ? "text-gray-500 bg-gray-200"
                  : "text-white bg-green-500"
              }`}
            >
              Today's Summary
              {todayStatus ? (
                <FontAwesomeIcon className="animate-spin" icon={faSpinner} />
              ) : null}
            </button>
            {/* <button className="text-xl bg-blue-600 px-6 py-3 rounded-xl text-white font-semibold">Today's History</button> */}
          </div>
          <div className="py-6 px-8 gap-6">
            <h1 className="text-lg font-semibold">Summary by Dates</h1>
            <div className="flex gap-5 py-4">
              <div className="flex items-center bg-gray-100 shadow rounded-xl px-4">
                <label htmlFor="startDate">From:</label>
                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="Starting Date"
                  className="px-6 py-2 bg-transparent rounded-xl"
                />
              </div>
              <div className="flex items-center bg-gray-100 shadow rounded-xl px-4">
                <label htmlFor="endDate">To:</label>
                <input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="Ending Date"
                  className="px-6 py-2 bg-transparent rounded-xl"
                />
              </div>
            </div>
            <p className="text-red-500 pb-4">{error}</p>
            <button
              disabled={byDateStatus || summaryByDate === null}
              onClick={() => handleGenerateSummary()}
              className={`text-md  px-6 py-3 rounded-xl ${
                byDateStatus || summaryByDate === null
                  ? "text-gray-500 bg-gray-200"
                  : "text-white bg-blue-500"
              }`}
            >
              {byDateStatus ? "Generating..." : "Generate Summary"}{" "}
              {byDateStatus ? (
                <FontAwesomeIcon className="animate-spin" icon={faSpinner} />
              ) : null}
            </button>
          </div>
          <div className="hidden px-4 py-2 h-[calc(100%-500px)]">
            {summary && summary.reservations && (
              <div id="dailysummary" className="block overflow-scroll">
                <div className=" pb-6">
                  <img src="/logo.png" alt="" className="mx-auto w-24" />
                  <h1 className="text-xl font-semibold text-center">
                    Daily Summary for {new Date().toDateString()} @
                    {new Date().toTimeString().slice(0, 5)}
                  </h1>
                </div>
                <h1 className="text-xl font-bold py-4 text-center border uppercase">
                  Orders & Shipments
                </h1>
                {summary.orders &&
                  summary.orders.map((host) => (
                    <div key={uuid()}>
                      <h1 className="text-xl font-semibold py-4 text-center capitalize border">
                        {host.host.firstName + " " + host.host.lastName} (
                        {host.host.username})
                      </h1>
                      <table className="border w-full text-left font-mono">
                        <thead className="border-b">
                          <tr className="border-b">
                            <th className="px-4 py-2">SN</th>
                            <th className="w-full px-4 py-2">Item</th>
                            <th className="px-4">Qty</th>
                            <th className="px-4 py-2">Price</th>
                            <th className="px-4 py-2">Sale</th>
                          </tr>
                        </thead>
                        <tbody>
                          {host &&
                            host.items.map((product) => (
                              <tr className="border-b" key={uuid()}>
                                <td className="px-4 py-1">
                                  {host.items.indexOf(product) + 1}
                                </td>
                                <td className="px-4 w-full py-1">
                                  {product.name}
                                </td>
                                <td className="px-4 py-1">{product.qtySold}</td>
                                <td className="px-4 py-1">₦{product.price}</td>
                                <td className="px-4 py-1">
                                  ₦{product.totalSale}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                      <div className="px-4 border flex justify-between">
                        <h4 className="text-xl font-semibold">Host Sale:</h4>
                        <h4 className="text-xl font-semibold">
                          ₦{host.totalSale}
                        </h4>
                      </div>
                    </div>
                  ))}
                <div className="px-4 border flex justify-between">
                  <h4 className="text-xl font-bold">Total Sales</h4>
                  <h4 className="text-xl font-bold">
                    ₦
                    {summary.orders &&
                      summary.orders.reduce((acc, curr) => {
                        return acc + curr.totalSale;
                      }, 0)}
                  </h4>
                </div>
                {summary.reservations && summary.reservations.length > 0 && (
                  <>
                    <h1 className="text-xl font-bold py-4 text-center border uppercase">
                      Reservations Fulfilled
                    </h1>
                    {summary.reservations.map((host) => (
                      <div key={uuid()}>
                        <h1 className="text-xl font-semibold py-4 text-center capitalize border">
                          {host.host.firstName + " " + host.host.lastName} (
                          {host.host.username})
                        </h1>
                        <table className="border w-full text-left font-mono">
                          <thead className="border-b">
                            <tr className="border-b">
                              <th className="px-4 py-2">SN</th>
                              <th className="w-full px-4 py-2">Item</th>
                              <th className="px-4">Qty</th>
                              <th className="px-4 py-2">Price</th>
                              <th className="px-4 py-2">Sale</th>
                            </tr>
                          </thead>
                          <tbody>
                            {host &&
                              host.items.map((product) => (
                                <tr className="border-b" key={uuid()}>
                                  <td className="px-4 py-1">
                                    {host.items.indexOf(product) + 1}
                                  </td>
                                  <td className="px-4 w-full py-1">
                                    {product.name}
                                  </td>
                                  <td className="px-4 py-1">
                                    {product.qtySold}
                                  </td>
                                  <td className="px-4 py-1">
                                    ₦{product.price}
                                  </td>
                                  <td className="px-4 py-1">
                                    ₦{product.totalSale}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                        <div className="px-4 border flex justify-between">
                          <h4 className="text-xl font-semibold">Host Sale:</h4>
                          <h4 className="text-xl font-semibold">
                            ₦{host.totalSale}
                          </h4>
                        </div>
                      </div>
                    ))}
                    <div className="px-4 border flex justify-between">
                      <h4 className="text-xl font-bold">
                        Total Fulfilled Reservations
                      </h4>
                      <h4 className="text-xl font-bold">
                        ₦
                        {summary.reservations &&
                          summary.reservations.reduce((acc, curr) => {
                            return acc + curr.totalSale;
                          }, 0)}
                      </h4>
                    </div>
                  </>
                )}

                <div className="px-4 border flex justify-between">
                  <h4 className="text-xl font-semibold">Debt Paid Today:</h4>
                  <h4 className="text-xl font-semibold">
                    ₦{summary.totalDebtPaidToday}
                  </h4>
                </div>
                <div className="px-4 border flex justify-between">
                  <h4 className="text-xl font-semibold">Total Discounts:</h4>
                  <h4 className="text-xl font-semibold">
                    ₦{summary.discounts}
                  </h4>
                </div>
                <div className="px-4 border flex justify-between">
                  <h4 className="text-xl font-black">Overral Total Sales </h4>
                  <h4 className="text-xl font-black">
                    ₦
                    {(summary.reservations
                      ? summary.reservations.reduce((acc, curr) => {
                          return acc + curr.totalSale;
                        }, 0)
                      : 0) +
                      (summary.orders
                        ? summary.orders.reduce((acc, curr) => {
                            return acc + curr.totalSale;
                          }, 0)
                        : 0) +
                      (summary.totalDebtPaidToday || 0) -
                      summary.discounts}
                  </h4>
                </div>
              </div>
            )}
          </div>
          <div className="hidden px-4 py-2 h-[calc(100%-500px)]">
            {summaryByDate && summaryByDate.reservations && (
              <div id="datesummary" className="block overflow-scroll">
                <div className=" pb-6">
                  <img src="/logo.png" alt="" className="mx-auto w-24" />
                  <h1 className="text-xl font-semibold text-center">
                    Summary from {new Date(startDate).toDateString()} to{" "}
                    {new Date(endDate).toDateString()}
                  </h1>
                </div>
                <h1 className="text-xl font-bold py-4 text-center border uppercase">
                  Orders & Shipments
                </h1>
                {summaryByDate.orders &&
                  summaryByDate.orders.map((host) => (
                    <div key={uuid()}>
                      <h1 className="text-xl font-semibold py-4 capitalize text-center border">
                        {!host.host
                          ? "Old Staffs"
                          : host.host.firstName + " " + host.host.lastName}{" "}
                        ({!host.host ? "old user" : host.host.username})
                      </h1>
                      <table className="border w-full text-left font-mono">
                        <thead className="border-b">
                          <tr className="border-b">
                            <th className="px-4 py-2">SN</th>
                            <th className="w-full px-4 py-2">Item</th>
                            <th className="px-4">Qty</th>
                            <th className="px-4 py-2">Price</th>
                            <th className="px-4 py-2">Sale</th>
                          </tr>
                        </thead>
                        <tbody>
                          {host &&
                            host.items.map((product) => (
                              <tr className="border-b" key={uuid()}>
                                <td className="px-4 py-1">
                                  {host.items.indexOf(product) + 1}
                                </td>
                                <td className="px-4 w-full py-1">
                                  {product.name}
                                </td>
                                <td className="px-4 py-1">{product.qtySold}</td>
                                <td className="px-4 py-1">₦{product.price}</td>
                                <td className="px-4 py-1">
                                  ₦{product.totalSale}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                      <div className="px-4 border flex justify-between">
                        <h4 className="text-xl font-semibold">Host Sale:</h4>
                        <h4 className="text-xl font-semibold">
                          ₦{host.totalSale}
                        </h4>
                      </div>
                    </div>
                  ))}
                <div className="px-4 border flex justify-between">
                  <h4 className="text-xl font-bold">Total Sales</h4>
                  <h4 className="text-xl font-bold">
                    ₦
                    {summaryByDate.orders &&
                      summaryByDate.orders.reduce((acc, curr) => {
                        return acc + curr.totalSale;
                      }, 0)}
                  </h4>
                </div>
                <h1 className="text-xl font-bold py-4 text-center border uppercase">
                  Reservations Fulfilled
                </h1>
                {summaryByDate.reservations &&
                  summaryByDate.reservations.map((host) => (
                    <div key={uuid()}>
                      <h1 className="text-xl font-semibold py-4 capitalize text-center border">
                        {host.host === undefined
                          ? "Old Staffs"
                          : host.host.firstName + " " + host.host.lastName}{" "}
                        (
                        {host.host === undefined
                          ? "old user"
                          : host.host.username}
                        )
                      </h1>

                      {/* <h1 className='text-xl font-semibold py-4 text-center border'>{host.host.firstName +" "+ host.host.lastName} ({host.host.username})</h1> */}
                      <table className="border w-full text-left font-mono">
                        <thead className="border-b">
                          <tr className="border-b">
                            <th className="px-4 py-2">SN</th>
                            <th className="w-full px-4 py-2">Item</th>
                            <th className="px-4">Qty</th>
                            <th className="px-4 py-2">Price</th>
                            <th className="px-4 py-2">Sale</th>
                          </tr>
                        </thead>
                        <tbody>
                          {host &&
                            host.items.map((product) => (
                              <tr className="border-b" key={uuid()}>
                                <td className="px-4 py-1">
                                  {host.items.indexOf(product) + 1}
                                </td>
                                <td className="px-4 w-full py-1">
                                  {product.name}
                                </td>
                                <td className="px-4 py-1">{product.qtySold}</td>
                                <td className="px-4 py-1">₦{product.price}</td>
                                <td className="px-4 py-1">
                                  ₦{product.totalSale}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                      <div className="px-4 border flex justify-between">
                        <h4 className="text-xl font-semibold">Host Sale:</h4>
                        <h4 className="text-xl font-semibold">
                          ₦{host.totalSale}
                        </h4>
                      </div>
                    </div>
                  ))}
                <div className="px-4 border flex justify-between">
                  <h4 className="text-xl font-bold">
                    Total Fulfilled Reservations
                  </h4>
                  <h4 className="text-xl font-bold">
                    ₦
                    {summaryByDate.reservations &&
                      summaryByDate.reservations.reduce((acc, curr) => {
                        return acc + curr.totalSale;
                      }, 0)}
                  </h4>
                </div>
                <div className="px-4 border flex justify-between">
                  <h4 className="text-xl font-black">Overral Total Sales </h4>
                  <h4 className="text-xl font-black">
                    ₦
                    {(summaryByDate.reservations
                      ? summaryByDate.reservations.reduce((acc, curr) => {
                          return acc + curr.totalSale;
                        }, 0)
                      : 0) +
                      (summaryByDate.orders
                        ? summaryByDate.orders.reduce((acc, curr) => {
                            return acc + curr.totalSale;
                          }, 0)
                        : 0) -
                      summary.discounts}
                  </h4>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
}
 
export default Dashboard;