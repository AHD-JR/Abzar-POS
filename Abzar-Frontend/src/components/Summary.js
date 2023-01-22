import React, { useEffect, useState } from "react";
import {v4 as uuid} from 'uuid'
import moment from 'moment'

const Summary = ({ summary, type, startDate, endDate }) => {
    return (
        <>
        {summary && summary.reservations && (
            <div id={type + "-summary"} className="block overflow-scroll">
                <div className="pt 4">
              {type === "daily" && <div className=" pb-6">
                <img src="/logo.png" alt="" className="mx-auto w-24" />
                <h1 className="text-xl font-semibold text-center">
                  Daily Summary for {new Date().toDateString()} @
                  {new Date().toTimeString().slice(0, 5)}
                </h1>
              </div>}
              {
                type === "bydate" && <div className=" pb-6">
                <img src="/logo.png" alt="" className="mx-auto w-24" />
                <h1 className="text-xl font-semibold text-center">
                  Summary from {moment(startDate).format("DD MMM YYYY")} to{" "}
                  {moment(endDate).format("DD MMM YYYY")}
                </h1>
              </div>
              }
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
                <h4 className="text-xl font-semibold">Cash: ₦{summary.sales.cash} </h4>
                <h4 className="text-xl font-semibold">POS: ₦{summary.sales.pos} </h4>
                <h4 className="text-xl font-semibold">Transfer: ₦{summary.sales.transfer} </h4>
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
          </>
        )}

export default Summary;