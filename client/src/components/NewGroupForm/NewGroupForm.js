import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import classes from "./NewGroupForm.module.css";
import GroupFormHeader from "./GroupFormHeader";
import AddGroupMemberBtn from "./AddGroupMemberBtn";
import IndividualForms from "./IndividualForms";
import NewMemberModal from "./NewMemberModal";
import NewGroupBtnFormSubmission from "./NewGroupBtnFormSubmission";
import NewGroupBtnFormCancellation from "./NewGroupBtnFormCancellation";
import CreateGroupErrorModal from "./CreateGroupErrorModal";
import CreateGroupConfirmationModal from "./CreateGroupConfirmationModal";
import CancelSplittingConfirmationModal from "./CancelSplittingConfirmationModal";
import { showBackendAlert } from "./../../utils/backendAlertsController";

const NewGroupForm = function (props) {
  const history = useHistory("/");
  const [DUMMY_MEMBERS, setDUMMY_MEMBERS] = useState([props.user.email]);
  const [New_Group_Members, setNew_Group_Members] = useState([]);
  const addGroupMemberObjectHandler = function (obj) {
    setNew_Group_Members((prevMembers) => [...prevMembers, obj]);
  };
  const deleteGroupMemberObjectHandler = function (obj) {
    setNew_Group_Members(New_Group_Members.filter((ob) => ob !== obj));
  };
  const [showNewMemberModal, setShowNewMemberModal] = useState(false);
  const [showCreateGroupErrorModal, setShowCreateGroupErrorModal] =
    useState(false);
  const [
    showCreateGroupConfirmationModal,
    setShowCreateGroupConfirmationModal,
  ] = useState(false);
  const [numberOfConfirmedMembers, setNumberOfConfirmedMembers] = useState(0);
  const [totalMyContribution, setTotalMyContribution] = useState(0);
  const [totalCurrentlyPaying, setTotalCurrentlyPaying] = useState(0);
  const [confirmedMembersState, setConfirmedMembersState] = useState(false);
  const [totalMyContributionState, setTotalMyContributionState] = useState("");
  const [totalCurrentlyPayingState, setTotalCurrentlyPayingState] =
    useState("");
  const [
    showCancelSplittingConfirmationModal,
    setShowCancelSplittingConfirmationModal,
  ] = useState(false);
  const numberOfConfirmedMembersHandler = function (val) {
    setNumberOfConfirmedMembers((prevValue) => prevValue + val);
  };
  const totalMyContributionHandler = function (val) {
    setTotalMyContribution((prevValue) => prevValue + val);
  };
  const totalCurrentlyPayingHandler = function (val) {
    setTotalCurrentlyPaying((prevValue) => prevValue + val);
  };
  const showNewMemberModalHandler = function () {
    setShowNewMemberModal(true);
  };
  const hideNewMemberModalHandler = function () {
    setShowNewMemberModal(false);
  };
  const addNewMemberHandler = function (newMember) {
    setDUMMY_MEMBERS((prevValue) => [...prevValue, newMember]);
  };
  const RemoveGroupMemberHandler = function (gmail) {
    let MEMBERS = DUMMY_MEMBERS.filter((el) => el != gmail);
    setDUMMY_MEMBERS(MEMBERS);
  };
  const HideCreateGroupErrorModalHandler = function () {
    setShowCreateGroupErrorModal(false);
  };
  const createGroupHandler = function () {
    setShowCreateGroupErrorModal(true);
    if (numberOfConfirmedMembers === DUMMY_MEMBERS.length) {
      setConfirmedMembersState(true);
    } else {
      setConfirmedMembersState(false);
      return;
    }
    if (Number(props.totalAmountInput.trim()) == totalMyContribution) {
      setTotalMyContributionState("equal");
    } else if (Number(props.totalAmountInput.trim()) < totalMyContribution) {
      setTotalMyContributionState("greater");
      return;
    } else if (Number(props.totalAmountInput.trim()) > totalMyContribution) {
      setTotalMyContributionState("lesser");
      return;
    }
    if (Number(props.totalAmountInput.trim()) == totalCurrentlyPaying) {
      setTotalCurrentlyPayingState("equal");
    } else if (Number(props.totalAmountInput.trim()) < totalCurrentlyPaying) {
      setTotalCurrentlyPayingState("greater");
      return;
    } else if (Number(props.totalAmountInput.trim()) > totalCurrentlyPaying) {
      setTotalCurrentlyPayingState("lesser");
      return;
    }
    setShowCreateGroupConfirmationModal(true);
  };
  const confirmCreateGroupHandler = async () => {
    setShowCreateGroupConfirmationModal(false);
    const token = Cookies.get("jwt");
    let res;
    if (token) {
      let decoded = jwt_decode(token);
      console.log(decoded);
      try {
        res = await axios({
          method: "POST",
          url: `https://group-expense-manager-api.herokuapp.com/api/v1/groups/createNewGroup`,
          data: {
            groupId: props.initialisedGroupId,
            email: props.user.email,
          },
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        if (res.data.status === "success") {
          showBackendAlert("success", `Group created successfully!`);
          history.push("/groups");
          //props.onCreateNewGroup(res.data.data.groupObj);
        }
      } catch (err) {}
    } else {
      showBackendAlert("error", "You are not logged in!");
    }
  };
  const cancelCreateGroupHandler = function () {
    setShowCreateGroupConfirmationModal(false);
  };
  const showCancelSplittingModalHandler = function () {
    setShowCancelSplittingConfirmationModal(true);
  };
  const hideCancelSplittingModalHandler = function () {
    setShowCancelSplittingConfirmationModal(false);
  };
  const confirmCancellingSplittingHandler = async () => {
    try {
      const res = await axios({
        method: "DELETE",
        url: `https://group-expense-manager-api.herokuapp.com/api/v1/groups/deleteGroupVerification/${props.initialisedGroupId}`,
      });
    } catch (err) {}
    history.replace("/groups");
  };
  let isGroupFormInputsValid = true;
  let createGroupModalErrorMessage = "";
  if (confirmedMembersState == false) {
    isGroupFormInputsValid = false;
    createGroupModalErrorMessage = "All the users' forms are not confirmed!";
  } else if (totalMyContributionState != "equal") {
    isGroupFormInputsValid = false;
    if (totalMyContributionState == "greater") {
      createGroupModalErrorMessage = `The sum of all My Contribution field cannot exceed ${props.totalAmountInput}`;
    } else if (totalMyContributionState == "lesser") {
      createGroupModalErrorMessage = `The sum of all My Contribution field cannot be less than ${props.totalAmountInput}`;
    }
  } else if (totalCurrentlyPayingState != "equal") {
    isGroupFormInputsValid = false;
    if (totalCurrentlyPayingState == "greater") {
      createGroupModalErrorMessage = `The sum of all Currently Paying field cannot exceed ${props.totalAmountInput}`;
    } else if (totalCurrentlyPayingState == "lesser") {
      createGroupModalErrorMessage = `The sum of all Currently Paying field cannot be less than ${props.totalAmountInput}`;
    }
  }
  const createGroupConfirmationModalMessage =
    "Do you confirm creating new group with given information?";
  const cancelSplittingConfirmationModalMessageHeader =
    "Do you confirm cancel splitting?";
  const cancelSplittingConfirmationModalMessageFooter =
    "(All the entered data in the forms will be lost!)";
  return (
    <div className={classes.container}>
      {showCreateGroupConfirmationModal && (
        <CreateGroupConfirmationModal
          title="Confirmation Message"
          message={createGroupConfirmationModalMessage}
          onConfirm={confirmCreateGroupHandler}
          onCancel={cancelCreateGroupHandler}
        />
      )}
      {showCreateGroupErrorModal && !isGroupFormInputsValid && (
        <CreateGroupErrorModal
          HideCreateGroupErrorModal={HideCreateGroupErrorModalHandler}
          title="Error Message"
          message={createGroupModalErrorMessage}
        />
      )}
      {showNewMemberModal && (
        <NewMemberModal
          DUMMY_MEMBERS={DUMMY_MEMBERS}
          Dummy_Users={props.Dummy_Users}
          onAddNewMember={addNewMemberHandler}
          onHide={hideNewMemberModalHandler}
        />
      )}
      {showCancelSplittingConfirmationModal && (
        <CancelSplittingConfirmationModal
          title="Confirmation Message"
          message1={cancelSplittingConfirmationModalMessageHeader}
          message2={cancelSplittingConfirmationModalMessageFooter}
          onHide={hideCancelSplittingModalHandler}
          onConfirm={confirmCancellingSplittingHandler}
        />
      )}
      <GroupFormHeader
        groupNameInput={props.groupNameInput}
        totalAmountInput={props.totalAmountInput}
      />
      <AddGroupMemberBtn
        onShowNewMemberModal={showNewMemberModalHandler}
        onHide={hideNewMemberModalHandler}
      />
      <IndividualForms
        DUMMY_MEMBERS={DUMMY_MEMBERS}
        numberOfConfirmedMembersHandler={numberOfConfirmedMembersHandler}
        totalMyContributionHandler={totalMyContributionHandler}
        totalCurrentlyPayingHandler={totalCurrentlyPayingHandler}
        onRemoveGroupMember={RemoveGroupMemberHandler}
        onAddGroupMemberObject={addGroupMemberObjectHandler}
        onDeleteGroupMemberObject={deleteGroupMemberObjectHandler}
        initialisedGroupId={props.initialisedGroupId}
        totalAmountInput={props.totalAmountInput}
        groupNameInput={props.groupNameInput}
        signedInEmail={props.user.email}
      />
      <NewGroupBtnFormSubmission onCreateGroup={createGroupHandler}>
        Create Group
      </NewGroupBtnFormSubmission>
      <NewGroupBtnFormCancellation onShow={showCancelSplittingModalHandler}>
        Cancel Splitting
      </NewGroupBtnFormCancellation>
    </div>
  );
};
export default NewGroupForm;
