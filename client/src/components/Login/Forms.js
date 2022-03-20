import "./Login.css";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";

const Forms = function (props) {
  return (
    <div className="forms-container">
      <div className="signin-signup">
        <SignInForm
          onShowPasswordResetEmailFormModal={
            props.onShowPasswordResetEmailFormModal
          }
        />
        <SignUpForm />
      </div>
    </div>
  );
};

export default Forms;
