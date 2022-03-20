import React from "react";
import Card from "./Card";
import Button from "./Button";
import classes from "./CancelSplittingConfirmationModal.module.css";

const CancelSplittingConfirmationModal = (props) => {
  return (
    <div>
      <div className={classes.backdrop} onClick={props.onHide} />
      <Card className={classes.modal}>
        <header className={classes.header}>
          <h2>{props.title}</h2>
        </header>
        <div className={classes.content}>
          <p style={{ fontWeight: "bold" }}>{props.message1}</p>
          <p className="error-text" style={{ fontWeight: "bold" }}>
            {props.message2}
          </p>
        </div>
        <footer className={classes.actions}>
          <Button onClick={props.onConfirm}>Confirm</Button>
          <Button onClick={props.onHide}>Cancel</Button>
        </footer>
      </Card>
    </div>
  );
};

export default CancelSplittingConfirmationModal;
