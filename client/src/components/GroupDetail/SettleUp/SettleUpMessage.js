import "./SettleUpMessage.css";
import { useState } from "react";

const SettleUpMessage = function (props) {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  if (props.debtMessage != message || status != props.debtStatusClassName) {
    setMessage(props.debtMessage);
    setStatus(props.debtStatusClassName);
  }
  return <div class={`debt-status ${status}`}>{message}</div>;
};

export default SettleUpMessage;
