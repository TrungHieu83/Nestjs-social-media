import { useState, useEffect } from 'react';
import axios from "axios";
import { useHistory } from "react-router";
const useForm = (callback, validate) => {
  const history = useHistory();
  const url = process.env.REACT_APP_PUBLIC_FOLDER;
  const [values, setValues] = useState({
    fullName: '',
    email: '',
    password: '',
    password2: '',
    address: '',
    gender: true,
    dob: '2022-01-07'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
  
    setValues({
      ...values,
      [name]: value
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
  
    setErrors(validate(values, 1));
  
    const user = {
      fullName: values.fullName,
      email: values.email,
      password: values.password,
      address: values.address,
      gender: true,
      dob: values.dob
    }
    if (values.fullName !== '' && values.email !== '' && values.password !== '' && values.password == values.password2) {
      try {
        setErrors(validate({done: false},2))
        await axios.post(`${url}auth/users/register`, user);
        setErrors(validate({done: true},2))
      } catch (err) {
        setErrors(validate({ isExist: false },3));
      }

    }
  };

  useEffect(
    () => {
      if (Object.keys(errors).length === 0 && isSubmitting) {
        callback();
      }
    },
    [errors]
  );

  return { handleChange, handleSubmit, values, errors };
};

export default useForm;
