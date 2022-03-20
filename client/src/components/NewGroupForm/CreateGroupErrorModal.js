import React from "react";
import Card from "./Card";
import Button from "./Button";
import classes from "./CreateGroupErrorModal.module.css";

const CreateGroupErrorModal = (props) => {
  return (
    <div>
      <div
        className={classes.backdrop}
        onClick={props.HideCreateGroupErrorModal}
      />
      <Card className={classes.modal}>
        <header className={classes.header}>
          <h2>{props.title}</h2>
        </header>
        <div className={classes.content}>
          <p style={{ fontWeight: "bold" }}>{props.message}</p>
        </div>
        <footer className={classes.actions}>
          <Button onClick={props.HideCreateGroupErrorModal}>Okay</Button>
        </footer>
      </Card>
    </div>
  );
};

export default CreateGroupErrorModal;
