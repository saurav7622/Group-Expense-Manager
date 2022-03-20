import React from "react";

import classes from "./ConfirmBtn.module.css";

const Button = (props) => {
  return (
    <div className={classes.btnWrapper}>
      <button
        type={props.type || "button"}
        onClick={props.onHide}
        style={{ height: "140%", borderRadius: "8px", marginBottom: "10%" }}
      >
        {props.children}
      </button>
    </div>
  );
};

export default Button;
