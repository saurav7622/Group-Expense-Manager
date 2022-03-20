import "./Login.css";
import log from "./log.svg";

const LeftPanel = function () {
  const switchToSignUpFormHandler = function () {
    const container = document.querySelector(".container");
    container.classList.add("sign-up-mode");
  };
  return (
    <div className="panel left-panel">
      <p className="app-name" style={{ fontSize: "165%" }}>
        Group Expense Manager
      </p>
      <div className="content">
        <h3>New here ?</h3>
        <p style={{ fontSize: "125%" }}>
          Get registered in order to get started with creating your own group
          expenses
        </p>
        <button
          className="btn transparent"
          id="sign-up-btn"
          onClick={switchToSignUpFormHandler}
        >
          Sign up
        </button>
      </div>
      <img src={log} className="image" alt="" />
    </div>
  );
};

export default LeftPanel;
