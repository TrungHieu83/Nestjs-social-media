export default function validateInfo(values, type) {
  let errors = {};

  if (type == 1) {
    if (!values.fullName.trim()) {
      errors.username = 'Username required';
    }
    // else if (!/^[A-Za-z]+/.test(values.name.trim())) {
    //   errors.name = 'Enter a valid name';
    // }

    if (!values.email) {
      errors.email = 'Email required';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Email address is invalid';
    }
    if (!values.password) {
      errors.password = 'Password is required';
    } else if (values.password.length < 6) {
      errors.password = 'Password needs to be 6 characters or more';
    }

    if (!values.password2) {
      errors.password2 = 'Password is required';
    } else if (values.password2 !== values.password) {
      errors.password2 = 'Passwords do not match';
    }
    if(!values.address){
      errors.address = 'Address required';
    }
  }
  if (type == 2) {
    if (values.done == true) {
      errors.done = true;
    }
    if(values.done == false){
      errors.done = false;
    }
  }
  if (type == 3) {
    if (values.isExist == false) {
      errors.email = 'This email address is already being used';
    }
  }




  return errors;
}
