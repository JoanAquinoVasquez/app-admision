import Breadcrumb from "../../../components/Breadcrumb/Breadcrumb";
import TableInscritos from "../../../components/Table/TableInscritos";

function Inscritos() {
    // Generar una lista única de grados

    return (
        <div className="container max-w-full mx-auto">
            <div>
                <Breadcrumb
                    paths={[{ name: "Inscripción", href: "/inscripciones" }]}
                />
            </div>

            <TableInscritos></TableInscritos>
        </div>
    );
}

export default Inscritos;
