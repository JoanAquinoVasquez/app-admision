import { MdDashboard } from "react-icons/md";
import Breadcrumb from "../../../components/Breadcrumb/Breadcrumb";
import TablePostulantesAptos from "../../../components/Table/TablePostulantesAptos";

function PostulantesAptos() {
    // Generar una lista única de grados

    return (
        <div className="container p-4 max-w-full">
            <div>
                <Breadcrumb
                    paths={[
                        { name: "Evaluación" },
                        { name: "Gestionar Notas", href: "/evaluacion-postulantes" }
                    ]}
                />
            </div>
            <div className="bg-white rounded-lg p-3 shadow-md mb-3 min-w-[320px] overflow-x-auto">

                <TablePostulantesAptos></TablePostulantesAptos>
            </div>
        </div>
    );
}

export default PostulantesAptos;
