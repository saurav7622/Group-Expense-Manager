import React from "react";
import Card from "./Card";
import Button from "./Button";
import classes from "./CreateGroupConfirmationModal.module.css";

const CreateGroupConfirmationModal = (props) => {
  return (
    <div>
      <div className={classes.backdrop} onClick={props.onCancel} />
      <Card className={classes.modal}>
        <header className={classes.header}>
          <h2>{props.title}</h2>
        </header>
        <div className={classes.content}>
          <p style={{ fontWeight: "bold" }}>{props.message}</p>
        </div>
        <footer className={classes.actions}>
          <Button onClick={props.onConfirm}>Confirm</Button>
          <Button onClick={props.onCancel}>Cancel</Button>
        </footer>
      </Card>
    </div>
  );
};

export default CreateGroupConfirmationModal;
