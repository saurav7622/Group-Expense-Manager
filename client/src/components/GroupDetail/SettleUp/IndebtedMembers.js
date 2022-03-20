import "./IndebtedMembers.css";
import IndebtedMember from "./IndebtedMember";
import { useState } from "react";
const IndebtedMembers = function (props) {
  const [indebtedMembers, setIndebtedMembers] = useState([]);
  if (indebtedMembers != props.indebtedMembers) {
    setIndebtedMembers(props.indebtedMembers);
  }

  return (
    <div className="members">
      <table>
        <thead>
          <tr>
            <th>Member Id</th>
            <th>Share</th>
            <th>Amount Paid</th>
            <th>Amount Received</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>{props.indebtedMembers}</tbody>
      </table>
    </div>
  );
};
export default IndebtedMembers;
