import "./MemberName.css";

const MemberName = (props) => {
  return (
    <div className="member">
      <h2>{props.name}</h2>
    </div>
  );
};

export default MemberName;
