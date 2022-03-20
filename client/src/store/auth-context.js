import { useHistory } from "react-router-dom";
import React, { useState } from "react";
import Cookies from "js-cookie";
import { showBackendAlert } from "../utils/backendAlertsController";

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {
  const history = useHistory("/");
  const initialToken = Cookies.get("jwt");
  const [token, setToken] = useState(initialToken);

  const userIsLoggedIn = !!token;

  const loginHandler = (token) => {
    setToken(token);
  };

  const logoutHandler = () => {
    setToken(null);
    Cookies.remove("jwt");
    showBackendAlert("success", "Logged out successfully!");
  };

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
