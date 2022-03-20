import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { showBackendAlert } from "./../../../utils/backendAlertsController";
import { useParams } from "react-router-dom";
import "./Logs.css";
import Log from "./Log.js";
import TableRow from "./TableRow";

const Logs = function (props) {
  const params = useParams();
  const groupId = params.groupId;
  const [groupObj, setGroupObj] = useState(null);
  const [user, setUser] = useState(null);

  const fetchGroupFromServer = useCallback(async () => {
    const token = Cookies.get("jwt");
    if (token) {
      let decoded = jwt_decode(token);
      console.log(decoded);
      try {
        const res = await axios({
          method: "GET",
          url: `https://group-expense-manager-api.herokuapp.com/api/v1/groups/${groupId}`,
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        if (res.data.status === "success") {
          console.log("hello");
          setGroupObj(res.data.data.group);
          console.log(res.data.data.group);
        }
      } catch (err) {
        showBackendAlert("error", err);
      }
    } else {
      showBackendAlert("error", "You are not logged in to access the group!");
    }
  }, []);
  const fetchUserFromServer = useCallback(async () => {
    const token = Cookies.get("jwt");
    if (token) {
      let decoded = jwt_decode(token);
      console.log(decoded);
      try {
        const res = await axios({
          method: "GET",
          url: `https://group-expense-manager-api.herokuapp.com/api/v1/users/${decoded.id}`,
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        if (res.data.status === "success") {
          console.log("nhiiiiiiiiiii");
          console.log(res.data.data.user);
          setUser(res.data.data.user);
        }
      } catch (err) {
        showBackendAlert("error", err);
      }
    } else {
      showBackendAlert("error", "You are not logged in to access the group!");
    }
  }, []);
  useEffect(() => {
    fetchUserFromServer();
    fetchGroupFromServer();
  }, [fetchUserFromServer, fetchGroupFromServer]);
  let groupCreationLog;
  let tableRows = [];
  let logsAfterGroupCreation = [];
  if (groupObj && user) {
    for (let i = groupObj.logs.length - 1; i > 0; i--) {
      const logItem = (
        <Log date={groupObj.logs[i].date} logText={groupObj.logs[i].logText} />
      );
      logsAfterGroupCreation.push(logItem);
    }
    groupCreationLog = (
      <Log date={groupObj.logs[0].date} logText={groupObj.logs[0].logText} />
    );
    tableRows = groupObj.members.map((ob) => (
      <TableRow
        memberId={ob.memberId}
        myShare={ob.myShare}
        amountPaid={ob.amountPaid}
      />
    ));
  }

  return (
    <div>
      {logsAfterGroupCreation}
      {groupCreationLog}
      <div className="logs">
        <table>
          <thead>
            <tr>
              <th>Member Id</th>
              <th>Share</th>
              <th>Amount Paid</th>
            </tr>
          </thead>
          <tbody>{tableRows}</tbody>
        </table>
      </div>
    </div>
  );
};
export default Logs;
