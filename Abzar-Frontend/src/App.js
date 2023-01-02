import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import './App.css';
import AdminLogin from "./pages/admin/AdminLogin";
import History from "./pages/staff/History";
import AdminHistory from "./pages/admin/History";
import Menu from "./pages/staff/Menu";
import Sales from "./pages/staff/Sales";
import StaffLogin from "./pages/staff/StaffLogin";
import store from "./utils/redux/store"
import {Provider} from "react-redux"
import PrivateRoute from "./utils/PrivateRoute";
import Reservations from "./pages/staff/Reservations";
import AdminReservations from "./pages/admin/Reservations";
import Staffs from "./pages/admin/Staffs";
import AdminRoute from "./utils/AdminRoute";
import Dashboard from "./pages/admin/Dashboard";
import Profile from "./pages/admin/Profile";
import Inventory from "./pages/admin/Inventory";
import Discounts from "./pages/admin/Discounts";
import Purchases from "./pages/admin/Purchases";
import Debt from "./pages/admin/Debt";
import DebtBook from "./pages/staff/Debt";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<StaffLogin />} />
          <Route exact path="/menu" element={<PrivateRoute><Menu /></PrivateRoute>}/>
          <Route exact path="/history" element={<PrivateRoute><History /></PrivateRoute>}/>
          <Route exact path="/sales" element={<PrivateRoute><Sales /></PrivateRoute>}/>
          <Route exact path="/reservations" element={<PrivateRoute><Reservations /></PrivateRoute>}/>
          <Route exact path="/debtbook" element={<PrivateRoute><DebtBook /></PrivateRoute>} />

          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/coupons" element={<AdminRoute><Discounts /></AdminRoute>} />
          <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
          <Route path="/orders" element={<AdminRoute><AdminHistory /></AdminRoute>} />
          <Route path="/bookings" element={<AdminRoute><AdminReservations /></AdminRoute>} />
          <Route path="/staffs" element={<AdminRoute><Staffs /></AdminRoute>} />
          <Route path="/inventory" element={<AdminRoute><Inventory /></AdminRoute>} />
          <Route path="/profile" element={<AdminRoute><Profile /></AdminRoute>} />
          <Route path="/purchases" element={<AdminRoute><Purchases /></AdminRoute>} />
          <Route path="/debt" element={<AdminRoute><Debt /></AdminRoute>} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
