import axios from "../../axios";
const USER = JSON.parse(localStorage.getItem("USER_TEMP"))

const signout = async () => {
      return {user: '', token: null}
};

const login = async (data) => {
  const response = await axios.post("admin/login/", {...data}).then(res => {
    localStorage.setItem("USER_TEMP", JSON.stringify(res.data))
    return res.data
  }).catch(err => {
     if(err){
       return {loginError: err.response.data}
     }
  })
  return response
};

const getAllDiscounts = async () => {
  const response = await axios.get("admin/discount/all/", {
    headers: {
      "Authorization": `Token ${USER.token}`
    }
  }).then(res => {
    return res.data
  }).catch(err => {
     if(err){
       return {error: err.response.data}
     }
  })
  return response
};

const createDiscount = async (d) => {
  const response = await axios.post("admin/discount/", d, {
    headers: {
      "Authorization": `Token ${USER.token}`
    }
  }).then(res => {
    return res.data
  }).catch(err => {
     if(err){
       return {error: err.response.data}
     }
  })
  return response
};

const deleteDiscount = async (data) => {
  const response = await axios.post("admin/discount/delete", data, {
    headers: {
      "Authorization": `Token ${USER.token}`
    }
  }).then(res => {
    return res.data
  }).catch(err => {
     if(err){
       return {error: err.response.data}
     }
  })
  return response
};

const getAllProductByCategory = async (data) => {
  const response = await axios.get("admin/product/getall/", {
    headers: {
      "Authorization": `Token ${USER.token}`
    }
  }).then(res => {
    return res.data
  }).catch(err => {
     if(err){
       return {error: err.response.data}
     }
  })
  return response
};

const getAllStaff = async (data) => {
  const response = await axios.get("admin/staff", {
    headers: {
      "Authorization": `Token ${USER.token}`
    }
  }).then(res => {
    return res.data
  }).catch(err => {
     if(err){
       return {error: err.response.data}
     }
  })
  return response
};

async function getOrderHistory(data) {
  const response = await axios.post("admin/order/getall/", data, {
    headers: {
      "Authorization": `Token ${USER.token}`
    }
  }).then(res => {
    return res.data;
  }).catch(err => {
    if (err) {
      return { error: err.response.data };
    }
  });
  return response;
}

const getReservationHistory = async (data) => {
  const response = await axios.post("admin/order/reservations/", data, {
    headers: {
      "Authorization": `Token ${USER.token}`
    }
  }).then(res => {
    return res.data
  }).catch(err => {
     if(err){
       return {error: err.response.data}
     }
  })
  return response
};

const placeOrder = async (orderDetails) => {
  const response = await axios.post("admin/order/create/", {...orderDetails}, {
    headers: {
      "Authorization": `Token ${USER.token}`
    }
  }).then(res => {
    return res.data
  }).catch(err => {
     if(err){
       return {error: err.response.data}
     }
  })
  return response
};

const createProduct = async (product) => {
  const response = await axios.post("admin/product/create/", {...product}, {
    headers: {
      "Authorization": `Token ${USER.token}`
    }
  }).then(res => {
    return res.data
  }).catch(err => {
     if(err){
       return {error: err.response.data}
     }
  })
  return response
};

const deleteProduct = async (product) => {
  const response = await axios.post("admin/product/delete/", {...product}, {
    headers: {
      "Authorization": `Token ${USER.token}`
    }
  }).then(res => {
    return res.data
  }).catch(err => {
     if(err){
       return {error: err.response.data}
     }
  })
  return response
};

const deleteStaff = async (product) => {
  const response = await axios.post("admin/staff/delete/", {...product}, {
    headers: {
      "Authorization": `Token ${USER.token}`
    }
  }).then(res => {
    return res.data
  }).catch(err => {
     if(err){
       return {error: err.response.data}
     }
  })
  return response
};

const editStaff = async (staff) => {
  const response = await axios.post("admin/staff/edit/", {...staff}, {
    headers: {
      "Authorization": `Token ${USER.token}`
    }
  }).then(res => {
    return res.data
  }).catch(err => {
     if(err){
       return {error: err.response.data}
     }
  })
  return response
};

const fundStock = async (details) => {
  const response = await axios.post("admin/product/stock/fund/", {...details}, {
    headers: {
      "Authorization": `Token ${USER.token}`
    }
  }).then(res => {
    return res.data
  }).catch(err => {
     if(err){
       return {error: err.response.data}
     }
  })
  return response
};

const editProduct = async (details) => {
  const response = await axios.post("admin/product/edit/", {...details}, {
    headers: {
      "Authorization": `Token ${USER.token}`
    }
  }).then(res => {
    return res.data
  }).catch(err => {
     if(err){
       return {error: err.response.data}
     }
  })
  return response
};

const createStaff = async (details) => {
  const response = await axios.post("admin/staff/create/", {...details}, {
    headers: {
      "Authorization": `Token ${USER.token}`
    }
  }).then(res => {
    return res.data
  }).catch(err => {
     if(err){
       return {error: err.response.data}
     }
  })
  return response
};

const getProfile = async () => {
  const response = await axios.get("admin/profile/", {
    headers: {
      "Authorization": `Token ${USER.token}`
    }
  }).then(res => {
    return res.data
  }).catch(err => {
     if(err){
       return {error: err.response.data}
     }
  })
  return response
};

const getTodaySummary = async () => {
  const response = await axios.get("admin/summary/today", {
    headers: {
      "Authorization": `Token ${USER.token}`
    }
  }).then(res => {
    return res.data
  }).catch(err => {
     if(err){
       return {error: err.response.data}
     }
  })
  return response
};

const getSummaryByDate = async (d) => {
  const response = await axios.post("admin/summary/bydate", d, {
    headers: {
      "Authorization": `Token ${USER.token}`
    }
  }).then(res => {
    return res.data
  }).catch(err => {
     if(err){
       return {error: err.response.data}
     }
  })
  return response
};

const editProfile = async () => {
  const response = await axios.post("admin/profile/", {
    headers: {
      "Authorization": `Token ${USER.token}`
    }
  }).then(res => {
    return res.data
  }).catch(err => {
     if(err){
       return {error: err.response.data}
     }
  })
  return response
};

const revokeOrder = async (id) => {
  const response = await axios.post("admin/order/revoke/", id, {
    headers: {
      "Authorization": `Token ${USER.token}`
    }
  }).then(res => {
    return res.data
  }).catch(err => {
     if(err){
       return {error: err.response.data}
     }
  })
  return response
};

const fulfilReservation = async (id) => {
  const response = await axios.post("admin/order/reservation/fulfil/", id, {
    headers: {
      "Authorization": `Token ${USER.token}`
    }
  }).then(res => {
    return res.data
  }).catch(err => {
     if(err){
       return {error: err.response.data}
     }
  })
  return response
};


const wipeState = async (data) => {
  return {}
};

const closeOrder = async () => {
  return {}
};

const getAllPurchases = async (params) => {
  const response = await axios.post("admin/purchases/all", params, {
    headers: {
      "Authorization": `Token ${USER.token}`
    }
  }).then(res => {
    return res.data
  }
  ).catch(err => {
    if(err){
      return {error: err.response.data}
    }
  }
  )
  return response
};

const getDebtHistory = async (params) => {
  const response = await axios.post("admin/debt/history", params, {
    headers: {
      "Authorization": `Token ${USER.token}`
    }
  }).then(res => {
    return res.data
  }
  ).catch(err => {
    if(err){
      return {error: err.response.data}
    }
  }
  )
  return response
};

    



const adminServices = {
  login,
  signout,
  wipeState,
  getAllProductByCategory,
  placeOrder,
  closeOrder,
  getOrderHistory,
  getReservationHistory,
  revokeOrder,
  fulfilReservation,
  getAllStaff,
  fundStock,
  editProduct,
  createProduct,
  deleteProduct,
  createStaff,
  getProfile,
  editProfile,
  getTodaySummary,
  getSummaryByDate,
  deleteStaff,
  editStaff,
  getAllDiscounts,
  deleteDiscount,
  createDiscount,
  getAllPurchases,
  getDebtHistory
};

export default adminServices;