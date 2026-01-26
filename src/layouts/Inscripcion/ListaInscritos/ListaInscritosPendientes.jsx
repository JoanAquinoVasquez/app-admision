import { MdDashboard } from "react-icons/md";
import Breadcrumb from "../../../components/Breadcrumb/Breadcrumb";
import TableInscritosPendiente from "../../../components/Table/TableInscritosPendiente";

function Inscritos() {
    return (
        <div className="bg-white rounded-lg p-3 shadow-md mb-3 container p-4 max-w-full">
            <Breadcrumb
                paths={[
                    {
                        name: "Inscripciones Pendientes",
                        href: "/inscripciones-pendientes",
                    },
                ]}
            />

            <TableInscritosPendiente />
        </div>
    );
}

export default Inscritos;
