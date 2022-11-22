import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Form.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

const FormSuccess = () => {
  const url = process.env.REACT_APP_PUBLIC_FOLDER;
  const verificationCode = useParams().verificationCode;
  const userId = useParams().userId;
  const history = useHistory();
  const [test, setTest] = useState(true)
  const [status, setStatus] = useState(0);
  useEffect(async () => {

    try {
      const res = await axios.post(`${url}auth/verify-email`, { verificationCode: verificationCode, id: parseInt(userId) })
      
      setStatus(1);
    } catch (error) {
      if (error.response.data.message == 'Verification code time out') {
        setStatus(2);
      } else if (error.response.data.message == 'Verification code is invalid') {
        history.push("/not-found")
      } else if (error.response.data.message == 'Email is already being verified') {
        history.push("/not-found")
      }
    }

  }, [test])
  return (

    <>
      <div className='form-container'>
        <div className='form-content-left'>
          <img className='form-img' src='https://docs.nestjs.com/assets/logo-small.svg' alt='spaceship' />
        </div>

        <div className='form-content-right'>
          {status == 1 &&
            <h1 className='notification1'>
              Verification successful! Login <Link to="/login">now</Link>
            </h1>
          }
          {status == 2 &&
            <h1 className='notification1'>
              Check the newest mail to verify.
            </h1>
          }
        </div>

      </div>
    </>

  );
};

export default FormSuccess;
