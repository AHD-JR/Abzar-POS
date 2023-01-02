import axios from "axios";

const USER = JSON.parse(localStorage.getItem("USER_TEMP")) || {}

export default axios.create({
  baseURL: "http://localhost:5000/api/",
  // baseURL: "http://192.168.1.1:5000/api/",
  headers: {
    "Content-type": "application/json",
    "Authorization": `Token ${USER.token}` || ""
  }
});

