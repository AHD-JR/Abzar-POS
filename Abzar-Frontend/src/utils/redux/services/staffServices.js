import axios from "../../axios";
const USER = JSON.parse(localStorage.getItem("USER_TEMP"))

const signout = async () => {
      return {user: '', token: null}
};

const login = async (data) => {
  const response = await axios.post("staff/login/", {...data}).then(res => {
    localStorage.setItem("USER_TEMP", JSON.stringify(res.data))
    return res.data
  }).catch(err => {
     if(err){
       return {loginError: err.response.data}
     }
  })
  return response
};

const getAllProductByCategory = async (data) => {
  const response = await axios.get("staff/product/getall/", {
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

const getDiscounts = async (data) => {
  const response = await axios.get("staff/discount/all/", {
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

const getOrderHistory = async (data) => {
  const response = await axios.post("staff/order/getall/", data, {
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

const getReservationHistory = async (data) => {
  const response = await axios.post("staff/order/reservations/", data, {
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
  const response = await axios.post("staff/order/create/", {...orderDetails}, {
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
  const response = await axios.post("staff/order/revoke/", id, {
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
  const response = await axios.post("staff/order/reservation/fulfil/", id, {
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

const getDebtHistory = async (params) => {
  const response = await axios.post("staff/debt/history", params, {
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


const userServices = {
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
  getDiscounts,
  getDebtHistory
};

export default userServices;