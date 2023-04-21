import axios from "axios";

const API_URL = `${process.env.REACT_APP_BACKEND_URI}/api/v5/auth/`;

//Register user
const register = async (userData) => {
  try {
    const response = await axios.post(API_URL + "register/", userData);
    console.log(JSON.stringify(response.data));
    console.log(response.data.name);
    if (response.data) {
      //localStorage.setItem('user',JSON.stringify(response.data))
      localStorage.setItem("user", response.data.name);
    }
    return response.data.name; //response.data
  } catch (error) {
    console.log("authService: register");
    console.log(error);
    console.log(error.response.data);
  }
};

//Login user
const login = async (userData) => {
  const response = await axios.post(API_URL + "login", userData, {
    withCredentials: true,
  });
  // console.log(response.data);
  if (response.data) {
    //localStorage.setItem('user',JSON.stringify(response.data))
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }
  return response.data.user;
};

//Logout user
const logout = async () => {
  const response = await axios.get(API_URL + "logout", {
    withCredentials: true,
  });
  if (response.data.success) {
    localStorage.setItem("user", null);
  }
};

const authService = {
  register,
  logout,
  login,
};

export default authService;
