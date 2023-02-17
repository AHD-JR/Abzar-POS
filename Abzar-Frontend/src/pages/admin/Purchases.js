import React, {useState, useMemo, useEffect} from 'react'
import AdminSideNavStaff from '../../components/AdminSideNavStaff';
import {useSelector, useDispatch} from 'react-redux'
import {getAllPurchases, createDiscount, deleteDiscount} from '../../utils/redux/actions/adminSlice'
import ModalComponent from '../../components/ModalComp';
import moment from 'moment';
import { addCommaToNumber } from '../../utils/helpers';
import { PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/solid';
import axios from '../../utils/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import printJS from 'print-js';


const Discounts = () => {
    const dispatch = useDispatch()
    const purchases = useSelector(state => state.admin.allPurchases)
    const [addPurchase, setAddPurchase] = useState(false)
    const [selectedPurchase, setSelectedPurchase] = useState(null)
    const [selectedPurchaseItems, setSelectedPurchaseItems] = useState([])
    const [showRevokePurchase, setShowRevokePurchase] = useState(false)
    const [purchase, setPurchase] = useState({
        supplier: "",
        items: [],
        totalPaid: 0,
    })
    const [viewPurchase, setViewPurchase] = useState(false)
    const [showDeletePurchase, setShowDeletePurchase] = useState(false)
    const [showEditPurchase, setShowEditPurchase] = useState(false)
    const [freqProducts, setFreqProducts] = useState([])
    const [freqSuppliers, setFreqSuppliers] = useState([])
    const [page, setPage] = useState(1)
    const [newPurchase, setNewPurchase] = useState({
        supplier: "",
        items: [],
        totalPaid: 0,
    })
    const [newPurchaseItem, setNewPurchaseItem] = useState({
        name: "",
        qty: "",
        price: "",
    })


    useEffect(() => {
        dispatch(getAllPurchases({page}))
    }, [page])
    
    const getFreqProducts = async () => {
      const res = (await axios.get('/admin/product/getfreq')).data
      setFreqProducts(res)
    }
    
    const getFreqSuppliers = async () => {
      const res = (await axios.get('/admin/suppliers/all')).data
      setFreqSuppliers(res)
    }

    const createPurchase = async () => {
      if(newPurchase.supplier === "") {
        toast.error("Please select a supplier")
        return
      }
      if(newPurchase.items.length === 0) {
        toast.error("Please add items to purchase")
        return
      }
      if(!newPurchase.totalPaid) {
        toast.error("Please enter total paid")
        return
      }
      axios.post('/admin/purchase/create', newPurchase).then(res => {
        if(res.status === 200) {
          dispatch(getAllPurchases())
          setAddPurchase(false)
          setNewPurchase({
            supplier: "",
            items: [],
          })
          setNewPurchaseItem({
            name: "",
            qty: "",
            price: "",
          })
        }
      })
    }


    useEffect(() => {
      getFreqProducts()
      getFreqSuppliers()
    }, [])

    const updatePurchase = async () => {
      axios.put('/admin/purchase/update', purchase).then(res => {
      if(res.status === 200) {
        dispatch(getAllPurchases())
        setShowEditPurchase(false) 
        setPurchase(null)
        console.log(res)
      }
    }
    )}


    return (
      <>
      <ToastContainer />
      <div style={{
        scale: 0.8,
      }}>
      <>
        {showRevokePurchase && (
          <ModalComponent
            show={showRevokePurchase}
            setShow={setShowRevokePurchase}
            title="Revoke Purchase"
          >
            <div className="flex flex-col space-y-4 w-full">
              <div className="flex flex-col space-y-2">
                <p className="text-sm font-semibold">
                  Are you sure you want to revoke this purchase?
                </p>
              </div>
              <div className="flex justify-between gap-2">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md w-full"
                  onClick={() => {
                    axios
                      .put("/admin/purchase/revoke", { _id: purchase._id })
                      .then((res) => {
                        if (res.status === 200) {
                          dispatch(getAllPurchases());
                          setShowRevokePurchase(false);
                          setSelectedPurchase(null);
                        }
                      });
                  }}
                >
                  Yes
                </button>
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded-md w-full"
                  onClick={() => setShowRevokePurchase(false)}
                >
                  No
                </button>
              </div>
            </div>
          </ModalComponent>
        )}

        {showEditPurchase && (
          <ModalComponent
            show={showEditPurchase}
            setShow={setShowEditPurchase}
            title="Edit Purchase"
          >
            <div className="flex">
            <div className="">
            <div className="flex flex-col space-y-4 w-full">
              <div className="flex flex-col space-y-2">
                <label htmlFor="supplier" className="text-sm font-semibold">
                  Supplier
                </label>
                <input
                  type="text"
                  name="supplier"
                  list='suppliers'
                  id="supplier"
                  className="border border-gray-300 rounded-md px-4 py-2"
                  value={purchase.supplier}
                  onChange={(e) =>
                    setPurchase({ ...purchase, supplier: e.target.value })
                  }
                />
                <datalist id="suppliers">
                  {
                    freqSuppliers.map((supplier, index) => (
                      <option key={"opt-"+index} value={supplier._id} />
                    ))
                  }
                </datalist>
              </div>
              <div className="flex justify-between gap-2">
                <div className="flex flex-col space-y-2">
                  <label htmlFor="paid" className="text-sm font-semibold">
                    Total
                  </label>
                  <input
                    type="string"
                    name="paid"
                    id="paid"
                    className="border border-gray-300 rounded-md px-4 py-2"
                    value={"₦" + addCommaToNumber(purchase.total)}
                    onChange={(e) =>
                      setPurchase({ ...purchase, total: e.target.value })
                    }
                    disabled
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label htmlFor="paid" className="text-sm font-semibold">
                    Paid
                  </label>
                  <input
                    value={"₦" + purchase.totalPaid}
                    max={purchase.total}
                    onChange={(e) =>
                      setPurchase({ ...purchase, totalPaid: e.target.value.split("₦")[1] })
                    }
                    type="text"
                    className={`border border-gray-300 rounded-md px-4 py-2 ${
                      purchase.totalPaid < purchase.total
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                </div>
              </div>
              <div className="pt-3 border-t">
              <h4 className="text-sm font-semibold pb-3">
                Select Product Details
              </h4>
              <div className="flex justify-between gap-5">
                <input
                  type="text"
                  list="products"
                  name="product"
                  id="product"
                  value={newPurchaseItem.name}
                  onChange={(e) =>
                    setNewPurchaseItem({
                      ...newPurchaseItem,
                      name: e.target.value,
                    })
                  }
                  placeholder="Product name"
                  className="border border-gray-300 rounded-md px-4 py-2"
                />
                <datalist id="products">
                  {
                    freqProducts.map((product, index) => (
                      <option key={"opt-2"+index} value={product.name} />
                    ))
                }
                </datalist>
                <div className="flex border border-gray-300 rounded-md px-4 py-2">
                  <span>₦ </span>
                  <input
                    type="number"
                    placeholder="Price"
                    id="price"
                    value={newPurchaseItem.price}
                    onChange={(e) =>
                      setNewPurchaseItem({
                        ...newPurchaseItem,
                        price: e.target.value,
                      })
                    }
                    name="price"
                    className="w-full focus:outline-none"
                  />
                </div>
                <input
                  type="number"
                  name="qty"
                  id="qty"
                  value={newPurchaseItem.qty}
                  onChange={(e) =>
                    setNewPurchaseItem({
                      ...newPurchaseItem,
                      qty: e.target.value,
                    })
                  }
                  placeholder="Qty"
                  className="border border-gray-300 rounded-md px-4 py-2"
                />
              </div>
              <button
                onClick={() => {
                  if(newPurchaseItem.name === "" || newPurchaseItem.price.split("₦")[1] === "" || newPurchaseItem.qty === "") return toast.warn("Please fill all fields")
                    setPurchase({
                        ...purchase,
                        items: [...purchase.items, newPurchaseItem],
                    });
                    setNewPurchaseItem({
                        name: "",
                        qty: "",
                        price: "",
                    });
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 w-full"
              >
                Add to list
              </button>
            </div>
        </div>
            <div className="w-full pt-4">
              <div className="flex flex-col space-y-2">
                <div className="flex flex-col space-y-2 h-52 overflow-y-scroll">
                  <table className="min-w-full border-collapse block md:table">
                    <thead className="block md:table-header-group">
                      <tr>
                        <th className="bg-gray-100 p-2 text-[#333] font-bold md:border md:border-grey-500 text-left block md:table-cell">
                          Item
                        </th>
                        <th className="bg-gray-100 p-2 text-[#333] font-bold md:border md:border-grey-500 text-left block md:table-cell">
                          Unit Price
                        </th>
                        <th className="bg-gray-100 p-2 text-[#333] font-bold md:border md:border-grey-500 text-left block md:table-cell">
                          Quantity
                        </th>
                        <th className="bg-gray-100 p-2 text-[#333] font-bold md:border md:border-grey-500 text-left block md:table-cell">
                          Total
                        </th>
                        <th className="bg-gray-100 p-2 text-[#333] font-bold md:border md:border-grey-500 text-left block md:table-cell"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {purchase.items.map((item, index) => (
                        <tr key={"items-"+index} className="bg-gray-50 border border-grey-500 md:border-none block md:table-row">
                          <td className="">
                            <input
                              type="text"
                              name="name"
                              id="name"
                              className="p-2 md:border md:border-grey-500 text-left block md:table-cell w-full"
                              value={item.name}
                              onChange={(e) => {
                                setPurchase({ ...purchase,
                                    total: purchase.items.reduce((acc, item) => acc + item.price * item.qty, 0),
                                    items: purchase.items.map((item, i) => {
                                        if (i === index) {
                                            return { ...item, name: e.target.value };
                                        }
                                        return item;
                                    }
                                )});
                              }}
                            />
                          </td>
                          <td className="">
                            <input
                              type="text"
                              className="p-2 md:border md:border-grey-500 text-left block md:table-cell w-full"
                              value={"₦" + item.price}
                              min="0"
                              onChange={(e) => {
                                if(/^[0-9]+$/.test(e.target.value.split("₦")[1]) || e.target.value.split("₦")[1] === '') {
                                setPurchase({ ...purchase,
                                    total: purchase.items.reduce((acc, item) => acc + item.price * item.qty, 0),
                                    items: purchase.items.map((item, i) => {
                                        if (i === index) {
                                          if(e.target.value.split("₦")[1] !== undefined) return { ...item, price: e.target.value.split("₦")[1] };
                                          return { ...item, price: 0 };
                                        }
                                        return item;
                                    }
                                )});
                                  }
                              }}
                            />
                          </td>
                          <td className="">
                            <input
                              type="text"
                              className="p-2 md:border md:border-grey-500 text-left block md:table-cell w-full"
                              value={item.qty}
                              onChange={(e) => {
                                setPurchase({ ...purchase,
                                    total: purchase.items.reduce((acc, item) => acc + item.price * item.qty, 0),
                                    items: purchase.items.map((item, i) => {
                                        if (i === index) {
                                            return { ...item, qty: e.target.value };
                                        }
                                        return item;
                                    }
                                )});
                              }}
                            />
                          </td>
                          <td className="">
                            <input
                              type="text"
                              name="name"
                              id="name"
                              className="p-2 md:border md:border-grey-500 text-left block md:table-cell w-full"
                              value={"₦"+ addCommaToNumber(item.qty * item.price)}
                              disabled
                            />
                          </td>
                            <td className="">
                                <button
                                    onClick={() => {
                                        setPurchase({
                                            ...purchase,
                                            total: purchase.items.reduce((acc, item) => acc + item.price * item.qty, 0),
                                            items: purchase.items.filter((item, i) => i !== index)
                                        })
                                    }}
                                    tabIndex="-1"
                                    className="text-red-500 p-2 md:border md:border-grey-500 text-left block md:table-cell w-full"
                                >
                                    <TrashIcon className="w-5" />
                                </button>
                            </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="flex justify-end gap-2 bg-white pt-2 border-t border-gray-200">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                  onClick={() => setShowEditPurchase(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-md"
                  onClick={() => {
                    updatePurchase();
                  }}
                >
                  Save
                </button>
              </div>
            </div>
            </div>
            </div>
          </ModalComponent>
        )}

        {viewPurchase && (
          <ModalComponent
            show={viewPurchase}
            setShow={setViewPurchase}
            title="Purchase Details"
          >
            <div className="flex flex-col space-y-4 w-[700px]">
              <div id="printpurchase">
                <div className="flex flex-col space-y-2">
                  <label htmlFor="supplier" className="text-sm font-semibold">
                    Supplier
                  </label>
                  <input
                    type="text"
                    name="supplier"
                    id="supplier"
                    className="border border-gray-300 rounded-md px-4 py-2"
                    value={purchase.supplier}
                    disabled
                  />
                </div>
                <div className="flex justify-between gap-2">
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="paid" className="text-sm font-semibold">
                      Total
                    </label>
                    <div className="flex border border-gray-300  bg-gray-50 rounded-md px-4 py-2">
                      <span>₦ </span>
                      <input
                        type="text"
                        name="paid"
                        id="paid"
                        className="w-full bg-gray-50 focus:outline-none"
                        value={addCommaToNumber(purchase.total)}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="paid" className="text-sm font-semibold">
                      Amount Paid
                    </label>
                    <div
                      className={`flex border border-gray-300  bg-gray-50 rounded-md px-4 py-2
                          ${
                            purchase.totalPaid < purchase.total
                              ? "text-red-500"
                              : "text-green-500"
                          }`}
                    >
                      <span>₦</span>
                      <input
                        type="text"
                        name="paid"
                        id="paid"
                        className="w-full bg-gray-50 focus:outline-none"
                        value={addCommaToNumber(purchase.totalPaid)}
                        onChange={(e) => {
                          setPurchase({
                            ...purchase,
                            totalPaid: e.target.value,
                          });
                        }}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="date" className="text-sm font-semibold">
                      Date
                    </label>
                    <span
                      type="date"
                      name="date"
                      id="date"
                      className="border bg-gray-50 border-gray-300 rounded-md px-4 py-2"
                    >
                      {moment(purchase.createdAt).format("D MMM, YYYY")}{" "}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col flex-1 space-y-2">
                  <label htmlFor="items" className="text-sm font-semibold">
                    Items
                  </label>
                  <div className="flex flex-col space-y h-full">
                    <table className="min-w-full border-collapse block md:table">
                      <thead className="block md:table-header-group">
                        <tr>
                          <th className="bg-gray-100 p-2 text-[#333] font-bold md:border md:border-grey-500 text-left block md:table-cell">
                            Item
                          </th>
                          <th className="bg-gray-100 p-2 text-[#333] font-bold md:border md:border-grey-500 text-left block md:table-cell">
                            Unit Price
                          </th>
                          <th className="bg-gray-100 p-2 text-[#333] font-bold md:border md:border-grey-500 text-left block md:table-cell">
                            Qty
                          </th>
                          <th className="bg-gray-100 p-2 text-[#333] font-bold md:border md:border-grey-500 text-left block md:table-cell">
                            Total Price
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                      {purchase.items.map((item, index) => (
                          <tr key={"purchase-item-"+index} className="bg-gray-50 border border-grey-500 md:border-none block md:table-row">
                            <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                              {item.name}
                            </td>
                            <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                              ₦{addCommaToNumber(item.price)}
                            </td>
                            <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                              {item.qty}
                            </td>
                            <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                              ₦{addCommaToNumber(item.price * item.qty)}
                            </td>
                          </tr>
                      ))}

                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="">
                <button 
                onClick={() =>
                  printJS({
                    printable: "printpurchase",
                    css: [
                      "https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css",
                      "font-size: 10px",
                    ],
                    type: "html",
                    scanStyles: true,
                  })
                }
                className="px-4 py-2 rounded-lg text-white bg-green-500 print:opacity-0 print:invisible">Print</button>
              </div>
            </div>
          </ModalComponent>
        )}
        <ModalComponent
          show={addPurchase}
          setShow={setAddPurchase}
          title="New Purchase"
        >
          <div className="flex flex-col space-y-4 max-h-[90vh]">
            <div className="flex flex-col space-y-2">
              <label htmlFor="supplier" className="text-sm font-semibold">
                Supplier
              </label>
              <input
                type="text"
                name="supplier"
                list='suppliers'
                id="supplier"
                placeholder="Supplier Name or Company Name"
                className="border border-gray-300 rounded-md px-4 py-2"
                value={newPurchase.supplier}
                onChange={(e) =>
                  setNewPurchase({ ...newPurchase, supplier: e.target.value })
                }
              />
              <datalist id="suppliers">
                {freqSuppliers.map((supplier, index) => (
                  <option key={"supplier-"+index} value={supplier._id} />
                ))}
              </datalist>

            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="paid" className="text-sm font-semibold">
                Amount Paid
              </label>
              <div className="flex border border-gray-300 rounded-md px-4 py-2">
                <span>₦ </span>
                <input
                  type="number"
                  name="paid"
                  id="paid"
                  className="w-full focus:outline-none"
                  value={newPurchase.paid}
                  onChange={(e) =>
                    setNewPurchase({ ...newPurchase, totalPaid: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="pt-8 border-t">
              <h4 className="text-sm font-semibold pb-3">
                Select Product Details
              </h4>
              <div className="flex justify-between gap-5">
                <input
                  type="text"
                  list="products"
                  name="product"
                  id="product"
                  value={newPurchaseItem.name}
                  onChange={(e) =>
                    setNewPurchaseItem({
                      ...newPurchaseItem,
                      name: e.target.value,
                    })
                  }
                  placeholder="Product name"
                  className="border border-gray-300 rounded-md px-4 py-2"
                />
                <datalist id="products">
                  {
                    freqProducts.map((product, index) => (
                      <option key={"freq-product-"+index} value={product.name} />
                    ))
                  }
                </datalist>
                <div className="flex border border-gray-300 rounded-md px-4 py-2">
                  <span>₦ </span>
                  <input
                    type="number"
                    placeholder="Price"
                    id="price"
                    value={newPurchaseItem.price}
                    onChange={(e) =>
                      setNewPurchaseItem({
                        ...newPurchaseItem,
                        price: e.target.value,
                      })
                    }
                    name="price"
                    className="w-full focus:outline-none"
                  />
                </div>
                <input
                  type="number"
                  name="qty"
                  id="qty"
                  value={newPurchaseItem.qty}
                  onChange={(e) =>
                    setNewPurchaseItem({
                      ...newPurchaseItem,
                      qty: e.target.value,
                    })
                  }
                  placeholder="Qty"
                  className="border border-gray-300 rounded-md px-4 py-2"
                />
              </div>
              <button
                onClick={() => {
                  if(!newPurchaseItem.name || !newPurchaseItem.price || !newPurchaseItem.qty) return toast.warn("Please fill all fields")
                  setNewPurchase({
                    ...newPurchase,
                    items: [
                      ...newPurchase.items,
                      {
                        name: newPurchaseItem.name,
                        price: newPurchaseItem.price,
                        qty: newPurchaseItem.qty,
                      },
                    ],
                  });
                  setNewPurchaseItem({
                    ...newPurchaseItem,
                    name: "",
                    price: "",
                    qty: "",
                  });
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 w-full"
              >
                Add to list
              </button>
            </div>
            <div className="overflow-y-scroll h-[30vh]">
              <table className="min-w-full border-collapse block md:table">
                <thead>
                  <tr>
                    <th className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                      Product
                    </th>
                    <th className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                      Price
                    </th>
                    <th className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                      Qty
                    </th>
                    <th className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                      Total
                    </th>
                    <th className="p-2 md:border md:border-grey-500 text-left block md:table-cell"></th>
                  </tr>
                </thead>
                <tbody>
                {newPurchase.items.map((item, index) => (
                    <tr
                    key={"new-purchase-item" + index}
                    >
                      <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                        {item.name}
                      </td>
                      <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                        ₦{item.price}
                      </td>
                      <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                        {item.qty}
                      </td>
                      <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                        ₦{item.price * item.qty}
                      </td>
                      <td className="flex p-2 flex-row md:border md:border-grey-500 text-left md:table-cell w-6">
                        <button
                          onClick={() => {
                            const newItems = newPurchase.items.filter(
                              (item, i) => i !== index
                            );
                            setNewPurchase({
                              ...newPurchase,
                              items: newItems,
                            });
                          }}
                          className="text-red-500 px-4 py-2"
                        >
                          <TrashIcon width={12} height={12} />
                        </button>
                        <button
                          onClick={() => {
                            setNewPurchaseItem({
                              ...newPurchaseItem,
                              name: item.name,
                              price: item.price,
                              qty: item.qty,
                            });
                            const newItems = newPurchase.items.filter(
                              (item, i) => i !== index
                            );
                            setNewPurchase({
                              ...newPurchase,
                              items: newItems,
                            });
                          }}
                          className="text-blue-500 px-4 py-2"
                        >
                          <PencilIcon width={12} height={12} />
                        </button>
                      </td>
                    </tr>
                ))}
                {
                  newPurchase.items.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-2 md:border text-center md:border-grey-500 block md:table-cell">
                        No items added
                      </td>
                    </tr>
                  )
                }
                </tbody>
              </table>
            </div>
              <div className="flex justify-between mt-4">

                <div className="flex flex-row gap-5 items-end w-full">
                  <button 

                    onClick={() => createPurchase()}
                  className="bg-green-500 text-white px-4 py-2 rounded-md mt-4 w-full">
                    Save
                  </button>
                  <button 
                    onClick={() => setAddPurchase(false)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md mt-4 w-full">
                    Cancel
                  </button>
                </div>
                </div>
          </div>
        </ModalComponent>
        <div className="w-screen h-screen relative flex bg-[#f1f1f1]">
          <AdminSideNavStaff page="coupons" />
          <div className="flex flex-col flex-grow divide-y mx-6 mt-4 w-full  bg-white rounded-xl">
            <div className="flex justify-between px-8 py-6">
              <h1 className="text-xl font-semibold">Store Purchase</h1>
              <button
                onClick={() => setAddPurchase(true)}
                className="px-6 py-2 bg-blue-500 text-white rounded-xl shadow"
              >
                New Purchase
              </button>
            </div>

            <div className="px-6 py-4 overflow-y-scroll h-full flex-1">
              <table className="min-w-full border-collapse block md:table">
                <thead className="block md:table-header-group">
                  <tr className="border border-grey-500 md:border-none block md:table-row absolute -top-full md:top-auto -left-full md:left-auto  md:relative ">
                    <th className="w-9/12 bg-gray-100 p-2 text-[#333] font-bold md:border md:border-grey-500 text-left block md:table-cell">
                      Supplier
                    </th>
                    <th className="bg-gray-100 p-2 text-[#333] font-bold md:border md:border-grey-500 text-left block md:table-cell">
                      Date
                    </th>
                    <th className="bg-gray-100 p-2 text-[#333] font-bold md:border md:border-grey-500 text-left block md:table-cell">
                      Total
                    </th>
                    <th className="bg-gray-100 p-2 text-[#333] font-bold md:border md:border-grey-500 text-left block md:table-cell">
                      Paid
                    </th>
                    <th className="bg-gray-100 p-2 text-[#333] font-bold md:border md:border-grey-500 text-left block md:table-cell">
                    </th>
                  </tr>
                </thead>
                <tbody className="block md:table-row-group text-sm">
                  {purchases &&
                    purchases.purchases.map((purchase, index) => {
                      return (
                        <tr key={"purchase-list-item" + index} className={`${
                          purchase.revoked ? "bg-gray-200" : "bg-gray-50"
                        } border border-grey-500 md:border-none block md:table-row`}>
                          <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                            <div className="w-full">

                            {purchase.supplier}
                            </div>
                          </td>
                          <td className="w-full p-2 md:border md:border-grey-500 text-left block md:table-cell">
                            {moment(purchase.createdAt).format("D MMM, YYYY")}{" "}
                            {moment(purchase.createdAt).format("hh:mmA")}
                          </td>
                          <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                            ₦{addCommaToNumber(purchase.total)}
                          </td>
                          <td
                            className={`p-2 md:border md:border-grey-500 text-left block md:table-cell ${
                              purchase.totalPaid === purchase.total
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            ₦{addCommaToNumber(purchase.totalPaid)}
                          </td>
                          <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                            <div className="flex gap-2 justify-evenly">
                              <button
                                onClick={() => {
                                  setViewPurchase(true);
                                  setPurchase(purchase);
                                }}
                                className="bg-blue-500 text-white px-2 py-1 w-full rounded-md"
                              >
                                View
                              </button>
                              <button
                                onClick={() => {
                                  setShowEditPurchase(true);
                                  setPurchase(purchase);
                                }}
                                disabled={purchase.revoked}
                                className={`${
                                  !purchase.revoked ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
                                } px-2 py-1 w-full rounded-md`}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  setPurchase(purchase);
                                  setShowRevokePurchase(true);
                                }}
                                disabled={purchase.revoked}
                                className={`${
                                  !purchase.revoked ? "bg-red-500 text-white" : "bg-gray-200 text-gray-500"
                                }  px-2 py-1 w-full rounded-md`}
                              >
                                Revoke
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>

              {purchases === []  && (
                  <h1 className="text-3xl text-gray-300 text-center mx-auto pt-16">
                    No purchase is found
                  </h1>
                )}
            </div>
            <div id="pagination" className="flex justify-center items-center">
              <Pagination
                count={purchases?.pagesCount || 1}
                page={page}
                onChange={(page) => {
                  setPage(page);
                }}
              />

          </div>
          </div>
        </div>
      </>
    </div>
    </>
    );
}
 
export default Discounts;

const Pagination = ({
  count,
  page,
  onChange,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setCurrentPage(page);
    setTotalPages(count);
  }, [page, count]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    onChange(value);
  };

  return (
    <div className="flex justify-center items-center">
      <button 
        onClick={() => {
          if (currentPage > 1) {
            handlePageChange(null, currentPage - 1);
          }
        }}
      className="bg-white text-gray-500 px-4 py-2 rounded-l-md focus:outline-none">
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button className="bg-white text-gray-500 px-4 py-2 focus:outline-none">
        {currentPage}
      </button>
      <span className="bg-white text-gray-500 px-4 py-2 focus:outline-none">of</span>
      <button className="bg-white text-gray-500 px-4 py-2 rounded-r-md focus:outline-none">
        {totalPages}
      </button>
      <button 
      onClick={() => {
        console.log(count);
        if (currentPage < count) {
          handlePageChange(null, currentPage + 1);
        }
      }}

      className="bg-white text-gray-500 px-4 py-2 rounded-r-md focus:outline-none">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};
