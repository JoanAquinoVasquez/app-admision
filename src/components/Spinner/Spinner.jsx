import { Spinner } from "@nextui-org/react"; // Cambia el nombre aquí
import PropTypes from "prop-types";

const ComponentSpinner = ({ label }) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-80 z-50">
      <Spinner size="lg" label={label} />
    </div>
  );
};

ComponentSpinner.propTypes = {
  label: PropTypes.string,
};

export default ComponentSpinner;


