import React, { useEffect } from 'react';
import validate from './validateInfo';
import useForm from './useForm';
import './Form.css';
import { KeyboardDatePicker } from "@material-ui/pickers";
import { useState, useRef } from 'react';
import { Spinner } from 'react-bootstrap';
import { Overlay } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import axios from 'axios';
const FormSignup = ({ submitForm }) => {
  const { handleChange, handleSubmit, values, errors } = useForm(
    submitForm,
    validate
  );
  const [selectedDate, handleDateChange] = useState(new Date());
  const [isSubmit, setIsSubmit] = useState(false);
  const targetFullName = useRef(null);
  const targetEmail = useRef(null);
  const targetPassword1 = useRef(null);
  const targetPassword2 = useRef(null);
  const targetAddress = useRef(null);
  const [address, setAddress] = useState([]);
  const [sniper, setSniper] = useState(false);
  const fix = 0;
  useEffect(async () => {
    const res = await axios.get('https://provinces.open-api.vn/api/');
    setAddress(res.data)
  }, [fix])
  return (
    <div className='form-content-right'>
      <form onSubmit={handleSubmit} className='form' noValidate>
        {errors.done ? <p className='done-verify'>Registration successful! Verify your email</p> : <h1>
          Get started with us today! Create your account by filling out the
          information below.
        </h1>}

        <div className='form-inputs'>
          <label className='form-label'>Full name</label>
          <input
            className='form-input'
            type='text'
            name='fullName'
            placeholder='Enter your full name'
            value={values.fullName}
            onChange={handleChange}
            ref={targetFullName}
          />
          {errors.fullName &&
            <Overlay placement="left" show={true} target={targetFullName.current}>
              <div
                style={{
                  backgroundColor: 'rgba(255, 100, 100, 0.85)',
                  padding: '2px 10px',
                  color: 'white',
                  borderRadius: 3,
                }}
              >
                {errors.fullName}
              </div>

            </Overlay>
          }
        </div>
        <div className='form-inputs'>
          <label className='form-label'>Email</label>
          <input
            className='form-input'
            type='email'
            name='email'
            placeholder='Enter your email'
            value={values.email}
            onChange={handleChange}
            ref={targetEmail}
          />
          {errors.email &&
            <Overlay placement="left" show={true} target={targetEmail.current}>
              <div
                style={{
                  backgroundColor: 'rgba(255, 100, 100, 0.85)',
                  padding: '2px 10px',
                  color: 'white',
                  borderRadius: 3,
                }}
              >
                {errors.email}
              </div>

            </Overlay>
          }
        </div>
        <div className='form-inputs'>
          <label className='form-label'>Password</label>
          <input
            className='form-input'
            type='password'
            name='password'
            placeholder='Enter your password'
            value={values.password}
            onChange={handleChange}
            ref={targetPassword1}
          />
          {errors.password &&
            <Overlay placement="left" show={true} target={targetPassword1.current}>
              <div
                style={{
                  backgroundColor: 'rgba(255, 100, 100, 0.85)',
                  padding: '2px 10px',
                  color: 'white',
                  borderRadius: 3,
                }}
              >
                {errors.password}
              </div>

            </Overlay>
          }
        </div>

        <div className='form-inputs'>
          <label className='form-label'>Confirm Password</label>
          <input
            className='form-input'
            type='password'
            name='password2'
            placeholder='Confirm your password'
            value={values.password2}
            onChange={handleChange}
            ref={targetPassword2}
          />
          {errors.password2 &&
            <Overlay placement="left" show={true} target={targetPassword2.current}>
              <div
                style={{
                  backgroundColor: 'rgba(255, 100, 100, 0.85)',
                  padding: '2px 10px',
                  color: 'white',
                  borderRadius: 3,
                }}
              >
                {errors.password2}
              </div>

            </Overlay>
          }
        </div>

        <div className='form-inputs'>
          <label className='form-label'>Address</label>
          <select className='form-input' name='address' onChange={handleChange} ref={targetAddress}>
            <option value="" selected disabled hidden>Choose here</option>
            {address.map((a) => (
              <option key={a.name} value={a.name}>{a.name}</option>
            ))}
          </select>
          {errors.address &&
            <Overlay placement="left" show={true} target={targetAddress.current}>
              <div
                style={{
                  backgroundColor: 'rgba(255, 100, 100, 0.85)',
                  padding: '2px 10px',
                  color: 'white',
                  borderRadius: 3,
                }}
              >
                {errors.address}
              </div>

            </Overlay>
          }
        </div>
        <div className='form-inputs'>
          <label className='form-label'>Date of birth</label>
          <KeyboardDatePicker
            className='form-input date-picker'
            autoOk
            variant="inline"
            inputVariant="outlined"
            format="MM/dd/yyyy"
            value={selectedDate}
            InputAdornmentProps={{ position: "start" }}
            onChange={date => handleDateChange(date)}
          />
        </div>
        <button className='form-input-btn' type='submit' onClick={e => setIsSubmit(true)}>
          {(!isSubmit || errors || errors.done) && <>Sign up</>}
          {errors.done == false && <Spinner animation="border" />}

        </button>
        <NotificationContainer />
        <span className='form-input-login'>
          Already have an account? Login <Link to="/login">here</Link>
        </span>
      </form>
    </div>
  );
};

export default FormSignup;
