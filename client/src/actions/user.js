import {
  Login_Start,
  Login_Failed,
  Login_Success,
  Signup_Start,
  Signup_Failed,
  Signup_Success,
  Add_User_Data,
  User_Logout,
} from './actionType';
import axios from 'axios';
const config = {
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
};
export const loginSuccess = (user) => {
  return {
    type: Login_Success,
    user,
  };
};
export const loginFailed = (err) => {
  return {
    type: Login_Failed,
    err,
  };
};
export function login(user) {
  return (dispatch) => {
    axios
      .post(`https://save-more.vercel.app/api/user/login`, user, config)
      .then((data) => dispatch(loginSuccess(data.data)))
      .catch((err) => {
        dispatch(
          loginFailed(
            err.response.data === 'Unauthorized'
              ? 'Invalid username or password'
              : err.response.data
          )
        );
      });
  };
}
export const signupSuccess = (user) => {
  return {
    type: Signup_Success,
    user,
  };
};
export const signupFailed = (err) => {
  return {
    type: Signup_Failed,
    err,
  };
};
export function signup(user) {
  return (dispatch) => {
    axios
      .post(`https://save-more.vercel.app/api/user/signup`, user, config)
      .then((data) => {
        dispatch(signupSuccess(data.data));
      })
      .catch((err) => {
        dispatch(signupFailed(err.response.data));
      });
  };
}
export function addUserData(user) {
  return {
    type: Add_User_Data,
    user,
  };
}
export function userLogout() {
  return {
    type: User_Logout,
  };
}
export function fetchUserData() {
  return (dispatch) => {
    axios
      .get(`https://save-more.vercel.app/api/currentUser`, config)
      .then((res) => dispatch(addUserData(res.data)));
  };
}
export function logout() {
  return (dispatch) => {
    axios
      .get(`https://save-more.vercel.app/api/user/logout`, config)
      .then((res) => dispatch(userLogout()));
  };
}
