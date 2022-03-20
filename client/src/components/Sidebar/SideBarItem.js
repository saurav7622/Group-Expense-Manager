import "./SideBar.css";
import { useHistory } from "react-router-dom";

const SideBarItem = function (props) {
  const history = useHistory();
  const clickHandler = function () {
    if (props.iClassName === "fa fa-sign-out") {
      props.onSignOut();
      history.replace("/login");
    } else if (props.iClassName === "fa fa-lock") {
      props.onShowPasswordUpdateForm();
    }
  };
  return (
    <li onClick={clickHandler}>
      <a>
        <span class="icon">
          <i className={props.iClassName} aria-hidden="true"></i>
        </span>
        <span class="title" style={{ color: "#fff", fontSize: "130%" }}>
          {props.name}
        </span>
      </a>
    </li>
  );
};
export default SideBarItem;
