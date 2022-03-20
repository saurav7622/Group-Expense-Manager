import classes from "./NewGroupBtnSecondary.module.css";

const NewGroupBtnSecondary = function (props) {
  return (
    <div className={classes.btnWrapper}>
      <button onClick={props.onEdit}>{props.children}</button>
    </div>
  );
};

export default NewGroupBtnSecondary;
