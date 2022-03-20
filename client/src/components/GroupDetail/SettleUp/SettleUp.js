import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { useParams } from "react-router-dom";
import SettleUpMessage from "./SettleUpMessage";
import IndebtedMembers from "./IndebtedMembers";
import BearedUpMembers from "./BearedUpMembers";
import IndebtedMember from "./IndebtedMember";
import BearedUpMember from "./BearedUpMember";
import { useState, useEffect, useCallback } from "react";
import { showBackendAlert } from "./../../../utils/backendAlertsController";
let GroupObj;
let User;
let DebtStatus;
let DebtMessage;
let DebtStatusClassName;
let Share;
let TotalAmountPaid;
let AmountReceived;
let IndebtedMembersTemp;
let BearedUpMembersTemp;
let initialStatus;
const SettleUp = function (props) {
  //alert(debtStatus);
  const params = useParams();
  const groupId = params.groupId;
  const [groupObj, setGroupObj] = useState(null);
  const [user, setUser] = useState(null);
  const [debtStatus, setDebtStatus] = useState("");
  const [debtMessage, setDebtMessage] = useState("");
  const [debtStatusClassName, setDebtStatusClassName] = useState("");
  const [share, setShare] = useState(null);
  const [totalAmountPaid, setTotalAmountPaid] = useState(null);
  const [amountReceived, setAmountReceived] = useState(null);
  const [indebtedMembers, setIndebtedMembers] = useState([]);
  const [bearedUpMembers, setBearedUpMembers] = useState([]);
  let signedInMember;
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
          // alert("hello");
          //setGroupObj(res.data.data.group);
          GroupObj = res.data.data.group;
          console.log(res.data.data.group);
        }
      } catch (err) {
        showBackendAlert("error", err.response.data.message);
      }
    } else {
      showBackendAlert("error", "You are not logged in to access the group!");
    }
  }, []);
  const fetchUserFromServer = useCallback(async () => {
    const token = Cookies.get("jwt");
    if (token) {
      let decoded = jwt_decode(token);
      //console.log(decoded);
      try {
        const res = await axios({
          method: "GET",
          url: `https://group-expense-manager-api.herokuapp.com/api/v1/users/${decoded.id}`,
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        if (res.data.status === "success") {
          User = res.data.data.user;
          signedInMember = GroupObj.members.find(
            (ob) => ob.memberId === User.email
          );
          let totalAmountPaid = signedInMember.totalAmountPaid;
          let amountReceived = signedInMember.amountReceived;
          let share = signedInMember.myShare;
          TotalAmountPaid = signedInMember.totalAmountPaid;
          AmountReceived = signedInMember.amountReceived;
          Share = signedInMember.myShare;
          if (totalAmountPaid - amountReceived > share) {
            initialStatus = "owed";
          } else if (totalAmountPaid - amountReceived === share) {
            initialStatus = "settled";
          } else {
            initialStatus = "owe";
          }
          //setUser(res.data.data.user);
        }
      } catch (err) {
        showBackendAlert("error", err.response.data.message);
      }
    } else {
      showBackendAlert("error", "You are not logged in to access the group!");
    }
  }, []);
  const setPropertiesAndValues = useCallback(async () => {
    //alert("saaaaaaaaaala");
    let STATUS;
    if (totalAmountPaid === null) {
      STATUS = initialStatus;
    } else {
      if (totalAmountPaid - amountReceived > share) {
        STATUS = "owed";
      } else if (totalAmountPaid - amountReceived === share) {
        STATUS = "settled";
      } else {
        STATUS = "owe";
      }
    }
    if (STATUS === "owed") {
      DebtStatus = "owed";
      //setDebtStatus("owed");
      /*setDebtMessage(
        `You are owed Rs ${
          totalAmountPaid - amountReceived - share
        } from the group.You can set reminder to few of the members of this group by clicking on the following members.`
      );*/
      DebtMessage = `You are owed Rs ${
        TotalAmountPaid - AmountReceived - Share
      } from the group.You can set reminder to few of the members of this group by clicking on the following members.`;
      //setDebtStatusClassName("status-pending");
      //alert(GroupObj.name);
      DebtStatusClassName = "status-pending";
      const indebtedMembers = GroupObj.members
        .filter((ob) => ob.totalAmountPaid - ob.amountReceived < ob.myShare)
        .map((ob) => (
          <IndebtedMember
            key={ob._id}
            groupMemberObj={ob}
            onAddGroupLog={props.onAddGroupLog}
            signedInMember={signedInMember}
            groupName={GroupObj.groupName}
          />
        ));
      //setIndebtedMembers(indebtedMembers);
      IndebtedMembersTemp = indebtedMembers;
    } else if (STATUS === "settled") {
      DebtStatus = "settled";
      //setDebtStatus("settled");
      DebtMessage = "Your payment is all settled up!";
      //setDebtMessage("Your payment is all settled up!");
      // setDebtStatusClassName("status-paid");
      DebtStatusClassName = "status-paid";
    } else {
      //setDebtStatus("owe");
      DebtStatus = "owe";
      /*setDebtMessage(
        `You owe Rs ${
          share - (totalAmountPaid - amountReceived)
        } to the group.You can clear your debt by clicking on some of the following members for Pay through Email Confirmation!`
      );*/
      DebtMessage = `You owe Rs ${
        Share - (TotalAmountPaid - AmountReceived)
      } to the group.If you have paid some amount to member(s) of the group and still not have your information about the payment updated in the application, click on some of the following members to send email about confirming the payment!`;
      //setDebtStatusClassName("status-unpaid");
      DebtStatusClassName = "status-unpaid";
      console.log(groupObj);
      //alert("hello3");
      const bearedUpMembers = GroupObj.members
        .filter((ob) => ob.totalAmountPaid - ob.amountReceived > ob.myShare)
        .map((ob) => (
          <BearedUpMember
            key={ob._id}
            groupMemberObj={ob}
            signedInMember={signedInMember}
            onAddGroupLog={props.onAddGroupLog}
            groupName={GroupObj.groupName}
          />
        ));
      //setBearedUpMembers(bearedUpMembers);
      BearedUpMembersTemp = bearedUpMembers;
    }
  }, []);
  useEffect(async () => {
    await fetchGroupFromServer();
    await fetchUserFromServer();
    setGroupObj(GroupObj);
    setUser(User);
    if (GroupObj && User) setPropertiesAndValues();
    setDebtStatus(DebtStatus);
    setDebtStatusClassName(DebtStatusClassName);
    setDebtMessage(DebtMessage);
    if (user && groupObj) {
      signedInMember = groupObj.members.find(
        (el) => el.memberId === user.email
      );
      setShare(signedInMember.myShare);
      setTotalAmountPaid(signedInMember.totalAmountPaid);
      setAmountReceived(signedInMember.amountReceived);
    }
    setIndebtedMembers(IndebtedMembersTemp);
    setBearedUpMembers(BearedUpMembersTemp);
  }, [fetchUserFromServer, fetchGroupFromServer, setPropertiesAndValues]);


  return (
    <div>
      <SettleUpMessage
        debtMessage={debtMessage}
        debtStatusClassName={debtStatusClassName}
      />
      {debtStatus === "owed" && (
        <IndebtedMembers
          indebtedMembers={indebtedMembers}
          onAddGroupLog={props.onAddGroupLog}
        />
      )}
      {debtStatus === "owe" && (
        <BearedUpMembers bearedUpMembers={bearedUpMembers} />
      )}
    </div>
  );
};
export default SettleUp;
