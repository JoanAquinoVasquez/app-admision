import PropTypes from 'prop-types';

export const DocumentTextSharpIcon = ({ size, height, width, ...props }) => {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 512 512"
      height={size || height || '1em'}
      width={size || width || '1em'}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M272 41.69V188a4 4 0 0 0 4 4h146.31a2 2 0 0 0 1.42-3.41L275.41 40.27a2 2 0 0 0-3.41 1.42z" />
      <path d="M248 224a8 8 0 0 1-8-8V32H92a12 12 0 0 0-12 12v424a12 12 0 0 0 12 12h328a12 12 0 0 0 12-12V224zm104 160H160v-32h192zm0-80H160v-32h192z" />
    </svg>
  );
};

DocumentTextSharpIcon.propTypes = {
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
