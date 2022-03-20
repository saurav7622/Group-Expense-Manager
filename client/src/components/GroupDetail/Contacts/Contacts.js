import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import axios from "axios";
import Contact from "./Contact";
import { useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { showBackendAlert } from "./../../../utils/backendAlertsController";

import "./Contacts.css";

const Contacts = function (props) {
  const params = useParams();
  const groupId = params.groupId;
  const [groupObj, setGroupObj] = useState(null);
  const [users, setUsers] = useState(null);

  const fetchGroupFromServer = useCallback(async () => {
    const token = Cookies.get("jwt");
    if (token) {
      let decoded = jwt_decode(token);
      //console.log(decoded);
      try {
        const res = await axios({
          method: "GET",
          url: `https://group-expense-manager-api.herokuapp.com/api/v1/groups/${groupId}`,
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        if (res.data.status === "success") {
          setGroupObj(res.data.data.group);
        }
      } catch (err) {
        showBackendAlert("error", err.response.data.message);
      }
    } else {
      showBackendAlert("error", "You are not logged in to access the group!");
    }
  }, []);
  const fetchUsersFromServer = useCallback(async () => {
    const token = Cookies.get("jwt");
    if (token) {
      let decoded = jwt_decode(token);
      // console.log(decoded);
      try {
        const res = await axios({
          method: "GET",
          url: `https://group-expense-manager-api.herokuapp.com/api/v1/users/getAllUsers`,
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        // console.log(res);
        if (res.data.status === "success") {
          setUsers(res.data.data.users);
        }
      } catch (err) {
        showBackendAlert("error", err.response.data.message);
      }
    } else {
      showBackendAlert("error", "You are not logged in to access the group!");
    }
  }, []);
  useEffect(() => {
    fetchUsersFromServer();
    fetchGroupFromServer();
  }, [fetchUsersFromServer, fetchGroupFromServer]);
  let Members = [];
  if (groupObj && users) {
    Members = groupObj.members.map((el) => {
      const user = users.find((ob) => ob.email === el.memberId);
      const name = user.name;
      const email = user.email;
      const contactNo = user.contactNo;
      return (
        <Contact
          key={el._id}
          id={el._id}
          name={name}
          email={email}
          contactNo={contactNo}
        />
      );
    });
  }

  return (
    <div className="members">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email Id</th>
            <th>Contact No</th>
          </tr>
        </thead>
        <tbody>{Members}</tbody>
      </table>
    </div>
  );
};

export default Contacts;
