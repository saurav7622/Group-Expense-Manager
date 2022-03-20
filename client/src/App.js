import axios from "axios";
import { Route, Switch, useHistory, Redirect } from "react-router-dom";
import Header from "./components/Groups/Header";
import Groups from "./components/Groups/Groups";
import SideBar from "./components/Sidebar/SideBar";
import AddNewGroupBtn from "./components/AddNewGroup/AddNewGroupBtn";
import NewGroupModalContent from "./components/AddNewGroup/NewGroupModalContent";
import NewGroupForm from "./components/NewGroupForm/NewGroupForm";
import Login from "./components/Login/Login";
import Members from "./components/GroupDetail/Members/Members";
import Contacts from "./components/GroupDetail/Contacts/Contacts";
import Logs from "./components/GroupDetail/Logs/Logs";
import SettleUp from "./components/GroupDetail/SettleUp/SettleUp";
import classes from "./components/UI/Background.module.css";
import React, { useState, useContext, useEffect, useCallback } from "react";
import { showBackendAlert } from "./utils/backendAlertsController";
import Layout from "./components/GroupDetail/Layout/Layout";
import PasswordUpdateFormModal from "./components/PasswordUpdateFormModal/PasswordUpdateFormModal";
import PasswordResetForm from "./components/PasswordResetForm/PasswordResetForm";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import AuthContext from "./store/auth-context";
import jwt_decode from "jwt-decode";

const Dummy_Users = [];

const Original_Dummy_Groups = [];

function App() {
  const history = useHistory("/");
  const [Dummy_Groups, setDummy_Groups] = useState([]);
  const [user, setUser] = useState(null);
  const [initialisedGroupId, setInitialisedGroupId] = useState("");
  const [showPasswordUpdateFormModal, setShowPasswordUpdateFormModal] =
    useState(false);
  const showPasswordUpdateFormModalHandler = function () {
    setShowPasswordUpdateFormModal(true);
  };
  const hidePasswordUpdateFormModalHandler = function () {
    setShowPasswordUpdateFormModal(false);
  };
  const initialiseGroupIdHandler = function (groupId) {
    setInitialisedGroupId(groupId);
  };
  const fetchMyGroupsFromServer = useCallback(async () => {
    const token = Cookies.get("jwt");
    if (token) {
      let decoded = jwt_decode(token);
      console.log(decoded);
      try {
        const res = await axios({
          method: "GET",
          url: `https://group-expense-manager-api.herokuapp.com/api/v1/groups/myGroups/${decoded.id}`,
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        if (res.data.status === "success") {
          setDummy_Groups(res.data.data.myGroups);
        }
      } catch (err) {
        showBackendAlert("error", err.response.data.message);
      }
    }
  }, []);
  const fetchUserFromServer = useCallback(async () => {
    const token = Cookies.get("jwt");
    if (token) {
      let decoded = jwt_decode(token);
      console.log(decoded);
      try {
        const res = await axios({
          method: "GET",
          url: `https://group-expense-manager-api.herokuapp.com/api/v1/users/${decoded.id}`,
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        if (res.data.status === "success") {
          setUser(res.data.data.user);
        }
      } catch (err) {
        showBackendAlert("error", err.response.data.message);
      }
    }
  }, []);
  useEffect(() => {
    fetchUserFromServer();
    fetchMyGroupsFromServer();
  }, [fetchUserFromServer, fetchMyGroupsFromServer]);

  const [showGroupFormModal, setShowGroupFormModal] = useState(false);
  const [groupNameInput, setGroupNameInput] = useState("");
  const [totalAmountInput, setTotalAmountInput] = useState("");
  const authCtx = useContext(AuthContext);
  const location = useLocation();
  const isLoggedIn = authCtx.isLoggedIn;

  if (location.pathname === "/login" && isLoggedIn) {
    history.replace("/groups");
  }

  /*if (!isLoggedIn) {
    history.push("/login");
  }*/

  const showGroupFormModalHandler = function () {
    setShowGroupFormModal(true);
  };
  const hideGroupFormModalHandler = function () {
    setShowGroupFormModal(false);
  };
  const groupFormInitialiser = function (
    groupNameInputTemp,
    totalAmountInputTemp
  ) {
    setGroupNameInput(groupNameInputTemp);
    setTotalAmountInput(totalAmountInputTemp);
  };
  const AddGroupLogHandler = function (date, logText, groupId) {
    const log = { date, logText };
    //alert(groupId);
    const groupObj = Dummy_Groups.find((el) => el.id === groupId);
    groupObj.logs.push(log);
    const filteredGroups = Dummy_Groups.filter((el) => el.id !== groupId);
    filteredGroups.push(groupObj);
    setDummy_Groups(filteredGroups);
  };
  return (
    <React.Fragment>
      {!isLoggedIn && !location.pathname.startsWith("/resetPassword") && (
        <Redirect to="/login" />
      )}
      {isLoggedIn && location.pathname === "/" && <Redirect to="/groups" />}
      <Switch>
        <Route path="/resetPassword/:token" exact>
          <PasswordResetForm />
        </Route>
        <Route path="/groups" exact>
          <div className={classes.pageCoverViolet}>
            {showGroupFormModal && (
              <NewGroupModalContent
                onShow={showGroupFormModalHandler}
                onHide={hideGroupFormModalHandler}
                onSubmit={groupFormInitialiser}
                onInitialiseGroupId={initialiseGroupIdHandler}
                initialisedGroupId={initialisedGroupId}
              />
            )}
            {showPasswordUpdateFormModal && (
              <PasswordUpdateFormModal
                onHide={hidePasswordUpdateFormModalHandler}
              />
            )}
            <SideBar
              user={user}
              onShowPasswordUpdateForm={showPasswordUpdateFormModalHandler}
            />
            <Header />
            <AddNewGroupBtn onShow={showGroupFormModalHandler} />
            <Groups users={Dummy_Users} groups={Dummy_Groups} user={user} />
          </div>
        </Route>
        <Route path="/create-new-group" exact>
          <div className={classes.pageCoverYellow}>
            <NewGroupForm
              groupNameInput={groupNameInput}
              totalAmountInput={totalAmountInput}
              Dummy_Users={Dummy_Users}
              initialisedGroupId={initialisedGroupId}
              user={user}
            />
          </div>
        </Route>
        <Route path="/groups/:groupId">
          <Layout Original_Dummy_Groups={Dummy_Groups}>
            <Switch>
              <Route path="/groups/:groupId" exact>
                <Members
                  Original_Dummy_Groups={Dummy_Groups}
                  Dummy_Users={Dummy_Users}
                  user={user}
                />
              </Route>
              <Route path="/groups/:groupId/settle-up" exact>
                <SettleUp
                  Original_Dummy_Groups={Dummy_Groups}
                  onAddGroupLog={AddGroupLogHandler}
                />
              </Route>
              <Route path="/groups/:groupId/logs" exact>
                <Logs Original_Dummy_Groups={Dummy_Groups} />
              </Route>
              <Route path="/groups/:groupId/contacts" exact>
                <Contacts
                  Original_Dummy_Groups={Dummy_Groups}
                  Dummy_Users={Dummy_Users}
                />
              </Route>
            </Switch>
          </Layout>
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/logout">
          <Redirect to="/login" />
        </Route>
      </Switch>
    </React.Fragment>
  );
}

export default App;
