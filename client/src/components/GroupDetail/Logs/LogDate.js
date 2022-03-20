import React from "react";

import "./LogDate.css";

const LogDate = (props) => {
  let d = new Date(props.date);
  const month = d.toLocaleString("en-US", { month: "long" });
  const day = d.toLocaleString("en-US", { day: "2-digit" });
  const year = d.getFullYear();
  return (
    <div className="log-date">
      <div className="log-date__month">{month}</div>
      <div className="log-date__year">{year}</div>
      <div className="log-date__day">{day}</div>
    </div>
  );
};

export default LogDate;
