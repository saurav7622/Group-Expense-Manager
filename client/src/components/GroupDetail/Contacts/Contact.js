import "./Contact.css";

const Contact = function (props) {
  const name = props.name;
  const email = props.email;
  const contactNo = props.contactNo;
  return (
    <tr>
      <td>{`${name}`}</td>
      <td>{`${email}`}</td>
      <td>{`${contactNo}`}</td>
    </tr>
  );
};

export default Contact;
