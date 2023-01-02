import React, {useState, useMemo, useEffect} from 'react'
import AdminSideNavStaff from '../../components/AdminSideNavStaff';
import {useSelector, useDispatch} from 'react-redux'
import {getAllProductByCategory, fundStock, deleteProduct, editProduct, createProduct} from '../../utils/redux/actions/adminSlice'
import {v4 as uuid} from 'uuid'
import { InboxIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import axios from '../../utils/axios';

const Inventory = () => {
    const dispatch = useDispatch()
    const products = useSelector(state => state.admin.productsByCategory)
    const fundedProduct = useSelector(state => state.admin.fundedProduct)
    const editedProduct = useSelector(state => state.admin.editedProduct)
    const deletedProduct = useSelector(state => state.admin.deletedProduct)
    const createdProduct = useSelector(state => state.admin.createdProduct)
    const [productToFund, setProductToFund] = useState()
    const [addProduct, setAddProduct] = useState(false)
    const [newProduct, setNewProduct] = useState({
        name: '',
        category: 'Food',
        price: 0
    })
    const [productToDelete, setProductToDelete] = useState()
    const [productToEdit, setProductToEdit] = useState()
    const [productDetails, setProductDetails] = useState()
    const [stockAmount, setStockAmount] = useState()
    const [categories, setCategories] = useState([])
    const [addCategory, setAddCategory] = useState(false)
    const [newCat, setNewCat] = useState("")
    const [searchKwrd, setSearchKwrd] = useState("")



    async function fetchCategories () {
        const cats = await (await axios.get("/admin/categories")).data
        setCategories(cats)
    }

    useEffect(() => {
        fetchCategories()
    },[])
    
    const [selectedCategory, setSelectedCategory] = useState('All')
    const sortedProducts = useMemo(() => (
        products.products.filter(item => {
            if(searchKwrd.length < 1) return item
            return String(item.name).toLowerCase().includes(searchKwrd.toLowerCase())
        }).filter(item => {
            if(selectedCategory === "All") return item 
            return item.category === selectedCategory
        })
    ), [selectedCategory, products, categories, searchKwrd])


    const handleSelectCat = (name) => {
        setSelectedCategory(name)
    }

    useEffect(() => {
        dispatch(getAllProductByCategory())
        setProductToFund()
        setProductToEdit()
        setProductToDelete()
        setAddProduct(false)
    }, [fundedProduct, editedProduct, createdProduct, deletedProduct])

    const handleFundStock = () => {
        if(!stockAmount) return
        const stockDetails = {
            _id: productToFund._id,
            amount: stockAmount
        }
        dispatch(fundStock(stockDetails))
    }

    const handleEditProductDetails = (detail) => {
            setProductDetails(prevState => {
                const {_id} = productToEdit
                const newState = {
                    _id,
                    ...prevState,
                    ...detail
                }
                return newState
            })
    }

    const handleEditProduct = () => {
        const {name, category, price, _id} = productDetails
        if(!name || !category || !price || !_id) return
        const editData = {
            _id,
            name,
            category,
            price
        }
        dispatch(editProduct(editData))
    }

    const handleAddProduct = () => {
        const {name, category, price} = newProduct
        // if(!name || !category || !price) return
        const newData = {
            name,
            category,
            price
        }
        dispatch(createProduct(newData))
    }

    const handleDeleteProduct = () => {
        const {_id} = productToDelete
        if(!_id) return
        dispatch(deleteProduct({_id}))
    }

    async function handleCreateCategory () {
        if(newCat.length < 3) return 
        const createdCat = await (await axios.post("/admin/category/create", {name: newCat})).data
        if(createdCat) {
            fetchCategories()
            return setNewCat("")
        }
    }

    async function handleDeleteCategory (_id) {
        const deletedCat = await (await axios.post("/admin/category/delete", {_id})).data
        if(deletedCat) {
            fetchCategories()
        }
    }


    return ( 
        <div className="w-screen h-screen text-sm flex bg-[#f1f1f1]">
            {productToDelete && 
                <div className="flex items-center justify-center absolute z-40 bg-[rgba(0,0,0,.5)] w-full h-screen">
                    <div className=" bg-white shadow-xl px-16 py-16 rounded-2xl">
                        <p className="text-xl">Are you sure you want to delete {productToDelete.name}?</p>
                        <div className="flex gap-4 justify-between pt-6 w-full">
                            <button 
                            onClick={() => setProductToDelete()}  
                            className="w-full px-8 py-6 bg-green-500 text-white rounded-2xl shadow">Cancel</button>
                            <button 
                            onClick={() => handleDeleteProduct()}
                            className="w-full px-8 py-6 bg-red-500 text-white rounded-2xl shadow">Delete</button>
                        </div>
                    </div>
                </div>
            }
            {productToFund && <div className="flex items-center justify-center absolute z-40 bg-[rgba(0,0,0,.5)] w-full h-screen">
                <div 
                className=" bg-white shadow-xl px-6 py-6 rounded-2xl">
                   <h6 className='py-2'>Stock to add for {productToFund.name}</h6>
                   <input value={stockAmount} onChange={(e) => setStockAmount(e.target.value)} type="text" placeholder='Qty in numbers' className="px-6 py-2 focus:outline-none rounded-xl bg-gray-100 shadow-inner" />
                   <div className="flex pt-4 justify-between gap-4">
                        <button onClick={() => setProductToFund(0,setStockAmount())} className="px-6 w-full py-3 rounded-xl shadow text-white bg-red-500">Cancel</button>
                        <button onClick={() => handleFundStock()} className="px-6 w-full py-3 rounded-xl shadow text-white bg-green-500">Add</button>
                   </div>
                   </div>
                </div>
                }
            {addCategory && 
            <div className="flex items-center justify-center absolute z-40 bg-[rgba(0,0,0,.5)] w-full h-screen">
                <div className="relative">

                <button onClick={() => setAddCategory(false)} className='fixed px-3 py-2'>
                    <XMarkIcon width={16} height={16} />
                </button>
                <div 
                className=" bg-white w-[40vw] min-h-[40vh] shadow-xl px-6 py-6 rounded-2xl">
                   <div className="w-full gap-4 flex px-4 py-2">
                        <input value={newCat} onChange={e => setNewCat(e.target.value)} type="text" className="px-6 py-2 w-full rounded-xl bg-gray-100" />
                        <button onClick={() => handleCreateCategory()} className="px-6 w-max py-3 rounded-xl shadow text-white bg-green-500">Add</button>
                   </div>
                   <div className="grid gap-4 grid-cols-3 py-4">
                    {
                        categories.map(cat => (
                            <button key={cat._id} className="flex justify-between items-center px-4 py-2 bg-gray-100 rounded-lg">{cat.name} <XMarkIcon onClick={() => handleDeleteCategory(cat._id)} width={16} height={16} /></button>
                        ))
                    }
                   </div>
                   {
                    categories.length === 0 && 
                    <div className="flex flex-col items-center py-8">
                        <InboxIcon width={128} height={128} color={"#ccc"} />
                        <p className='text-[#ccc]'>No record was found!</p>
                    </div>
                   }
                   </div>
                </div>
                </div>
                }
            {productToEdit && <div className="flex items-center justify-center absolute z-40 bg-[rgba(0,0,0,.5)] w-full h-screen">
                <div 
                className=" bg-white shadow-xl px-6 py-6 rounded-2xl">
                   <div className="">
                        <h6 className='py-2'>Product Name</h6>
                        <input value={productDetails.name} onChange={(e) => handleEditProductDetails({name: e.target.value})} type="text" placeholder='Qty in numbers' className="px-6 py-2 focus:outline-none rounded-xl bg-gray-100 shadow-inner" />
                   </div>
                   <div className="">
                        <h6 className='py-2'>Price</h6>
                        <input value={"₦" + productDetails.price} onChange={(e) => handleEditProductDetails({price: e.target.value.slice(1)})} type="text" placeholder='Qty in numbers' className="px-6 py-2 focus:outline-none rounded-xl bg-gray-100 shadow-inner" />
                   </div>
                   <div className="">
                        <h6 className='py-2'>Category</h6>
                        <select defaultValue={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}  className="px-6 py-2 focus:outline-none rounded-xl bg-gray-100 shadow border">
                            <option key={uuid()} value="All">All</option>
                            {
                                categories.map(cat => (
                                    <option key={uuid()} value={cat.name}>{cat.name}</option>
                                ))
                            }
                        </select>
                   </div>
                   
                   <div className="flex pt-4 justify-between gap-4">
                        <button onClick={() => setProductToEdit(0,setProductDetails())} className="px-6 w-full py-3 rounded-xl shadow text-white bg-red-500">Cancel</button>
                        <button onClick={() => handleEditProduct()} className="px-6 w-full py-3 rounded-xl shadow text-white bg-green-500">Edit</button>
                   </div>
                   </div>
                </div>
                }
            {addProduct && <div className="flex items-center justify-center absolute z-40 bg-[rgba(0,0,0,.5)] w-full h-screen">
                <div 
                className=" bg-white shadow-xl px-6 py-6 rounded-2xl">
                   <div className="">
                        <h6 className='py-2'>Product Name</h6>
                        <input value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} type="text" placeholder='Product Name' className="px-6 py-2 focus:outline-none rounded-xl bg-gray-100 shadow-inner" />
                   </div>
                   <div className="">
                        <h6 className='py-2'>Price</h6>
                        <input value={"₦" + newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value.slice(1)})} type="text" placeholder='Qty in numbers' className="px-6 py-2 focus:outline-none rounded-xl bg-gray-100 shadow-inner" />
                   </div>
                   <div className="">
                        <h6 className='py-2'>Category</h6>
                        <select defaultValue={newProduct.category} value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}  className="px-6 py-2 focus:outline-none rounded-xl bg-gray-100 shadow border">
                            {
                                categories.map(cat => (
                                    <option key={uuid()} value={cat.name}>{cat.name}</option>
                                ))
                            }
                        </select>
                   </div>
                   
                   <div className="flex pt-4 justify-between gap-4">
                        <button onClick={() => setAddProduct(null,setNewProduct({
                            name: '',
                            category: 'Food',
                            price: 0
                        }))} className="px-6 w-full py-3 rounded-xl shadow text-white bg-red-500">Cancel</button>
                        <button onClick={() => handleAddProduct()} className="px-6 w-full py-3 rounded-xl shadow text-white bg-green-500">Create</button>
                   </div>
                   </div>
                </div>
                }
            <AdminSideNavStaff page="menu" />
            <div className="flex-1 text-sm flex-grow divide-y mx-6 mt-4 w-full  bg-white rounded-xl">
                <div className="flex justify-between px-8 py-4 items-center">
                    <h1 className='text-lg font-semibold'>Menu</h1>
                    <div className="px-6 gap-4 flex items-center">
                        <p>Category: </p>
                    <select 
                    onChange={(e) => handleSelectCat(e.target.value)}
                    className='px-4 py-2 border rounded-lg  ' name="" id="">
                        <option key={uuid()} value="All">All</option>
                        {
                            categories.map(category => (
                                <option key={uuid()} value={category.name}>{category.name}</option>
                            ))
                        }
                    </select>
                </div>
                <div>
                    <input placeholder='Search' value={searchKwrd} onChange={(e) => setSearchKwrd(e.target.value)} className='px-6 py-2 rounded-xl bg-gray-50 shadow-inner' />
                   </div>
                    <button onClick={() => setAddProduct(true)} className="px-6 py-2 bg-green-500 text-white rounded-xl shadow">Add Product</button>
                    <button onClick={() => setAddCategory(true)} className="px-6 py-2 bg-blue-500 text-white rounded-xl shadow">Add Category</button>
                </div>
                
                {/* <div className="px-6 text-sm">
                    <div className="flex items-center gap-3 mb-4 ml-4 px-6 py-4 bg-white max-w-5xl rounded-full">
                        <button 
                        onClick={() => handleSelectCat("All")}
                        className={`flex flex-row shadow-xl item-center gap-3 px-4 py-3 pr-6  rounded-full border-2 ${selectedCategory === "All" ? "border-[#FFA0A0]" : "bg-[#F1F7FC] border-transparent"}`}>
                            <img src="/store.png" alt="" className='w-[20px]' />
                            <p>All</p>
                        </button>
                        {
                            dummy.map(category => (
                                <button 
                                key={uuid()}
                                onClick={() => handleSelectCat(category.name)}
                                className={`flex flex-row shadow-xl item-center justify-center gap-3 px-3 py-3 pr-6 w-max rounded-full border-2 ${selectedCategory === category.name ? "border-[#FFA0A0]" : "bg-[#F1F7FC] border-transparent"}`}>
                                    <img src={`${category.icon}`} alt="" className='w-[20px]' />
                                    <p>{category.name}</p>
                                </button>
                            ))
                        }
                    </div>
                </div> */}
                <div className="px-6 overflow-y-scroll pt-6 h-[calc(100%-25%)]">
                <table className="table-auto py-4 px-6 w-full text-left">
                    <thead className='border-b sticky border-gray-200 py-2'>
                        <tr className='my-2 font-normal'>
                            <th className='py-2 font-normal w-full'>Product</th>
                            {selectedCategory === "All" && <th className='py-2 font-normal px-8'>Category</th>}
                            <th className='py-2 font-normal px-8'>Price</th>
                            <th className='py-2 font-normal px-6'>Stock</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            sortedProducts.map(item => (
                                <tr key={uuid()}>
                                    <td className='py-2 w-full border-b border-gray-100'>{item.name}</td>
                                    {selectedCategory === "All" && <td className='py-2 px-8 border-b border-gray-100'>{item.category}</td>}
                                    <td className='py-2 px-8 border-b border-gray-100'>₦{item.price}</td>
                                    <td className='py-2 px-6 border-b border-gray-100'>{item.stock}</td>
                                    <div className="w-max flex gap-3 items-center py-2">
                                        <button onClick={() => setProductToFund(item, setStockAmount())} className="px-4 py-2 rounded-xl text-white shadow bg-green-500">Stock</button>
                                        <button onClick={() => setProductToEdit(item, setProductDetails(item))} className="px-4 py-2 rounded-xl text-white shadow bg-blue-500">
                                            {/* Edit Product */}
                                            <PencilIcon width={16} height={16} />
                                        </button>
                                        <button onClick={() => setProductToDelete(item)} className="px-4 py-2 rounded-xl text-white shadow bg-red-500">
                                            {/* Delete Product */}
                                            <TrashIcon height={16} width={16} />
                                        </button>
                                    </div>
                                </tr>
                            ))
                        }
                    </tbody>
                    </table>
                    {
                        sortedProducts && sortedProducts.length === 0 &&
                        <div className="flex flex-col items-center py-44">
                        <InboxIcon width={128} height={128} color={"#ccc"} />
                        <p className='text-[#ccc]'>No record was found!</p>
                    </div>
                    }
                </div>
            </div>
        </div>
     );
}
 
export default Inventory;