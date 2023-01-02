import React, { useEffect, useState, useMemo } from 'react'
import SideNavStaff from '../../components/SideNavStaff';
import {useSelector, useDispatch} from 'react-redux'
import {getAllProductByCategory, placeOrder, closeOrder, getDiscounts} from '../../utils/redux/actions/staffSlice'
import jwtDecode from 'jwt-decode';
import printJS from "print-js"
import {v4 as uuid} from 'uuid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faCartShopping} from '@fortawesome/free-solid-svg-icons'
import axios from '../../utils/axios';
import Receipt from '../../components/Receipt';


const Sales = () => {
    const dispatch = useDispatch()
    const products = useSelector(state => state.staff.productsByCategory)
    const discounts = useSelector(state => state.staff.discounts)
    const completedOrder = useSelector(state => state.staff.completedOrder)
    const staff = jwtDecode(JSON.parse(localStorage.getItem("USER_TEMP")).token)
    // const filterItem = getFilterItem(query, products)

    useEffect(() => {
        dispatch(getAllProductByCategory())
        dispatch(getDiscounts())
    }, [dispatch])

    const [cart, setCart] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [shipmentFee, setShipmentFee] = useState(0)
    const [customer, setCustomer] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [showPrint, setShowPrint] = useState(false)
    const [selectedDiscount, setSelectedDiscount] = useState('')
    const [reservationDate, setReservationDate] = useState('')
    const [categories, setCategories] = useState([])
    const [searchKwrd, setSearchKwrd] = useState("")
    const [selectedOrderType, setSelectedOrderType] = useState("Instant-Order")
    const [selectedPayType, setSelectedPayType] = useState("Cash")
    // const [query, setQuery] = useState('')

    async function fetchCategories () {
        const cats = await (await axios.get("/staff/categories")).data
        setCategories(cats)
    }

    useEffect(() => {
        fetchCategories()
    },[])
    
    // const [reservationTime, setReservationTime] = useState('')
    const cartSum = useMemo(() => (cart.reduce((accumulator, object) => {
        return accumulator + (object.item.price * object.qty);
    }, 0)), [cart])

    function sortByKey(array, key) {
        return array.sort(function(a, b) {
            var x = a[key]; var y = b[key];
            return ((x < y) ? 1 : ((x > y) ? -1 : 0));
        });
    }

    // const discountedValue = useMemo(() => {
    //     if(!discounts === [] && selectedDiscount !== 0) return (selectedDiscount === "0" ? 0 : discounts[discounts.findIndex(discount => discount._id === selectedDiscount)].percentage)
    //     return 0
    // }, [selectedDiscount, discounts])
    const discountedValue = useMemo(() => {
        return selectedDiscount 
    }, [selectedDiscount])

    const sortedProducts = useMemo(() => (
        products.products.filter(item => {
            if(searchKwrd.length < 1) return item
            return String(item.name).toLowerCase().includes(searchKwrd.toLowerCase())
        }).filter(item => {
            if(selectedCategory === "All") return item 
            return item.category === selectedCategory
        })
    ), [selectedCategory, products, searchKwrd])

    // const getFilterItem = (query, products) => {
    //     // if (!query) return products
    
    //     // return products.filter(product => product.name.includes(query))
    // }

    const dummy = [
        {
            name: "Food",
            icon: "/dish.png"
        },
        {
            name: "Drinks",
            icon: "/drinks.png"
        },
        {
            name: "Confection",
            icon: "/confection.jfif"
        },
        {
            name: "Biscuit",
            icon: "/biscuit.png"
        },
        {
            name: "Tea",
            icon: "/tea.jfif"
        },
        {
            name: "Spices",
            icon: "/spices.jfif"
        },
        {
            name: "Oil",
            icon: "/oil.png"
        },
        {
            name: "Detergent",
            icon: "/detergent.jfif"
        },
        {
            name: "Others",
            icon: "/others.png"
        }
    ]

    

    
    const handleSelectCat = (name) => {
        setSelectedCategory(name)
    }

    const handleIncrement = (increment, item) => {
        const newState = cart.map(obj => {
            if (obj.item._id === item.item._id) {
                if(increment === "-") return {...obj, qty: +obj.qty - 1}
                if(increment === "+" && item.item.stock <= obj.qty) return {...obj, qty: item.item.stock}
                if(increment === "+") return {...obj, qty: +obj.qty + 1}
                if(typeof increment === "string" && increment > item.item.stock) return {...obj, qty: item.item.stock}
                if(typeof increment === "string") return {...obj, qty: +increment}
            }
            return obj;
        }); 
          setCart(newState);
    }

    const handleRemove = (item) => {
        const newState = cart.filter(product => product.item._id !== item.item._id)
        setCart(newState)
    }


    const handleAddToCart = (item) => {
       if(cart.filter(i => i.item._id === item._id).length > 0) return 
        setCart(prevState => {
            let newState = [
                ...prevState,
                {
                    item,
                    qty: 1
                }
            ]
            return newState
        })
    }

    const showConfirmOrder = () => {
        if(cartSum === 0) return
        setShowModal(true)
    }

    const handleConfirmOrder = () => {
        if(!cart) return
        if(!selectedOrderType) return
        if(!selectedOrderType === "Reservation") setReservationDate('')
        if(selectedOrderType === "Reservation" && !reservationDate) return
        const orderDetails = {
            items: [...cart],
            customer,
            orderType: selectedOrderType,
            createdBy: staff._id,
            reservationDate,
            discount: discountedValue,
            isReserved: selectedOrderType === "Reservation",
            shipmentFee: (selectedOrderType === "Shipment" ? shipmentFee : null),
            payType: selectedPayType,
        }
        setSelectedDiscount('')
        setSelectedOrderType('')
        dispatch(placeOrder(orderDetails))
        dispatch(getAllProductByCategory())
        setSelectedOrderType('')
        setCart([])
        setShowPrint(true)
    }
    
    const completeOrder = () => {
        dispatch(closeOrder())
        dispatch(getAllProductByCategory())
        setSelectedOrderType('')
        setCart([])
        setCustomer('')
        setSelectedDiscount('')
        setShowModal(false)
        setShowPrint(false)
    } 

    const D = new Date()

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();

    if (dd < 10) {
    dd = '0' + dd;
    }

    if (mm < 10) {
    mm = '0' + mm;
    } 
        
    today = yyyy + '-' + mm + '-' + dd;

    return ( 
        <div className="w-screen h-screen flex text-sm bg-[#f1f1f1]">
            {/* <div>
                <label>Search </label>
                <input type="text" onChange={e => setQuery(e.target.value)} />
                <ul>
                    {filterItem.map(result => <h1 key={result.name}>{result.name}</h1>)}
                </ul>
            </div> */}
            {showModal && <div className="flex items-center justify-center absolute z-40 bg-[rgba(0,0,0,.5)] w-full h-screen">
                <div 
                className="divide-y bg-white shadow-xl w-7/12 px-6 py-16 rounded-2xl">
                   {!showPrint && 
                   <>
                    <div className="pb-6">
                        <p className='text-xl text-center pb-6'>Please choose a type for this order</p>
                        <div className="flex gap-4 mx-auto justify-center">
                            <button 
                            onClick={() => setSelectedOrderType("Instant-Order")}
                            className={`rounded-lg px-6 py-4 bg-gray-100 border-4 ${selectedOrderType === "Instant-Order" ? "border-orange-500" : "border-transparent"}`}>Instant Order</button>
                            <button 
                            onClick={() => {
                                setSelectedPayType("")
                                setSelectedOrderType("Debt")
                            }}
                            className={`rounded-lg px-6 py-4 bg-gray-100 border-4 ${selectedOrderType === "Debt" ? "border-orange-500" : "border-transparent"}`}>Debt</button>
                            <button 
                            onClick={() => setSelectedOrderType("Shipment")}
                            className={`rounded-lg px-6 py-4 bg-gray-100 border-4 ${selectedOrderType === "Shipment" ? "border-orange-500" : "border-transparent"}`}>Delivery</button>
                            <button 
                            onClick={() => setSelectedOrderType("Reservation")}
                            className={`rounded-lg px-6 py-4 bg-gray-100 border-4 ${selectedOrderType === "Reservation" ? "border-orange-500" : "border-transparent"}`}>Reservation</button>
                        </div>
                        <p className='text-xl text-center py-6'>Choose payment type</p>
                        <div className="flex gap-4 mx-auto justify-center">
                            <button 
                            onClick={() => setSelectedPayType("Cash")}
                            style={{
                                pointerEvents: selectedOrderType === "Debt" ? "none" : "auto",
                            }}
                            className={`rounded-lg px-6 py-4 bg-gray-100 border-4 ${selectedPayType === "Cash" ? "border-orange-500" : "border-transparent"}`}>Cash</button>
                            <button 
                            onClick={() => setSelectedPayType("Transfer")}
                            style={{
                                pointerEvents: selectedOrderType === "Debt" ? "none" : "auto",
                            }}
                            className={`rounded-lg px-6 py-4 bg-gray-100 border-4 ${selectedPayType === "Transfer" ? "border-orange-500" : "border-transparent"}`}>Transfer</button>
                            <button 
                            onClick={() => setSelectedPayType("POS")}
                            style={{
                                pointerEvents: selectedOrderType === "Debt" ? "none" : "auto",
                            }}
                            className={`rounded-lg px-6 py-4 bg-gray-100 border-4 ${selectedPayType === "POS" ? "border-orange-500" : "border-transparent"}`}>POS</button>
                        </div>
                        {selectedOrderType === "Reservation" && <div className="pt-6 flex items-center justify-center">
                            <h6 className='mr-4'>Pick Date and Time:</h6>
                            <input type="date" min={today} value={reservationDate} onChange={(e) => setReservationDate(e.target.value)} className='border border-slate-400 rounded-xl focus:outline-none px-3 py-2' name="" id="" />
                        </div>}
                        {selectedOrderType === "Shipment" && <div className="pt-6 flex items-center justify-center">
                            <h6 className='mr-4'>Delivery Fee:</h6>
                            <input type="number" min={0} value={shipmentFee} onChange={(e) => setShipmentFee(e.target.value)} className='border border-slate-400 rounded-xl focus:outline-none px-3 py-2' name="" id="" />
                        </div>}
                        </div>
                            <div className="flex gap-4 justify-between pt-6 w-full">
                                <button onClick={() => setShowModal(false)}  className="w-full px-8 py-6 bg-green-500 text-white rounded-2xl shadow">Cancel</button>
                                <button 
                                onClick={() => handleConfirmOrder()}
                                className="w-full px-8 py-6 bg-red-500 text-white rounded-2xl shadow">Confirm Order</button>
                            </div>
                        </>
                        }
                        {
                            showPrint && 
                            <div className="flex items-center justify-center pt-2 px-4">
                               { completedOrder && completedOrder.items && 
                                   <Receipt value={completedOrder} staff={staff} />
                                }
                                 <div className="flex flex-col w-96 pl-16 h-96 px-6 py-4 ">
                                    <button className="bg-blue-500 ring-4 rounded-t-xl h-screen w-full text-white px-6 py-2" type="button" onClick={() => printJS({printable: 'receipt', css: ["https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css", "font-size: 10px"], type: 'html', scanStyles: true})}>
                                        Print Receipt
                                    </button>
                                    <button className="bg-red-500 ring-4 ring-red-400 rounded-b-xl h-screen w-full text-white px-6 py-2" type="button" onClick={() => completeOrder()}>
                                        Close
                                    </button>
                                 </div>
                        
                        </div>
                        }
                        
                    </div>
                </div>
                }
            <SideNavStaff page="sales" />
            <div className="flex-1 w-full flex-grow ">
                <div className='flex items-center justify-center'>

                <div className="px-6 flex gap-4 pt-3">
                        <h6 className='py-2'>Category:</h6>
                        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}  className="px-6 py-1 focus:outline-none rounded-xl bg-gray-100 shadow border">
                            <option key={uuid()} value="All">All</option>
                            {
                                categories.map(cat => (
                                    <option key={uuid()} value={cat.name}>{cat.name}</option>
                                ))
                            }
                        </select>
                   </div>
                   <div>
                    <input placeholder='Search' value={searchKwrd} onChange={(e) => setSearchKwrd(e.target.value)} className='px-6 py-2 rounded-xl shadow-inner' />
                   </div>
                </div>
                <div className="flex flex-col px-6 py-4 pt-16 pb-32 overflow-y-scroll gap-4 h-full">
                    {
                        products && sortByKey(sortedProducts, "stock").map(item => (
                            <div 
                                key={item._id}
                                onClick={() => item.stock > 0 ? handleAddToCart(item) : null}
                                className={`flex items-center px-4 h-max py-4 rounded-xl shadow-lg bg-white ${item.stock <= 20 ? "bg-yellow-100" : ""} ${item.stock < 1 ? "bg-red-400" : ""}`}>
                                {/* <img src="/logo.png" alt="" className='w-16' /> */}
                                <div className="flex">
                                    <h4 className='text-lg'>{item.name}</h4>
                                    &nbsp;
                                    <p className='text-lg font-semibold'>₦{item.price}</p>
                                </div>
                            </div>
                        ))
                    }
                    {
                        !sortedProducts && <div className="w-full h-full flex items-center justify-center">
                            <p className='text-gray-400 text-2xl'>No item found in this category</p>
                        </div>
                    }
                </div>
                {/* <div className="flex gap-3 border-2 border-gray-50 fixed shadow-xl bottom-0 mb-4 ml-4 px-6 py-4 bg-white max-w-6xl rounded-full">
                    <button 
                    onClick={() => handleSelectCat("All")}
                    className={`flex flex-row shadow-xl item-center gap-3 px-4 py-3 pr-6  rounded-full border-2 ${selectedCategory === "All" ? "border-[#FFA0A0]" : "bg-[#F1F7FC] border-transparent"}`}>
                        <img src="/store.png" alt="" className='w-[26px]' />
                        <p>All</p>
                    </button>
                    {
                        dummy.map(category => (
                            <button 
                            key={dummy.indexOf(category)}
                            onClick={() => handleSelectCat(category.name)}
                            className={`flex flex-row shadow-xl item-center gap-3 px-4 py-3 pr-6 w-32 rounded-full border-2 ${selectedCategory === category.name ? "border-[#FFA0A0]" : "bg-[#F1F7FC] border-transparent"}`}>
                                <img src={`${category.icon}`} alt="" className='w-[26px]' />
                                <p>{category.name}</p>
                            </button>
                        ))
                    }
                </div> */}
            </div>
            <div className="flex flex-col text-sm divide-y w-[25vw] rounded-xl scale-[.95] bg-green-500">
                {/* <div className="h-full w-full"> */}
                    <div className="flex flex-col divide-y w-full rounded-xl divide-dashed divide-gray-400 h-full bg-white px-0 py-6">
                        <h4 className='px-6 pb-4 text-xl flex items-center gap-3 font-semibold'>
                        <FontAwesomeIcon icon={faCartShopping} />
                             Cart</h4>
                        <div className="py-2 divide-y w-full divide-gray-100 flex-grow flex flex-col overflow-y-scroll">
                            {
                                cart.reverse().map(item => (
                                    <div key={item.item._id} className="flex gap-3 px-4 py-2 items-center">
                                        <img src="/logo.png" alt="" className='w-16' />
                                        <div className="leading-tight">
                                            <h6>{item.item.name}</h6>
                                            <h6 className='font-semibold text-lg'>₦{item.item.price}</h6>
                                        </div>
                                        <div className="flex items-center gap-2 ml-auto">
                                            {
                                                item.qty === 1 || item.qty < 2 ?
                                                <button onClick={() => handleRemove(item)} className='w-8 h-8 bg-red-500 text-white rounded-lg'>🗑</button>
                                                :
                                                <button onClick={() => handleIncrement("-", item)} className='w-8 h-8 bg-red-500 text-white rounded-lg'>-</button>
                                            }
                                            <input className='w-12 border text-center' type="number" min={0} max={item.item.stock} value={item.qty} onChange={(e) => handleIncrement(e.target.value, item)}/>
                                            <button onClick={() => handleIncrement("+", item)}  className='w-8 h-8 bg-green-500 text-white rounded-lg'>+</button>
                                        </div>
                                    </div>
                                ))
                            }
                            {
                                cartSum === 0 && <div className="flex text-gray-300 h-full items-center justify-center w-full text-center">
                                    <h3>Click on an item to add to cart</h3>
                                </div>
                            }
                        </div>
                        <div className="py-2 px-6">
                            <input type="text" value={customer} onChange={(e) => setCustomer(e.target.value)} placeholder='Customer name (optional)' className="capitalize focus:outl px-6 py-3 shadow-inner text-sm w-full rounded-full bg-gray-100" />
                        </div>
                        
                        <div className="py-2 px-6">
                            <input 
                            type="text"
                            value={selectedDiscount}
                            onChange={(e) => {
                                if (isNaN(e.target.value)) return
                                setSelectedDiscount(e.target.value)
                                }} className='focus:outl px-6 py-3 shadow-inner text-sm w-full rounded-full bg-gray-100' placeholder='Discount e.g 400' name="" id="" />
                        </div>

                        {
                            (cartSum - (cartSum * ((100 - discountedValue) / 100))) !== 0 &&
                        <div className="py-4 px-6 items-center flex justify-between">
                            <h5>Subtotal:</h5>
                            <h5>{cartSum} - <p className='text-red-500 inline'>₦{discountedValue}</p></h5>
                        </div>
                        }
                        <div className="py-4 px-6 items-center flex justify-between">
                            <h5>Total:</h5>
                            <h5 className='text-green-500 text-2xl font-semibold'>₦{cartSum - discountedValue}</h5>
                           
                        </div>
                        <div className="flex gap-2 px-6 pt-4">
                            <button onClick={() => setCart([], setCustomer(''))} className="px-6 py-3 shadow bg-red-500 text-white rounded-full">
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                            <button 
                            onClick={() => showConfirmOrder()}
                            className={`px-6 py-3 ${cart.length > 0 ? "bg-green-500" : "bg-gray-300"}  text-white shadow w-full rounded-full`}>Place Order</button>
                        </div>
                    </div>
                {/* </div> */}
            </div>
        </div>
     );
}
 
export default Sales;
