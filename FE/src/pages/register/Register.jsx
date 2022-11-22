import axios from "axios";
import { useRef, useState } from "react";
import "./register.css";
import { KeyboardDatePicker } from "@material-ui/pickers";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { useHistory } from "react-router";
import dateFormat, { masks } from "dateformat";
import { Link } from "react-router-dom";


export default function Register() {
  const fullName = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const history = useHistory();
  const [selectedDate, handleDateChange] = useState(new Date());
  const [ radioBtn, setRadioBtn ] = useState('female');
  const url = process.env.REACT_APP_PUBLIC_FOLDER;
  const handleClick = async (e) => {
    e.preventDefault();
    if (passwordAgain.current.value !== password.current.value) {
      passwordAgain.current.setCustomValidity("Passwords don't match!");
    } else {
      const user = {
        fullName: fullName.current.value,
        email: email.current.value,
        password: password.current.value,
        gender: radioBtn === 'female' ? false : true,
        dob: dateFormat(selectedDate, "isoDate")
      };
      try {
        await axios.post(`${url}auth/users/register`, user);
        history.push("/login");
      } catch (err) {
      }
    }
  };
  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">NestJS-social</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on NestJS.
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
            <input
              placeholder="Full name"
              required
              ref={fullName}
              className="loginInput"
            />
            <input
              placeholder="Email"
              required
              ref={email}
              className="loginInput"
              type="email"
            />
            <input
              placeholder="Password"
              required
              ref={password}
              className="loginInput"
              type="password"
              minLength="6"
            />
            <input
              placeholder="Password Again"
              required
              ref={passwordAgain}
              className="loginInput"
              type="password"
            />
            <div className="loginInput">
              <FormControl component="fieldset" >
                <FormLabel component="legend">Gender</FormLabel>
                <RadioGroup row aria-label="gender" name="row-radio-buttons-group" value={radioBtn} onChange={(e) => setRadioBtn(e.target.value)}>
                  <FormControlLabel value="female" control={<Radio />} label="Female" />
                  <FormControlLabel value="male" control={<Radio />} label="Male" />
                </RadioGroup>
              </FormControl>
            </div>
            <KeyboardDatePicker
              autoOk
              variant="inline"
              inputVariant="outlined"
              label="Date of birth"
              format="MM/dd/yyyy"
              value={selectedDate}
              InputAdornmentProps={{ position: "start" }}
              onChange={date => handleDateChange(date)}
            />

            <button className="loginButton" type="submit">
              Sign Up
            </button>
            <p>Have account? <Link to="/login" style={{ textDecoration: "none" }}>Login now</Link> </p>
          </form>
        </div>
      </div>
    </div>
  );
}
