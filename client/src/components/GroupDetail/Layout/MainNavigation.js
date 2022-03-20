import { NavLink, useHistory } from "react-router-dom";
import AuthContext from "./../../../store/auth-context";
import { useContext } from "react";

import classes from "./MainNavigation.module.css";

const MainNavigation = (props) => {
  const history = useHistory();
  const authCtx = useContext(AuthContext);
  const logoutHandler = function () {
    authCtx.logout();
    history.replace("/login");
  };
  return (
    <header className={classes.header}>
      <div className={classes.logo}>
        {props.groupObj.name}{" "}
        <span
          style={{ fontStyle: "italic", fontSize: "65%" }}
        >{`(Rs. ${props.groupObj.worth} splitted)`}</span>
      </div>
      <nav className={classes.nav}>
        <ul>
          <li>
            <NavLink
              to={`/groups/${props.groupObj._id}`}
              activeClassName={classes.active}
              exact
            >
              Members
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/groups/${props.groupObj._id}/settle-up`}
              activeClassName={classes.active}
              exact
            >
              Settle Up
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/groups/${props.groupObj._id}/logs`}
              activeClassName={classes.active}
              exact
            >
              Logs
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/groups/${props.groupObj._id}/contacts`}
              activeClassName={classes.active}
              exact
            >
              Contacts
            </NavLink>
          </li>
          <li>
            <NavLink to="/groups" activeClassName={classes.active} exact>
              Home
            </NavLink>
          </li>
          <li onClick={logoutHandler}>
            <NavLink to={`/logout`} activeClassName={classes.active} exact>
              Logout
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
