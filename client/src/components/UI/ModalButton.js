import React from "react";

import classes from "./ModalButton.module.css";

const ModalButton = (props) => {
  return (
    <button className={classes.button} type={props.type || "button"}>
      {props.children}
    </button>
  );
};

export default ModalButton;
