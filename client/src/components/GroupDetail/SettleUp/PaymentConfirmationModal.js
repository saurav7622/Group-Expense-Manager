import React from "react";
import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import FormModal from "../../UI/FormModal";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "./PaymentConfirmationModal.module.css";
import ModalBtn from "../../UI/ModalButton";
import CloseBtn from "./CloseBtn.js";
import ConfirmBtn from "./ConfirmBtn.js";
import { showBackendAlert } from "./../../../utils/backendAlertsController";

const PaymentConfirmationModal = function (props) {
  const params = useParams();
  const groupId = params.groupId;
  const amountToBeConfirmedInputRef = useRef();
  const meansOfPaymentInputRef = useRef();
  const proofOfPaymentInputRef = useRef();
  const [paymentToBeConfirmedInputObj, setPaymentToBeConfirmedInputObj] =
    useState({
      amountToBeConfirmedInputIsValid: true,
      amountToBeConfirmedInputErrorMsg: "",
      meansOfPaymentInputIsValid: true,
      meansOfPaymentInputErrorMsg: "",
      proofOfPaymentInputIsValid: true,
    });
  const sendPaymentConfirmationEmail = async (
    sender,
    receiver,
    amount,
    means,
    fileData
  ) => {
    const token = Cookies.get("jwt");
    if (token) {
      let decoded = jwt_decode(token);
     // console.log(decoded);
      const form = new FormData();
      form.append("sender", sender);
      form.append("receiver", receiver);
      form.append("amount", amount);
      form.append("means", means);
      form.append("photo", fileData);
      form.append("groupId", groupId);
      try {
        const res = await axios({
          method: "POST",
          url: `https://group-expense-manager-api.herokuapp.com/api/v1/users/sendPaymentConfirmationEmail`,
          data: form,
          headers: {
            authorization: `Bearer ${token}`,
            id:decoded.id,
          },
        });

        if (res.data.status === "success") {
          showBackendAlert("success","Payment Confirmation Email successfully sent!");
          //console.log(res.data.data.group);
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
  const formSubmissionHandler = function (event) {
    event.preventDefault();
    //console.log(event.target[2].files.length);
    let amountToBeConfirmedInput = amountToBeConfirmedInputRef.current.value;
    let amountToBeConfirmedInputIsValid = true,
      amountToBeConfirmedInputErrorMsg = "";
    let meansOfPaymentInput = meansOfPaymentInputRef.current.value;
    let meansOfPaymentInputIsValid = true,
      meansOfPaymentInputErrorMsg = "";
    let proofOfPaymentInput = proofOfPaymentInputRef.current.value;
    let proofOfPaymentInputIsValid = true,
      proofOfPaymentInputErrorMsg = "";

    console.log("File");
    console.log(proofOfPaymentInput);
    const regEx = /^\d+$/;

    if (amountToBeConfirmedInput.trim() == "") {
      amountToBeConfirmedInputIsValid = false;
      amountToBeConfirmedInputErrorMsg = (
        <p className="error-text">Please enter amount field!</p>
      );
    } else if (!amountToBeConfirmedInput.trim().match(regEx)) {
      amountToBeConfirmedInputIsValid = false;
      amountToBeConfirmedInputErrorMsg = (
        <p className="error-text">
          Please ensure that the input is a whole number!
        </p>
      );
    } else if (
      props.groupMemberObj.totalAmountPaid * 1 -
        props.groupMemberObj.myShare * 1 -
        props.groupMemberObj.amountReceived * 1 <
      amountToBeConfirmedInput * 1
    ) {
      amountToBeConfirmedInputIsValid = false;
      amountToBeConfirmedInputErrorMsg = (
        <p className="error-text">
          The amount inputted cannot exceed the amount the beared up person has
          been owed from the group!
        </p>
      );
    } else if (
      props.signedInMember.myShare * 1 +
        props.signedInMember.amountReceived * 1 -
        props.signedInMember.totalAmountPaid * 1 <
      amountToBeConfirmedInput * 1
    ) {
      amountToBeConfirmedInputIsValid = false;
      amountToBeConfirmedInputErrorMsg = (
        <p className="error-text">
          The amount inputted exceeded the amount you owe to the group!
        </p>
      );
    }
    if (meansOfPaymentInput.trim() === "") {
      meansOfPaymentInputIsValid = false;
      meansOfPaymentInputErrorMsg = (
        <p className="error-text">
          Please enter either of the means of payment or proof of payment
          field(s)!
        </p>
      );
    }

    if (event.target[2].files.length === 0) {
      proofOfPaymentInputIsValid = false;
      proofOfPaymentInputErrorMsg = (
        <p className="error-text">
          Please enter either of the means of payment or proof of payment
          field(s)!
        </p>
      );
    }

    if (
      !amountToBeConfirmedInputIsValid ||
      (meansOfPaymentInput.trim() === "" && event.target[2].files.length === 0)
    ) {
      setPaymentToBeConfirmedInputObj({
        amountToBeConfirmedInputIsValid,
        amountToBeConfirmedInputErrorMsg,
        meansOfPaymentInputIsValid,
        meansOfPaymentInputErrorMsg,
        proofOfPaymentInputIsValid,
        proofOfPaymentInputErrorMsg,
      });
    } else {
      setPaymentToBeConfirmedInputObj({
        amountToBeConfirmedInputIsValid,
        amountToBeConfirmedInputErrorMsg,
        meansOfPaymentInputIsValid,
        meansOfPaymentInputErrorMsg,
        proofOfPaymentInputIsValid,
        proofOfPaymentInputErrorMsg,
      });
      for (let i = 0; i <= 100000000; i++) {}
      sendPaymentConfirmationEmail(
        props.signedInMember.memberId,
        props.groupMemberObj.memberId,
        amountToBeConfirmedInput.trim(),
        meansOfPaymentInput.trim(),
        event.target[2].files[0]
      );
      // pushLogToGroupDocument(reminderMessage, groupId);
      const currentDate = new Date();
      const timestamp = currentDate.getTime();
      //props.onAddGroupLog(currentDate, reminderMessage, groupId);
      props.onHide();
    }
  };
  const amountToBeConfirmedInputClasses =
    !paymentToBeConfirmedInputObj.amountToBeConfirmedInputIsValid
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
      <FontAwesomeIcon icon="fa-solid fa-xmark" />
      <form onSubmit={formSubmissionHandler}>
        <div className={amountToBeConfirmedInputClasses}>
          <label
            style={labelStylesObj}
            htmlFor="amount"
          >{`Amount you ask for email confirmation (in Rs.)`}</label>
          <input
            ref={amountToBeConfirmedInputRef}
            id="amount"
            type="number"
            min="0"
            autoComplete="off"
            style={inputStylesObj}
          />
          {!paymentToBeConfirmedInputObj.amountToBeConfirmedInputIsValid &&
            paymentToBeConfirmedInputObj.amountToBeConfirmedInputErrorMsg}
        </div>
        <div>
          <label
            style={labelStylesObj}
            htmlFor="means"
          >{`Short description for your means of payment`}</label>
          <input
            ref={meansOfPaymentInputRef}
            id="means"
            min="0"
            autoComplete="off"
            style={inputStylesObj}
          />
          {!paymentToBeConfirmedInputObj.meansOfPaymentInputIsValid &&
            paymentToBeConfirmedInputObj.meansOfPaymentInputErrorMsg}
        </div>
        <div>
          <label style={labelStylesObj} htmlFor="attachment">
            Attachment for Proof of Payment
          </label>
          <input
            type="file"
            ref={proofOfPaymentInputRef}
            id="attachment"
            style={inputStylesObj}
          />
          {!paymentToBeConfirmedInputObj.proofOfPaymentInputIsValid &&
            paymentToBeConfirmedInputObj.proofOfPaymentInputErrorMsg}
        </div>
        <ConfirmBtn type="submit">Confirm</ConfirmBtn>
      </form>
    </FormModal>
  );
};

export default PaymentConfirmationModal;
