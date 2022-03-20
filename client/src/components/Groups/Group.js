import { Link } from "react-router-dom";
import React, { useState } from "react";

import GroupDate from "./GroupDate";
import Card from "../UI/Card";
import "./Group.css";

const Group = (props) => {
  /* const myShare = props.signedInUser.myShare;
  const amountPaid = props.signedInUser.amountPaid;
  const amountReceived = props.signedInUser.amountReceived;
  const [userDebtStatus, setUserDebtStatus] = useState("");
  if (myShare > amountPaid - amountReceived) {
    setUserDebtStatus(`You owe Rs ${myShare - amountPaid - amountReceived}`);
  } else if (myShare === amountPaid - amountReceived) {
    setUserDebtStatus(`Your amount is settled up`);
  } else {
    setUserDebtStatus(
      `You are owed Rs ${amountPaid - amountReceived - myShare}`
    );
  }*/
  return (
    <li>
      <Link to={`/groups/${props.id}`}>
        <Card className="group">
          <GroupDate date={props.date} />
          <div className="group__description">
            <h2>{`${props.name} (Total transaction amounting to Rs ${props.worth})`}</h2>
          </div>
        </Card>
      </Link>
    </li>
  );
};

export default Group;
