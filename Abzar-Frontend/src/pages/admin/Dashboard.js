import React, {useState, useEffect} from 'react'
import AdminSideNavStaff from '../../components/AdminSideNavStaff';
import {useSelector, useDispatch} from 'react-redux'
import {getTodaySummary, getSummaryByDate} from '../../utils/redux/actions/adminSlice'
import printJS from 'print-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, } from '@fortawesome/free-solid-svg-icons'
import {v4 as uuid} from 'uuid'
import Summary from '../../components/Summary';

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
        printable: 'bydate-summary', 
        css: ["https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css", "font-size: 10px"], 
        type: 'html', 
        scanStyles: true})
    }

    useEffect(() => {
      console.log(startDate, endDate)
    }, [startDate, endDate])

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
                  printable: "daily-summary",
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
            <Summary summary={summary}  type={"daily"} />
          </div>
          <div className="hidden px-4 py-2 h-[calc(100%-500px)]">
            <Summary summary={summaryByDate} type={"bydate"} startDate={startDate} endDate={endDate} />
          </div>
        </div>
      </div>
    );
}
 
export default Dashboard;