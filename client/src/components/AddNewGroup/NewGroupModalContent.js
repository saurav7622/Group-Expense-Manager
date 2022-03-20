import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useRef, useState } from "react";
import FormModal from "../UI/FormModal";
import classes from "./NewGroupModalContent.module.css";
import ModalBtn from "../UI/ModalButton";
import CloseBtn from "./CloseBtn.js";
import { useHistory } from "react-router-dom";
import { showBackendAlert } from "./../../utils/backendAlertsController";

const NewGroupModalContent = function (props) {
  const history = useHistory();
  const groupNameInputRef = useRef();
  const totalAmountInputRef = useRef();
  const [groupObj, setGroupObj] = useState({
    groupNameInputIsValid: true,
    totalAmountInputIsValid: true,
    groupNameInputErrorMsg: "",
    totalAmountInputErrorMsg: "",
  });

  const createGroupVerification = async (groupName, groupWorth) => {
    const token = Cookies.get("jwt");
    if (token) {
      let decoded = jwt_decode(token);
      //console.log(decoded);
      try {
        const res = await axios({
          method: "POST",
          url: `https://group-expense-manager-api.herokuapp.com/api/v1/groups/createGroupVerification`,
          data: {
            groupName,
            groupWorth,
          },
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        props.onInitialiseGroupId(res.data.data._id);
      } catch (err) {
        showBackendAlert("error", err.response.data.message);
      }
    } else {
      showBackendAlert("error", "You are not logged in!");
    }
  };
  const formSubmissionHandler = async (event) => {
    event.preventDefault();
    let groupNameInput = groupNameInputRef.current.value;
    let totalAmountInput = totalAmountInputRef.current.value;
    let groupNameInputIsValid = true,
      totalAmountInputIsValid = true,
      groupNameInputErrorMsg = "",
      totalAmountInputErrorMsg = "";
    const regEx = /^[0-9a-zA-Z]+$/;
    if (groupNameInput.trim() == "") {
      groupNameInputIsValid = false;
      groupNameInputErrorMsg = (
        <p className="error-text">Please enter a non-empty group name!</p>
      );
    } else if (groupNameInput.trim().length > 30) {
      groupNameInputIsValid = false;
      groupNameInputErrorMsg = (
        <p className="error-text">
          The length of the group name should not exceed 30!
        </p>
      );
    } else if (
      !groupNameInput.trim().match(regEx) &&
      !groupNameInput.trim().includes(" ")
    ) {
      groupNameInputIsValid = false;
      groupNameInputErrorMsg = (
        <p className="error-text">The group name should be alphanumeric!</p>
      );
    }
    if (totalAmountInput.trim() == "") {
      totalAmountInputIsValid = false;
      totalAmountInputErrorMsg = (
        <p className="error-text">Please enter amount field!</p>
      );
    } else if (totalAmountInput.includes(".")) {
      totalAmountInputIsValid = false;
      totalAmountInputErrorMsg = (
        <p className="error-text">Please enter amount with no decimals!</p>
      );
    }

    if (!groupNameInputIsValid || !totalAmountInputIsValid) {
      setGroupObj({
        groupNameInputIsValid,
        totalAmountInputIsValid,
        groupNameInputErrorMsg,
        totalAmountInputErrorMsg,
      });
    } else {
      setGroupObj({
        groupNameInputIsValid,
        totalAmountInputIsValid,
        groupNameInputErrorMsg,
        totalAmountInputErrorMsg,
      });
      for (let i = 0; i <= 100000000; i++) {}
      //console.log(groupObj);
      groupNameInputRef.current.value = "";
      totalAmountInputRef.current.value = "";
      try {
        await createGroupVerification(groupNameInput, totalAmountInput);
        history.push("/create-new-group");
        props.onSubmit(groupNameInput, totalAmountInput);
      } catch (err) {
        showBackendAlert(
          "error",
          "There was an error initialising the group formation!"
        );
      }
      props.onHide();
    }
  };
  const groupNameInputClasses = !groupObj.groupNameInputIsValid
    ? "form-control invalid"
    : "form-control";

  const totalAmountInputClasses = !groupObj.totalAmountInputIsValid
    ? "form-control invalid"
    : "form-control";
  const formStylesObj = {
    width: "90%",
    color: "black",
    maxWidth: "40rem",
    fontWeight: "bold",
  };
  const labelStylesObj = {
    position: "absolute",
    fontSize: "80%",
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
    justifyContent: "left",
    zIndex: 10,
  };
  return (
    <FormModal className={classes.input} onHide={props.onHide}>
      <form onSubmit={formSubmissionHandler} style={formStylesObj}>
        <div className={groupNameInputClasses}>
          <input
            ref={groupNameInputRef}
            id="groupname"
            type="text"
            autoComplete="off"
            style={inputStylesObj}
            placeholder="Group Name"
          />
          {!groupObj.groupNameInputIsValid && groupObj.groupNameInputErrorMsg}
        </div>
        <div className={totalAmountInputClasses}>
          <input
            ref={totalAmountInputRef}
            id="amount"
            type="number"
            min="0"
            autoComplete="off"
            style={inputStylesObj}
            placeholder="Total Amount (Rs)"
          />
          {!groupObj.groupNameInputIsValid && groupObj.groupNameInputErrorMsg}
          {!groupObj.totalAmountInputIsValid &&
            groupObj.totalAmountInputErrorMsg}
        </div>
        <ModalBtn type="submit">Split Bill</ModalBtn>
      </form>
    </FormModal>
  );
};

export default NewGroupModalContent;
