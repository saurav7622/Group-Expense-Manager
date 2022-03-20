import MemberName from "./MemberName";
import "./Member.css";

const Member = function (props) {
  const myShare = props.myShare;
  const totalAmountPaid = props.totalAmountPaid;
  const amountReceived = props.amountReceived;
  const name = props.name;
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
    <tr>
      <td>{`${name}`}</td>
      <td class="amount">{`Rs. ${myShare}`}</td>
      <td class="amount">{`Rs. ${totalAmountPaid}`}</td>
      <td class="amount">{`Rs. ${amountReceived}`}</td>
      <td>
        <p class={`status ${debtStyle}`}>{userDebtStatus}</p>
      </td>
    </tr>
  );
};

export default Member;
