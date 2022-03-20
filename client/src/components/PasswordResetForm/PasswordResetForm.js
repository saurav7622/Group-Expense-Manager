import React from "react";
import { useRef, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import classes from "./PasswordResetForm.module.css";
import { showBackendAlert } from "./../../utils/backendAlertsController";

const PasswordResetForm = function () {
  const history = useHistory("/");
  const passwordInputRef = useRef();
  const passwordConfirmInputRef = useRef();
  const params = useParams();
  const token = params.token;
  const resetPassword = async (password, passwordConfirm) => {
    try {
      const res = await axios({
        method: "PATCH",
        url: `https://group-expense-manager-api.herokuapp.com/api/v1/users/resetPassword/${token}`,
        data: {
          password,
          passwordConfirm,
        },
      });

      if (res.data.status === "success") {
        showBackendAlert("success", "Password resetted successfully!");
      }
    } catch (err) {
      showBackendAlert("error", err.response.data.message);
    }
  };

  const formSubmissionHandler = function (event) {
    event.preventDefault();
    const password = passwordInputRef.current.value;
    const passwordConfirm = passwordConfirmInputRef.current.value;

    resetPassword(password, passwordConfirm);
    passwordInputRef.current.value = "";
    passwordConfirmInputRef.current.value = "";
  };

  return (
    <div className={classes.pageCoverGrey}>
      <div className={classes["form-container"]}>
        <form className={classes["form-wrap"]} onSubmit={formSubmissionHandler}>
          <h2>Reset Password</h2>
          <div className={classes["form-box"]}>
            <input
              type="password"
              ref={passwordInputRef}
              placeholder="Enter your new password"
            />
          </div>
          <div className={classes["form-box"]}>
            <input
              type="password"
              ref={passwordConfirmInputRef}
              placeholder="Confirm your new password"
            />
          </div>
          <div className={classes["form-submit"]}>
            <input type="submit" value="Confirm" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordResetForm;
