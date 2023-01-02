import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userServices from "../services/adminServices";

const initialState = {
  revokedOrder: {},
  fundedProduct: {},
  editedProduct: {},
  createdProduct: {},
  deletedProduct: {},
  deletedStaff: {},
  profile: {},
  editedProfile: {},
  editedStaff: {},
  todaySummary: {pending: false, todaySummary: null},
  summaryByDate: {pending: false, summaryByDate: null},
  completedOrder: {},
  allDiscounts: [],
  fulfilledReservation: {},
  debtHistory: {orders: []},
  admin: {token: null, pending: false},
  allStaffs: [],
  orderHistory: {orders: [], pending: false},
  productsByCategory: {products: [], pending: false},
  reservationsHistory: {reservations: [], pending: false},
};

export const signIn = createAsyncThunk(
  "admin/login",
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

export const getTodaySummary = createAsyncThunk(
  "summary/today",
  async () => {
    const res = await userServices.getTodaySummary();
    return res;
  }
);

export const createDiscount = createAsyncThunk(
  "discount/create",
  async (d) => {
    const res = await userServices.createDiscount(d);
    return res;
  }
);

export const getAllDiscounts = createAsyncThunk(
  "discount/all",
  async () => {
    const res = await userServices.getAllDiscounts();
    return res;
  }
);

export const deleteDiscount = createAsyncThunk(
  "discount/delete",
  async (d) => {
    const res = await userServices.deleteDiscount(d);
    return res;
  }
);

export const getAllStaff = createAsyncThunk(
  "staff/getall",
  async () => {
    const res = await userServices.getAllStaff();
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

export const fundStock = createAsyncThunk(
  "product/fund",
  async (d) => {
    const res = await userServices.fundStock(d);
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

export const editProduct = createAsyncThunk(
  "product/edit",
  async (productDetails) => {
    const res = await userServices.editProduct(productDetails);
    return res;
  }
);

export const editStaff= createAsyncThunk(
  "staff/edit",
  async (staffDetails) => {
    const res = await userServices.editStaff(staffDetails);
    return res;
  }
);

export const createProduct = createAsyncThunk(
  "product/create",
  async (productDetails) => {
    const res = await userServices.createProduct(productDetails);
    return res;
  }
);

export const createStaff = createAsyncThunk(
  "staff/create",
  async (productDetails) => {
    const res = await userServices.createStaff(productDetails);
    return res;
  }
);

export const deleteProduct = createAsyncThunk(
  "product/delete",
  async (productDetails) => {
    const res = await userServices.deleteProduct(productDetails);
    return res;
  }
);

export const deleteStaff = createAsyncThunk(
  "staff/delete",
  async (staffDetails) => {
    const res = await userServices.deleteStaff(staffDetails);
    return res;
  }
);


export const getProfile = createAsyncThunk(
  "profile/get",
  async () => {
    const res = await userServices.getProfile();
    return res;
  }
);

export const getSummaryByDate = createAsyncThunk(
  "summary/getbydate",
  async (d) => {
    const res = await userServices.getSummaryByDate(d);
    return res;
  }
);

export const editProfile = createAsyncThunk(
  "profile/edit",
  async () => {
    const res = await userServices.editProfile();
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

export const getAllPurchases = createAsyncThunk(
  "purchases/all",
  async (params) => {
    const res = await userServices.getAllPurchases(params);
    return res;
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
      return {...state, admin: {...action.payload, pending: false}}
    },
    [signIn.pending]: (state, action) => {
      return {...state, admin: {...state.admin, pending: true}}
    },
    [signIn.rejected]: (state, action) => {
      return {...state, admin: {...state.admin, pending: false}}
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
    [getAllStaff.pending]: (state, action) => {
      return {...state, allStaffs: {staffs: [], pending: true}}
    },
    [getAllStaff.rejected]: (state, action) => {
      return {...state, allStaffs: {staffs: [], pending: false}}
    },
    [getAllStaff.fulfilled]: (state, action) => {
      return {...state, allStaffs: {...action.payload, pending: false}}
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
    [editStaff.fulfilled]: (state, action) => {
      return {...state, editedStaff: {...action.payload}}
    },
    [editProduct.fulfilled]: (state, action) => {
      return {...state, editedProduct: {...action.payload}}
    },
    [getProfile.fulfilled]: (state, action) => {
      return {...state, profile: {...action.payload}}
    },
    [getTodaySummary.fulfilled]: (state, action) => {
      return {...state, todaySummary: {todaySummary: {...action.payload}, pending: false}}
    },
    [getTodaySummary.pending]: (state, action) => {
      return {...state, todaySummary: {todaySummary: {...action.payload}, pending: true}}
    },
    [getTodaySummary.rejected]: (state, action) => {
      return {...state, todaySummary: {todaySummary: {...action.payload}, pending: false}}
    },
    [getAllDiscounts.fulfilled]: (state, action) => {
      return {...state, allDiscounts: [...action.payload]}
    },
    [createDiscount.fulfilled]: (state, action) => {
      return {...state, allDiscounts: [...action.payload]}
    },
    [deleteDiscount.fulfilled]: (state, action) => {
      return {...state, allDiscounts: [...action.payload]}
    },
    [getTodaySummary.rejected]: (state, action) => {
      return {...state, todaySummary: {}}
    },
    [getSummaryByDate.pending]: (state, action) => {
      return {...state, summaryByDate: {summaryByDate: {...action.payload}, pending: true}}
    },
    [getSummaryByDate.fulfilled]: (state, action) => {
      return {...state, summaryByDate: {summaryByDate: {...action.payload}, pending: false}}
    },
    [getSummaryByDate.rejected]: (state, action) => {
      return {...state, summaryByDate: {summaryByDate: {...action.payload}, pending: false}}
    },
    [editProfile.fulfilled]: (state, action) => {
      return {...state, editedProfile: {...action.payload}}
    },
    [createProduct.fulfilled]: (state, action) => {
      return {...state, createdProduct: {...action.payload}}
    },
    [createStaff.fulfilled]: (state, action) => {
      return {...state, createdStaff: {...action.payload}}
    },
    [deleteProduct.fulfilled]: (state, action) => {
      return {...state, deletedProduct: {...action.payload}}
    },
    [deleteStaff.fulfilled]: (state, action) => {
      return {...state, deletedStaff: {...action.payload}}
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
    [fundStock.fulfilled]: (state, action) => {
      return {...state, fundedProduct: {...action.payload}}
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
    [getAllPurchases.fulfilled]: (state, action) => {
      return {...state, allPurchases: {...action.payload}}
    },
    [getDebtHistory.fulfilled]: (state, action) => {
      return {...state, debtHistory: {...action.payload}}
    }
  },
});

const { reducer } = userSlice;
export default reducer;