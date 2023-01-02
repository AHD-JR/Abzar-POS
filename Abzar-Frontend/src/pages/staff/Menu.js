import React, {useState, useMemo, useEffect} from 'react'
import SideNavStaff from '../../components/SideNavStaff';
import {useSelector, useDispatch} from 'react-redux'
import {getAllProductByCategory} from '../../utils/redux/actions/staffSlice'

const Menu = () => {
    const dispatch = useDispatch()
    const products = useSelector(state => state.staff.productsByCategory)
    const [selectedCategory, setSelectedCategory] = useState('All')
    const sortedProducts = useMemo(() => (
        products.products.filter(item => {
            if(selectedCategory === "All") return item 
            return item.category === selectedCategory
        })
    ), [selectedCategory, products])

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

    useEffect(() => {
        dispatch(getAllProductByCategory())
    }, [])

    return ( 
        <div className="w-screen h-screen flex text-sm bg-[#f1f1f1]">
            <SideNavStaff page="menu" />
            <div className="flex-1 flex-grow divide-y mx-6 mt-4 w-full  bg-white rounded-xl">
                <div className="px-8 py-6">
                    <h1 className='text-xl font-semibold'>Menu</h1>
                </div>
                <div className="px-6">
                    <div className="flex gap-3 mb-4 ml-4 px-6 py-4 bg-white max-w-5xl rounded-full">
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
                    </div>
                </div>
                <div className="px-6 py-4 overflow-y-scroll h-[calc(100%-25%)]">
                <table class="table-auto py-4 mx-6 w-full text-left">
                    <thead className='border-b sticky border-gray-200 py-2'>
                        <tr className='my-2 font-normal'>
                            <th className='py-2 font-normal w-full'>Product</th>
                            {selectedCategory === "All" && <th className='py-2 font-normal px-32'>Category</th>}
                            <th className='py-2 font-normal px-32'>Price</th>
                            <th className='py-2 font-normal px-32'>Stock</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            sortedProducts.map(item => (
                                <tr>
                                    <td className='py-2 w-full border-b border-gray-100'>{item.name}</td>
                                    {selectedCategory === "All" && <td className='py-2 px-32 border-b border-gray-100'>{item.category}</td>}
                                    <td className='py-2 px-32 border-b border-gray-100'>₦{item.price}</td>
                                    <td className='py-2 px-32 border-b border-gray-100'>
                                        {
                                            item.stock > 5 ?
                                            <span className='text-green-500'>{item.stock}</span>
                                            :
                                            <span className='text-red-500'>{item.stock}</span>
                                        }
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                    </table>
                </div>
            </div>
        </div>
     );
}
 
export default Menu;