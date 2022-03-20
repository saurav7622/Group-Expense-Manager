import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import FormModal from "../../UI/FormModal";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import axios from "axios";
import classes from "./ReminderModal.module.css";
import ModalBtn from "../../UI/ModalButton";
import CloseBtn from "./CloseBtn.js";
import ConfirmBtn from "./ConfirmBtn.js";
import { showBackendAlert } from "./../../../utils/backendAlertsController";

const ReminderModal = function (props) {
  const params = useParams();
  const groupId = params.groupId;
  const amountRemindedInputRef = useRef();
  const [amountRemindedInputObj, setAmountRemindedInputObj] = useState({
    amountRemindedInputIsValid: true,
    amountRemindedInputErrorMsg: "",
  });
  const sendPaymentReminderEmail = async (sender, receiver, amount) => {
    const token = Cookies.get("jwt");
    if (token) {
      let decoded = jwt_decode(token);
      console.log(decoded);
      try {
        const res = await axios({
          method: "POST",
          url: `https://group-expense-manager-api.herokuapp.com/api/v1/users/sendPaymentReminderEmail`,
          data: {
            sender,
            receiver,
            amount,
            groupId,
          },
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        if (res.data.status === "success") {
          showBackendAlert(
            "success",
            "Payment Reminder Email successfully sent!"
          );
        }
      } catch (err) {
        showBackendAlert("error", err.response.data.message);
      }
    } else {
      showBackendAlert(
        "error",
        "You are not logged in to send the desired mail!"
      );
    }
  };
  const pushLogToGroupDocument = async (reminderMessage, groupId) => {
    const token = Cookies.get("jwt");
    if (token) {
      let decoded = jwt_decode(token);
      console.log(decoded);
      try {
        const res = await axios({
          method: "PATCH",
          url: `https://group-expense-manager-api.herokuapp.com/api/v1/groups/pushLogToGroupDocument`,
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
        }
      } catch (err) {}
    } else {
      showBackendAlert(
        "error",
        "You are not logged in to send the desired mail!"
      );
    }
  };
  const formSubmissionHandler = function (event) {
    event.preventDefault();
    let amountRemindedInput = amountRemindedInputRef.current.value;
    let amountRemindedInputIsValid = true,
      amountRemindedInputErrorMsg = "";
    const regEx = /^\d+$/;

    if (amountRemindedInput.trim() == "") {
      amountRemindedInputIsValid = false;
      amountRemindedInputErrorMsg = (
        <p className="error-text">Please enter amount field!</p>
      );
    } else if (!amountRemindedInput.trim().match(regEx)) {
      amountRemindedInputIsValid = false;
      amountRemindedInputErrorMsg = (
        <p className="error-text">
          Please ensure that the input is a whole number!
        </p>
      );
    } else if (
      props.groupMemberObj.myShare - props.groupMemberObj.totalAmountPaid <
      amountRemindedInput * 1
    ) {
      amountRemindedInputIsValid = false;
      amountRemindedInputErrorMsg = (
        <p className="error-text">
          The amount inputted cannot exceed the amount the person owe to the
          group!
        </p>
      );
    } else if (
      props.signedInMember.totalAmountPaid -
        props.signedInMember.amountReceived -
        props.signedInMember.myShare <
      amountRemindedInput * 1
    ) {
      amountRemindedInputIsValid = false;
      amountRemindedInputErrorMsg = (
        <p className="error-text">
          The amount inputted exceeded the amount you are actually owed!
        </p>
      );
    }
    if (!amountRemindedInputIsValid) {
      setAmountRemindedInputObj({
        amountRemindedInputIsValid,
        amountRemindedInputErrorMsg,
      });
    } else {
      setAmountRemindedInputObj({
        amountRemindedInputIsValid,
        amountRemindedInputErrorMsg,
      });
      for (let i = 0; i <= 100000000; i++) {}
      const reminderMessage = `${props.signedInMember.memberId} has reminded ${props.groupMemberObj.memberId} to pay Rs ${amountRemindedInputRef.current.value}`;
      sendPaymentReminderEmail(
        props.signedInMember.memberId,
        props.groupMemberObj.memberId,
        amountRemindedInputRef.current.value
      );
      pushLogToGroupDocument(reminderMessage, groupId);
      const currentDate = new Date();
      const timestamp = currentDate.getTime();
      //props.onAddGroupLog(currentDate, reminderMessage, groupId);
      props.onHide();
    }
  };
  const amountRemindedInputClasses =
    !amountRemindedInputObj.amountRemindedInputIsValid
      ? "form-control invalid"
      : "form-control";
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
      <form onSubmit={formSubmissionHandler}>
        <div className={amountRemindedInputClasses}>
          <label
            style={labelStylesObj}
            htmlFor="amount"
          >{`Remind ${props.groupMemberObj.memberId} to pay Rs`}</label>
          <input
            ref={amountRemindedInputRef}
            id="amount"
            type="number"
            min="0"
            autoComplete="off"
            style={inputStylesObj}
          />
          {!amountRemindedInputObj.amountRemindedInputIsValid &&
            amountRemindedInputObj.amountRemindedInputErrorMsg}
        </div>
        <ConfirmBtn type="submit">Confirm</ConfirmBtn>
      </form>
    </FormModal>
  );
};

export default ReminderModal;
