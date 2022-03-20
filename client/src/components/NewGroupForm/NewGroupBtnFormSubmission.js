import classes from "./NewGroupBtnFormSubmission.module.css";

const NewGroupBtnFormSubmission = function (props) {
  return (
    <div className={classes.btnWrapper}>
      <button onClick={props.onCreateGroup}>{props.children}</button>
    </div>
  );
};

export default NewGroupBtnFormSubmission;
