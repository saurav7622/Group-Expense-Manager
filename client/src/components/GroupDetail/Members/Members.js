import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import axios from "axios";
import Member from "./Member";
import { useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { showBackendAlert } from "./../../../utils/backendAlertsController";

import "./Members.css";

const Members = function (props) {
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
  let signedInMember;
  let MembersExceptSignedInMember = [];
  let Members = [];
  let filteredMembers = [];
  if (groupObj && user) {
    signedInMember = groupObj.members.find((el) => el.memberId === user.email);
    MembersExceptSignedInMember = groupObj.members.filter(
      (el) => el.memberId !== user.email
    );

    Members = [
      <Member
        key={signedInMember._id}
        id={signedInMember._id}
        name="You"
        myShare={signedInMember.myShare}
        amountPaid={signedInMember.amountPaid}
        totalAmountPaid={signedInMember.totalAmountPaid}
        amountReceived={signedInMember.amountReceived}
      />,
    ];
    filteredMembers = MembersExceptSignedInMember.map((el) => (
      <Member
        key={el._id}
        id={el._id}
        name={el.memberId}
        myShare={el.myShare}
        amountPaid={el.amountPaid}
        totalAmountPaid={el.totalAmountPaid}
        amountReceived={el.amountReceived}
      />
    ));
    for (const el of filteredMembers) Members.push(el);
  }
  return (
    <div className="members">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Share</th>
            <th>Amount Paid</th>
            <th>Amount Received</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>{Members}</tbody>
      </table>
    </div>
  );
};

export default Members;
