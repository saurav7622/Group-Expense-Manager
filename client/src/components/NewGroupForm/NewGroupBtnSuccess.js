import classes from "./NewGroupBtnSuccess.module.css";

const NewGroupBtnSuccess = function (props) {
  const btnDisabled=props.disabled=="disabled"?true:false;
  return (
    <div className={classes.btnWrapper}>
      <button onClick={props.onAskForConfirmation} disabled={btnDisabled}>{props.children}</button>
    </div>
  );
};

export default NewGroupBtnSuccess;
