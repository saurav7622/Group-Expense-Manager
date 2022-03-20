import "./Login.css";
import register from "./register.svg";

const RightPanel = function () {
  const switchToSignInFormHandler = function () {
    const container = document.querySelector(".container");
    container.classList.remove("sign-up-mode");
  };
  return (
    <div className="panel right-panel">
      <h1 className="app-name" style={{ fontSize: "165%" }}>
        Group Expense Manager
      </h1>
      <div className="content">
        <h3>One of us ?</h3>
        <p style={{ fontSize: "125%" }}>
          A place where you can create your group expenses and settle up those
          as well!
        </p>
        <button
          className="btn transparent"
          id="sign-in-btn"
          onClick={switchToSignInFormHandler}
        >
          Sign in
        </button>
      </div>

      <img src={register} className="image" alt="" />
      <a
        style={{
          position: "relative",
          color: "white",
          marginLeft: "15%",
          marginBottom: "8%",
          textDecoration: "underline",
          justifyContent: "center",
          fontSize: "100%",
        }}
        className="sign-up-link"
        onClick={switchToSignInFormHandler}
      >
        Sign In
      </a>
    </div>
  );
};

export default RightPanel;
