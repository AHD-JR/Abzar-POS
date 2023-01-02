import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userServices from "../services/staffServices";

const initialState = {
  staff: {token: null, pending: false},
  productsByCategory: {products: [], pending: false},
  completedOrder: {},
  revokedOrder: {},
  discounts: [],
  fulfilledReservation: {},
  debtHistory: {orders: []},
  orderHistory: {orders: [], pending: false},
  reservationsHistory: {reservations: [], pending: false}
};

export const signIn = createAsyncThunk(
  "accounts/login",
  async (d) => {
    const res = await userServices.login(d);
    return res;
  }
);

export const getAllProductByCategory = createAsyncThunk(
  "products/allbycat",
  async () => {
    const res = await userServices.getAllProductByCategory();
    return res;
  }
);

export const getDiscounts = createAsyncThunk(
  "discounts/getall",
  async () => {
    const res = await userServices.getDiscounts();
    return res;
  }
);

export const getOrderHistory = createAsyncThunk(
  "orders/all",
  async (d) => {
    const res = await userServices.getOrderHistory(d);
    return res;
  }
);

export const getReservationHistory = createAsyncThunk(
  "orders/reservations",
  async (d) => {
    const res = await userServices.getReservationHistory(d);
    return res;
  }
);

export const placeOrder = createAsyncThunk(
  "order/placeorder",
  async (orderDetails) => {
    const res = await userServices.placeOrder(orderDetails);
    return res;
  }
);

export const revokeOrder = createAsyncThunk(
  "order/revokeorder",
  async (orderDetails) => {
    const res = await userServices.revokeOrder(orderDetails);
    return res;
  }
);

export const fulfilReservation = createAsyncThunk(
  "order/fulfilreservation",
  async (orderDetails) => {
    const res = await userServices.fulfilReservation(orderDetails);
    return res;
  }
);

export const signOut = createAsyncThunk(
  "accounts/signout",
  async () => {
    localStorage.removeItem("USER_TEMP")
    return {token: null}
  }
);

export const closeOrder = createAsyncThunk(
  "order/close",
  async () => {
    return {}
  }
);

export const getDebtHistory = createAsyncThunk(
  "debt/paginated",
  async (params) => {
    const res = await userServices.getDebtHistory(params);
    return res;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  extraReducers: {
    [signIn.fulfilled]: (state, action) => {
      return {...state, staff: {...action.payload, pending: false}}
    },
    [signIn.pending]: (state, action) => {
      return {...state, staff: {...state.staff, pending: true}}
    },
    [signIn.rejected]: (state, action) => {
      return {...state, staff: {...state.staff, pending: false}}
    },
    [getOrderHistory.pending]: (state, action) => {
      return {...state, orderHistory: {orders: [], pending: true}}
    },
    [getOrderHistory.rejected]: (state, action) => {
      return {...state, orderHistory: {orders: [], pending: false}}
    },
    [getOrderHistory.fulfilled]: (state, action) => {
      return {...state, orderHistory: {...action.payload, pending: false}}
    },
    [getDiscounts.fulfilled]: (state, action) => {
      return {...state, discounts: [...action.payload]}
    },
    [getDiscounts.rejected]: (state, action) => {
      return {...state, discounts: []}
    },
    [getReservationHistory.pending]: (state, action) => {
      return {...state, reservationsHistory: {reservations: [], pending: true}}
    },
    [getReservationHistory.rejected]: (state, action) => {
      return {...state, reservationsHistory: {reservations: [], pending: false}}
    },
    [getReservationHistory.fulfilled]: (state, action) => {
      return {...state, reservationsHistory: {...action.payload, pending: false}}
    },
    [fulfilReservation.pending]: (state, action) => {
      return {...state, fulfilledReservation: {reservation: {}, pending: true}}
    },
    [fulfilReservation.rejected]: (state, action) => {
      return {...state, fulfilledReservation: {reservation: {}, pending: false}}
    },
    [fulfilReservation.fulfilled]: (state, action) => {
      return {...state, fulfilledReservation: {reservation: {...action.payload}, pending: false}}
    },
    [getAllProductByCategory.fulfilled]: (state, action) => {
      return {...state, productsByCategory: {...action.payload, pending: false}}
    },
    [getAllProductByCategory.pending]: (state, action) => {
      return {...state, productsByCategory: {products: [], pending: true}}
    },
    [placeOrder.fulfilled]: (state, action) => {
      return {...state, completedOrder: {...action.payload}}
    },
    [revokeOrder.fulfilled]: (state, action) => {
      return {...state, revokedOrder: {...action.payload}}
    },
    [revokeOrder.rejected]: (state, action) => {
      return {...state, revokedOrder: {}}
    },
    [signOut.fulfilled]: (state, action) => {
      return state = {...initialState}
    },
    [closeOrder.fulfilled]: (state, action) => {
      return state = {...state, completedOrder: {}}
    },
    [getDebtHistory.fulfilled]: (state, action) => {
      return {...state, debtHistory: {...action.payload}}
    }
  },
});

const { reducer } = userSlice;
export default reducer;