import { useState } from "react"
import { XMarkIcon } from '@heroicons/react/24/solid';

const ModalComponent = ({show, setShow, title, children}) => {
    return (
        <div 
        onClick={(e) => {
            if(e.target === e.currentTarget) {
                setShow(false)
            }
        }}

        className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 ${show ? 'flex' : 'hidden'}`}>
            <div className="bg-white scale-[.94] rounded-xl mx-auto my-auto">
                <div className="flex justify-between items-center px-8 py-4">
                    <h1 className="text-xl font-semibold">{title}</h1>
                    <button onClick={() => setShow(false)} className="text-2xl font-semibold">
                        <XMarkIcon width={18} height={18} />
                    </button>
                </div>
                <div className="px-8 py-4 overflow-y-scroll">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default ModalComponent