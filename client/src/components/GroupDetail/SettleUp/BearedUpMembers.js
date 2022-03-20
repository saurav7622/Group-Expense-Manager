import "./BearedUpMembers.css";
import BearedUpMember from "./BearedUpMember";
const BearedUpMembers = function (props) {
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
        <tbody>{props.bearedUpMembers}</tbody>
      </table>
    </div>
  );
};
export default BearedUpMembers;
