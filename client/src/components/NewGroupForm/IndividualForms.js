import { useState } from "react";
import IndividualForm from "./IndividualForm";
const IndividualForms = function (props) {
  const individualForms = props.DUMMY_MEMBERS.map((item) => (
    <IndividualForm
      onAddGroupMemberObject={props.onAddGroupMemberObject}
      onDeleteGroupMemberObject={props.onDeleteGroupMemberObject}
      numberOfConfirmedMembersHandler={props.numberOfConfirmedMembersHandler}
      totalMyContributionHandler={props.totalMyContributionHandler}
      totalCurrentlyPayingHandler={props.totalCurrentlyPayingHandler}
      onRemoveGroupMember={props.onRemoveGroupMember}
      key={item}
      gmail={item}
      initialisedGroupId={props.initialisedGroupId}
      totalAmountInput={props.totalAmountInput}
      groupNameInput={props.groupNameInput}
      signedInEmail={props.signedInEmail}
    />
  ));
  return <div>{individualForms}</div>;
};
export default IndividualForms;
