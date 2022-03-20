import classes from "./AddGroupMemberBtn.module.css";

const AddNewGroupBtn = function (props) {
  return (
    <div className={classes.btnWrapper}>
      <button onClick={props.onShowNewMemberModal}>Add New Member</button>
    </div>
  );
};

export default AddNewGroupBtn;
