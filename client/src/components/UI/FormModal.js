import React from "react";
import Card from "./Card";
import classes from "./FormModal.module.css";

const FormModal = (props) => {
  const classNames = `${classes.modal} ${props.className}`;
  return (
    <div>
      <div className={classes.backdrop} onClick={props.onHide}/>
      <Card className={classNames} style={props.style}>{props.children}</Card>
    </div>
  );
};

export default FormModal;
