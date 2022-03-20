import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import axios from "axios";
import FormModal from "../UI/FormModal";
import classes from "./NewMemberModal.module.css";
import ModalBtn from "../UI/ModalButton";
import CloseBtn from "./CloseBtn.js";
import { useHistory } from "react-router-dom";
import { showBackendAlert } from "./../../utils/backendAlertsController";

const NewMemberModal = function (props) {
  const history = useHistory();
  const emailIdInputRef = useRef();
  const [emailIdObj, setEmailIdObj] = useState({
    emailIdInputIsValid: true,
    emailIdInputErrorMsg: "",
  });
  const isRegistered = async (emailId) => {
    const token = Cookies.get("jwt");
    if (token) {
      let decoded = jwt_decode(token);
      console.log(decoded);
      try {
        const result = await axios({
          method: "POST",
          url: `https://group-expense-manager-api.herokuapp.com/api/v1/users/isRegistered`,
          data: {
            emailId,
          },
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        return result.data.data.isRegistered;
      } catch (err) {
        showBackendAlert("error", err.response.data.message);
      }
    } else {
      showBackendAlert("error", "You are not logged in!");
    }
  };
  const formSubmissionHandler = async (event) => {
    event.preventDefault();
    let emailIdInput = emailIdInputRef.current.value;
    let emailIdInputIsValid = true,
      emailIdInputErrorMsg = "";
    //const regEx = /^[0-9a-zA-Z]+$/;
    if (emailIdInput.trim() == "") {
      emailIdInputIsValid = false;
      emailIdInputErrorMsg = (
        <p className="error-text">Please enter a non-empty email Id!</p>
      );
    } else if (props.DUMMY_MEMBERS.find((member) => member == emailIdInput)) {
      emailIdInputIsValid = false;
      emailIdInputErrorMsg = (
        <p className="error-text">
          The given email is already included in the current group!
        </p>
      );
    } else if (!(await isRegistered(emailIdInput.trim()))) {
      emailIdInputIsValid = false;
      emailIdInputErrorMsg = (
        <p className="error-text">The given email Id is not registered!</p>
      );
    }

    if (!emailIdInputIsValid) {
      setEmailIdObj({
        emailIdInputIsValid,
        emailIdInputErrorMsg,
      });
    } else {
      setEmailIdObj({
        emailIdInputIsValid,
        emailIdInputErrorMsg,
      });
      for (let i = 0; i <= 100000000; i++) {}
      //console.log(groupObj);
      props.onAddNewMember(emailIdInput);
      emailIdInputRef.current.value = "";
      props.onHide();
    }
  };
  const emailIdInputClasses = !emailIdObj.emailIdInputIsValid
    ? "form-control invalid"
    : "form-control";
  const labelStylesObj = {
    position: "absolute",
    fontSize: "120%",
    fontWeight: "bold",
    marginTop: "0.2rem",
    marginLeft: "-25%",
    marginBottom: "0.7rem",
  };
  const inputStylesObj = {
    position: "relative",
    border: "1px solid black",
    padding: "0.15rem",
    marginBottom: "0.9rem",
  };
  return (
    <FormModal className={classes.input} onHide={props.onHide}>
      <form onSubmit={formSubmissionHandler}>
        <div className={emailIdInputClasses}>
          <label style={labelStylesObj} htmlFor="emailId">
            Enter Email
          </label>
          <input
            ref={emailIdInputRef}
            id="emailId"
            type="email"
            autoComplete="off"
            style={inputStylesObj}
          />
          {!emailIdObj.emailIdInputIsValid && emailIdObj.emailIdInputErrorMsg}
        </div>
        <ModalBtn type="submit">Add</ModalBtn>
      </form>
    </FormModal>
  );
};

export default NewMemberModal;
