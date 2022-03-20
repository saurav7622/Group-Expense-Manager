import { useState, Fragment } from "react";
import "./IndebtedMember.css";
import ReminderModal from "./ReminderModal";

const IndebtedMember = function (props) {
  const [showReminderModal, setShowReminderModal] = useState(false);
  const myShare = props.groupMemberObj.myShare;
  const totalAmountPaid = props.groupMemberObj.totalAmountPaid;
  const amountReceived = props.groupMemberObj.amountReceived;
  const memberId = props.groupMemberObj.memberId;
  let debtStyle;
  let userDebtStatus;
  const showReminderModalHandler = function () {
    setShowReminderModal(true);
  };
  const hideReminderModalHandler = function () {
    setShowReminderModal(false);
  };
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
      {showReminderModal && (
        <ReminderModal
          groupMemberObj={props.groupMemberObj}
          onHide={hideReminderModalHandler}
          onAddGroupLog={props.onAddGroupLog}
          signedInMember={props.signedInMember}
          groupName={props.groupName}
        />
      )}
      <tr onClick={showReminderModalHandler}>
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
export default IndebtedMember;
