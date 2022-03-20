import { Fragment } from "react";
import { useParams } from "react-router-dom";
import classes from "./Layout.module.css";
import MainNavigation from "./MainNavigation";

const Layout = (props) => {
  const params = useParams();
  const groupId = params.groupId;
  if (props.Original_Dummy_Groups.length !== 0) {
    const groupObj = props.Original_Dummy_Groups.find(
      (ob) => ob._id === groupId
    );
    return (
      <Fragment>
        <MainNavigation groupObj={groupObj} />
        <main className={classes.main}>{props.children}</main>
      </Fragment>
    );
  } else {
    return <Fragment></Fragment>;
  }
};

export default Layout;
