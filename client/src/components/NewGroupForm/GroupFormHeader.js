import classes from "./GroupFormHeader.module.css";
const GroupFormHeader = function (props) {
  return (
    <h1 className={classes.header}>
      {`${props.groupNameInput} (Rs.${props.totalAmountInput} to be split)`}
    </h1>
  );
};
export default GroupFormHeader;
