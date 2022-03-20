import axios from "axios";
import { useHistory } from "react-router-dom";
import { useCookies } from "react-cookie";
import Cookies from "js-cookie";
import { useRef, useContext, useState, Fragment } from "react";
import AuthContext from "./../../store/auth-context";
import { showBackendAlert } from "./../../utils/backendAlertsController";
import "./Login.css";

const SignInForm = function (props) {
  const switchToSignUpFormHandler = function () {
    const container = document.querySelector(".container");
    container.classList.add("sign-up-mode");
  };
  const history = useHistory();
  const [cookies, setCookie] = useCookies(["jwt"]);
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const authCtx = useContext(AuthContext);

  const loginUser = async (email, password) => {
    try {
      const res = await axios({
        method: "POST",
        url: "https://group-expense-manager-api.herokuapp.com/api/v1/users/login",
        data: {
          email,
          password,
        },
      });
      console.log(res);
      if (res.data.status === "success") {
        showBackendAlert("success", "Signed in successfully!");
        let expires = new Date();
        expires.setTime(expires.getTime() + 30 * 24 * 60 * 60 * 1000);
        const cookieOptions = {
          path: "/",
          expires,
        };
        setCookie("jwt", res.data.token, cookieOptions);
        const token = Cookies.get("jwt");
        authCtx.login(token);
        history.replace("/groups");
        window.location.reload(true);
      }
    } catch (err) {
      console.log("Signup error!!!!!!");
      console.log(err);
      showBackendAlert("error", err.response.data.message);
    }
  };
  const formSubmissionHandler = function (event) {
    event.preventDefault();
    const emailInput = emailInputRef.current.value.trim();
    const passwordInput = passwordInputRef.current.value.trim();
    loginUser(emailInput, passwordInput);
  };
  return (
    <Fragment>
      <form
        action="#"
        className="sign-in-form"
        onSubmit={formSubmissionHandler}
      >
        <h2 className="title">Sign in</h2>
        <div className="input-field">
          <i className="fas fa-user"></i>
          <input type="email" placeholder="Email" ref={emailInputRef} />
        </div>
        <div className="input-field">
          <i className="fas fa-lock"></i>
          <input
            type="password"
            placeholder="Password"
            ref={passwordInputRef}
          />
        </div>
        <input type="submit" value="Login" className="btn solid" />
        <a
          style={{ color: "black" }}
          onClick={props.onShowPasswordResetEmailFormModal}
        >
          Forgot Password?
        </a>
        <a
          style={{
            position: "relative",
            color: "black",
            marginTop: "2%",
            textDecoration: "underline",
          }}
          className="sign-up-link"
          onClick={switchToSignUpFormHandler}
        >
          Sign Up
        </a>
      </form>
    </Fragment>
  );
};

export default SignInForm;
