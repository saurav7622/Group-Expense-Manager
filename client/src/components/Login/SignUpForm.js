import axios from "axios";
import { useHistory } from "react-router-dom";
import { useRef } from "react";
import { showBackendAlert } from "./../../utils/backendAlertsController";
import "./Login.css";

const SignUpForm = function () {
  const history = useHistory();
  const nameInputRef = useRef();
  const usernameInputRef = useRef();
  const emailInputRef = useRef();
  const mobileNoInputRef = useRef();
  const passwordInputRef = useRef();
  const passwordConfirmInputRef = useRef();

  const createUser = async (
    name,
    username,
    email,
    contactNo,
    password,
    passwordConfirm
  ) => {
    try {
      const res = await axios({
        method: "POST",
        url: "https://group-expense-manager-api.herokuapp.com/api/v1/users/signup",
        data: {
          name,
          username,
          email,
          contactNo,
          password,
          passwordConfirm,
        },
      });
      //alert(res.data.status);
      if (res.data.status === "PENDING") {
        showBackendAlert("success", res.data.message);
        nameInputRef.current.value = "";
        usernameInputRef.current.value = "";
        emailInputRef.current.value = "";
        mobileNoInputRef.current.value = "";
        passwordInputRef.current.value = "";
        passwordConfirmInputRef.current.value = "";
      }
    } catch (err) {
      console.log("Signup error!!!!!!");
      console.log(err.response.data.message);
      showBackendAlert("error", err.response.data.message);
    }
  };
  const formSubmissionHandler = function (event) {
    event.preventDefault();
    const nameInput = nameInputRef.current.value.trim();
    const usernameInput = usernameInputRef.current.value.trim();
    const emailInput = emailInputRef.current.value.trim();
    const mobileNoInput = mobileNoInputRef.current.value.trim();
    const passwordInput = passwordInputRef.current.value.trim();
    const passwordConfirmInput = passwordConfirmInputRef.current.value.trim();
    createUser(
      nameInput,
      usernameInput,
      emailInput,
      mobileNoInput,
      passwordInput,
      passwordConfirmInput
    );
  };
  return (
    <form action="#" className="sign-up-form" onSubmit={formSubmissionHandler}>
      <h2 className="title">Sign up</h2>
      <div className="input-field">
        <i className="fas fa-user"></i>
        <input
          ref={nameInputRef}
          type="text"
          placeholder="Name"
          autoComplete="on"
        />
      </div>
      <div className="input-field">
        <i className="fas fa-user"></i>
        <input
          ref={usernameInputRef}
          type="text"
          placeholder="Generate Unique Username"
          autoComplete="on"
        />
      </div>
      <div className="input-field">
        <i className="fas fa-envelope"></i>
        <input
          ref={emailInputRef}
          type="email"
          placeholder="Email"
          autoComplete="on"
        />
      </div>
      <div className="input-field">
        <i className="fas fa-phone-alt"></i>
        <input ref={mobileNoInputRef} placeholder="Mobile No" />
      </div>
      <div className="input-field">
        <i className="fas fa-lock"></i>
        <input
          ref={passwordInputRef}
          type="password"
          placeholder="Password"
          autoComplete="on"
        />
      </div>
      <div className="input-field">
        <i className="fas fa-lock"></i>
        <input
          ref={passwordConfirmInputRef}
          type="password"
          placeholder="Confirm Password"
          autoComplete="on"
        />
      </div>
      <input type="submit" className="btn" value="Sign up" />
    </form>
  );
};

export default SignUpForm;
