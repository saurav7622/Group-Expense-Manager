import React from "react";
import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import FormModal from "../UI/FormModal";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "./PasswordUpdateFormModal.module.css";
import ModalBtn from "../UI/ModalButton";
import ConfirmBtn from "./ConfirmBtn.js";
import { showBackendAlert } from "./../../utils/backendAlertsController";

const PasswordUpdateFormModal = function (props) {
  const currentPasswordInputRef = useRef();
  const newPasswordInputRef = useRef();
  const confirmNewPasswordInputRef = useRef();
  const updateMyPassword = async (
    currentPassword,
    newPassword,
    confirmNewPassword
  ) => {
    const token = Cookies.get("jwt");
    if (token) {
      let decoded = jwt_decode(token);
      console.log(decoded);

      try {
        const res = await axios({
          method: "PATCH",
          url: `https://group-expense-manager-api.herokuapp.com/api/v1/users/updateMyPassword`,
          data: {
            passwordCurrent: currentPassword,
            password: newPassword,
            passwordConfirm: confirmNewPassword,
          },
          headers: {
            authorization: `Bearer ${token}`,
            id: decoded.id,
          },
        });

        if (res.data.status === "success") {
          showBackendAlert("success", "Password updated successfully!");
        }
      } catch (err) {
        showBackendAlert("error", err.response.data.message);
      }
    } else {
      showBackendAlert("error", "You are not logged in to update password!");
    }
  };
  /*const pushLogToGroupDocument = async (reminderMessage, groupId) => {
    const token = Cookies.get("jwt");
    if (token) {
      let decoded = jwt_decode(token);
      console.log(decoded);
      try {
        const res = await axios({
          method: "PATCH",
          url: `http://127.0.0.1:8080/api/v1/groups/pushLogToGroupDocument`,
          data: {
            reminderMessage,
            groupId,
          },
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        if (res.data.status === "success") {
          showBackendAlert(
            "success",
            "Reminder message successfully saved to logs!"
          );
          console.log(res.data.data.group);
        }
      } catch (err) {
        showBackendAlert("error", err);
      }
    } else {
      showBackendAlert(
        "error",
        "You are not logged in to send the desired mail!"
      );
    }
  };*/
  const formSubmissionHandler = function (event) {
    event.preventDefault();
    const currentPassword = currentPasswordInputRef.current.value;
    const newPassword = newPasswordInputRef.current.value;
    const confirmNewPassword = confirmNewPasswordInputRef.current.value;

    updateMyPassword(currentPassword, newPassword, confirmNewPassword);
    props.onHide();
  };
  const labelStylesObj = {
    position: "relative",
    fontSize: "105%",
    fontWeight: "bold",
    marginTop: "0.2rem",
    marginLeft: "-5%",
    marginBottom: "0.7rem",
  };
  const inputStylesObj = {
    position: "relative",
    border: "1px solid black",
    padding: "0.15rem",
    marginBottom: "0.9rem",
    marginLeft: "-5%",
  };

  return (
    <FormModal className={classes.input} onHide={props.onHide}>
      <FontAwesomeIcon icon="fa-solid fa-xmark" />
      <form onSubmit={formSubmissionHandler}>
        <div>
          <label
            style={labelStylesObj}
            htmlFor="currentPassword"
          >{`Enter your current password`}</label>
          <input
            ref={currentPasswordInputRef}
            id="currentPassword"
            type="password"
            autoComplete="off"
            style={inputStylesObj}
          />
        </div>
        <div>
          <label
            style={labelStylesObj}
            htmlFor="newPassword"
          >{`Enter your new password`}</label>
          <input
            ref={newPasswordInputRef}
            id="newPassword"
            type="password"
            autoComplete="off"
            style={inputStylesObj}
          />
        </div>
        <div>
          <label
            style={labelStylesObj}
            htmlFor="confirmNewPassword"
          >{`Confirm your new password`}</label>
          <input
            ref={confirmNewPasswordInputRef}
            id="confirmNewPassword"
            type="password"
            autoComplete="off"
            style={inputStylesObj}
          />
        </div>
        <ConfirmBtn type="submit">Update Password</ConfirmBtn>
      </form>
    </FormModal>
  );
};

export default PasswordUpdateFormModal;
