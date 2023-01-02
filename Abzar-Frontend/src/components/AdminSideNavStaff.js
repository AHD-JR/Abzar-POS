import React, {useMemo} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faClockRotateLeft, faStore, faBoxArchive, faUsers, faArrowRightFromBracket, faTicketSimple} from '@fortawesome/free-solid-svg-icons'
import { signOut } from '../utils/redux/actions/adminSlice'
import { useDispatch } from 'react-redux'
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
    TicketIcon,
    BanknotesIcon,
    WalletIcon
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
    TicketIcon as TicketIconOutline,
    BanknotesIcon as BanknotesIconOutline,
    WalletIcon as WalletIconOutline,
  } from "@heroicons/react/24/outline";
// import { BeakerIcon, Squares2X2Icon } from '@heroicons/react/24/solid'
export default function SideNavStaff({page}) {
    const location = useLocation();
  const thisLocation = location.pathname.toString().substring(1);
    const dispatch = useDispatch()
    const selectedPage = useMemo(() => page || "dashboard", [page])
    const history = useNavigate()
    const navigate = useNavigate()

    const handleSelectPage = (nextPage) => {
        history("/"+nextPage)
    }

    const handleLogout = () => {
      dispatch(signOut())
      navigate("/admin")
    }

  return (
    <div className='w-[210px] py-6 h-full flex flex-col justify-between divide-y px-6 bg-white shadow-lg'>
        <img src="/logo.png" alt="" className='mx-auto h-[100px] w-7/12 pb-5' />
        <div className="grid gap-4 h-full justify-center grow-0 py-4">
        <PaneComponent
            currentLocation={thisLocation}
          />
           
        </div>
        <div className="h-max flex justify-end items-end py-5">
            <button 
            onClick={() => handleLogout()}
            className={`px-2 py-2 w-full bg-gray-100 border hover:border-red-500 shadow hover:bg-red-500 hover:text-white flex gap-4 items-center rounded-[8px]`} >
                <ArrowLeftOnRectangleIcon width={16} height={16} />
                <h6 className='text-sm'>Logout</h6>
            </button>
        </div>
    </div>
  )
}

const PaneComponent = ({ currentLocation }) => {
    return (
      <div className="w-48 pr-6 flex flex-col gap-1">
        <PaneButton
          text="Dashboard"
          InitialIcon={Squares2X2Icon}
          HoverIcon={Squares2X2IconOutline}
          currentLocation={currentLocation}
          pathAddress="dashboard"
        />
        <PaneButton
          text="Sale History"
          InitialIcon={ClipboardDocumentCheckIcon}
          HoverIcon={ClipboardDocumentCheckIconOutline}
          currentLocation={currentLocation}
          pathAddress="orders"
        />
          <PaneButton
            text="Inventory"
            InitialIcon={BuildingStorefrontIcon}
            HoverIcon={BuildingStorefrontIconOutline}
            currentLocation={currentLocation}
            pathAddress="inventory"
          />
          <PaneButton
            text="Debt Book"
            InitialIcon={BanknotesIcon}
            HoverIcon={BanknotesIconOutline}
            currentLocation={currentLocation}
            pathAddress="debt"
          />
          {/* <PaneButton
            text="Coupons"
            InitialIcon={TicketIcon}
            HoverIcon={TicketIconOutline}
            currentLocation={currentLocation}
            pathAddress="coupons"
          /> */}
          <PaneButton
            text="Purchases"
            InitialIcon={WalletIcon}
            HoverIcon={WalletIconOutline}
            currentLocation={currentLocation}
            pathAddress="purchases"
          />
        <PaneButton
          text="Reservations"
          InitialIcon={ArchiveBoxIcon}
          HoverIcon={ArchiveBoxIconOutline}
          currentLocation={currentLocation}
          pathAddress="bookings"
        />
        <PaneButton
          text="User Accounts"
          InitialIcon={UserGroupIcon}
          HoverIcon={UserGroupIconOutline}
          currentLocation={currentLocation}
          pathAddress="staffs"
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
          currentLocation === pathAddress ? "bg-zinc-50" : "hover:bg-blue-gray-50"
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