import PropTypes from "prop-types";
import Button from "./Button";

const Header = ({ title, onAdd, showAdd, onKey }) => {
  return (
    <header className="header">
      <h1>{title}</h1>
      <Button color='black' text='Key' onClick={onKey}/>
      <Button color={showAdd ? 'black' : 'green'} text={showAdd ? 'Close' : 'Add'} onClick={onAdd} />
    </header>
  );
};

Header.defaultProps = {
  title: "Blockchain Transaction UI",
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Header;
