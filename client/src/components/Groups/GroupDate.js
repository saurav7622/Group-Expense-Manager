import React from "react";

import "./GroupDate.css";

const GroupDate = (props) => {
  let d = new Date(props.date);
  const month = d.toLocaleString("en-US", { month: "long" });
  const day = d.toLocaleString("en-US", { day: "2-digit" });
  const year = d.getFullYear();

  return (
    <div className="group-date">
      <div className="group-date__month">{month}</div>
      <div className="group-date__year">{year}</div>
      <div className="group-date__day">{day}</div>
    </div>
  );
};

export default GroupDate;
