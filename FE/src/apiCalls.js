import { AirlineSeatLegroomExtra } from "@material-ui/icons";
import axios from "axios";

const url = process.env.REACT_APP_PUBLIC_FOLDER;
export const loginCall = async (userCredential, dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try {
    const res = await axios.post(`${url}auth/login`, userCredential);
    dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
    return { mess: 'success' }
  } catch (err) {
    dispatch({ type: "LOGIN_FAILURE" });
    return { mess: 'error' }
  }
};

export const loginFacebookCall = async (userCredential, dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try {
    const res = await axios.post(`${url}auth/facebook-login`, userCredential);
    dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
    return { mess: 'success' }
  } catch (err) {
    dispatch({ type: "LOGIN_FAILURE" });
    return { mess: 'error' }
  }
};

export const refreshToken = async () => {
  const userInfo = JSON.parse(localStorage.getItem('user'));
  try {
    const res = await axios.post(`${url}auth/refresh-token`, { refreshToken: userInfo.refresh_token });
    localStorage.setItem("user", JSON.stringify({
          access_token: res.data.access_token,
          refresh_token: userInfo.refresh_token,
          userId: userInfo.userId,
          fullName: userInfo.fullName,
          avatar: userInfo.avatar
    }));
  } catch (error) {
    localStorage.clear();
    return window.location.reload();
  }
}

