import React from "react";

import classes from "./CloseBtn.module.css";

const Button = (props) => {
  return (
    <div className={classes.btnWrapper}>
    <button
      type={props.type || "button"}
      onClick={props.onHide}
    >
      {props.children}
    </button>
    </div>
  );
};

export default Button;
