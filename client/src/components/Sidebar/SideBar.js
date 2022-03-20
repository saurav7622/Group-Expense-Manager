import React from "react";
import "./SideBar.css";
import SideBarDialog from "./SideBarDialog";
import SideBarBtn from "./SideBarBtn";
const SideBar = function (props) {
  const toggleMenuHandler = function () {
    let navigation = document.querySelector(".navigation");
    let toggle = document.querySelector(".toggle");
    navigation.classList.toggle("active");
    toggle.classList.toggle("active");
  };
  return (
    <React.Fragment>
      <SideBarDialog
        user={props.user}
        onShowPasswordUpdateForm={props.onShowPasswordUpdateForm}
      />
      <SideBarBtn toggleMenuHandler={toggleMenuHandler} />
    </React.Fragment>
  );
};

export default SideBar;
