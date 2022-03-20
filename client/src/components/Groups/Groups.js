import React, { useState } from "react";

import Group from "./Group";
import Card from "../UI/Card";
import "./Groups.css";

const Groups = (props) => {
  let groups = [];
  if (props.user != null) {
    let signedInUsers = [];
    const filteredGroups = props.groups.filter((group) => {
      let value = false;
      console.log(group);
      for (const obj of group.members) {
        if (obj.memberId === props.user.email) {
          value = true;
          signedInUsers.push(obj);
          break;
        }
      }
      return value;
    });
    console.log(filteredGroups);
    groups = filteredGroups.map((item, index) => (
      <Group
        key={item._id}
        id={item._id}
        name={item.name}
        date={item.date}
        worth={item.worth}
        signedInUser={signedInUsers[index]}
      />
    ));
    //setGroups(groupsTemp);
  }

  return (
    <div>
      <Card className="groups">{groups}</Card>
    </div>
  );
};

export default Groups;
