import SideBarItem from "./SideBarItem";
import AuthContext from "./../../store/auth-context";
import { useContext, useState } from "react";
import "./SideBar.css";

const SideBarDialog = function (props) {
  const authCtx = useContext(AuthContext);
  const [username, setUsername] = useState("Username");
  //alert("dimagkharab");
  if (props.user && username === "Username") {
    setUsername(props.user.username);
  }
  return (
    <div class="navigation">
      <ul>
        <SideBarItem iClassName="fa fa-user" name={`${username}`} />
        <SideBarItem
          iClassName="fa fa-lock"
          name="Reset Password"
          onShowPasswordUpdateForm={props.onShowPasswordUpdateForm}
        />
        <SideBarItem
          iClassName="fa fa-sign-out"
          name="Sign Out"
          onSignOut={authCtx.logout}
        />
      </ul>
    </div>
  );
};

export default SideBarDialog;
