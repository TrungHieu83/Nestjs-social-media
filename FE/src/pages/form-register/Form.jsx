import React, { useState } from 'react';
import './Form.css';
import FormSignup from './FormSignup';
import FormSuccess from './FormSuccess';

const Form = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const url = process.env.REACT_APP_PUBLIC_FOLDER;
  function submitForm() {
    setIsSubmitted(true);
  }
  return (
    <>
      <div className='form-container'>
        <div className='form-content-left'>
          <img className='form-img' src='https://docs.nestjs.com/assets/logo-small.svg' alt='spaceship' />
        </div>
       
          <FormSignup />
        
      </div>
    </>
  );
};

export default Form;
