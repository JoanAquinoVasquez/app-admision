import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Breadcrumb = ({ paths }) => {
    return (
        <nav className="flex flex-col ml-1 p-0 mb-4 items-start w-full" aria-label="Breadcrumb">
            <ol className="inline-flex items-center w-full min-w-0 flex-wrap gap-2 md:gap-3">
                {paths.map((path, index) => {
                    const isLast = index === paths.length - 1;
                    return (
                        <li key={path.name + index} className="inline-flex items-center min-w-0 max-w-full">
                            {index > 0 && (
                                <svg
                                    className="w-5 h-5 text-gray-400 mx-1 md:mx-2 flex-shrink-0"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            )}
                            {isLast ? (
                                <span className="text-xl md:text-2xl font-bold tracking-tight text-gray-800 truncate block">
                                    {path.name}
                                </span>
                            ) : path.href ? (
                                <Link
                                    to={`/admision-epg/auth${path.href}`}
                                    className="text-xl md:text-2xl font-semibold tracking-tight text-gray-500 hover:text-blue-600 transition-colors truncate block"
                                >
                                    {path.name}
                                </Link>
                            ) : (
                                <span className="text-xl md:text-2xl font-semibold tracking-tight text-gray-500 truncate block">
                                    {path.name}
                                </span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

Breadcrumb.propTypes = {
    paths: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            href: PropTypes.string,
        })
    ).isRequired,
};

export default Breadcrumb;
