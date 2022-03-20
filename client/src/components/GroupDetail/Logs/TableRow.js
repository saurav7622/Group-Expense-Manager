import "./TableRow.css";

const TableRow = function (props) {
  return (
    <tr>
      <td>{`${props.memberId}`}</td>
      <td class="amount">{`Rs. ${props.myShare}`}</td>
      <td class="amount">{`Rs. ${props.amountPaid}`}</td>
    </tr>
  );
};

export default TableRow;
