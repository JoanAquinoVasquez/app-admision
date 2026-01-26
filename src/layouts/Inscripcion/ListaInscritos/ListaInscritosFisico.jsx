import { MdDashboard } from "react-icons/md";
import Breadcrumb from "../../../components/Breadcrumb/Breadcrumb";
import TableInscritosFisico from "../../../components/Table/TableInscritosFisico";

function Inscritos() {
    // Generar una lista única de grados

    return (
        <div className="container max-w-full mx-auto">
            <div>
                <Breadcrumb
                    paths={[
                        {
                            name: "Validación Física",
                            href: "/inscripciones-expediente",
                        },
                    ]}
                />
            </div>

            <TableInscritosFisico></TableInscritosFisico>
        </div>
    );
}

export default Inscritos;
