import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useRef, useState } from "react";
import classes from "./IndividualForm.module.css";
import NewGroupBtnDanger from "./NewGroupBtnDanger";
import NewGroupBtnSuccess from "./NewGroupBtnSuccess";
import NewGroupBtnSecondary from "./NewGroupBtnSecondary";
import RemoveMemberErrorModal from "./RemoveMemberErrorModal";
import RemoveMemberConfirmationModal from "./RemoveMemberConfirmationModal";
import { useHistory } from "react-router-dom";
import { showBackendAlert } from "./../../utils/backendAlertsController";

const IndividualForm = (props) => {
  const history = useHistory();
  const myContributionInputRef = useRef();
  const currentlyPayingInputRef = useRef();
  const [memberId, setMemberId] = useState("");
  const [memberObj, setMemberObj] = useState({
    myContributionInputIsValid: true,
    currentlyPayingInputIsValid: true,
    myContributionInputErrorMsg: "",
    currentlyPayingInputErrorMsg: "",
  });
  const [confirmationState, setConfirmationState] = useState("");
  const [showRemoveMemberErrorModal, setShowRemoveMemberErrorModal] =
    useState(false);
  const [
    showRemoveMemberConfirmationModal,
    setShowRemoveMemberConfirmationModal,
  ] = useState(false);
  let clear;
  const registerConfirmation = function () {
    setConfirmationState("confirmed");
    props.numberOfConfirmedMembersHandler(1);
    props.totalMyContributionHandler(
      Number(myContributionInputRef.current.value)
    );
    props.totalCurrentlyPayingHandler(
      Number(currentlyPayingInputRef.current.value)
    );
    const obj = {
      memberId: props.gmail,
      myShare: myContributionInputRef.current.value,
      amountPaid: currentlyPayingInputRef.current.value,
    };
    props.onAddGroupMemberObject(obj);
  };
  const sendMemberConfirmationEmail = async (
    groupName,
    groupWorth,
    share,
    amountPaid
  ) => {
    const token = Cookies.get("jwt");
    if (token) {
      let decoded = jwt_decode(token);
      console.log(decoded);
      try {
        const res = await axios({
          method: "POST",
          url: `https://group-expense-manager-api.herokuapp.com/api/v1/users/sendMemberConfirmationEmail`,
          data: {
            groupName,
            groupWorth,
            share,
            amountPaid,
            receiver: props.gmail,
            groupId: props.initialisedGroupId,
          },
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        if (res.data.status === "success") {
          showBackendAlert(
            "success",
            "Member Confirmation Email successfully sent!"
          );
          return res.data.data.memberId;
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
  };
  const askForConfirmationHandler = async (event) => {
    event.preventDefault();
    let myContributionInput = myContributionInputRef.current.value;
    let currentlyPayingInput = currentlyPayingInputRef.current.value;
    let myContributionInputIsValid = true,
      currentlyPayingInputIsValid = true,
      myContributionInputErrorMsg = "",
      currentlyPayingInputErrorMsg = "";
    const regEx = /^\d+$/;
    if (myContributionInput.trim() == "") {
      myContributionInputIsValid = false;
      myContributionInputErrorMsg = (
        <p className="error-text">Please enter the contribution field!</p>
      );
    } else if (!myContributionInput.trim().match(regEx)) {
      myContributionInputIsValid = false;
      myContributionInputErrorMsg = (
        <p className="error-text">
          Please ensure that the input is a whole number!
        </p>
      );
    }

    if (currentlyPayingInput.trim() == "") {
      currentlyPayingInputIsValid = false;
      currentlyPayingInputErrorMsg = (
        <p className="error-text">Please enter the currently paying field!</p>
      );
    } else if (!currentlyPayingInput.trim().match(regEx)) {
      currentlyPayingInputIsValid = false;
      currentlyPayingInputErrorMsg = (
        <p className="error-text">
          Please ensure that the input is a whole number!
        </p>
      );
    } else if (currentlyPayingInput.trim() == "0") {
      if (myContributionInput.trim() == "0") {
        myContributionInputIsValid = false;
        myContributionInputErrorMsg = (
          <p className="error-text">
            My Contribution field and Currently Paying field cannot be 0
            simultaneously!{" "}
          </p>
        );
        currentlyPayingInputIsValid = false;
        currentlyPayingInputErrorMsg = (
          <p className="error-text">
            My Contribution field and Currently Paying field cannot be 0
            simultaneously!
          </p>
        );
      }
    }

    if (!myContributionInputIsValid || !currentlyPayingInputIsValid) {
      setMemberObj({
        myContributionInputIsValid,
        currentlyPayingInputIsValid,
        myContributionInputErrorMsg,
        currentlyPayingInputErrorMsg,
      });
      setConfirmationState("");
    } else {
      setMemberObj({
        myContributionInputIsValid,
        currentlyPayingInputIsValid,
        myContributionInputErrorMsg,
        currentlyPayingInputErrorMsg,
      });

      const MemberId = await sendMemberConfirmationEmail(
        props.groupNameInput,
        props.totalAmountInput,
        myContributionInput,
        currentlyPayingInput
      );
      console.log(MemberId);
      setConfirmationState("pending");
      setMemberId(MemberId);
      for (let i = 0; i <= 100000000; i++) {}
      clear = setInterval(async () => {
        const token = Cookies.get("jwt");
        if (token) {
          let decoded = jwt_decode(token);
          console.log(decoded);
          try {
            const result = await axios({
              method: "POST",
              url: `https://group-expense-manager-api.herokuapp.com/api/v1/users/checkMemberConfirmationStatus`,
              data: {
                groupId: props.initialisedGroupId,
                gmail: props.gmail,
              },
              headers: {
                authorization: `Bearer ${token}`,
              },
            });

            if (result.data.status === "success") {
              if (result.data.data.isConfirmed == true) {
                clearInterval(clear);
                registerConfirmation();
              }
            }
          } catch (err) {
            showBackendAlert("error", err);
          }
        } else {
          showBackendAlert("error", "You are not logged in!");
        }
      }, 20 * 1000);
    }
  };
  const editHandler = async () => {
    setConfirmationState("");
    try {
      await axios({
        method: "PATCH",
        url: `https://group-expense-manager-api.herokuapp.com/api/v1/users/removeVerificationMember`,
        data: {
          groupId: props.initialisedGroupId,
          gmail: props.gmail,
        },
      });
    } catch (err) {
      showBackendAlert("error", err.response.data.message);
    }
    props.numberOfConfirmedMembersHandler(-1);
    props.totalMyContributionHandler(
      -Number(myContributionInputRef.current.value)
    );
    props.totalCurrentlyPayingHandler(
      -Number(currentlyPayingInputRef.current.value)
    );
    const obj = {
      memberId: props.gmail,
      myShare: myContributionInputRef.current.value,
      amountPaid: currentlyPayingInputRef.current.value,
    };
    props.onDeleteGroupMemberObject(obj);
    setMemberId("");
  };
  const removeMemberHandler = async () => {
    if (props.gmail === props.signedInEmail) {
      setShowRemoveMemberErrorModal(true);
      return;
    }
    try {
      await axios({
        method: "PATCH",
        url: `http://127.0.0.1:8080/api/v1/users/removeVerificationMember`,
        data: {
          groupId: props.initialisedGroupId,
          gmail: props.gmail,
        },
      });
    } catch (err) {
      showBackendAlert("error", err.response.data.message);
    }
    setShowRemoveMemberConfirmationModal(true);
    const obj = {
      memberId: props.gmail,
      myShare: myContributionInputRef.current.value,
      amountPaid: currentlyPayingInputRef.current.value,
    };
    props.onDeleteGroupMemberObject(obj);
    setMemberId("");
  };
  const hideRemoveMemberErrorModal = function () {
    setShowRemoveMemberErrorModal(false);
  };
  const hideRemoveMemberConfirmationModalHandler = function () {
    setShowRemoveMemberConfirmationModal(false);
  };
  const ConfirmRemoveMemberHandler = function () {
    props.onRemoveGroupMember(props.gmail);
    props.numberOfConfirmedMembersHandler(-1);
    props.totalMyContributionHandler(
      -Number(myContributionInputRef.current.value)
    );
    props.totalCurrentlyPayingHandler(
      -Number(currentlyPayingInputRef.current.value)
    );
  };
  const myContributionInputClasses = !memberObj.myContributionInputIsValid
    ? "form-control invalid"
    : "form-control";

  const currentlyPayingInputClasses = !memberObj.currentlyPayingInputIsValid
    ? "form-control invalid"
    : "form-control";
  const disabled = confirmationState && "disabled";
  const pendingMessage = (
    <p className="warning-message">
      The confirmation request sent is yet not approved!
    </p>
  );
  const confirmedMessage = <p className="success-message">Confirmed!</p>;
  const ModalErrorTitle = "Error Message";
  const ModalErrorMessage =
    "The user who initiated group formation cannot be removed!";
  const ModalConfirmationTitle = "Confirmation Message";
  const ModalConfirmationMessage = `Do you confirm removing this member having gmailId (${props.gmail})?`;
  return (
    <div className={classes.wrapper}>
      {showRemoveMemberConfirmationModal && (
        <RemoveMemberConfirmationModal
          title={ModalConfirmationTitle}
          message={ModalConfirmationMessage}
          onHideRemoveMemberConfirmationModal={
            hideRemoveMemberConfirmationModalHandler
          }
          onConfirmRemoveMember={ConfirmRemoveMemberHandler}
        />
      )}
      {showRemoveMemberErrorModal && (
        <RemoveMemberErrorModal
          title={ModalErrorTitle}
          message={ModalErrorMessage}
          onHide={hideRemoveMemberErrorModal}
        />
      )}
      <div className={classes.title}>{props.gmail}</div>
      <div className={classes.form}>
        <div className={myContributionInputClasses}>
          <label>My Contribution (in Rs.):</label>
          <input
            ref={myContributionInputRef}
            disabled={disabled}
            type="number"
            className={classes.input}
            min="0"
            autoComplete="off"
          />
          {!memberObj.myContributionInputIsValid &&
            memberObj.myContributionInputErrorMsg}
        </div>
        <div className={currentlyPayingInputClasses}>
          <label>Currently Paying (in Rs.):</label>
          <input
            ref={currentlyPayingInputRef}
            disabled={disabled}
            type="number"
            className={classes.input}
            min="0"
            autoComplete="off"
          />
          {!memberObj.currentlyPayingInputIsValid &&
            memberObj.currentlyPayingInputErrorMsg}
        </div>
        <NewGroupBtnSuccess
          onAskForConfirmation={askForConfirmationHandler}
          disabled={disabled}
        >
          Ask for Confirmation
        </NewGroupBtnSuccess>
        {confirmationState == "pending" && pendingMessage}
        {confirmationState == "confirmed" && confirmedMessage}
        <NewGroupBtnSecondary onEdit={editHandler}>Edit</NewGroupBtnSecondary>
        <NewGroupBtnDanger onRemoveMember={removeMemberHandler}>
          Remove Member
        </NewGroupBtnDanger>
      </div>
    </div>
  );
};
export default IndividualForm;
