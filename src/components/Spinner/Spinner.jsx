import { Spinner } from "@heroui/react"; // Cambia el nombre aquí
import PropTypes from "prop-types";

const ComponentSpinner = ({ label, fullScreen = true }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-80 z-50">
        <Spinner size="lg" label={label} />
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[200px] flex justify-center items-center">
      <Spinner size="lg" label={label} />
    </div>
  );
};

ComponentSpinner.propTypes = {
  label: PropTypes.string,
};

export default ComponentSpinner;


