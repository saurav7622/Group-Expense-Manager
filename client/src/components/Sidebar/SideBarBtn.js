import "./SideBar.css";

const SideBarBtn = function (props) {
  return <div className="toggle" onClick={props.toggleMenuHandler}></div>;
};

export default SideBarBtn;
