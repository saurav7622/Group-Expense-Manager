import "./AddNewGroupBtn.css";

const AddNewGroupBtn = function (props) {
  return (
    <div className="new-group">
      <button onClick={props.onShow}>Add New Group</button>
    </div>
  );
};

export default AddNewGroupBtn;
