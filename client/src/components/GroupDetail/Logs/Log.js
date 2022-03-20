import "./Log.css";
import Card from "../../UI/Card";
import LogDate from "./LogDate";

const Log = function (props) {
  return (
    <Card className="log">
      <LogDate date={props.date} />
      <div className="log__description">
        <h2>{props.logText}</h2>
      </div>
    </Card>
  );
};

export default Log;
