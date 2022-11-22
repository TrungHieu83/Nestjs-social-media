import { useContext, useRef, useState } from "react";
import "./login.css";
import { loginCall, loginFacebookCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress } from "@material-ui/core";
import FacebookLogin from "react-facebook-login";
import { Link } from "react-router-dom";
export default function Login() {
  const email = useRef();
  const password = useRef();
  const { isFetching, dispatch } = useContext(AuthContext);
  const [errorMess, setErrorMess] = useState('');
  const url = process.env.REACT_APP_PUBLIC_FOLDER;
  const componentClicked = () => {
  }
  const responseFacebook = async response => {
    let res = await loginFacebookCall(
      { id: response.id, fullName: response.name },
      dispatch
    );
  }
  const handleClick = async (e) => {
    e.preventDefault();
    let res = await loginCall(
      { email: email.current.value, password: password.current.value},
      dispatch
    );
    setErrorMess('Email or password is incorrect');
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">NestJS-social</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on NestJS-social.
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
            <div>{errorMess}</div>
            <input
              placeholder="Email"
              type="email"
              required
              className="loginInput"
              ref={email}
            />
            <input
              placeholder="Password"
              type="password"
              required
              minLength="6"
              className="loginInput"
              ref={password}
            />
            <button className="loginButton" type="submit" disabled={isFetching}>
              {isFetching ? (
                <CircularProgress color="white" size="20px" />
              ) : (
                "Log In"
              )}
            </button>
            <FacebookLogin
              className="facebook-btn"
              appId="1216201332238253"
              autoLoad={false}
              fields="name,email,picture"
              onClick={componentClicked}
              callback={responseFacebook} />,
            <Link className="loginRegisterButton" to="/register" style={{ textDecoration: "none" }}>
              <button className="loginRegisterButton1" >
                {isFetching ? (
                  <CircularProgress color="white" size="20px" />
                ) : (
                  "Create a New Account"
                )}
              </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
