import "./Login.css";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";

const Panels = function () {
  return (
    <div className="panels-container">
      <LeftPanel />
      <RightPanel />
    </div>
  );
};

export default Panels;
