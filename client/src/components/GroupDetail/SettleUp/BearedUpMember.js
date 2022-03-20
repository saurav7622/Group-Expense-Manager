import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, Fragment } from "react";
import PaymentConfirmationModal from "./PaymentConfirmationModal";
import "./BearedUpMember.css";

const BearedUpMember = function (props) {
  const [showPaymentConfirmationModal, setShowPaymentConfirmationModal] =
    useState(false);
  const showPaymentConfirmationModalHandler = function () {
    setShowPaymentConfirmationModal(true);
  };
  const hidePaymentConfirmationModalHandler = function () {
    setShowPaymentConfirmationModal(false);
  };

  const myShare = props.groupMemberObj.myShare;
  const totalAmountPaid = props.groupMemberObj.totalAmountPaid;
  const amountReceived = props.groupMemberObj.amountReceived;
  const memberId = props.groupMemberObj.memberId;
  let debtStyle;
  let userDebtStatus;
  if (myShare + amountReceived > totalAmountPaid) {
    userDebtStatus = `Owe Rs ${myShare - totalAmountPaid}`;
    debtStyle = "status-unpaid";
  } else if (myShare + amountReceived === totalAmountPaid) {
    userDebtStatus = `Settled Up`;
    debtStyle = "status-paid";
  } else {
    userDebtStatus = `Owed Rs ${totalAmountPaid - (myShare + amountReceived)}`;
    debtStyle = "status-pending";
  }
  return (
    <Fragment>
      {showPaymentConfirmationModal && (
        <PaymentConfirmationModal
          groupMemberObj={props.groupMemberObj}
          onHide={hidePaymentConfirmationModalHandler}
          onAddGroupLog={props.onAddGroupLog}
          signedInMember={props.signedInMember}
          groupName={props.groupName}
        />
      )}
      <tr onClick={showPaymentConfirmationModalHandler}>
        <td>{`${memberId}`}</td>
        <td class="amount">{`Rs. ${myShare}`}</td>
        <td class="amount">{`Rs. ${totalAmountPaid}`}</td>
        <td class="amount">{`Rs. ${amountReceived}`}</td>
        <td>
          <p class={`status ${debtStyle}`}>{userDebtStatus}</p>
        </td>
      </tr>
    </Fragment>
  );
};
export default BearedUpMember;
