import classes from "./NewGroupBtnFormCancellation.module.css";

const NewGroupBtnFormCancellation = function (props) {
  return (
    <div className={classes.btnWrapper}>
      <button onClick={props.onShow}>{props.children}</button>
    </div>
  );
};

export default NewGroupBtnFormCancellation;
