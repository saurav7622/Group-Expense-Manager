import classes from "./NewGroupBtnDanger.module.css";

const NewGroupBtnDanger = function (props) {
  return (
    <div className={classes.btnWrapper}>
      <button onClick={props.onRemoveMember}>{props.children}</button>
    </div>
  );
};

export default NewGroupBtnDanger;
