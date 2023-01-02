import React, {useState} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {signOut} from "../utils/redux/actions/staffSlice"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClockRotateLeft, faStore, faArrowRightFromBracket, faClipboard, faShopLock, faEyeSlash, faEye} from '@fortawesome/free-solid-svg-icons'
import {
    Squares2X2Icon,
    UserGroupIcon,
    BookOpenIcon,
    DocumentDuplicateIcon,
    ArchiveBoxIcon,
    CogIcon,
    ClipboardDocumentListIcon,
    ChatBubbleBottomCenterTextIcon,
    PowerIcon,
    BuildingStorefrontIcon,
    ClipboardDocumentCheckIcon,
    ArrowLeftOnRectangleIcon,
    ClipboardIcon,
    BanknotesIcon,
  } from "@heroicons/react/24/solid";
  import {
    Squares2X2Icon as Squares2X2IconOutline,
    UserGroupIcon as UserGroupIconOutline,
    BookOpenIcon as BookOpenIconOutline,
    ArchiveBoxIcon as ArchiveBoxIconOutline,
    CogIcon as CogIconOutline,
    ClipboardDocumentListIcon as ClipboardDocumentListIconOutline,
    DocumentDuplicateIcon as DocumentDuplicateIconOutline,
    ChatBubbleBottomCenterTextIcon as ChatBubbleBottomCenterTextIconOutline,
    PowerIcon as PowerIconOutline,
    BuildingStorefrontIcon as BuildingStorefrontIconOutline,
    ClipboardDocumentCheckIcon as ClipboardDocumentCheckIconOutline,
    ArrowLeftOnRectangleIcon as ArrowLeftOnRectangleIconOutline,
    ClipboardIcon as ClipboardIconOutline,
    BanknotesIcon as BanknotesIconOutline
  } from "@heroicons/react/24/outline";
  
export default function SideNavStaff({page}) {
    const dispatch = useDispatch()
    const [selectedPage, setSelectedPage] = useState(page || "sales")
    const [expandPane, setExpandPane] = useState(true)
    const history = useNavigate()
    const location = useLocation();
  const thisLocation = location.pathname.toString().substring(1);

    const handleSelectPage = (nextPage) => {
        history("/"+nextPage)
    }

    const handleLogout = () => {
      dispatch(signOut())
      history("/")
    }

  return (
      <>
    <div className={`transition duration-250 h-full flex flex-col text-sm py-6 w-[200px] divide-y px-6 bg-white shadow-lg ${expandPane ? "" : "-ml-44"}`}>
        <img src="/logo.png" alt="" className='mx-auto w-max' />
            <div className="grid gap-4 w-full justify-center py-4">
            <PaneComponent
            currentLocation={thisLocation}
          />
                
        </div>
        <div className="bottom-0 flex flex-col justify-end  h-full py-12 items-end w-full">
        <button 
            onClick={() => handleLogout()}
            className={`px-4 py-3 my-auto w-full bg-gray-100 border hover:border-red-500 shadow hover:bg-red-500 hover:text-white flex gap-4 items-center rounded-[16px]`} >
                <FontAwesomeIcon icon={faArrowRightFromBracket} />
                <h6 className='text-sm'>Logout</h6>
            </button>
        </div>
        <div className={`fixed bottom-0 left-0 ${expandPane ? "w-[200px]" : "w-6 h-screen"}`}>
            <button onClick={() => setExpandPane(!expandPane)} className={`w-full ${expandPane ? "" :  "h-screen"}`}>{expandPane ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} /> }</button>
        </div>
    </div>
      </>
  )
}


const PaneComponent = ({ currentLocation }) => {
    return (
      <div className="w-48 pr-6 flex flex-col gap-1">
          <PaneButton
            text="Sales"
            InitialIcon={BuildingStorefrontIcon}
            HoverIcon={BuildingStorefrontIconOutline}
            currentLocation={currentLocation}
            pathAddress="sales"
          />
        <PaneButton
          text="Sale History"
          InitialIcon={ClipboardDocumentCheckIcon}
          HoverIcon={ClipboardDocumentCheckIconOutline}
          currentLocation={currentLocation}
          pathAddress="history"
        />
        <PaneButton
          text="Menu"
          InitialIcon={ClipboardIcon}
          HoverIcon={ClipboardIconOutline}
          currentLocation={currentLocation}
          pathAddress="menu"
        />
        <PaneButton
            text="Debt Book"
            InitialIcon={BanknotesIcon}
            HoverIcon={BanknotesIconOutline}
            currentLocation={currentLocation}
            pathAddress="debtbook"
          />
        <PaneButton
          text="Reservations"
          InitialIcon={DocumentDuplicateIcon}
          HoverIcon={DocumentDuplicateIconOutline}
          currentLocation={currentLocation}
          pathAddress="reservations"
        />
      </div>
    );
  };

const PaneButton = ({ InitialIcon, HoverIcon, text, currentLocation, pathAddress }) => {
    const navigate = useNavigate()
    return (
      <>
      <div
        className={`group cursor-pointer ${
          currentLocation === pathAddress ? "bg-[#F5F5F5]" : "hover:bg-blue-gray-50"
        }  text-black rounded-lg  transition-all duration-200 flex gap-2 px-4 py-2  capitalize`}
        onClick={() => navigate("/"+pathAddress)}
        >
        <div className="">
          <InitialIcon
            color="#444444"
            className={`${currentLocation === pathAddress ? "block" : "group-hover:block hidden"}   transition-all duration-200 h-5 w-5`}
            />
          <HoverIcon
            color="#666666"
            className={`${currentLocation === pathAddress ? "hidden" : "group-hover:hidden"}  transition-all duration-200 h-5 w-5`}
            />
        </div>
        <h6 className="text-sm font-normal group-hover:text-black text-[#555555]">
          {text}
        </h6>
      </div>
      </>
    );
  };