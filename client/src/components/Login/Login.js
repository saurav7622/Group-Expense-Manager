import "./Login.css";
import { useState, Fragment } from "react";
import Forms from "./Forms";
import Panels from "./Panels";
import PasswordResetEmailFormModal from "./PasswordResetEmailFormModal";

const Login = function () {
  const [showPasswordResetEmailFormModal, setShowPasswordResetEmailFormModal] =
    useState(false);
  const showPasswordResetEmailFormModalHandler = function () {
    setShowPasswordResetEmailFormModal(true);
  };
  const hidePasswordResetEmailFormModalHandler = function () {
    setShowPasswordResetEmailFormModal(false);
  };
  return (
    <div className="container">
      {showPasswordResetEmailFormModal && (
        <PasswordResetEmailFormModal
          onHide={hidePasswordResetEmailFormModalHandler}
        />
      )}
      <Forms
        onShowPasswordResetEmailFormModal={
          showPasswordResetEmailFormModalHandler
        }
      />
      <Panels />
    </div>
  );
};

export default Login;
